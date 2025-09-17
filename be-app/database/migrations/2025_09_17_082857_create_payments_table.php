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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->string('payment_number')->unique();
            $table->foreignId('booking_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->decimal('amount', 12, 2);
            $table->enum('payment_method', ['credit_card', 'debit_card', 'bank_transfer', 'momo', 'zalopay', 'vnpay', 'cash'])->default('credit_card');
            $table->enum('status', ['pending', 'processing', 'completed', 'failed', 'refunded'])->default('pending');
            $table->string('transaction_id')->nullable(); // Gateway transaction ID
            $table->string('gateway_response')->nullable(); // Payment gateway response code
            $table->json('gateway_data')->nullable(); // Raw payment gateway response
            $table->string('card_holder_name')->nullable();
            $table->string('card_last_four')->nullable();
            $table->string('card_brand')->nullable(); // Visa, Mastercard, etc.
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('refunded_at')->nullable();
            $table->decimal('refund_amount', 12, 2)->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            
            $table->index(['booking_id', 'status']);
            $table->index(['user_id', 'status']);
            $table->index(['payment_method']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
