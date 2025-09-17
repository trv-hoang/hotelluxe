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
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('hotel_id')->constrained()->onDelete('cascade');
            $table->foreignId('booking_id')->nullable()->constrained()->onDelete('set null');
            $table->decimal('rating', 2, 1); // 0.0 - 5.0
            $table->text('title')->nullable();
            $table->text('comment');
            $table->json('rating_breakdown')->nullable(); // {service: 4.5, cleanliness: 5.0, location: 4.0, etc.}
            $table->boolean('is_verified')->default(false); // Verified stay
            $table->boolean('is_approved')->default(false);
            $table->timestamp('approved_at')->nullable();
            $table->integer('helpful_count')->default(0);
            $table->integer('not_helpful_count')->default(0);
            $table->text('response_from_hotel')->nullable();
            $table->timestamp('hotel_responded_at')->nullable();
            $table->timestamps();
            
            $table->index(['hotel_id', 'is_approved']);
            $table->index(['user_id']);
            $table->index(['rating']);
            $table->unique(['user_id', 'hotel_id', 'booking_id']); // One review per booking
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
