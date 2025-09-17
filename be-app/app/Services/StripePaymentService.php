<?php

namespace App\Services;

use App\Models\Payment;
use App\Models\Booking;
use Illuminate\Support\Facades\Log;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Stripe\PaymentMethod;
use Stripe\Exception\ApiErrorException;

class StripePaymentService
{
    private $secretKey;
    private $webhookSecret;

    public function __construct()
    {
        $this->secretKey = config('payment.stripe.secret_key');
        $this->webhookSecret = config('payment.stripe.webhook_secret');
        Stripe::setApiKey($this->secretKey);
    }

    /**
     * Create Stripe payment intent for Visa/Mastercard
     */
    public function createPaymentIntent(Booking $booking, array $cardData = [])
    {
        try {
            $payment = Payment::create([
                'payment_id' => Payment::generatePaymentId(),
                'booking_id' => $booking->id,
                'user_id' => $booking->user_id,
                'payment_method' => $this->getCardBrand($cardData),
                'gateway' => Payment::GATEWAY_STRIPE,
                'amount' => $booking->total_amount,
                'currency' => 'VND',
                'status' => Payment::STATUS_PENDING,
            ]);

            // Convert VND to cents (Stripe requires amounts in cents)
            $amountInCents = (int) ($booking->total_amount * 100);

            $paymentIntent = PaymentIntent::create([
                'amount' => $amountInCents,
                'currency' => 'vnd',
                'payment_method_types' => ['card'],
                'metadata' => [
                    'booking_id' => $booking->id,
                    'payment_id' => $payment->payment_id,
                    'user_id' => $booking->user_id,
                ],
                'description' => "Hotel booking payment - Booking ID: {$booking->id}",
                'receipt_email' => $booking->user->email ?? null,
            ]);

            $payment->update([
                'gateway_transaction_id' => $paymentIntent->id,
                'gateway_response' => $paymentIntent->toArray(),
                'metadata' => [
                    'stripe_payment_intent_id' => $paymentIntent->id,
                    'client_secret' => $paymentIntent->client_secret
                ]
            ]);

            return [
                'success' => true,
                'payment' => $payment,
                'client_secret' => $paymentIntent->client_secret,
                'payment_intent_id' => $paymentIntent->id
            ];

        } catch (ApiErrorException $e) {
            Log::error('Stripe Payment Intent Error', [
                'booking_id' => $booking->id,
                'error' => $e->getMessage(),
                'code' => $e->getStripeCode()
            ]);

            if (isset($payment)) {
                $payment->markAsFailed($e->getMessage(), ['stripe_error' => $e->toArray()]);
            }

            return [
                'success' => false,
                'message' => 'Card payment processing failed: ' . $e->getMessage()
            ];

        } catch (\Exception $e) {
            Log::error('Stripe Payment Error', [
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
     * Confirm payment with card details
     */
    public function confirmPayment($paymentIntentId, array $cardData)
    {
        try {
            $payment = Payment::where('gateway_transaction_id', $paymentIntentId)->first();
            
            if (!$payment) {
                return [
                    'success' => false,
                    'message' => 'Payment not found'
                ];
            }

            $payment->update(['status' => Payment::STATUS_PROCESSING]);

            // Create payment method
            $paymentMethod = PaymentMethod::create([
                'type' => 'card',
                'card' => [
                    'number' => $cardData['number'],
                    'exp_month' => $cardData['exp_month'],
                    'exp_year' => $cardData['exp_year'],
                    'cvc' => $cardData['cvc'],
                ],
                'billing_details' => [
                    'name' => $cardData['card_holder_name'] ?? null,
                    'email' => $payment->user->email ?? null,
                ]
            ]);

            // Confirm payment intent
            $paymentIntent = PaymentIntent::retrieve($paymentIntentId);
            $paymentIntent->confirm([
                'payment_method' => $paymentMethod->id
            ]);

            if ($paymentIntent->status === 'succeeded') {
                // Get card details
                $cardDetails = $paymentMethod->card;
                
                $payment->update([
                    'card_holder_name' => $cardData['card_holder_name'] ?? null,
                    'card_last_four' => $cardDetails->last4,
                    'card_brand' => $cardDetails->brand,
                    'gateway_response' => $paymentIntent->toArray()
                ]);

                $payment->markAsCompleted($paymentIntent->id, $paymentIntent->toArray());
                
                // Update booking
                $payment->booking->update(['payment_status' => 'paid']);

                return [
                    'success' => true,
                    'payment' => $payment,
                    'transaction_id' => $paymentIntent->id
                ];

            } else {
                $payment->markAsFailed('Payment confirmation failed', $paymentIntent->toArray());
                
                return [
                    'success' => false,
                    'message' => 'Payment confirmation failed'
                ];
            }

        } catch (ApiErrorException $e) {
            Log::error('Stripe Confirm Payment Error', [
                'payment_intent_id' => $paymentIntentId,
                'error' => $e->getMessage(),
                'code' => $e->getStripeCode()
            ]);

            if (isset($payment)) {
                $payment->markAsFailed($e->getMessage(), ['stripe_error' => $e->toArray()]);
            }

            return [
                'success' => false,
                'message' => 'Card payment failed: ' . $e->getMessage()
            ];

        } catch (\Exception $e) {
            Log::error('Stripe Confirm Error', [
                'payment_intent_id' => $paymentIntentId,
                'error' => $e->getMessage()
            ]);

            if (isset($payment)) {
                $payment->markAsFailed($e->getMessage());
            }

            return [
                'success' => false,
                'message' => 'Payment confirmation failed: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Handle Stripe webhooks
     */
    public function handleWebhook($payload, $signature)
    {
        try {
            $event = \Stripe\Webhook::constructEvent(
                $payload,
                $signature,
                $this->webhookSecret
            );

            switch ($event->type) {
                case 'payment_intent.succeeded':
                    $this->handlePaymentSucceeded($event->data->object);
                    break;
                
                case 'payment_intent.payment_failed':
                    $this->handlePaymentFailed($event->data->object);
                    break;
                
                case 'charge.dispute.created':
                    $this->handleChargeback($event->data->object);
                    break;
            }

            return ['success' => true, 'message' => 'Webhook processed'];

        } catch (\Exception $e) {
            Log::error('Stripe Webhook Error', [
                'error' => $e->getMessage(),
                'payload' => $payload
            ]);

            return ['success' => false, 'message' => 'Webhook processing failed'];
        }
    }

    /**
     * Create refund
     */
    public function createRefund($paymentIntentId, $amount = null)
    {
        try {
            $payment = Payment::where('gateway_transaction_id', $paymentIntentId)->first();
            
            if (!$payment || !$payment->isCompleted()) {
                return [
                    'success' => false,
                    'message' => 'Payment not found or not completed'
                ];
            }

            $refundAmount = $amount ? (int)($amount * 100) : null;

            $refund = \Stripe\Refund::create([
                'payment_intent' => $paymentIntentId,
                'amount' => $refundAmount,
                'metadata' => [
                    'payment_id' => $payment->payment_id,
                    'booking_id' => $payment->booking_id
                ]
            ]);

            $payment->markAsRefunded($amount);

            Log::info('Stripe Refund Created', [
                'payment_id' => $payment->id,
                'refund_id' => $refund->id,
                'amount' => $refundAmount
            ]);

            return [
                'success' => true,
                'refund_id' => $refund->id,
                'payment' => $payment
            ];

        } catch (\Exception $e) {
            Log::error('Stripe Refund Error', [
                'payment_intent_id' => $paymentIntentId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Refund failed: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Handle successful payment webhook
     */
    private function handlePaymentSucceeded($paymentIntent)
    {
        $payment = Payment::where('gateway_transaction_id', $paymentIntent->id)->first();
        
        if ($payment && !$payment->isCompleted()) {
            $payment->markAsCompleted($paymentIntent->id, $paymentIntent);
            $payment->booking->update(['payment_status' => 'paid']);
            
            Log::info('Stripe Payment Succeeded via Webhook', [
                'payment_id' => $payment->id,
                'booking_id' => $payment->booking_id
            ]);
        }
    }

    /**
     * Handle failed payment webhook
     */
    private function handlePaymentFailed($paymentIntent)
    {
        $payment = Payment::where('gateway_transaction_id', $paymentIntent->id)->first();
        
        if ($payment && !$payment->isFailed()) {
            $payment->markAsFailed($paymentIntent->last_payment_error->message ?? 'Payment failed', $paymentIntent);
            
            Log::warning('Stripe Payment Failed via Webhook', [
                'payment_id' => $payment->id,
                'booking_id' => $payment->booking_id,
                'error' => $paymentIntent->last_payment_error->message ?? 'Unknown error'
            ]);
        }
    }

    /**
     * Handle chargeback webhook
     */
    private function handleChargeback($charge)
    {
        // Find payment by charge ID and handle chargeback
        Log::warning('Stripe Chargeback Created', [
            'charge_id' => $charge->id,
            'amount' => $charge->amount
        ]);
    }

    /**
     * Get card brand from card data
     */
    private function getCardBrand(array $cardData): string
    {
        $cardNumber = $cardData['number'] ?? '';
        
        if (preg_match('/^4/', $cardNumber)) {
            return Payment::METHOD_VISA;
        } elseif (preg_match('/^5[1-5]/', $cardNumber)) {
            return Payment::METHOD_MASTERCARD;
        }
        
        return Payment::METHOD_VISA; // Default to Visa
    }
}