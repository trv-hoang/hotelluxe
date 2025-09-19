<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Payment;
use App\Models\Hotel;
use App\Services\MoMoPaymentService;
use App\Services\StripePaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class PaymentController extends Controller
{
    protected $momoService;
    protected $stripeService;

    public function __construct(
        MoMoPaymentService $momoService,
        StripePaymentService $stripeService
    ) {
        $this->momoService = $momoService;
        $this->stripeService = $stripeService;
    }

    /**
     * Get supported payment methods
     */
    public function getPaymentMethods()
    {
        $methods = config('payment.settings.supported_methods');
        
        // Filter only enabled methods
        $enabledMethods = array_filter($methods, function ($method) {
            return $method['enabled'] ?? false;
        });

        return response()->json([
            'success' => true,
            'data' => $enabledMethods
        ]);
    }

    /**
     * Create payment for a booking
     */
    public function createPayment(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'booking_id' => 'required|exists:bookings,id',
                'payment_method' => 'required|in:momo,visa,mastercard',
                'card_data' => 'required_if:payment_method,visa,mastercard|array',
                'card_data.number' => 'required_if:payment_method,visa,mastercard|string',
                'card_data.exp_month' => 'required_if:payment_method,visa,mastercard|integer|min:1|max:12',
                'card_data.exp_year' => 'required_if:payment_method,visa,mastercard|integer|min:' . date('Y'),
                'card_data.cvc' => 'required_if:payment_method,visa,mastercard|string|min:3|max:4',
                'card_data.card_holder_name' => 'required_if:payment_method,visa,mastercard|string|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $booking = Booking::with('user', 'hotel')->find($request->booking_id);

            // Check if user owns this booking
            if ($booking->user_id !== auth()->id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized to pay for this booking'
                ], 403);
            }

            // Check if booking is already paid
            if ($booking->payment_status === 'paid') {
                return response()->json([
                    'success' => false,
                    'message' => 'This booking is already paid'
                ], 400);
            }

            // Check if there's already a pending payment
            $existingPayment = Payment::where('booking_id', $booking->id)
                ->where('status', Payment::STATUS_PENDING)
                ->first();

            if ($existingPayment) {
                return response()->json([
                    'success' => false,
                    'message' => 'There is already a pending payment for this booking',
                    'existing_payment' => $existingPayment
                ], 400);
            }

            DB::beginTransaction();

            $paymentMethod = $request->payment_method;
            $result = null;

            switch ($paymentMethod) {
                case 'momo':
                    $result = $this->momoService->createPayment($booking);
                    break;
                    
                case 'visa':
                case 'mastercard':
                    $result = $this->stripeService->createPaymentIntent($booking, $request->card_data ?? []);
                    break;
                    
                default:
                    return response()->json([
                        'success' => false,
                        'message' => 'Unsupported payment method'
                    ], 400);
            }

            if ($result['success']) {
                DB::commit();
                return response()->json([
                    'success' => true,
                    'message' => 'Payment created successfully',
                    'data' => $result
                ]);
            } else {
                DB::rollback();
                return response()->json([
                    'success' => false,
                    'message' => $result['message']
                ], 400);
            }

        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Payment Creation Error', [
                'user_id' => auth()->id(),
                'booking_id' => $request->booking_id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Payment creation failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Confirm card payment (for Stripe)
     */
    public function confirmCardPayment(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'payment_intent_id' => 'required|string',
                'card_data' => 'required|array',
                'card_data.number' => 'required|string',
                'card_data.exp_month' => 'required|integer|min:1|max:12',
                'card_data.exp_year' => 'required|integer|min:' . date('Y'),
                'card_data.cvc' => 'required|string|min:3|max:4',
                'card_data.card_holder_name' => 'required|string|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $result = $this->stripeService->confirmPayment(
                $request->payment_intent_id,
                $request->card_data
            );

            if ($result['success']) {
                return response()->json([
                    'success' => true,
                    'message' => 'Payment confirmed successfully',
                    'data' => $result
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => $result['message']
                ], 400);
            }

        } catch (\Exception $e) {
            Log::error('Payment Confirmation Error', [
                'user_id' => auth()->id(),
                'payment_intent_id' => $request->payment_intent_id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Payment confirmation failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get payment details
     */
    public function getPayment($paymentId)
    {
        try {
            $payment = Payment::with(['booking.hotel', 'user'])
                ->where('payment_id', $paymentId)
                ->first();

            if (!$payment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment not found'
                ], 404);
            }

            // Check if user owns this payment
            if ($payment->user_id !== auth()->id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized to view this payment'
                ], 403);
            }

            return response()->json([
                'success' => true,
                'data' => $payment
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch payment: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user's payment history
     */
    public function getUserPayments(Request $request)
    {
        try {
            $query = Payment::with(['booking.hotel'])
                ->where('user_id', auth()->id())
                ->orderBy('created_at', 'desc');

            // Filter by status
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            // Filter by payment method
            if ($request->has('payment_method')) {
                $query->where('payment_method', $request->payment_method);
            }

            $payments = $query->paginate($request->per_page ?? 15);

            return response()->json([
                'success' => true,
                'data' => $payments
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch payments: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * MoMo webhook handler
     */
    public function momoWebhook(Request $request)
    {
        Log::info('MoMo Webhook Received', $request->all());

        $result = $this->momoService->handleIPN($request->all());

        if ($result['success']) {
            return response()->json(['message' => 'Success'], 200);
        } else {
            return response()->json(['message' => $result['message']], 400);
        }
    }

    /**
     * Stripe webhook handler
     */
    public function stripeWebhook(Request $request)
    {
        $payload = $request->getContent();
        $signature = $request->header('Stripe-Signature');

        Log::info('Stripe Webhook Received', [
            'signature' => $signature,
            'payload_size' => strlen($payload)
        ]);

        $result = $this->stripeService->handleWebhook($payload, $signature);

        if ($result['success']) {
            return response()->json(['message' => 'Success'], 200);
        } else {
            return response()->json(['message' => $result['message']], 400);
        }
    }

    /**
     * Cancel payment
     */
    public function cancelPayment($paymentId)
    {
        try {
            $payment = Payment::where('payment_id', $paymentId)->first();

            if (!$payment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment not found'
                ], 404);
            }

            // Check if user owns this payment
            if ($payment->user_id !== auth()->id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized to cancel this payment'
                ], 403);
            }

            // Can only cancel pending payments
            if (!$payment->isPending()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Can only cancel pending payments'
                ], 400);
            }

            $payment->update(['status' => Payment::STATUS_CANCELLED]);

            return response()->json([
                'success' => true,
                'message' => 'Payment cancelled successfully',
                'data' => $payment
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to cancel payment: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Request refund
     */
    public function requestRefund(Request $request, $paymentId)
    {
        try {
            $validator = Validator::make($request->all(), [
                'reason' => 'required|string|max:500',
                'amount' => 'nullable|numeric|min:0'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $payment = Payment::where('payment_id', $paymentId)->first();

            if (!$payment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment not found'
                ], 404);
            }

            // Check if user owns this payment
            if ($payment->user_id !== auth()->id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized to refund this payment'
                ], 403);
            }

            // Can only refund completed payments
            if (!$payment->isCompleted()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Can only refund completed payments'
                ], 400);
            }

            // For now, we'll just log the refund request
            // In production, you'd integrate with the payment gateway's refund API
            Log::info('Refund Requested', [
                'payment_id' => $payment->id,
                'user_id' => auth()->id(),
                'reason' => $request->reason,
                'amount' => $request->amount
            ]);

            // TODO: Implement actual refund processing based on gateway
            // if ($payment->gateway === Payment::GATEWAY_STRIPE) {
            //     $result = $this->stripeService->createRefund($payment->gateway_transaction_id, $request->amount);
            // }

            return response()->json([
                'success' => true,
                'message' => 'Refund request submitted successfully. It will be processed within 3-5 business days.',
                'data' => $payment
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to request refund: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Process booking and payment from frontend
     */
    public function processBookingFromFrontend(Request $request)
    {
        try {
            // Validate request data
            $validator = Validator::make($request->all(), [
                'user' => 'required|array',
                'user.id' => 'required|integer',
                'user.name' => 'required|string',
                'user.email' => 'required|email',
                'items' => 'required|array|min:1',
                'items.*.id' => 'required|integer',
                'items.*.title' => 'required|string',
                'items.*.price' => 'required|numeric',
                'items.*.nights' => 'required|integer|min:1',
                'paymentData' => 'required|array',
                'paymentData.cardHolder' => 'required|string',
                'paymentData.cardNumber' => 'required|string',
                'paymentData.expirationDate' => 'required|string',
                'paymentData.cvv' => 'required|string',
                'paymentData.paymentMethod' => 'required|string',
                'totalAmount' => 'required|numeric',
                'currency' => 'required|string',
                'checkInDate' => 'required|date',
                'checkOutDate' => 'required|date|after:checkInDate',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

            // Get first item (hotel booking)
            $firstItem = $request->input('items')[0];
            $hotel = Hotel::find($firstItem['id']);

            if (!$hotel) {
                return response()->json([
                    'success' => false,
                    'message' => 'Hotel not found'
                ], 404);
            }

            // Parse dates
            $checkInDate = Carbon::parse($request->input('checkInDate'));
            $checkOutDate = Carbon::parse($request->input('checkOutDate'));
            $nights = $checkInDate->diffInDays($checkOutDate);
            $pricePerNight = $firstItem['price'];

            // Create booking
            $booking = Booking::create([
                'booking_number' => 'BK' . time() . rand(100, 999),
                'user_id' => auth()->id(),
                'hotel_id' => $hotel->id,
                'check_in_date' => $checkInDate->format('Y-m-d'),
                'check_out_date' => $checkOutDate->format('Y-m-d'),
                'adults' => $firstItem['totalGuests'] ?? 2,
                'children' => 0,
                'infants' => 0,
                'nights' => $nights,
                'price_per_night' => $pricePerNight,
                'subtotal' => $request->input('totalAmount'),
                'total_amount' => $request->input('totalAmount'),
                'status' => 'pending',
                'special_requests' => null,
            ]);

            // Create payment
            $paymentData = $request->input('paymentData');
            $paymentMethod = match ($paymentData['paymentMethod']) {
                'credit_card' => 'credit_card',
                'momo' => 'momo',
                'zalopay' => 'zalopay',
                default => 'credit_card'
            };

            $payment = Payment::create([
                'payment_number' => Payment::generatePaymentIdForBooking(auth()->id(), $checkInDate),
                'booking_id' => $booking->id,
                'user_id' => auth()->id(),
                'amount' => $request->input('totalAmount'),
                'currency' => $request->input('currency', 'VND'),
                'payment_method' => $paymentMethod,
                'gateway' => $paymentMethod === 'momo' ? 'momo' : 'stripe',
                'status' => 'pending',
                'card_holder_name' => $paymentData['cardHolder'] ?? null,
                'card_last_four' => isset($paymentData['cardNumber']) ? substr($paymentData['cardNumber'], -4) : null,
                'metadata' => [
                    'frontend_timestamp' => $request->input('timestamp'),
                    'card_data' => [
                        'number' => $paymentData['cardNumber'] ?? null,
                        'exp_month' => isset($paymentData['expirationDate']) ? (int) explode('/', $paymentData['expirationDate'])[0] : null,
                        'exp_year' => isset($paymentData['expirationDate']) ? (int) ('20' . explode('/', $paymentData['expirationDate'])[1]) : null,
                        'cvc' => $paymentData['cvv'] ?? null,
                        'card_holder_name' => $paymentData['cardHolder'] ?? null,
                    ],
                    'original_payment_method' => $paymentData['paymentMethod'],
                    'custom_payment_id_info' => [
                        'user_id' => auth()->id(),
                        'check_in_date' => $checkInDate->format('Y-m-d'),
                        'generated_at' => now()->toISOString(),
                    ]
                ]
            ]);

            // Simulate payment processing
            $paymentResult = $this->simulatePaymentProcessing($paymentMethod, $paymentData, $request->input('totalAmount'));

            if ($paymentResult['success']) {
                // Update payment status
                $payment->update([
                    'status' => 'completed',
                    'paid_at' => now(),
                    'transaction_id' => $paymentResult['transaction_id'] ?? null
                ]);

                // Update booking status
                $booking->update(['status' => 'confirmed']);

                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => 'Payment processed successfully',
                    'data' => [
                        'booking' => $booking,
                        'payment' => $payment,
                        'payment_id' => $payment->payment_number,
                        'transaction_id' => $paymentResult['transaction_id']
                    ]
                ]);
            } else {
                // Update payment as failed
                $payment->update([
                    'status' => 'failed',
                    'gateway_response' => $paymentResult['message'] ?? 'Payment failed'
                ]);

                DB::rollBack();

                return response()->json([
                    'success' => false,
                    'message' => 'Payment failed: ' . ($paymentResult['message'] ?? 'Unknown error')
                ], 422);
            }

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Booking processing failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Simulate payment processing for different methods
     */
    private function simulatePaymentProcessing($paymentMethod, $paymentData, $amount)
    {
        // Simulate processing time
        usleep(rand(500000, 1500000)); // 0.5 to 1.5 seconds

        // Simulate success/failure (90% success rate)
        $success = rand(1, 10) <= 9;

        if ($success) {
            return [
                'success' => true,
                'transaction_id' => strtoupper($paymentMethod) . '_' . time() . rand(1000, 9999),
                'message' => 'Payment processed successfully'
            ];
        } else {
            return [
                'success' => false,
                'message' => 'Payment declined by gateway',
                'error_code' => 'DECLINED_' . rand(1000, 9999)
            ];
        }
    }
}