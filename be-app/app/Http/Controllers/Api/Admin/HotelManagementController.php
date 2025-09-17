<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Hotel;
use App\Models\HotelCategory;
use App\Models\Amenity;
use App\Models\Booking;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class HotelManagementController extends Controller
{
    /**
     * Get all hotels with admin filters
     */
    public function index(Request $request)
    {
        try {
            $query = Hotel::with(['category']);

            // Search by name or description  
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%")
                      ->orWhere('address', 'like', "%{$search}%");
                });
            }

            // Filter by status (using is_active instead of status)
            if ($request->has('status')) {
                if ($request->status === 'active') {
                    $query->where('is_active', true);
                } elseif ($request->status === 'inactive') {
                    $query->where('is_active', false);
                }
            }

            // Filter by category
            if ($request->has('category_id')) {
                $query->where('category_id', $request->category_id);
            }

            // Filter by address (since there's no separate city column)
            if ($request->has('city')) {
                $query->where('address', 'like', "%{$request->city}%");
            }

            // Filter by rating range (using review_score)
            if ($request->has('min_rating')) {
                $query->where('review_score', '>=', $request->min_rating);
            }
            if ($request->has('max_rating')) {
                $query->where('review_score', '<=', $request->max_rating);
            }

            // Filter by price range
            if ($request->has('min_price')) {
                $query->where('price_per_night', '>=', $request->min_price);
            }
            if ($request->has('max_price')) {
                $query->where('price_per_night', '<=', $request->max_price);
            }

            // Include statistics
            $query->withCount(['bookings', 'reviews'])
                ->withSum('bookings as total_revenue', 'total_amount')
                ->withAvg('reviews as avg_review_rating', 'rating');

            // Sort options
            $sortField = $request->get('sort_by', 'created_at');
            $sortDirection = $request->get('sort_direction', 'desc');
            $query->orderBy($sortField, $sortDirection);

            $hotels = $query->paginate($request->per_page ?? 15);

            return response()->json([
                'success' => true,
                'data' => $hotels
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch hotels: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get specific hotel details for admin
     */
    public function show($id)
    {
        try {
            $hotel = Hotel::with([
                'category',
                'bookings' => function($query) {
                    $query->with('user')->latest()->limit(10);
                },
                'reviews' => function($query) {
                    $query->with('user')->latest()->limit(10);
                }
            ])
            ->withCount(['bookings', 'reviews'])
            ->withSum('bookings as total_revenue', 'total_amount')
            ->withAvg('reviews as avg_review_rating', 'rating')
            ->findOrFail($id);

            // Calculate additional statistics
            $stats = [
                'total_bookings' => $hotel->bookings_count,
                'confirmed_bookings' => $hotel->bookings()->where('status', 'confirmed')->count(),
                'cancelled_bookings' => $hotel->bookings()->where('status', 'cancelled')->count(),
                'total_revenue' => $hotel->total_revenue ?? 0,
                'average_booking_value' => $hotel->bookings_count > 0 
                    ? ($hotel->total_revenue ?? 0) / $hotel->bookings_count 
                    : 0,
                'reviews_count' => $hotel->reviews_count,
                'average_rating' => round($hotel->avg_review_rating ?? 0, 2),
                'occupancy_rate' => $this->calculateOccupancyRate($hotel),
                'last_booking_date' => $hotel->bookings()->latest()->first()?->created_at,
                'revenue_this_month' => $hotel->bookings()
                    ->whereMonth('created_at', now()->month)
                    ->sum('total_amount'),
            ];

            // Get booking trends (last 12 months)
            $bookingTrends = $hotel->bookings()
                ->selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, COUNT(*) as count, SUM(total_amount) as revenue')
                ->where('created_at', '>=', now()->subMonths(12))
                ->groupBy('month')
                ->orderBy('month')
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'hotel' => $hotel,
                    'statistics' => $stats,
                    'booking_trends' => $bookingTrends
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch hotel details: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create new hotel
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'address' => 'required|string|max:500',
                'price_per_night' => 'required|numeric|min:0',
                'category_id' => 'required|exists:hotel_categories,id',
                'latitude' => 'sometimes|numeric|between:-90,90',
                'longitude' => 'sometimes|numeric|between:-180,180',
                'max_guests' => 'sometimes|integer|min:1',
                'bedrooms' => 'sometimes|integer|min:0',
                'bathrooms' => 'sometimes|integer|min:0',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

            $hotel = Hotel::create([
                'user_id' => auth()->id() ?? 1, // Use authenticated admin or default
                'title' => $request->title,
                'slug' => \Str::slug($request->title),
                'description' => $request->description,
                'featured_image' => 'default-hotel.jpg', // Default image
                'address' => $request->address,
                'price_per_night' => $request->price_per_night,
                'category_id' => $request->category_id ?? 2,
                'latitude' => $request->latitude,
                'longitude' => $request->longitude,
                'max_guests' => $request->max_guests ?? 2,
                'bedrooms' => $request->bedrooms ?? 1,
                'bathrooms' => $request->bathrooms ?? 1,
                'is_active' => true,
                'review_score' => 0,
                'review_count' => 0,
                'published_at' => now(),
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Hotel created successfully',
                'data' => $hotel->load(['category'])
            ], 201);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create hotel: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete hotel
     */
    public function destroy($id)
    {
        try {
            $hotel = Hotel::findOrFail($id);

            // Check for active bookings
            $activeBookings = $hotel->bookings()
                ->whereIn('status', ['confirmed', 'checked_in', 'pending'])
                ->count();

            if ($activeBookings > 0) {
                return response()->json([
                    'success' => false,
                    'message' => "Cannot delete hotel with {$activeBookings} active bookings. Please cancel or complete them first."
                ], 400);
            }

            DB::beginTransaction();

            // Soft delete approach - just deactivate
            $hotel->is_active = false;
            $hotel->save();

            // Or hard delete if really needed
            // $hotel->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Hotel deleted successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete hotel: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update hotel status
     */
    public function updateStatus(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'status' => 'required|in:active,inactive',
                'reason' => 'sometimes|string|max:500'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $hotel = Hotel::findOrFail($id);
            
            DB::beginTransaction();

            $hotel->is_active = ($request->status === 'active');
            
            // Add status change reason to metadata
            $metadata = $hotel->metadata ?? [];
            $metadata['status_changes'][] = [
                'status' => $request->status,
                'reason' => $request->reason ?? 'Status updated by admin',
                'changed_by' => auth()->id(),
                'changed_at' => now()
            ];
            $hotel->metadata = $metadata;

            $hotel->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Hotel status updated successfully',
                'data' => $hotel
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => 'Failed to update hotel status: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update hotel information
     */
    public function update(Request $request, $id)
    {
        try {
            $hotel = Hotel::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'title' => 'sometimes|string|max:255',
                'description' => 'sometimes|string',
                'address' => 'sometimes|string|max:500',
                'price_per_night' => 'sometimes|numeric|min:0',
                'category_id' => 'sometimes|exists:hotel_categories,id',

                'latitude' => 'sometimes|numeric|between:-90,90',
                'longitude' => 'sometimes|numeric|between:-180,180',
                'max_guests' => 'sometimes|integer|min:1',
                'bedrooms' => 'sometimes|integer|min:0',
                'bathrooms' => 'sometimes|integer|min:0',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

            // Update hotel fields  
            $fillableFields = [
                'title', 'description', 'address', 'price_per_night', 'category_id',
                'latitude', 'longitude', 'max_guests', 'bedrooms', 'bathrooms'
            ];

            foreach ($fillableFields as $field) {
                if ($request->has($field)) {
                    $hotel->$field = $request->$field;
                }
            }

            $hotel->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Hotel updated successfully',
                'data' => $hotel->load(['category'])
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => 'Failed to update hotel: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get hotel analytics
     */
    public function analytics(Request $request)
    {
        try {
            $period = $request->get('period', 'month');
            $startDate = $request->get('start_date', now()->subMonth());
            $endDate = $request->get('end_date', now());

            // Hotel performance metrics
            $hotelPerformance = Hotel::withCount(['bookings' => function($query) use ($startDate, $endDate) {
                    $query->whereBetween('created_at', [$startDate, $endDate]);
                }])
                ->withSum(['bookings as revenue' => function($query) use ($startDate, $endDate) {
                    $query->whereBetween('created_at', [$startDate, $endDate]);
                }], 'total_amount')
                ->withAvg('reviews as rating', 'rating')
                ->orderBy('bookings_count', 'desc')
                ->limit(20)
                ->get(['id', 'name', 'city', 'status']);

            // Category performance
            $categoryPerformance = HotelCategory::withCount(['hotels' => function($query) {
                    $query->where('is_active', true);
                }])
                ->withSum(['hotels.bookings as total_revenue' => function($query) use ($startDate, $endDate) {
                    $query->whereBetween('created_at', [$startDate, $endDate]);
                }], 'total_amount')
                ->get();

            // Address-wise distribution (since no separate city column)
            $addressDistribution = Hotel::select(DB::raw('LEFT(address, 50) as location'), DB::raw('COUNT(*) as count'))
                ->where('is_active', true)
                ->groupBy(DB::raw('LEFT(address, 50)'))
                ->orderBy('count', 'desc')
                ->limit(15)
                ->get();

            // Status distribution
            $statusDistribution = Hotel::select(
                    DB::raw('CASE WHEN is_active = 1 THEN "active" ELSE "inactive" END as status'),
                    DB::raw('COUNT(*) as count')
                )
                ->groupBy('is_active')
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'hotel_performance' => $hotelPerformance,
                    'category_performance' => $categoryPerformance,
                    'address_distribution' => $addressDistribution,
                    'status_distribution' => $statusDistribution,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch hotel analytics: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Bulk actions for hotels
     */
    public function bulkAction(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'action' => 'required|in:activate,deactivate,suspend,delete,update_category',
                'hotel_ids' => 'required|array|min:1',
                'hotel_ids.*' => 'exists:hotels,id',
                'category_id' => 'required_if:action,update_category|exists:hotel_categories,id',
                'reason' => 'required_if:action,suspend|string|max:500'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $hotelIds = $request->hotel_ids;
            $action = $request->action;

            DB::beginTransaction();

            $affectedCount = 0;

            switch ($action) {
                case 'activate':
                    $affectedCount = Hotel::whereIn('id', $hotelIds)
                        ->update(['is_active' => true]);
                    break;

                case 'deactivate':
                    $affectedCount = Hotel::whereIn('id', $hotelIds)
                        ->update(['is_active' => false]);
                    break;

                case 'suspend':
                    $affectedCount = Hotel::whereIn('id', $hotelIds)
                        ->update(['is_active' => false]);
                    break;

                case 'update_category':
                    $affectedCount = Hotel::whereIn('id', $hotelIds)
                        ->update(['category_id' => $request->category_id]);
                    break;

                case 'delete':
                    // Check for active bookings
                    $hotelsWithActiveBookings = Hotel::whereIn('id', $hotelIds)
                        ->whereHas('bookings', function($query) {
                            $query->whereIn('status', ['confirmed', 'checked_in']);
                        })->count();

                    if ($hotelsWithActiveBookings > 0) {
                        DB::rollback();
                        return response()->json([
                            'success' => false,
                            'message' => "Cannot delete {$hotelsWithActiveBookings} hotels with active bookings"
                        ], 400);
                    }

                    $affectedCount = Hotel::whereIn('id', $hotelIds)
                        ->update(['is_active' => false]);
                    break;
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Bulk action '{$action}' completed successfully",
                'affected_count' => $affectedCount
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => 'Failed to perform bulk action: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Calculate occupancy rate for a hotel
     */
    private function calculateOccupancyRate($hotel)
    {
        $totalDays = now()->diffInDays(now()->subMonth());
        $bookedDays = $hotel->bookings()
            ->where('created_at', '>=', now()->subMonth())
            ->whereIn('status', ['confirmed', 'checked_in', 'checked_out'])
            ->sum(DB::raw('DATEDIFF(check_out_date, check_in_date)'));

        return $totalDays > 0 ? round(($bookedDays / $totalDays) * 100, 2) : 0;
    }

    /**
     * Export hotel data
     */
    public function export(Request $request)
    {
        try {
            $format = $request->get('format', 'csv'); // csv, xlsx, json
            
            $query = Hotel::with(['category'])
                ->withCount(['bookings', 'reviews'])
                ->withSum('bookings as total_revenue', 'total_amount');

            // Apply filters if provided
            if ($request->has('status')) {
                if ($request->status === 'active') {
                    $query->where('is_active', true);
                } elseif ($request->status === 'inactive') {
                    $query->where('is_active', false);
                }
            }
            if ($request->has('city')) {
                $query->where('address', 'like', "%{$request->city}%");
            }

            $hotels = $query->get();

            // Format data for export
            $exportData = $hotels->map(function ($hotel) {
                return [
                    'ID' => $hotel->id,
                    'Title' => $hotel->title,
                    'Address' => $hotel->address,
                    'Category' => $hotel->category->name ?? 'N/A',
                    'Status' => $hotel->is_active ? 'Active' : 'Inactive',
                    'Price per Night' => $hotel->price_per_night,
                    'Review Score' => $hotel->review_score,
                    'Total Bookings' => $hotel->bookings_count,
                    'Total Revenue' => $hotel->total_revenue ?? 0,
                    'Reviews Count' => $hotel->reviews_count,
                    'Created At' => $hotel->created_at->format('Y-m-d H:i:s'),
                ];
            });

            // For now, return JSON format
            // In production, you'd implement CSV/Excel export using packages like maatwebsite/excel
            return response()->json([
                'success' => true,
                'data' => $exportData,
                'format' => $format,
                'total_records' => $exportData->count()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to export hotel data: ' . $e->getMessage()
            ], 500);
        }
    }
}