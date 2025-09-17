<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Hotel extends Model
{
    protected $fillable = [
        'user_id',
        'category_id',
        'title',
        'slug',
        'description',
        'featured_image',
        'address',
        'latitude',
        'longitude',
        'price_per_night',
        'max_guests',
        'bedrooms',
        'bathrooms',
        'review_score',
        'review_count',
        'view_count',
        'comment_count',
        'sale_off',
        'is_ads',
        'is_active',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'price_per_night' => 'decimal:2',
            'review_score' => 'decimal:1',
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
            'is_ads' => 'boolean',
            'is_active' => 'boolean',
            'published_at' => 'datetime',
        ];
    }

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(HotelCategory::class, 'category_id');
    }

    public function images()
    {
        return $this->hasMany(HotelImage::class);
    }

    public function amenities()
    {
        return $this->belongsToMany(HotelAmenity::class, 'hotel_hotel_amenity');
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function favoritedBy()
    {
        return $this->belongsToMany(User::class, 'user_favorites');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopePublished($query)
    {
        return $query->whereNotNull('published_at');
    }

    // Helper methods
    public function getGalleryImagesAttribute()
    {
        return $this->images()->where('type', 'gallery')->get();
    }

    public function getFeaturedImageUrlAttribute()
    {
        $featuredImage = $this->images()->where('type', 'featured')->first();
        return $featuredImage ? $featuredImage->image_url : $this->featured_image;
    }
}
