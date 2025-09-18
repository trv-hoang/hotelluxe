<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class HotelImagesSeeder extends Seeder
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

        $this->command->info("Bắt đầu thêm hình ảnh cho các hotels...");

        foreach ($homestaysData as $homestay) {
            $slug = \Illuminate\Support\Str::slug($homestay['title']);
            
            // Tìm hotel theo slug
            $hotel = DB::table('hotels')->where('slug', $slug)->first();
            
            if (!$hotel) {
                continue;
            }

            // Xóa images cũ nếu có
            DB::table('hotel_images')->where('hotel_id', $hotel->id)->delete();
            
            // Thêm gallery images
            if (!empty($homestay['galleryImgs'])) {
                foreach ($homestay['galleryImgs'] as $index => $imageUrl) {
                    DB::table('hotel_images')->insert([
                        'hotel_id' => $hotel->id,
                        'image_url' => $imageUrl,
                        'alt_text' => $homestay['title'] . ' - Image ' . ($index + 1),
                        'type' => 'gallery',
                        'sort_order' => $index + 1,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
                
                $this->command->info("✓ Đã thêm " . count($homestay['galleryImgs']) . " hình ảnh cho: {$homestay['title']}");
            }
        }

        $this->command->info("Hoàn thành việc thêm hình ảnh cho hotels!");
    }
}