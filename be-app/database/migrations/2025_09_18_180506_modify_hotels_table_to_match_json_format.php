<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Cập nhật cấu trúc hotels table để giống JSON format
     */
    public function up(): void
    {
        Schema::table('hotels', function (Blueprint $table) {
            // Thêm các cột mới để match JSON format
            $table->integer('original_id')->nullable()->after('id'); // ID gốc từ JSON
            $table->integer('author_id')->nullable()->after('user_id'); // từ authorId
            $table->string('date')->nullable()->after('original_id'); // từ date
            $table->string('href')->nullable()->after('date'); // từ href
            $table->integer('listing_category_id')->nullable()->after('category_id'); // từ listingCategoryId
            $table->json('gallery_imgs')->nullable()->after('featured_image'); // từ galleryImgs
            $table->integer('comment_count_json')->nullable()->after('comment_count'); // backup cột cũ
            $table->integer('view_count_json')->nullable()->after('view_count'); // backup cột cũ
            $table->boolean('like')->default(false)->after('view_count_json'); // từ like
            $table->decimal('review_start', 2, 1)->nullable()->after('review_score'); // từ reviewStart
            $table->decimal('price_json', 12, 2)->nullable()->after('price_per_night'); // từ price
            $table->integer('max_guests_json')->nullable()->after('max_guests'); // backup
            $table->string('sale_off_json')->nullable()->after('sale_off'); // backup
            $table->boolean('is_ads_json')->nullable()->after('is_ads'); // backup
            $table->json('map')->nullable()->after('longitude'); // từ map {lat, lng}
        });

        // Cập nhật dữ liệu từ JSON để fill các cột mới
        $this->updateDataFromJson();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('hotels', function (Blueprint $table) {
            $table->dropColumn([
                'original_id',
                'author_id', 
                'date',
                'href',
                'listing_category_id',
                'gallery_imgs',
                'comment_count_json',
                'view_count_json',
                'like',
                'review_start',
                'price_json',
                'max_guests_json',
                'sale_off_json',
                'is_ads_json',
                'map'
            ]);
        });
    }

    /**
     * Cập nhật dữ liệu từ JSON gốc
     */
    private function updateDataFromJson(): void
    {
        $jsonPath = database_path('data/__homeStay.json');
        
        if (!file_exists($jsonPath)) {
            return;
        }

        $jsonData = json_decode(file_get_contents($jsonPath), true);
        
        if (!$jsonData) {
            return;
        }

        foreach ($jsonData as $homestay) {
            // Tìm hotel theo title để update
            $hotel = DB::table('hotels')
                ->where('title', $homestay['title'])
                ->first();
                
            if ($hotel) {
                DB::table('hotels')
                    ->where('id', $hotel->id)
                    ->update([
                        'original_id' => $homestay['id'],
                        'author_id' => $homestay['authorId'] ?? null,
                        'date' => $homestay['date'] ?? null,
                        'href' => $homestay['href'] ?? null,
                        'listing_category_id' => $homestay['listingCategoryId'] ?? null,
                        'gallery_imgs' => json_encode($homestay['galleryImgs'] ?? []),
                        'comment_count_json' => $homestay['commentCount'] ?? null,
                        'view_count_json' => $homestay['viewCount'] ?? null,
                        'like' => $homestay['like'] ?? false,
                        'review_start' => $homestay['reviewStart'] ?? null,
                        'price_json' => $homestay['price'] ?? null,
                        'max_guests_json' => $homestay['maxGuests'] ?? null,
                        'sale_off_json' => $homestay['saleOff'] ?? null,
                        'is_ads_json' => $homestay['isAds'] ?? null,
                        'map' => json_encode([
                            'lat' => $homestay['map']['lat'] ?? null,
                            'lng' => $homestay['map']['lng'] ?? null
                        ]),
                        'updated_at' => now(),
                    ]);
            }
        }
    }
};
