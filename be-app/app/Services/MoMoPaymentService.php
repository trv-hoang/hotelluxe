<?php

namespace App\Services;

use App\Models\Payment;
use App\Models\Booking;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MoMoPaymentService
{
    private $partnerCode;
    private $accessKey;
    private $secretKey;
    private $endpoint;
    private $redirectUrl;
    private $ipnUrl;

    public function __construct()
    {
        $this->partnerCode = config('payment.momo.partner_code');
        $this->accessKey = config('payment.momo.access_key');
        $this->secretKey = config('payment.momo.secret_key');
        $this->endpoint = config('payment.momo.endpoint');
        $this->redirectUrl = config('payment.momo.redirect_url');
        $this->ipnUrl = config('payment.momo.ipn_url');
    }

    /**
     * Create MoMo payment request
     */
    public function createPayment(Booking $booking, array $extraData = [])
    {
        try {
            $payment = Payment::create([
                'payment_id' => Payment::generatePaymentId(),
                'booking_id' => $booking->id,
                'user_id' => $booking->user_id,
                'payment_method' => Payment::METHOD_MOMO,
                'gateway' => Payment::GATEWAY_MOMO,
                'amount' => $booking->total_amount,
                'currency' => 'VND',
                'status' => Payment::STATUS_PENDING,
            ]);

            $orderId = $payment->payment_id;
            $orderInfo = "Thanh toán đặt phòng khách sạn - Booking ID: {$booking->id}";
            $amount = (int) ($booking->total_amount);
            $requestId = time() . '';
            $requestType = 'payWithATM';

            // Build raw signature
            $rawHash = "accessKey={$this->accessKey}&amount={$amount}&extraData=".urlencode(json_encode($extraData))."&ipnUrl={$this->ipnUrl}&orderId={$orderId}&orderInfo=".urlencode($orderInfo)."&partnerCode={$this->partnerCode}&redirectUrl={$this->redirectUrl}&requestId={$requestId}&requestType={$requestType}";
            
            $signature = hash_hmac('sha256', $rawHash, $this->secretKey);

            $data = [
                'partnerCode' => $this->partnerCode,
                'partnerName' => 'Hotel Booking System',
                'storeId' => 'HotelStore',
                'requestId' => $requestId,
                'amount' => $amount,
                'orderId' => $orderId,
                'orderInfo' => $orderInfo,
                'redirectUrl' => $this->redirectUrl,
                'ipnUrl' => $this->ipnUrl,
                'lang' => 'vi',
                'extraData' => json_encode($extraData),
                'requestType' => $requestType,
                'signature' => $signature,
            ];

            $response = Http::timeout(30)->post($this->endpoint, $data);
            
            if ($response->successful()) {
                $result = $response->json();
                
                if ($result['resultCode'] == 0) {
                    $payment->update([
                        'gateway_response' => $result,
                        'gateway_transaction_id' => $requestId,
                        'metadata' => [
                            'momo_request_id' => $requestId,
                            'momo_order_id' => $orderId,
                            'extra_data' => $extraData
                        ]
                    ]);

                    return [
                        'success' => true,
                        'payment' => $payment,
                        'payment_url' => $result['payUrl'],
                        'qr_code_url' => $result['qrCodeUrl'] ?? null,
                        'deep_link' => $result['deeplink'] ?? null
                    ];
                } else {
                    $payment->markAsFailed($result['message'], $result);
                    return [
                        'success' => false,
                        'message' => $result['message'] ?? 'MoMo payment creation failed'
                    ];
                }
            } else {
                $payment->markAsFailed('Failed to connect to MoMo', $response->json());
                return [
                    'success' => false,
                    'message' => 'Failed to connect to MoMo payment gateway'
                ];
            }
        } catch (\Exception $e) {
            Log::error('MoMo Payment Error', [
                'booking_id' => $booking->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            if (isset($payment)) {
                $payment->markAsFailed($e->getMessage());
            }

            return [
                'success' => false,
                'message' => 'Payment processing failed: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Handle MoMo IPN (Instant Payment Notification)
     */
    public function handleIPN(array $data)
    {
        try {
            // Verify signature
            if (!$this->verifySignature($data)) {
                Log::warning('MoMo IPN signature verification failed', $data);
                return ['success' => false, 'message' => 'Invalid signature'];
            }

            $payment = Payment::where('payment_id', $data['orderId'])->first();
            
            if (!$payment) {
                Log::warning('MoMo IPN: Payment not found', ['order_id' => $data['orderId']]);
                return ['success' => false, 'message' => 'Payment not found'];
            }

            if ($data['resultCode'] == 0) {
                // Payment successful
                $payment->markAsCompleted($data['transId'], $data);
                
                // Update booking status
                $booking = $payment->booking;
                $booking->update(['payment_status' => 'paid']);

                Log::info('MoMo Payment Completed', [
                    'payment_id' => $payment->id,
                    'booking_id' => $booking->id,
                    'transaction_id' => $data['transId']
                ]);
            } else {
                // Payment failed
                $payment->markAsFailed($data['message'] ?? 'Payment failed', $data);
                
                Log::warning('MoMo Payment Failed', [
                    'payment_id' => $payment->id,
                    'result_code' => $data['resultCode'],
                    'message' => $data['message'] ?? 'Unknown error'
                ]);
            }

            return ['success' => true, 'message' => 'IPN processed successfully'];
        } catch (\Exception $e) {
            Log::error('MoMo IPN Error', [
                'error' => $e->getMessage(),
                'data' => $data
            ]);

            return ['success' => false, 'message' => 'IPN processing failed'];
        }
    }

    /**
     * Verify MoMo signature
     */
    private function verifySignature(array $data): bool
    {
        $rawHash = "accessKey={$this->accessKey}&amount={$data['amount']}&extraData={$data['extraData']}&message={$data['message']}&orderId={$data['orderId']}&orderInfo={$data['orderInfo']}&orderType={$data['orderType']}&partnerCode={$data['partnerCode']}&payType={$data['payType']}&requestId={$data['requestId']}&responseTime={$data['responseTime']}&resultCode={$data['resultCode']}&transId={$data['transId']}";
        
        $signature = hash_hmac('sha256', $rawHash, $this->secretKey);
        
        return $signature === $data['signature'];
    }

    /**
     * Query payment status
     */
    public function queryPaymentStatus($orderId, $requestId)
    {
        try {
            $rawHash = "accessKey={$this->accessKey}&orderId={$orderId}&partnerCode={$this->partnerCode}&requestId={$requestId}";
            $signature = hash_hmac('sha256', $rawHash, $this->secretKey);

            $data = [
                'partnerCode' => $this->partnerCode,
                'requestId' => $requestId,
                'orderId' => $orderId,
                'signature' => $signature,
                'lang' => 'vi',
            ];

            $response = Http::timeout(30)->post(
                str_replace('/create', '/query', $this->endpoint),
                $data
            );

            if ($response->successful()) {
                return $response->json();
            }

            return null;
        } catch (\Exception $e) {
            Log::error('MoMo Query Error', [
                'order_id' => $orderId,
                'error' => $e->getMessage()
            ]);
            return null;
        }
    }
}