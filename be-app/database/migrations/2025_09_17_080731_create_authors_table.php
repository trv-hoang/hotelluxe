<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('authors', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('display_name');
            $table->string('email')->unique();
            $table->string('gender')->nullable();
            $table->string('avatar')->nullable();
            $table->string('bg_image')->nullable();
            $table->integer('count')->default(0);
            $table->string('href')->nullable();
            $table->text('desc')->nullable();
            $table->string('job_name')->nullable();
            $table->string('address')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('authors');
    }
};
