<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = [
        'user_id',
        'hotel_id',
        'booking_id',
        'rating',
        'title',
        'comment',
        'rating_breakdown',
        'is_verified',
        'is_approved',
        'approved_at',
        'helpful_count',
        'not_helpful_count',
        'response_from_hotel',
        'hotel_responded_at',
    ];

    protected function casts(): array
    {
        return [
            'rating' => 'decimal:1',
            'rating_breakdown' => 'array',
            'is_verified' => 'boolean',
            'is_approved' => 'boolean',
            'approved_at' => 'datetime',
            'hotel_responded_at' => 'datetime',
        ];
    }

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function hotel()
    {
        return $this->belongsTo(Hotel::class);
    }

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    // Scopes
    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
    }

    public function scopeVerified($query)
    {
        return $query->where('is_verified', true);
    }

    // Helper methods
    public function isApproved()
    {
        return $this->is_approved;
    }

    public function isVerified()
    {
        return $this->is_verified;
    }
}
