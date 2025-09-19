<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    /**
     * Get payment notifications for the authenticated user
     */
    public function getPaymentNotifications(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'message' => 'Unauthorized'
                ], 401);
            }

            // Get recent payments for the user (last 30 days)
            $payments = Payment::with(['booking', 'booking.hotel'])
                ->where('user_id', $user->id)
                ->where('created_at', '>=', now()->subDays(30))
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get();

            // Transform payments into notification format
            $notifications = $payments->map(function ($payment) {
                $title = $this->getNotificationTitle($payment);
                $description = $this->getNotificationDescription($payment);
                $time = $this->formatTime($payment->updated_at);
                
                return [
                    'id' => $payment->id,
                    'title' => $title,
                    'description' => $description,
                    'time' => $time,
                    'read' => $this->isNotificationRead($payment),
                    'type' => 'payment',
                    'payment_id' => $payment->payment_id,
                    'status' => $payment->status,
                    'amount' => $payment->amount,
                    'currency' => $payment->currency ?? 'VND',
                    'hotel_name' => $payment->booking->hotel->name ?? 'N/A'
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $notifications,
                'unread_count' => $notifications->where('read', false)->count()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể lấy thông báo',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mark notification as read
     */
    public function markAsRead(Request $request): JsonResponse
    {
        try {
            $notificationId = $request->input('notification_id');
            $user = Auth::user();

            if (!$user) {
                return response()->json([
                    'message' => 'Unauthorized'
                ], 401);
            }

            $payment = Payment::where('id', $notificationId)
                ->where('user_id', $user->id)
                ->first();

            if (!$payment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy thông báo'
                ], 404);
            }

            // You could add a 'read_at' column to payments table or create a separate notifications table
            // For now, we'll just return success
            return response()->json([
                'success' => true,
                'message' => 'Đã đánh dấu là đã đọc'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể đánh dấu thông báo',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get notification title based on payment status
     */
    private function getNotificationTitle(Payment $payment): string
    {
        switch ($payment->status) {
            case Payment::STATUS_COMPLETED:
                return 'Thanh toán thành công!';
            case Payment::STATUS_FAILED:
                return 'Thanh toán thất bại';
            case Payment::STATUS_PENDING:
                return 'Thanh toán đang xử lý';
            case Payment::STATUS_REFUNDED:
                return 'Hoàn tiền thành công';
            case Payment::STATUS_PARTIAL_REFUND:
                return 'Hoàn tiền một phần';
            case Payment::STATUS_CANCELLED:
                return 'Thanh toán đã hủy';
            default:
                return 'Cập nhật thanh toán';
        }
    }

    /**
     * Get notification description based on payment details
     */
    private function getNotificationDescription(Payment $payment): string
    {
        $hotelName = $payment->booking->hotel->title ?? 'N/A';
        $amount = number_format($payment->amount, 0, ',', '.') . ' ' . ($payment->currency ?? 'VND');

        switch ($payment->status) {
            case Payment::STATUS_COMPLETED:
                return "Hoàn tất thanh toán {$amount} - đặt phòng tại {$hotelName} đã được xử lý thành công.";
            case Payment::STATUS_FAILED:
                return "Thanh toán {$amount} cho đặt phòng tại {$hotelName} - đã thất bại. Vui lòng thử lại.";
            case Payment::STATUS_PENDING:
                return "Thanh toán {$amount} cho đặt phòng tại {$hotelName} - đang được xử lý.";
            case Payment::STATUS_REFUNDED:
                return "Hoàn tiền {$amount} cho đặt phòng tại {$hotelName} - đã được thực hiện.";
            case Payment::STATUS_PARTIAL_REFUND:
                $refundAmount = number_format($payment->refund_amount, 0, ',', '.') . ' ' . ($payment->currency ?? 'VND');
                return "Hoàn tiền một phần {$refundAmount} cho đặt phòng tại {$hotelName}.";
            case Payment::STATUS_CANCELLED:
                return "Thanh toán {$amount} cho đặt phòng tại {$hotelName} đã bị hủy.";
            default:
                return "Có cập nhật về thanh toán {$amount} cho đặt phòng tại {$hotelName}.";
        }
    }

    /**
     * Format time for display
     */
    private function formatTime($dateTime): string
    {
        $now = now();
        $diff = $now->diffInMinutes($dateTime);

        if ($diff < 1) {
            return 'Vừa xong';
        } elseif ($diff < 60) {
            return $diff . ' phút trước';
        } elseif ($diff < 1440) { // 24 hours
            $hours = floor($diff / 60);
            return $hours . ' giờ trước';
        } else {
            $days = floor($diff / 1440);
            return $days . ' ngày trước';
        }
    }

    /**
     * Determine if notification should be marked as read
     * For now, we'll consider payments older than 1 hour as read
     */
    private function isNotificationRead(Payment $payment): bool
    {
        return $payment->updated_at->diffInHours(now()) > 1;
    }
}