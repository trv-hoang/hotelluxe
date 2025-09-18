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
        // Các cột mới từ JSON format
        'original_id',
        'author_id',
        'date',
        'href',
        'listing_category_id',
        'gallery_imgs',
        'comment_count_json',
        'view_count_json',
        'like',
        'review_start',
        'price_json',
        'max_guests_json',
        'sale_off_json',
        'is_ads_json',
        'map',
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
            // Casts cho các cột mới
            'gallery_imgs' => 'array',
            'map' => 'array',
            'like' => 'boolean',
            'review_start' => 'decimal:1',
            'price_json' => 'decimal:2',
            'is_ads_json' => 'boolean',
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
