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
        Schema::table('users', function (Blueprint $table) {
            // Thêm các trường từ JSON users
            $table->enum('role', ['admin', 'user'])->default('user')->after('email_verified_at');
            $table->string('profile_pic')->nullable()->after('password');
            $table->string('nickname')->nullable()->after('profile_pic');
            $table->date('dob')->nullable()->after('nickname');
            $table->string('phone', 15)->nullable()->after('dob');
            $table->enum('gender', ['male', 'female', 'other'])->nullable()->after('phone');
            $table->text('address')->nullable()->after('gender');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'role', 'profile_pic', 'nickname', 'dob', 
                'phone', 'gender', 'address'
            ]);
        });
    }
};
