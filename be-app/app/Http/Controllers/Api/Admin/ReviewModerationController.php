<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Hotel;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ReviewModerationController extends Controller
{
    /**
     * Get all reviews with admin filters
     */
    public function index(Request $request)
    {
        try {
            $query = Review::with(['user', 'hotel', 'booking']);

            // Search by user name, hotel name, or review content
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('comment', 'like', "%{$search}%")
                      ->orWhereHas('user', function($userQuery) use ($search) {
                          $userQuery->where('name', 'like', "%{$search}%")
                                   ->orWhere('email', 'like', "%{$search}%");
                      })
                      ->orWhereHas('hotel', function($hotelQuery) use ($search) {
                          $hotelQuery->where('title', 'like', "%{$search}%");
                      });
                });
            }

            // Filter by approval status (using is_approved instead of status)
            if ($request->has('status')) {
                if ($request->status === 'approved') {
                    $query->where('is_approved', true);
                } elseif ($request->status === 'pending') {
                    $query->where('is_approved', false);
                }
            }

            // Filter by rating range
            if ($request->has('min_rating')) {
                $query->where('rating', '>=', $request->min_rating);
            }
            if ($request->has('max_rating')) {
                $query->where('rating', '<=', $request->max_rating);
            }

            // Filter by hotel
            if ($request->has('hotel_id')) {
                $query->where('hotel_id', $request->hotel_id);
            }

            // Filter by date range
            if ($request->has('start_date')) {
                $query->where('created_at', '>=', $request->start_date);
            }
            if ($request->has('end_date')) {
                $query->where('created_at', '<=', $request->end_date);
            }

            // Filter by verification status
            if ($request->has('is_verified')) {
                $query->where('is_verified', $request->is_verified);
            }

            // Sort options
            $sortField = $request->get('sort_by', 'created_at');
            $sortDirection = $request->get('sort_direction', 'desc');
            $query->orderBy($sortField, $sortDirection);

            $reviews = $query->paginate($request->per_page ?? 15);

            // Add statistics
            $stats = [
                'total_reviews' => $reviews->total(),
                'pending_reviews' => Review::where('is_approved', false)->count(),
                'approved_reviews' => Review::where('is_approved', true)->count(),
                'verified_reviews' => Review::where('is_verified', true)->count(),
                'average_rating' => round(Review::where('is_approved', true)->avg('rating'), 2),
            ];

            return response()->json([
                'success' => true,
                'data' => $reviews,
                'statistics' => $stats
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch reviews: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get specific review details for moderation
     */
    public function show($id)
    {
        try {
            $review = Review::with([
                'user',
                'hotel',
                'booking',
                'replies' => function($query) {
                    $query->with('user');
                }
            ])->findOrFail($id);

            // Get review metadata and moderation history
            $moderationHistory = [];
            $metadata = $review->metadata ?? [];
            
            if (isset($metadata['moderation_history'])) {
                $moderationHistory = $metadata['moderation_history'];
            }

            // Check for potential issues
            $potentialIssues = $this->analyzePotentialIssues($review);

            // Get similar reviews from same user or for same hotel
            $similarReviews = [
                'from_same_user' => Review::where('user_id', $review->user_id)
                    ->where('id', '!=', $review->id)
                    ->with('hotel')
                    ->latest()
                    ->limit(5)
                    ->get(),
                'for_same_hotel' => Review::where('hotel_id', $review->hotel_id)
                    ->where('id', '!=', $review->id)
                    ->with('user')
                    ->latest()
                    ->limit(5)
                    ->get()
            ];

            return response()->json([
                'success' => true,
                'data' => [
                    'review' => $review,
                    'moderation_history' => $moderationHistory,
                    'potential_issues' => $potentialIssues,
                    'similar_reviews' => $similarReviews
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch review details: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Approve or reject review
     */
    public function moderateReview(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'action' => 'required|in:approve,reject,verify,unverify',
                'reason' => 'required_if:action,reject|string|max:500',
                'admin_notes' => 'sometimes|string|max:1000'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $review = Review::findOrFail($id);
            $action = $request->action;

            DB::beginTransaction();

            // Update review status
            switch ($action) {
                case 'approve':
                    $review->is_approved = true;
                    $review->approved_at = now();
                    break;

                case 'reject':
                    $review->is_approved = false;
                    $review->approved_at = null;
                    break;

                case 'verify':
                    $review->is_verified = true;
                    break;

                case 'unverify':
                    $review->is_verified = false;
                    break;
            }

            $review->save();

            // Update hotel review score if review was approved/rejected
            if (in_array($action, ['approve', 'reject'])) {
                $this->updateHotelAverageRating($review->hotel_id);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Review {$action}ed successfully",
                'data' => $review->fresh()->load(['user', 'hotel'])
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => 'Failed to moderate review: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Bulk moderation actions
     */
    public function bulkAction(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'action' => 'required|in:approve,reject,verify,unverify,delete',
                'review_ids' => 'required|array|min:1',
                'review_ids.*' => 'exists:reviews,id',
                'reason' => 'required_if:action,reject|string|max:500'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $reviewIds = $request->review_ids;
            $action = $request->action;

            DB::beginTransaction();

            $affectedCount = 0;
            $hotelIds = [];

            foreach ($reviewIds as $reviewId) {
                $review = Review::find($reviewId);
                if (!$review) continue;

                $hotelIds[] = $review->hotel_id;

                switch ($action) {
                    case 'approve':
                        $review->is_approved = true;
                        $review->approved_at = now();
                        break;

                    case 'reject':
                        $review->is_approved = false;
                        $review->approved_at = null;
                        break;

                    case 'verify':
                        $review->is_verified = true;
                        break;

                    case 'unverify':
                        $review->is_verified = false;
                        break;

                    case 'delete':
                        $review->delete();
                        $affectedCount++;
                        continue 2;
                }

                $review->save();
                $affectedCount++;
            }

            // Update hotel average ratings
            $uniqueHotelIds = array_unique($hotelIds);
            foreach ($uniqueHotelIds as $hotelId) {
                $this->updateHotelAverageRating($hotelId);
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
     * Get review analytics
     */
    public function analytics(Request $request)
    {
        try {
            $startDate = $request->get('start_date', now()->subMonth());
            $endDate = $request->get('end_date', now());

            // Review statistics
            $reviewStats = [
                'total_reviews' => Review::whereBetween('created_at', [$startDate, $endDate])->count(),
                'approved_reviews' => Review::whereBetween('created_at', [$startDate, $endDate])
                    ->where('is_approved', true)->count(),
                'pending_reviews' => Review::whereBetween('created_at', [$startDate, $endDate])
                    ->where('is_approved', false)->count(),
                'verified_reviews' => Review::whereBetween('created_at', [$startDate, $endDate])
                    ->where('is_verified', true)->count(),
                'average_rating' => round(Review::whereBetween('created_at', [$startDate, $endDate])
                    ->where('is_approved', true)->avg('rating'), 2),
            ];

            // Rating distribution
            $ratingDistribution = Review::selectRaw('rating, COUNT(*) as count')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->where('is_approved', true)
                ->groupBy('rating')
                ->orderBy('rating')
                ->get();

            // Daily review trends
            $dailyTrends = Review::selectRaw('DATE(created_at) as date, COUNT(*) as count, AVG(rating) as avg_rating')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->groupBy('date')
                ->orderBy('date')
                ->get();

            // Top reviewed hotels
            $topReviewedHotels = Hotel::withCount(['reviews' => function($query) use ($startDate, $endDate) {
                    $query->whereBetween('created_at', [$startDate, $endDate])
                          ->where('is_approved', true);
                }])
                ->withAvg(['reviews as avg_rating' => function($query) use ($startDate, $endDate) {
                    $query->whereBetween('created_at', [$startDate, $endDate])
                          ->where('is_approved', true);
                }], 'rating')
                ->having('reviews_count', '>', 0)
                ->orderBy('reviews_count', 'desc')
                ->limit(10)
                ->get(['id', 'title', 'address']);

            // Most active reviewers
            $activeReviewers = User::withCount(['reviews' => function($query) use ($startDate, $endDate) {
                    $query->whereBetween('created_at', [$startDate, $endDate]);
                }])
                ->withAvg(['reviews as avg_rating' => function($query) use ($startDate, $endDate) {
                    $query->whereBetween('created_at', [$startDate, $endDate]);
                }], 'overall_rating')
                ->having('reviews_count', '>', 0)
                ->orderBy('reviews_count', 'desc')
                ->limit(10)
                ->get(['id', 'name', 'email']);

            // Sentiment analysis (basic)
            $sentimentData = [
                'positive' => Review::whereBetween('created_at', [$startDate, $endDate])
                    ->where('is_approved', true)
                    ->where('rating', '>=', 4)
                    ->count(),
                'neutral' => Review::whereBetween('created_at', [$startDate, $endDate])
                    ->where('is_approved', true)
                    ->where('rating', 3)
                    ->count(),
                'negative' => Review::whereBetween('created_at', [$startDate, $endDate])
                    ->where('is_approved', true)
                    ->where('rating', '<=', 2)
                    ->count(),
            ];

            return response()->json([
                'success' => true,
                'data' => [
                    'review_statistics' => $reviewStats,
                    'rating_distribution' => $ratingDistribution,
                    'daily_trends' => $dailyTrends,
                    'top_reviewed_hotels' => $topReviewedHotels,
                    'active_reviewers' => $activeReviewers,
                    'sentiment_analysis' => $sentimentData,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch review analytics: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get reviews requiring attention
     */
    public function requiresAttention(Request $request)
    {
        try {
            // Reviews requiring attention
            $pendingReviews = Review::where('is_approved', false)
                ->with(['user', 'hotel'])
                ->oldest()
                ->limit(10)
                ->get();

            $unverifiedReviews = Review::where('is_verified', false)
                ->with(['user', 'hotel'])
                ->latest()
                ->limit(10)
                ->get();

            // Suspicious patterns
            $suspiciousReviews = [
                'multiple_reviews_same_user' => $this->findMultipleReviewsFromSameUser(),
                'extreme_ratings' => Review::where('is_approved', true)
                    ->whereIn('rating', [1, 5])
                    ->where('created_at', '>=', now()->subDays(7))
                    ->with(['user', 'hotel'])
                    ->get(),
                'short_reviews_high_rating' => Review::where('is_approved', true)
                    ->where('rating', '>=', 4)
                    ->whereRaw('LENGTH(comment) < 20')
                    ->where('created_at', '>=', now()->subDays(7))
                    ->with(['user', 'hotel'])
                    ->get()
            ];

            return response()->json([
                'success' => true,
                'data' => [
                    'pending_reviews' => $pendingReviews,
                    'unverified_reviews' => $unverifiedReviews,
                    'suspicious_patterns' => $suspiciousReviews
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch reviews requiring attention: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Analyze potential issues with a review
     */
    private function analyzePotentialIssues($review)
    {
        $issues = [];

        // Check for very short review with high rating
        if ($review->rating >= 4 && strlen($review->comment) < 20) {
            $issues[] = 'Very short review with high rating';
        }

        // Check for extreme rating without detailed comment
        if (in_array($review->rating, [1, 5]) && strlen($review->comment) < 50) {
            $issues[] = 'Extreme rating with minimal explanation';
        }

        // Check if user has multiple reviews for same hotel
        $userReviewsForHotel = Review::where('user_id', $review->user_id)
            ->where('hotel_id', $review->hotel_id)
            ->count();

        if ($userReviewsForHotel > 1) {
            $issues[] = 'User has multiple reviews for same hotel';
        }

        // Check if user has many reviews in short period
        $recentReviews = Review::where('user_id', $review->user_id)
            ->where('created_at', '>=', now()->subDays(7))
            ->count();

        if ($recentReviews > 5) {
            $issues[] = 'User has posted many reviews recently';
        }

        // Check for potential spam keywords
        $spamKeywords = ['fake', 'scam', 'terrible', 'worst', 'amazing', 'perfect', 'best ever'];
        foreach ($spamKeywords as $keyword) {
            if (stripos($review->comment, $keyword) !== false) {
                $issues[] = 'Contains potential spam keywords';
                break;
            }
        }

        return $issues;
    }

    /**
     * Find users with multiple reviews in short period
     */
    private function findMultipleReviewsFromSameUser()
    {
        return DB::select("
            SELECT u.id, u.name, u.email, COUNT(r.id) as review_count
            FROM users u
            JOIN reviews r ON u.id = r.user_id
            WHERE r.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
            GROUP BY u.id, u.name, u.email
            HAVING review_count > 3
            ORDER BY review_count DESC
            LIMIT 10
        ");
    }

    /**
     * Update hotel average rating
     */
    private function updateHotelAverageRating($hotelId)
    {
        $avgRating = Review::where('hotel_id', $hotelId)
            ->where('is_approved', true)
            ->avg('rating');

        $reviewCount = Review::where('hotel_id', $hotelId)
            ->where('is_approved', true)
            ->count();

        Hotel::where('id', $hotelId)->update([
            'review_score' => round($avgRating ?? 0, 2),
            'review_count' => $reviewCount
        ]);
    }

    /**
     * Export review data
     */
    public function export(Request $request)
    {
        try {
            $query = Review::with(['user', 'hotel']);

            // Apply filters
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }
            if ($request->has('start_date')) {
                $query->where('created_at', '>=', $request->start_date);
            }
            if ($request->has('end_date')) {
                $query->where('created_at', '<=', $request->end_date);
            }

            $reviews = $query->get();

            // Format data for export
            $exportData = $reviews->map(function ($review) {
                return [
                    'Review ID' => $review->id,
                    'Reviewer Name' => $review->user->name,
                    'Reviewer Email' => $review->user->email,
                    'Hotel' => $review->hotel->title,
                    'Rating' => $review->rating,
                    'Title' => $review->title,
                    'Comment' => $review->comment,
                    'Is Approved' => $review->is_approved ? 'Yes' : 'No',
                    'Is Verified' => $review->is_verified ? 'Yes' : 'No',
                    'Helpful Count' => $review->helpful_count,
                    'Created Date' => $review->created_at->format('Y-m-d H:i:s'),
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $exportData,
                'total_records' => $exportData->count()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to export review data: ' . $e->getMessage()
            ], 500);
        }
    }
}