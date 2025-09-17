<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HotelAmenity extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'icon',
        'description',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    // Relationships
    public function hotels()
    {
        return $this->belongsToMany(Hotel::class, 'hotel_hotel_amenity');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
