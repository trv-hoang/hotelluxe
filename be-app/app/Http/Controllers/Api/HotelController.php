<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Hotel;
use App\Models\HotelCategory;
use App\Models\HotelAmenity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class HotelController extends Controller
{
    /**
     * Display a listing of hotels with filtering
     */
    public function index(Request $request)
    {
        $query = Hotel::with([
            'category',
            'images',
            'amenities'
        ]);

        // Filter by category
        if ($request->has('category_id') && $request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        // Filter by location
        if ($request->has('location') && $request->location) {
            $query->where('address', 'like', '%' . $request->location . '%');
        }

        // Filter by price range
        if ($request->has('min_price') && $request->min_price) {
            $query->where('price_per_night', '>=', $request->min_price);
        }
        if ($request->has('max_price') && $request->max_price) {
            $query->where('price_per_night', '<=', $request->max_price);
        }

        // Search by title or description
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', '%' . $search . '%')
                  ->orWhere('description', 'like', '%' . $search . '%');
            });
        }

        // Sort options
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        
        if ($sortBy === 'price') {
            $query->orderBy('price_per_night', $sortOrder);
        } else {
            $query->orderBy('created_at', $sortOrder);
        }

        // Pagination
        $perPage = $request->get('per_page', 12);
        $hotels = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $hotels
        ]);
    }

    /**
     * Store a newly created hotel
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price_per_night' => 'required|numeric|min:0',
            'category_id' => 'required|exists:hotel_categories,id',
            'address' => 'required|string|max:500',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'max_guests' => 'required|integer|min:1',
            'bedrooms' => 'required|integer|min:1',
            'bathrooms' => 'required|integer|min:1',
            'featured_image' => 'required|url',
            'images' => 'nullable|array',
            'images.*' => 'url',
            'amenities' => 'nullable|array',
            'amenities.*' => 'exists:hotel_amenities,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            $hotel = Hotel::create([
                'title' => $request->title,
                'slug' => Str::slug($request->title),
                'description' => $request->description,
                'price_per_night' => $request->price_per_night,
                'category_id' => $request->category_id,
                'address' => $request->address,
                'latitude' => $request->latitude,
                'longitude' => $request->longitude,
                'max_guests' => $request->max_guests,
                'bedrooms' => $request->bedrooms,
                'bathrooms' => $request->bathrooms,
                'featured_image' => $request->featured_image,
                'user_id' => auth('api')->id(),
            ]);

            // Add images
            if ($request->has('images')) {
                foreach ($request->images as $index => $imageUrl) {
                    $hotel->images()->create([
                        'image_url' => $imageUrl,
                        'is_primary' => false,
                        'alt_text' => $request->title . ' - Image ' . ($index + 1)
                    ]);
                }
            }

            // Add amenities
            if ($request->has('amenities')) {
                $hotel->amenities()->attach($request->amenities);
            }

            DB::commit();

            $hotel->load(['category', 'images', 'amenities']);

            return response()->json([
                'success' => true,
                'message' => 'Hotel created successfully',
                'data' => $hotel
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create hotel',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified hotel
     */
    public function show(string $id)
    {
        $hotel = Hotel::with([
            'category',
            'images',
            'amenities'
        ])->find($id);

        if (!$hotel) {
            return response()->json([
                'success' => false,
                'message' => 'Hotel not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $hotel
        ]);
    }

    /**
     * Update the specified hotel
     */
    public function update(Request $request, string $id)
    {
        $hotel = Hotel::find($id);

        if (!$hotel) {
            return response()->json([
                'success' => false,
                'message' => 'Hotel not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'price_per_night' => 'sometimes|numeric|min:0',
            'category_id' => 'sometimes|exists:hotel_categories,id',
            'address' => 'sometimes|string|max:500',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'max_guests' => 'sometimes|integer|min:1',
            'bedrooms' => 'sometimes|integer|min:1',
            'bathrooms' => 'sometimes|integer|min:1',
            'featured_image' => 'sometimes|url',
            'images' => 'sometimes|array',
            'images.*' => 'url',
            'amenities' => 'sometimes|array',
            'amenities.*' => 'exists:hotel_amenities,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            $updateData = $request->only([
                'title', 'description', 'price_per_night', 'category_id',
                'address', 'latitude', 'longitude', 'max_guests', 'bedrooms', 'bathrooms', 'featured_image'
            ]);

            if ($request->has('title')) {
                $updateData['slug'] = Str::slug($request->title);
            }

            $hotel->update($updateData);

            // Update images if provided
            if ($request->has('images')) {
                $hotel->images()->delete();
                foreach ($request->images as $index => $imageUrl) {
                    $hotel->images()->create([
                        'image_url' => $imageUrl,
                        'is_primary' => false,
                        'alt_text' => $hotel->title . ' - Image ' . ($index + 1)
                    ]);
                }
            }

            // Update amenities if provided
            if ($request->has('amenities')) {
                $hotel->amenities()->sync($request->amenities);
            }

            DB::commit();

            $hotel->load(['category', 'images', 'amenities']);

            return response()->json([
                'success' => true,
                'message' => 'Hotel updated successfully',
                'data' => $hotel
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to update hotel',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified hotel
     */
    public function destroy(string $id)
    {
        $hotel = Hotel::find($id);

        if (!$hotel) {
            return response()->json([
                'success' => false,
                'message' => 'Hotel not found'
            ], 404);
        }

        try {
            DB::beginTransaction();

            $hotel->images()->delete();
            $hotel->amenities()->detach();
            $hotel->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Hotel deleted successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete hotel',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get hotel categories
     */
    public function categories()
    {
        $categories = HotelCategory::all();

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    /**
     * Get hotel amenities
     */
    public function amenities()
    {
        $amenities = HotelAmenity::all();

        return response()->json([
            'success' => true,
            'data' => $amenities
        ]);
    }
}
