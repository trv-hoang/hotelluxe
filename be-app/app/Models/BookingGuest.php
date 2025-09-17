<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookingGuest extends Model
{
    protected $fillable = [
        'booking_id',
        'first_name',
        'last_name',
        'date_of_birth',
        'gender',
        'id_number',
        'passport_number',
        'nationality',
        'guest_type',
        'is_primary',
    ];

    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
            'is_primary' => 'boolean',
        ];
    }

    // Relationships
    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    // Scopes
    public function scopePrimary($query)
    {
        return $query->where('is_primary', true);
    }

    public function scopeAdults($query)
    {
        return $query->where('guest_type', 'adult');
    }

    // Helper methods
    public function getFullNameAttribute()
    {
        return $this->first_name . ' ' . $this->last_name;
    }
}
