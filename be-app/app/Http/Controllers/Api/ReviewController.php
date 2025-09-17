<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Hotel;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReviewController extends Controller
{
    /**
     * Display reviews for a specific hotel
     */
    public function index(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'hotel_id' => 'required|exists:hotels,id',
            'per_page' => 'integer|min:1|max:50',
            'sort' => 'string|in:newest,oldest,highest_rating,lowest_rating,most_helpful',
            'rating_filter' => 'integer|min:1|max:5'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $perPage = $request->get('per_page', 10);
        $sort = $request->get('sort', 'newest');
        $ratingFilter = $request->get('rating_filter');

        $query = Review::with([
            'user:id,name',
            'booking:id,check_in_date,check_out_date,status'
        ])
        ->where('hotel_id', $request->hotel_id)
        ->where('is_approved', true);

        // Apply rating filter
        if ($ratingFilter) {
            $query->where('rating', '>=', $ratingFilter)
                  ->where('rating', '<', $ratingFilter + 1);
        }

        // Apply sorting
        switch ($sort) {
            case 'oldest':
                $query->orderBy('created_at', 'asc');
                break;
            case 'highest_rating':
                $query->orderBy('rating', 'desc');
                break;
            case 'lowest_rating':
                $query->orderBy('rating', 'asc');
                break;
            case 'most_helpful':
                $query->orderBy('helpful_count', 'desc');
                break;
            case 'newest':
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        $reviews = $query->paginate($perPage);

        // Calculate review statistics
        $stats = Review::where('hotel_id', $request->hotel_id)
            ->where('is_approved', true)
            ->selectRaw('
                COUNT(*) as total_reviews,
                AVG(rating) as average_rating,
                SUM(CASE WHEN rating >= 5 THEN 1 ELSE 0 END) as five_star,
                SUM(CASE WHEN rating >= 4 AND rating < 5 THEN 1 ELSE 0 END) as four_star,
                SUM(CASE WHEN rating >= 3 AND rating < 4 THEN 1 ELSE 0 END) as three_star,
                SUM(CASE WHEN rating >= 2 AND rating < 3 THEN 1 ELSE 0 END) as two_star,
                SUM(CASE WHEN rating >= 1 AND rating < 2 THEN 1 ELSE 0 END) as one_star
            ')
            ->first();

        return response()->json([
            'success' => true,
            'data' => $reviews,
            'stats' => [
                'total_reviews' => $stats->total_reviews ?? 0,
                'average_rating' => round($stats->average_rating ?? 0, 1),
                'rating_distribution' => [
                    '5' => $stats->five_star ?? 0,
                    '4' => $stats->four_star ?? 0,
                    '3' => $stats->three_star ?? 0,
                    '2' => $stats->two_star ?? 0,
                    '1' => $stats->one_star ?? 0,
                ]
            ]
        ]);
    }

    /**
     * Store a new review
     */
    public function store(Request $request)
    {
        $user = auth('api')->user();

        $validator = Validator::make($request->all(), [
            'hotel_id' => 'required|exists:hotels,id',
            'booking_id' => 'nullable|exists:bookings,id',
            'rating' => 'required|numeric|min:1|max:5',
            'title' => 'nullable|string|max:255',
            'comment' => 'required|string|min:10|max:2000',
            'rating_breakdown' => 'nullable|array',
            'rating_breakdown.service' => 'nullable|numeric|min:1|max:5',
            'rating_breakdown.cleanliness' => 'nullable|numeric|min:1|max:5',
            'rating_breakdown.location' => 'nullable|numeric|min:1|max:5',
            'rating_breakdown.value' => 'nullable|numeric|min:1|max:5',
            'rating_breakdown.comfort' => 'nullable|numeric|min:1|max:5',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Check if user has already reviewed this hotel for this booking
            $existingReview = Review::where('user_id', $user->id)
                ->where('hotel_id', $request->hotel_id);

            if ($request->booking_id) {
                $existingReview->where('booking_id', $request->booking_id);
            }

            if ($existingReview->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'You have already reviewed this hotel for this booking'
                ], 422);
            }

            // If booking_id is provided, verify the booking belongs to the user and is completed
            $isVerified = false;
            if ($request->booking_id) {
                $booking = Booking::where('id', $request->booking_id)
                    ->where('user_id', $user->id)
                    ->where('hotel_id', $request->hotel_id)
                    ->whereIn('status', ['completed', 'confirmed'])
                    ->first();

                if (!$booking) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Invalid booking or booking not eligible for review'
                    ], 422);
                }

                // Check if the booking check-out date has passed
                if ($booking->check_out_date > now()) {
                    return response()->json([
                        'success' => false,
                        'message' => 'You can only review after your stay is completed'
                    ], 422);
                }

                $isVerified = true;
            }

            // Create the review
            $review = Review::create([
                'user_id' => $user->id,
                'hotel_id' => $request->hotel_id,
                'booking_id' => $request->booking_id,
                'rating' => $request->rating,
                'title' => $request->title,
                'comment' => $request->comment,
                'rating_breakdown' => $request->rating_breakdown,
                'is_verified' => $isVerified,
                'is_approved' => false, // Reviews need approval by default
            ]);

            DB::commit();

            // Update hotel's average rating
            $this->updateHotelRating($request->hotel_id);

            $review->load(['user:id,name', 'booking:id,check_in_date,check_out_date']);

            return response()->json([
                'success' => true,
                'message' => 'Review submitted successfully and is pending approval',
                'data' => $review
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create review: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified review
     */
    public function show(Review $review)
    {
        if (!$review->is_approved) {
            $user = auth('api')->user();
            
            // Only allow viewing unapproved reviews by the owner or admins
            if (!$user || ($review->user_id !== $user->id && $user->role !== 'admin')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Review not found'
                ], 404);
            }
        }

        $review->load([
            'user:id,name',
            'hotel:id,title,slug,featured_image',
            'booking:id,check_in_date,check_out_date,status'
        ]);

        return response()->json([
            'success' => true,
            'data' => $review
        ]);
    }

    /**
     * Update the specified review
     */
    public function update(Request $request, Review $review)
    {
        $user = auth('api')->user();

        // Only review owner can update
        if ($review->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to update this review'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'rating' => 'nullable|numeric|min:1|max:5',
            'title' => 'nullable|string|max:255',
            'comment' => 'nullable|string|min:10|max:2000',
            'rating_breakdown' => 'nullable|array',
            'rating_breakdown.service' => 'nullable|numeric|min:1|max:5',
            'rating_breakdown.cleanliness' => 'nullable|numeric|min:1|max:5',
            'rating_breakdown.location' => 'nullable|numeric|min:1|max:5',
            'rating_breakdown.value' => 'nullable|numeric|min:1|max:5',
            'rating_breakdown.comfort' => 'nullable|numeric|min:1|max:5',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Update review (will need re-approval if modified)
            $review->update(array_filter([
                'rating' => $request->rating,
                'title' => $request->title,
                'comment' => $request->comment,
                'rating_breakdown' => $request->rating_breakdown,
                'is_approved' => false, // Reset approval status
                'approved_at' => null,
            ]));

            // Update hotel's average rating
            $this->updateHotelRating($review->hotel_id);

            $review->load(['user:id,name', 'booking:id,check_in_date,check_out_date']);

            return response()->json([
                'success' => true,
                'message' => 'Review updated successfully and is pending approval',
                'data' => $review
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update review: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified review
     */
    public function destroy(Review $review)
    {
        $user = auth('api')->user();

        // Only review owner or admin can delete
        if ($review->user_id !== $user->id && $user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to delete this review'
            ], 403);
        }

        try {
            $hotelId = $review->hotel_id;
            $review->delete();

            // Update hotel's average rating
            $this->updateHotelRating($hotelId);

            return response()->json([
                'success' => true,
                'message' => 'Review deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete review: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mark review as helpful/not helpful
     */
    public function markHelpful(Request $request, Review $review)
    {
        $validator = Validator::make($request->all(), [
            'helpful' => 'required|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            if ($request->helpful) {
                $review->increment('helpful_count');
            } else {
                $review->increment('not_helpful_count');
            }

            return response()->json([
                'success' => true,
                'message' => 'Feedback recorded successfully',
                'data' => [
                    'helpful_count' => $review->helpful_count,
                    'not_helpful_count' => $review->not_helpful_count
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to record feedback: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user's own reviews
     */
    public function myReviews(Request $request)
    {
        $user = auth('api')->user();
        
        $perPage = $request->get('per_page', 10);

        $reviews = Review::with([
            'hotel:id,title,slug,featured_image,price_per_night',
            'booking:id,check_in_date,check_out_date,status'
        ])
        ->where('user_id', $user->id)
        ->orderBy('created_at', 'desc')
        ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $reviews
        ]);
    }

    /**
     * Update hotel's average rating (private method)
     */
    private function updateHotelRating($hotelId)
    {
        $stats = Review::where('hotel_id', $hotelId)
            ->where('is_approved', true)
            ->selectRaw('AVG(rating) as avg_rating, COUNT(*) as review_count')
            ->first();

        Hotel::where('id', $hotelId)->update([
            'review_score' => round($stats->avg_rating ?? 0, 1),
            'review_count' => $stats->review_count ?? 0
        ]);
    }
}