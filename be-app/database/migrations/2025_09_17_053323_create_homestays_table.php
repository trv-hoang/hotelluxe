<?php // database/migrations/xxxx_create_homestays_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('homestays', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('author_id');
            $table->string('title');
            $table->string('href');
            $table->unsignedBigInteger('listing_category_id');
            $table->text('description');
            $table->string('featured_image');
            $table->json('gallery_imgs'); // hoặc text nếu dùng MySQL < 5.7
            $table->string('address');
            $table->float('review_start');
            $table->unsignedInteger('review_count');
            $table->unsignedInteger('comment_count');
            $table->unsignedInteger('view_count');
            $table->boolean('like');
            $table->unsignedInteger('price');
            $table->unsignedInteger('max_guests');
            $table->unsignedInteger('bedrooms');
            $table->unsignedInteger('bathrooms');
            $table->string('sale_off')->nullable();
            $table->boolean('is_ads');
            $table->double('map_lat');
            $table->double('map_lng');
            $table->string('date'); // hoặc date nếu bạn muốn lưu dạng date
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('homestays');
    }
};