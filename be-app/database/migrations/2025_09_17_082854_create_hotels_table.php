<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('hotels', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Owner/Manager
            $table->foreignId('category_id')->constrained('hotel_categories');
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->string('featured_image');
            $table->text('address');
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->decimal('price_per_night', 12, 2);
            $table->integer('max_guests')->default(2);
            $table->integer('bedrooms')->default(1);
            $table->integer('bathrooms')->default(1);
            $table->decimal('review_score', 2, 1)->default(0.0);
            $table->integer('review_count')->default(0);
            $table->integer('view_count')->default(0);
            $table->integer('comment_count')->default(0);
            $table->string('sale_off')->nullable();
            $table->boolean('is_ads')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            
            $table->index(['category_id', 'is_active']);
            $table->index(['price_per_night']);
            $table->index(['review_score']);
            $table->fullText(['title', 'description']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hotels');
    }
};
