<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class HotelDataSeeder extends Seeder
{
    /**
     * Seed dữ liệu cho hệ thống hotel từ homestays JSON.
     */
    public function run(): void
    {
        $this->command->info('🏨 Bắt đầu nhập dữ liệu cho hệ thống hotel...');
        
        // 1. Tạo dữ liệu cơ bản (users, categories)
        $this->call(BasicDataSeeder::class);
        
        // 2. Nhập dữ liệu homestays vào hotels
        $this->call(HomestayToHotelSeeder::class);
        
        // 3. Thêm hình ảnh cho hotels
        $this->call(HotelImagesSeeder::class);
        
        $this->command->info('✅ Hoàn thành việc nhập dữ liệu hotel!');
        $this->command->line('📊 Tóm tắt:');
        $this->command->line('- ' . \Illuminate\Support\Facades\DB::table('users')->count() . ' users');
        $this->command->line('- ' . \Illuminate\Support\Facades\DB::table('hotel_categories')->count() . ' categories');
        $this->command->line('- ' . \Illuminate\Support\Facades\DB::table('hotels')->count() . ' hotels');
        $this->command->line('- ' . \Illuminate\Support\Facades\DB::table('hotel_images')->count() . ' hotel images');
    }
}