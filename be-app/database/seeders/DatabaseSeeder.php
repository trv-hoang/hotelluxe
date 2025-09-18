<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        // Gọi các seeder khác ở đây
        $this->call([
            AuthorSeeder::class,
            UserSeeder::class,
            // HotelDataSeeder::class, // Uncomment để seed dữ liệu hotel từ JSON
        ]);
        // hoàng
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
    }
}
