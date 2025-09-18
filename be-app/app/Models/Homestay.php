<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Homestay extends Model
{
    use HasFactory;

    // Cho phép gán hàng loạt
    protected $fillable = [
        'author_id',
        'title',
        'href',
        'listing_category_id',
        'description',
        'featured_image',
        'gallery_imgs',
        'address',
        'review_start',
        'review_count',
        'comment_count',
        'view_count',
        'like',
        'price',
        'max_guests',
        'bedrooms',
        'bathrooms',
        'sale_off',
        'is_ads',
        'map_lat',
        'map_lng',
        'date',
    ];

    // Tự động cast field sang đúng kiểu khi lấy từ DB
    protected $casts = [
        'gallery_imgs' => 'array',   // JSON -> array
        'is_ads'       => 'boolean',
        'like'         => 'boolean',
        'review_start' => 'float',
        'price'        => 'integer',
        'max_guests'   => 'integer',
        'bedrooms'     => 'integer',
        'bathrooms'    => 'integer',
        'review_count' => 'integer',
        'comment_count'=> 'integer',
        'view_count'   => 'integer',
        'map_lat'      => 'float',
        'map_lng'      => 'float',
        'date'         => 'string', // hoặc 'datetime' nếu bạn muốn format
    ];
}
