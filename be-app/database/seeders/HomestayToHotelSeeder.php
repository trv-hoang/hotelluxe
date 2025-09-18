<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class HomestayToHotelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $homestaysJsonPath = database_path('data/__homeStay.json');
        
        if (!file_exists($homestaysJsonPath)) {
            $this->command->error("File __homeStay.json không tồn tại!");
            return;
        }

        $homestaysData = json_decode(file_get_contents($homestaysJsonPath), true);
        
        if (!$homestaysData) {
            $this->command->error("Không thể đọc dữ liệu từ __homeStay.json!");
            return;
        }

        $this->command->info("Bắt đầu nhập dữ liệu từ homestays vào hotels...");

        foreach ($homestaysData as $homestay) {
            $slug = Str::slug($homestay['title']);
            
            // Kiểm tra xem hotel đã tồn tại chưa
            $existingHotel = DB::table('hotels')->where('slug', $slug)->first();
            
            if ($existingHotel) {
                $this->command->warn("Hotel với slug '{$slug}' đã tồn tại, bỏ qua...");
                continue;
            }

            // Chuyển đổi dữ liệu từ homestay sang hotel
            $hotelData = [
                'user_id' => $homestay['authorId'] ?? 1, // Sử dụng authorId làm user_id
                'category_id' => $homestay['listingCategoryId'] ?? 1,
                'title' => $homestay['title'],
                'slug' => $slug,
                'description' => $homestay['description'] ?? 'Mô tả chi tiết sẽ được cập nhật sau.',
                'featured_image' => $homestay['featuredImage'],
                'address' => $homestay['address'],
                'latitude' => $homestay['map']['lat'] ?? null,
                'longitude' => $homestay['map']['lng'] ?? null,
                'price_per_night' => $homestay['price'],
                'max_guests' => $homestay['maxGuests'] ?? 2,
                'bedrooms' => $homestay['bedrooms'] ?? 1,
                'bathrooms' => $homestay['bathrooms'] ?? 1,
                'review_score' => $homestay['reviewStart'] ?? 0.0,
                'review_count' => $homestay['reviewCount'] ?? 0,
                'view_count' => $homestay['viewCount'] ?? 0,
                'comment_count' => $homestay['commentCount'] ?? 0,
                'sale_off' => $homestay['saleOff'] ?? null,
                'is_ads' => $homestay['isAds'] ?? false,
                'is_active' => true,
                'published_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ];

            try {
                $hotelId = DB::table('hotels')->insertGetId($hotelData);
                
                // Thêm gallery images vào hotel_images table
                if (!empty($homestay['galleryImgs'])) {
                    foreach ($homestay['galleryImgs'] as $index => $imageUrl) {
                        DB::table('hotel_images')->insert([
                            'hotel_id' => $hotelId,
                            'image_url' => $imageUrl,
                            'alt_text' => $homestay['title'] . ' - Image ' . ($index + 1),
                            'type' => 'gallery', // Sử dụng type thay vì is_primary
                            'sort_order' => $index + 1,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                }
                
                $this->command->info("✓ Đã nhập hotel: {$homestay['title']}");
                
            } catch (\Exception $e) {
                $this->command->error("✗ Lỗi khi nhập hotel '{$homestay['title']}': " . $e->getMessage());
            }
        }

        $this->command->info("Hoàn thành việc nhập dữ liệu homestays vào hotels!");
    }
}