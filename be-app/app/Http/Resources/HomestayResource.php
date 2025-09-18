<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class HomestayResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'authorId' => $this->author_id,
            'date' => $this->date,
            'href' => $this->href,
            'listingCategoryId' => $this->listing_category_id,
            'title' => $this->title,
            'featuredImage' => $this->featured_image,
            'galleryImgs' => $this->gallery_imgs ?? [],
            'description' => $this->description,
            'commentCount' => $this->comment_count,
            'viewCount' => $this->view_count,
            'like' => (bool) $this->like,
            'address' => $this->address,
            'reviewStart' => $this->review_start,
            'reviewCount' => $this->review_count,
            'price' => $this->price,
            'maxGuests' => $this->max_guests,
            'bedrooms' => $this->bedrooms,
            'bathrooms' => $this->bathrooms,
            'saleOff' => $this->sale_off,
            'isAds' => (bool) $this->is_ads,
            'map' => [
                'lat' => $this->map_lat,
                'lng' => $this->map_lng,
            ],
        ];
    }
}
