<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\HotelCategory;

class HotelCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Resort',
                'slug' => 'resort',
                'description' => 'Luxury resorts with full amenities',
                'icon' => '🏖️'
            ],
            [
                'name' => 'Hotel',
                'slug' => 'hotel',
                'description' => 'Traditional hotels',
                'icon' => '🏨'
            ],
            [
                'name' => 'Villa',
                'slug' => 'villa',
                'description' => 'Private villas and houses',
                'icon' => '🏡'
            ],
            [
                'name' => 'Apartment',
                'slug' => 'apartment',
                'description' => 'Serviced apartments',
                'icon' => '🏢'
            ],
            [
                'name' => 'Homestay',
                'slug' => 'homestay',
                'description' => 'Local family homes',
                'icon' => '🏠'
            ],
            [
                'name' => 'Hostel',
                'slug' => 'hostel',
                'description' => 'Budget accommodation',
                'icon' => '🛏️'
            ]
        ];

        foreach ($categories as $category) {
            HotelCategory::create($category);
        }
    }
}
