<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Payment;
use App\Models\Hotel;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class BookingManagementController extends Controller
{
    /**
     * Get all bookings with admin filters
     */
    public function index(Request $request)
    {
        try {
            $query = Booking::with(['user', 'hotel']);

            // Search by booking number, user name, or hotel title
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('booking_number', 'like', "%{$search}%")
                      ->orWhereHas('user', function($userQuery) use ($search) {
                          $userQuery->where('name', 'like', "%{$search}%")
                                   ->orWhere('email', 'like', "%{$search}%");
                      })
                      ->orWhereHas('hotel', function($hotelQuery) use ($search) {
                          $hotelQuery->where('title', 'like', "%{$search}%");
                      });
                });
            }

            // Filter by status
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            // Filter by payment status
            if ($request->has('payment_status')) {
                $query->whereHas('payment', function($paymentQuery) use ($request) {
                    $paymentQuery->where('status', $request->payment_status);
                });
            }

            // Filter by date range
            if ($request->has('start_date')) {
                $query->where('check_in_date', '>=', $request->start_date);
            }
            if ($request->has('end_date')) {
                $query->where('check_out_date', '<=', $request->end_date);
            }

            // Filter by booking date range
            if ($request->has('booking_start_date')) {
                $query->where('created_at', '>=', $request->booking_start_date);
            }
            if ($request->has('booking_end_date')) {
                $query->where('created_at', '<=', $request->booking_end_date);
            }

            // Filter by hotel
            if ($request->has('hotel_id')) {
                $query->where('hotel_id', $request->hotel_id);
            }

            // Filter by amount range
            if ($request->has('min_amount')) {
                $query->where('total_amount', '>=', $request->min_amount);
            }
            if ($request->has('max_amount')) {
                $query->where('total_amount', '<=', $request->max_amount);
            }

            // Sort options
            $sortField = $request->get('sort_by', 'created_at');
            $sortDirection = $request->get('sort_direction', 'desc');
            $query->orderBy($sortField, $sortDirection);

            $bookings = $query->paginate($request->per_page ?? 15);

            // Add additional statistics
            $stats = [
                'total_bookings' => $bookings->total(),
                'confirmed_bookings' => Booking::where('status', 'confirmed')->count(),
                'pending_bookings' => Booking::where('status', 'pending')->count(),
                'cancelled_bookings' => Booking::where('status', 'cancelled')->count(),
                'total_revenue' => Booking::sum('total_amount'),
            ];

            return response()->json([
                'success' => true,
                'data' => $bookings,
                'statistics' => $stats
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch bookings: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get specific booking details for admin
     */
    public function show($id)
    {
        try {
            $booking = Booking::with([
                'user',
                'hotel',
                'reviews'
            ])->findOrFail($id);

            // Get booking timeline
            $timeline = [];
            
            // Add creation event
            $timeline[] = [
                'event' => 'Booking Created',
                'timestamp' => $booking->created_at,
                'description' => 'Booking was created by ' . $booking->user->name,
                'type' => 'info'
            ];

            // Add payment events
            if ($booking->payment) {
                $timeline[] = [
                    'event' => 'Payment ' . ucfirst($booking->payment->status),
                    'timestamp' => $booking->payment->created_at,
                    'description' => 'Payment of $' . $booking->payment->amount . ' via ' . $booking->payment->payment_method,
                    'type' => $booking->payment->status === 'completed' ? 'success' : 'warning'
                ];
            }

            // Add status changes from metadata
            $metadata = $booking->metadata ?? [];
            if (isset($metadata['status_changes'])) {
                foreach ($metadata['status_changes'] as $change) {
                    $timeline[] = [
                        'event' => 'Status Changed to ' . ucfirst($change['status']),
                        'timestamp' => $change['changed_at'] ?? $booking->updated_at,
                        'description' => $change['reason'] ?? 'Status updated',
                        'type' => in_array($change['status'], ['confirmed', 'checked_out']) ? 'success' : 'info'
                    ];
                }
            }

            // Sort timeline by timestamp
            usort($timeline, function($a, $b) {
                return strtotime($a['timestamp']) - strtotime($b['timestamp']);
            });

            // Calculate booking metrics
            $metrics = [
                'nights' => $booking->nights ?? Carbon::parse($booking->check_in_date)->diffInDays(Carbon::parse($booking->check_out_date)),
                'average_per_night' => $booking->price_per_night,
                'days_until_checkin' => now()->diffInDays(Carbon::parse($booking->check_in_date), false),
                'booking_lead_time' => Carbon::parse($booking->created_at)->diffInDays(Carbon::parse($booking->check_in_date)),
                'adults' => $booking->adults,
                'children' => $booking->children,
                'infants' => $booking->infants,
            ];

            return response()->json([
                'success' => true,
                'data' => [
                    'booking' => $booking,
                    'timeline' => $timeline,
                    'metrics' => $metrics
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch booking details: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update booking status
     */
    public function updateStatus(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'status' => 'required|in:pending,confirmed,checked_in,checked_out,cancelled,no_show',
                'reason' => 'required_if:status,cancelled,no_show|string|max:500',
                'refund_amount' => 'sometimes|numeric|min:0'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $booking = Booking::findOrFail($id);
            $oldStatus = $booking->status;

            // Validate status transition
            if (!$this->isValidStatusTransition($oldStatus, $request->status)) {
                return response()->json([
                    'success' => false,
                    'message' => "Invalid status transition from {$oldStatus} to {$request->status}"
                ], 400);
            }

            DB::beginTransaction();

            $booking->status = $request->status;
            
            // Add status change to metadata
            $metadata = $booking->metadata ?? [];
            $metadata['status_changes'][] = [
                'from' => $oldStatus,
                'to' => $request->status,
                'reason' => $request->reason ?? 'Status updated by admin',
                'changed_by' => auth()->id(),
                'changed_at' => now()
            ];
            $booking->metadata = $metadata;

            $booking->save();

            // Handle cancellation refund
            if ($request->status === 'cancelled' && $request->has('refund_amount') && $booking->payment) {
                // Create refund record (implement refund logic based on payment method)
                $refundData = [
                    'booking_id' => $booking->id,
                    'payment_id' => $booking->payment->id,
                    'amount' => $request->refund_amount,
                    'reason' => $request->reason,
                    'processed_by' => auth()->id(),
                    'processed_at' => now()
                ];
                
                // Add refund to booking metadata
                $metadata['refunds'][] = $refundData;
                $booking->metadata = $metadata;
                $booking->save();
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Booking status updated successfully',
                'data' => $booking->fresh()->load(['user', 'hotel', 'payment'])
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => 'Failed to update booking status: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get booking analytics
     */
    public function analytics(Request $request)
    {
        try {
            $startDate = $request->get('start_date', now()->subMonth());
            $endDate = $request->get('end_date', now());

            // Booking statistics
            $bookingStats = [
                'total_bookings' => Booking::whereBetween('created_at', [$startDate, $endDate])->count(),
                'confirmed_bookings' => Booking::whereBetween('created_at', [$startDate, $endDate])
                    ->where('status', 'confirmed')->count(),
                'cancelled_bookings' => Booking::whereBetween('created_at', [$startDate, $endDate])
                    ->where('status', 'cancelled')->count(),
                'total_revenue' => Booking::whereBetween('created_at', [$startDate, $endDate])
                    ->sum('total_amount'),
                'average_booking_value' => Booking::whereBetween('created_at', [$startDate, $endDate])
                    ->avg('total_amount'),
            ];

            // Daily booking trends
            $dailyTrends = Booking::selectRaw('DATE(created_at) as date, COUNT(*) as bookings, SUM(total_amount) as revenue')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->groupBy('date')
                ->orderBy('date')
                ->get();

            // Status distribution
            $statusDistribution = Booking::selectRaw('status, COUNT(*) as count')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->groupBy('status')
                ->get();

            // Top hotels by bookings
            $topHotels = Hotel::withCount(['bookings' => function($query) use ($startDate, $endDate) {
                    $query->whereBetween('created_at', [$startDate, $endDate]);
                }])
                ->withSum(['bookings as revenue' => function($query) use ($startDate, $endDate) {
                    $query->whereBetween('created_at', [$startDate, $endDate]);
                }], 'total_amount')
                ->having('bookings_count', '>', 0)
                ->orderBy('bookings_count', 'desc')
                ->limit(10)
                ->get(['id', 'name', 'city']);

            // Booking lead times
            $leadTimes = Booking::selectRaw('
                CASE 
                    WHEN DATEDIFF(check_in_date, created_at) <= 1 THEN "Same Day"
                    WHEN DATEDIFF(check_in_date, created_at) <= 7 THEN "1-7 Days"
                    WHEN DATEDIFF(check_in_date, created_at) <= 30 THEN "1-4 Weeks"
                    WHEN DATEDIFF(check_in_date, created_at) <= 90 THEN "1-3 Months"
                    ELSE "3+ Months"
                END as lead_time_category,
                COUNT(*) as count
            ')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('lead_time_category')
            ->get();

            // Cancellation analysis
            $cancellationData = Booking::where('status', 'cancelled')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->selectRaw('
                    COUNT(*) as total_cancellations,
                    AVG(DATEDIFF(updated_at, created_at)) as avg_days_to_cancel,
                    SUM(total_amount) as lost_revenue
                ')
                ->first();

            return response()->json([
                'success' => true,
                'data' => [
                    'booking_statistics' => $bookingStats,
                    'daily_trends' => $dailyTrends,
                    'status_distribution' => $statusDistribution,
                    'top_hotels' => $topHotels,
                    'lead_times' => $leadTimes,
                    'cancellation_analysis' => $cancellationData,
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
     * Bulk actions for bookings
     */
    public function bulkAction(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'action' => 'required|in:confirm,cancel,check_in,check_out,export',
                'booking_ids' => 'required|array|min:1',
                'booking_ids.*' => 'exists:bookings,id',
                'reason' => 'required_if:action,cancel|string|max:500'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $bookingIds = $request->booking_ids;
            $action = $request->action;

            DB::beginTransaction();

            $affectedCount = 0;
            $results = [];

            foreach ($bookingIds as $bookingId) {
                $booking = Booking::find($bookingId);
                if (!$booking) continue;

                $oldStatus = $booking->status;
                $newStatus = $this->getNewStatusForAction($action);

                if ($newStatus && $this->isValidStatusTransition($oldStatus, $newStatus)) {
                    $booking->status = $newStatus;
                    
                    // Add to metadata
                    $metadata = $booking->metadata ?? [];
                    $metadata['status_changes'][] = [
                        'from' => $oldStatus,
                        'to' => $newStatus,
                        'reason' => $request->reason ?? "Bulk action: {$action}",
                        'changed_by' => auth()->id(),
                        'changed_at' => now()
                    ];
                    $booking->metadata = $metadata;
                    
                    $booking->save();
                    $affectedCount++;
                    $results[] = ['id' => $bookingId, 'status' => 'success'];
                } else {
                    $results[] = ['id' => $bookingId, 'status' => 'error', 'message' => 'Invalid status transition'];
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Bulk action '{$action}' completed",
                'affected_count' => $affectedCount,
                'results' => $results
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
     * Get upcoming check-ins and check-outs
     */
    public function upcomingEvents(Request $request)
    {
        try {
            $days = $request->get('days', 7);
            $startDate = now();
            $endDate = now()->addDays($days);

            $upcomingCheckIns = Booking::with(['user', 'hotel'])
                ->where('status', 'confirmed')
                ->whereBetween('check_in_date', [$startDate, $endDate])
                ->orderBy('check_in_date')
                ->get();

            $upcomingCheckOuts = Booking::with(['user', 'hotel'])
                ->where('status', 'checked_in')
                ->whereBetween('check_out_date', [$startDate, $endDate])
                ->orderBy('check_out_date')
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'upcoming_check_ins' => $upcomingCheckIns,
                    'upcoming_check_outs' => $upcomingCheckOuts
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch upcoming events: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Validate status transitions
     */
    private function isValidStatusTransition($from, $to)
    {
        $validTransitions = [
            'pending' => ['confirmed', 'cancelled'],
            'confirmed' => ['checked_in', 'cancelled', 'no_show'],
            'checked_in' => ['checked_out'],
            'checked_out' => [], // Final state
            'cancelled' => [], // Final state
            'no_show' => [] // Final state
        ];

        return in_array($to, $validTransitions[$from] ?? []);
    }

    /**
     * Get new status for bulk action
     */
    private function getNewStatusForAction($action)
    {
        $statusMap = [
            'confirm' => 'confirmed',
            'cancel' => 'cancelled',
            'check_in' => 'checked_in',
            'check_out' => 'checked_out'
        ];

        return $statusMap[$action] ?? null;
    }

    /**
     * Export booking data
     */
    public function export(Request $request)
    {
        try {
            $query = Booking::with(['user', 'hotel', 'payment']);

            // Apply filters
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }
            if ($request->has('start_date')) {
                $query->where('check_in_date', '>=', $request->start_date);
            }
            if ($request->has('end_date')) {
                $query->where('check_out_date', '<=', $request->end_date);
            }

            $bookings = $query->get();

            // Format data for export
            $exportData = $bookings->map(function ($booking) {
                return [
                    'Booking Number' => $booking->booking_number,
                    'Guest Name' => $booking->user->name,
                    'Guest Email' => $booking->user->email,
                    'Hotel' => $booking->hotel->title,
                    'Check In' => $booking->check_in_date,
                    'Check Out' => $booking->check_out_date,
                    'Adults' => $booking->adults,
                    'Children' => $booking->children,
                    'Nights' => $booking->nights,
                    'Status' => ucfirst($booking->status),
                    'Total Amount' => $booking->total_amount,
                    'Payment Status' => $booking->payment ? ucfirst($booking->payment->status) : 'N/A',
                    'Payment Method' => $booking->payment ? $booking->payment->payment_method : 'N/A',
                    'Booking Date' => $booking->created_at->format('Y-m-d H:i:s'),
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
                'message' => 'Failed to export booking data: ' . $e->getMessage()
            ], 500);
        }
    }
}