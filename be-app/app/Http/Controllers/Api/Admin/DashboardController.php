<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Hotel;
use App\Models\Booking;
use App\Models\Payment;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Get dashboard overview statistics
     */
    public function overview()
    {
        try {
            $stats = [
                // User statistics
                'users' => [
                    'total' => User::count(),
                    'new_this_month' => User::whereMonth('created_at', now()->month)
                        ->whereYear('created_at', now()->year)
                        ->count(),
                    'active_users' => User::where('created_at', '>=', now()->subDays(30))
                        ->count(),
                    'verified_users' => User::whereNotNull('email_verified_at')->count(),
                ],
                
                // Hotel statistics
                'hotels' => [
                    'total' => Hotel::count(),
                    'active' => Hotel::where('is_active', true)->count(),
                    'pending_approval' => Hotel::where('is_active', false)->count(),
                    'average_rating' => Hotel::whereHas('reviews')->avg('review_score') ?? 0,
                ],
                
                // Booking statistics
                'bookings' => [
                    'total' => Booking::count(),
                    'today' => Booking::whereDate('created_at', today())->count(),
                    'this_month' => Booking::whereMonth('created_at', now()->month)
                        ->whereYear('created_at', now()->year)
                        ->count(),
                    'confirmed' => Booking::where('status', 'confirmed')->count(),
                    'pending' => Booking::where('status', 'pending')->count(),
                    'cancelled' => Booking::where('status', 'cancelled')->count(),
                ],
                
                // Payment statistics
                'payments' => [
                    'total_revenue' => Payment::where('status', 'completed')->sum('amount'),
                    'today_revenue' => Payment::where('status', 'completed')
                        ->whereDate('created_at', today())
                        ->sum('amount'),
                    'this_month_revenue' => Payment::where('status', 'completed')
                        ->whereMonth('created_at', now()->month)
                        ->whereYear('created_at', now()->year)
                        ->sum('amount'),
                    'pending_payments' => Payment::where('status', 'pending')->count(),
                    'failed_payments' => Payment::where('status', 'failed')->count(),
                ],
                
                // Review statistics
                'reviews' => [
                    'total' => Review::count(),
                    'pending_approval' => Review::where('is_approved', false)->count(),
                    'approved' => Review::where('is_approved', true)->count(),
                    'average_rating' => Review::where('is_approved', true)->avg('rating') ?? 0,
                ],
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch dashboard statistics: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get revenue analytics data
     */
    public function revenueAnalytics(Request $request)
    {
        try {
            $period = $request->get('period', 'month'); // day, week, month, year
            $startDate = $request->get('start_date', now()->subMonth());
            $endDate = $request->get('end_date', now());

            $dateFormat = match($period) {
                'day' => '%Y-%m-%d',
                'week' => '%Y-%u',
                'month' => '%Y-%m',
                'year' => '%Y',
                default => '%Y-%m-%d'
            };

            $revenueData = Payment::where('status', 'completed')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->select(
                    DB::raw("DATE_FORMAT(created_at, '{$dateFormat}') as period"),
                    DB::raw('SUM(amount) as revenue'),
                    DB::raw('COUNT(*) as transactions')
                )
                ->groupBy('period')
                ->orderBy('period')
                ->get();

            // Payment method breakdown
            $paymentMethods = Payment::where('status', 'completed')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->select('payment_method', DB::raw('SUM(amount) as revenue'), DB::raw('COUNT(*) as count'))
                ->groupBy('payment_method')
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'revenue_timeline' => $revenueData,
                    'payment_methods' => $paymentMethods,
                    'total_revenue' => $revenueData->sum('revenue'),
                    'total_transactions' => $revenueData->sum('transactions'),
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch revenue analytics: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get booking analytics data
     */
    public function bookingAnalytics(Request $request)
    {
        try {
            $period = $request->get('period', 'month');
            $startDate = $request->get('start_date', now()->subMonth());
            $endDate = $request->get('end_date', now());

            // Booking trends
            $dateFormat = match($period) {
                'day' => '%Y-%m-%d',
                'week' => '%Y-%u', 
                'month' => '%Y-%m',
                'year' => '%Y',
                default => '%Y-%m-%d'
            };

            $bookingTrends = Booking::whereBetween('created_at', [$startDate, $endDate])
                ->select(
                    DB::raw("DATE_FORMAT(created_at, '{$dateFormat}') as period"),
                    DB::raw('COUNT(*) as bookings'),
                    'status'
                )
                ->groupBy('period', 'status')
                ->orderBy('period')
                ->get();

            // Popular hotels
            $popularHotels = Hotel::withCount(['bookings' => function($query) use ($startDate, $endDate) {
                    $query->whereBetween('created_at', [$startDate, $endDate]);
                }])
                ->orderBy('bookings_count', 'desc')
                ->limit(10)
                ->get(['id', 'name', 'city']);

            // Booking status breakdown
            $statusBreakdown = Booking::whereBetween('created_at', [$startDate, $endDate])
                ->select('status', DB::raw('COUNT(*) as count'))
                ->groupBy('status')
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'booking_trends' => $bookingTrends,
                    'popular_hotels' => $popularHotels,
                    'status_breakdown' => $statusBreakdown,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch booking analytics: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user analytics data
     */
    public function userAnalytics(Request $request)
    {
        try {
            $period = $request->get('period', 'month');
            $startDate = $request->get('start_date', now()->subMonth());
            $endDate = $request->get('end_date', now());

            $dateFormat = match($period) {
                'day' => '%Y-%m-%d',
                'week' => '%Y-%u',
                'month' => '%Y-%m', 
                'year' => '%Y',
                default => '%Y-%m-%d'
            };

            // User registration trends
            $registrationTrends = User::whereBetween('created_at', [$startDate, $endDate])
                ->select(
                    DB::raw("DATE_FORMAT(created_at, '{$dateFormat}') as period"),
                    DB::raw('COUNT(*) as new_users')
                )
                ->groupBy('period')
                ->orderBy('period')
                ->get();

            // Active users (users who made bookings)
            $activeUsers = User::whereHas('bookings', function($query) use ($startDate, $endDate) {
                    $query->whereBetween('created_at', [$startDate, $endDate]);
                })
                ->count();

            // Top customers by booking count
            $topCustomers = User::withCount(['bookings' => function($query) use ($startDate, $endDate) {
                    $query->whereBetween('created_at', [$startDate, $endDate]);
                }])
                ->whereHas('bookings')
                ->orderBy('bookings_count', 'desc')
                ->limit(10)
                ->get(['id', 'name', 'email']);

            return response()->json([
                'success' => true,
                'data' => [
                    'registration_trends' => $registrationTrends,
                    'active_users' => $activeUsers,
                    'top_customers' => $topCustomers,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch user analytics: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get recent activities
     */
    public function recentActivities(Request $request)
    {
        try {
            $limit = $request->get('limit', 20);

            $activities = collect();

            // Recent bookings
            $recentBookings = Booking::with(['user', 'hotel'])
                ->latest()
                ->limit($limit / 4)
                ->get()
                ->map(function ($booking) {
                    return [
                        'type' => 'booking',
                        'action' => 'created',
                        'description' => "New booking #{$booking->booking_code} for {$booking->hotel->name}",
                        'user' => $booking->user->name,
                        'timestamp' => $booking->created_at,
                        'data' => $booking
                    ];
                });

            // Recent payments
            $recentPayments = Payment::with(['user', 'booking.hotel'])
                ->latest()
                ->limit($limit / 4)
                ->get()
                ->map(function ($payment) {
                    return [
                        'type' => 'payment',
                        'action' => 'processed',
                        'description' => "Payment {$payment->status} for booking #{$payment->booking->booking_code}",
                        'user' => $payment->user->name,
                        'timestamp' => $payment->updated_at,
                        'data' => $payment
                    ];
                });

            // Recent reviews
            $recentReviews = Review::with(['user', 'hotel'])
                ->latest()
                ->limit($limit / 4)
                ->get()
                ->map(function ($review) {
                    return [
                        'type' => 'review',
                        'action' => 'submitted',
                        'description' => "New review for {$review->hotel->name} - {$review->overall_rating} stars",
                        'user' => $review->user->name,
                        'timestamp' => $review->created_at,
                        'data' => $review
                    ];
                });

            // Recent user registrations
            $recentUsers = User::latest()
                ->limit($limit / 4)
                ->get()
                ->map(function ($user) {
                    return [
                        'type' => 'user',
                        'action' => 'registered',
                        'description' => "New user registration: {$user->name}",
                        'user' => $user->name,
                        'timestamp' => $user->created_at,
                        'data' => $user
                    ];
                });

            // Merge and sort all activities
            $activities = $activities
                ->concat($recentBookings)
                ->concat($recentPayments)
                ->concat($recentReviews)
                ->concat($recentUsers)
                ->sortByDesc('timestamp')
                ->take($limit)
                ->values();

            return response()->json([
                'success' => true,
                'data' => $activities
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch recent activities: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get system health status
     */
    public function systemHealth()
    {
        try {
            $health = [
                'database' => [
                    'status' => 'healthy',
                    'response_time' => $this->checkDatabaseHealth(),
                ],
                'cache' => [
                    'status' => 'healthy',
                    'driver' => config('cache.default'),
                ],
                'queue' => [
                    'status' => 'healthy',
                    'driver' => config('queue.default'),
                ],
                'storage' => [
                    'status' => 'healthy',
                    'disk_usage' => $this->getDiskUsage(),
                ],
                'mail' => [
                    'status' => 'healthy',
                    'driver' => config('mail.default'),
                ],
            ];

            return response()->json([
                'success' => true,
                'data' => $health
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to check system health: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Check database connection health
     */
    private function checkDatabaseHealth()
    {
        $start = microtime(true);
        try {
            DB::connection()->getPdo();
            return round((microtime(true) - $start) * 1000, 2) . 'ms';
        } catch (\Exception $e) {
            return 'error';
        }
    }

    /**
     * Get disk usage information
     */
    private function getDiskUsage()
    {
        $bytes = disk_free_space(storage_path());
        $total = disk_total_space(storage_path());
        $used = $total - $bytes;
        
        return [
            'used' => $this->formatBytes($used),
            'free' => $this->formatBytes($bytes),
            'total' => $this->formatBytes($total),
            'usage_percentage' => round(($used / $total) * 100, 2)
        ];
    }

    /**
     * Format bytes to human readable format
     */
    private function formatBytes($size, $precision = 2)
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        
        for ($i = 0; $size > 1024 && $i < count($units) - 1; $i++) {
            $size /= 1024;
        }
        
        return round($size, $precision) . ' ' . $units[$i];
    }
}