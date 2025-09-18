<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Xóa table homestays sau khi dữ liệu đã được chuyển vào table hotels
     */
    public function up(): void
    {
        Schema::dropIfExists('homestays');
    }

    /**
     * Reverse the migrations.
     * 
     * Tái tạo table homestays nếu cần rollback
     */
    public function down(): void
    {
        Schema::create('homestays', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('featured_image')->nullable();
            $table->json('gallery_images')->nullable();
            $table->text('address')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->decimal('price', 12, 2)->nullable();
            $table->integer('max_guests')->default(1);
            $table->integer('bedrooms')->default(1);
            $table->integer('bathrooms')->default(1);
            $table->decimal('review_score', 2, 1)->default(0.0);
            $table->integer('review_count')->default(0);
            $table->integer('view_count')->default(0);
            $table->integer('comment_count')->default(0);
            $table->string('sale_off')->nullable();
            $table->boolean('is_ads')->default(false);
            $table->boolean('like')->default(false);
            $table->json('map')->nullable();
            $table->string('href')->nullable();
            $table->integer('listing_category_id')->nullable();
            $table->integer('author_id')->nullable();
            $table->timestamp('date')->nullable();
            $table->timestamps();
        });
    }
};
