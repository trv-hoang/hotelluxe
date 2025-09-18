<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class BasicDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info("Tạo dữ liệu cơ bản...");

        // Tạo categories
        $categories = [
            ['name' => 'Khách sạn sang trọng', 'slug' => 'khach-san-sang-trong', 'description' => 'Khách sạn cao cấp với dịch vụ 5 sao'],
            ['name' => 'Resort nghỉ dưỡng', 'slug' => 'resort-nghi-duong', 'description' => 'Khu nghỉ dưỡng với không gian rộng lớn'],
            ['name' => 'Khách sạn boutique', 'slug' => 'khach-san-boutique', 'description' => 'Khách sạn nhỏ xinh với phong cách riêng biệt'],
            ['name' => 'Khách sạn thương gia', 'slug' => 'khach-san-thuong-gia', 'description' => 'Khách sạn phục vụ doanh nhân và du khách thương gia'],
        ];

        foreach ($categories as $category) {
            DB::table('hotel_categories')->updateOrInsert(
                ['slug' => $category['slug']],
                array_merge($category, [
                    'created_at' => now(),
                    'updated_at' => now(),
                ])
            );
        }

        // Tạo users (authors từ homestays data)
        $users = [];
        for ($i = 1; $i <= 30; $i++) {
            $users[] = [
                'name' => "Hotel Owner {$i}",
                'email' => "owner{$i}@luxehotel.com",
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'role' => 'user', // Chỉ có 'admin' và 'user' theo migration
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        foreach ($users as $user) {
            DB::table('users')->updateOrInsert(
                ['email' => $user['email']],
                $user
            );
        }

        $this->command->info("✓ Đã tạo " . count($categories) . " categories và " . count($users) . " users");
    }
}