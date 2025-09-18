<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use App\Models\Homestay;

class HomestaySeeder extends Seeder
{
    public function run(): void
    {
        Homestay::truncate();
        $path = database_path('data/__homeStay.json');

        if (!File::exists($path)) {
            $this->command->error("❌ File not found: $path");
            return;
        }

        $json = File::get($path);
        $data = json_decode($json, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->command->error('❌ Invalid JSON: ' . json_last_error_msg());
            return;
        }

        if (!is_array($data)) {
            $this->command->error('❌ JSON data is not an array');
            return;
        }

        foreach ($data as $item) {
            Homestay::create([
                'author_id'          => $item['authorId'] ?? 0,
                'title'              => $item['title'] ?? 'No title',
                'href'               => $item['href'] ?? '#',
                'listing_category_id'=> $item['listingCategoryId'] ?? 1,
                'description'        => $item['description'] ?? 'No description.',
                'featured_image'     => trim($item['featuredImage'] ?? ''),
                
                // ✅ Không encode lại JSON, lưu array trực tiếp
                'gallery_imgs'       => is_array($item['galleryImgs'] ?? null) 
                                          ? array_map('trim', $item['galleryImgs']) 
                                          : [],

                'address'            => $item['address'] ?? 'Unknown',
                'review_start'       => $item['reviewStart'] ?? 0.0,
                'review_count'       => $item['reviewCount'] ?? 0,
                'comment_count'      => $item['commentCount'] ?? 0,
                'view_count'         => $item['viewCount'] ?? 0,
                'like'               => (bool)($item['like'] ?? false),
                'price'              => $item['price'] ?? 0,
                'max_guests'         => $item['maxGuests'] ?? 1,
                'bedrooms'           => $item['bedrooms'] ?? 1,
                'bathrooms'          => $item['bathrooms'] ?? 1,
                'sale_off'           => $item['saleOff'] ?? null,
                'is_ads'             => (bool)($item['isAds'] ?? false),
                'map_lat'            => $item['map']['lat'] ?? 0.0,
                'map_lng'            => $item['map']['lng'] ?? 0.0,
                'date'               => $item['date'] ?? now()->toDateString(),
            ]);
        }

        $this->command->info('✅ Homestays seeded successfully!');
    }
}
