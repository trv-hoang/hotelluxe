<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'payment_id',
        'booking_id',
        'user_id',
        'payment_method',
        'gateway',
        'amount',
        'currency',
        'status',
        'gateway_response',
        'gateway_transaction_id',
        'paid_at',
        'failed_at',
        'refunded_at',
        'refund_amount',
        'failure_reason',
        'notes',
        'metadata',
        // Keep old fields for compatibility
        'payment_number',
        'transaction_id',
        'gateway_data',
        'card_holder_name',
        'card_last_four',
        'card_brand'
    ];

    protected $casts = [
        'gateway_response' => 'array',
        'metadata' => 'array',
        'gateway_data' => 'array',
        'amount' => 'decimal:2',
        'refund_amount' => 'decimal:2',
        'paid_at' => 'datetime',
        'failed_at' => 'datetime',
        'refunded_at' => 'datetime',
    ];

    // Status constants
    const STATUS_PENDING = 'pending';
    const STATUS_PROCESSING = 'processing';
    const STATUS_COMPLETED = 'completed';
    const STATUS_FAILED = 'failed';
    const STATUS_CANCELLED = 'cancelled';
    const STATUS_REFUNDED = 'refunded';
    const STATUS_PARTIAL_REFUND = 'partial_refund';

    // Payment method constants
    const METHOD_MOMO = 'momo';
    const METHOD_VISA = 'visa';
    const METHOD_MASTERCARD = 'mastercard';
    const METHOD_BANK_TRANSFER = 'bank_transfer';

    // Gateway constants
    const GATEWAY_MOMO = 'momo';
    const GATEWAY_STRIPE = 'stripe';
    const GATEWAY_PAYPAL = 'paypal';

    /**
     * Get the booking that owns the payment.
     */
    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    /**
     * Get the user that owns the payment.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Check if payment is completed
     */
    public function isCompleted(): bool
    {
        return $this->status === self::STATUS_COMPLETED;
    }

    /**
     * Check if payment is pending
     */
    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    /**
     * Check if payment failed
     */
    public function isFailed(): bool
    {
        return $this->status === self::STATUS_FAILED;
    }

    /**
     * Check if payment is refunded
     */
    public function isRefunded(): bool
    {
        return in_array($this->status, [self::STATUS_REFUNDED, self::STATUS_PARTIAL_REFUND]);
    }

    /**
     * Mark payment as completed
     */
    public function markAsCompleted($gatewayTransactionId = null, $gatewayResponse = null): bool
    {
        return $this->update([
            'status' => self::STATUS_COMPLETED,
            'paid_at' => now(),
            'transaction_id' => $gatewayTransactionId,
            'gateway_response' => $gatewayResponse
        ]);
    }

    /**
     * Mark payment as failed
     */
    public function markAsFailed($reason = null, $gatewayResponse = null): bool
    {
        return $this->update([
            'status' => self::STATUS_FAILED,
            'failed_at' => now(),
            'failure_reason' => $reason,
            'gateway_response' => $gatewayResponse
        ]);
    }

    /**
     * Mark payment as refunded
     */
    public function markAsRefunded($amount = null): bool
    {
        $refundAmount = $amount ?? $this->amount;
        $status = $refundAmount < $this->amount ? self::STATUS_PARTIAL_REFUND : self::STATUS_REFUNDED;

        return $this->update([
            'status' => $status,
            'refunded_at' => now(),
            'refund_amount' => $refundAmount
        ]);
    }

    /**
     * Generate unique payment ID
     */
    public static function generatePaymentId(): string
    {
        return 'PAY_' . time() . '_' . strtoupper(uniqid());
    }

    /**
     * Scope for completed payments
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', self::STATUS_COMPLETED);
    }

    /**
     * Scope for pending payments
     */
    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    /**
     * Scope for failed payments
     */
    public function scopeFailed($query)
    {
        return $query->where('status', self::STATUS_FAILED);
    }

    /**
     * Generate custom payment ID for booking
     */
    public static function generatePaymentIdForBooking($userId, $checkInDate)
    {
        // Convert date to timestamp for consistency
        $timestamp = is_string($checkInDate) ? strtotime($checkInDate) : $checkInDate->timestamp;
        
        // Generate random suffix
        $randomSuffix = strtoupper(substr(md5(uniqid()), 0, 6));
        
        // Format: PAY_U{userId}_CI{timestamp}_{random}
        return "PAY_U{$userId}_CI{$timestamp}_{$randomSuffix}";
    }
}
