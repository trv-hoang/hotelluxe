<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HotelImage extends Model
{
    protected $fillable = [
        'hotel_id',
        'image_url',
        'alt_text',
        'sort_order',
        'type',
    ];

    // Relationships
    public function hotel()
    {
        return $this->belongsTo(Hotel::class);
    }

    // Scopes
    public function scopeGallery($query)
    {
        return $query->where('type', 'gallery');
    }

    public function scopeFeatured($query)
    {
        return $query->where('type', 'featured');
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order');
    }
}
