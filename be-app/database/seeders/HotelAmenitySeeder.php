<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\HotelAmenity;

class HotelAmenitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $amenities = [
            ['name' => 'Wi-Fi', 'slug' => 'wifi', 'icon' => '📶'],
            ['name' => 'Swimming Pool', 'slug' => 'swimming-pool', 'icon' => '🏊'],
            ['name' => 'Air Conditioning', 'slug' => 'air-conditioning', 'icon' => '❄️'],
            ['name' => 'Gym/Fitness Center', 'slug' => 'gym-fitness', 'icon' => '💪'],
            ['name' => 'Spa', 'slug' => 'spa', 'icon' => '🧖‍♀️'],
            ['name' => 'Restaurant', 'slug' => 'restaurant', 'icon' => '🍽️'],
            ['name' => 'Bar', 'slug' => 'bar', 'icon' => '🍸'],
            ['name' => 'Room Service', 'slug' => 'room-service', 'icon' => '🛎️'],
            ['name' => 'Parking', 'slug' => 'parking', 'icon' => '🅿️'],
            ['name' => 'Pet Friendly', 'slug' => 'pet-friendly', 'icon' => '🐕'],
            ['name' => 'Beach Access', 'slug' => 'beach-access', 'icon' => '🏖️'],
            ['name' => 'Business Center', 'slug' => 'business-center', 'icon' => '💼'],
            ['name' => 'Laundry Service', 'slug' => 'laundry-service', 'icon' => '🧺'],
            ['name' => 'Airport Shuttle', 'slug' => 'airport-shuttle', 'icon' => '🚐'],
            ['name' => '24/7 Front Desk', 'slug' => '24-7-front-desk', 'icon' => '🕰️'],
            ['name' => 'Balcony', 'slug' => 'balcony', 'icon' => '🏢'],
            ['name' => 'Kitchen', 'slug' => 'kitchen', 'icon' => '👩‍🍳'],
            ['name' => 'TV', 'slug' => 'tv', 'icon' => '📺'],
            ['name' => 'Minibar', 'slug' => 'minibar', 'icon' => '🍾'],
            ['name' => 'Safe', 'slug' => 'safe', 'icon' => '🔒']
        ];

        foreach ($amenities as $amenity) {
            HotelAmenity::create($amenity);
        }
    }
}
