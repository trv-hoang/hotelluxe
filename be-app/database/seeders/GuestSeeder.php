<?php

namespace Database\Seeders;

use App\Models\Guest;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class GuestSeeder extends Seeder
{
    public function run(): void
    {
        Guest::truncate();
        $path = database_path('data/__guests.json');

        if (!File::exists($path)) {
            $this->command->error("❌ File not found: $path");
            return;
        }

        $json = File::get($path);
        $data = json_decode($json, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->command->error("❌ Invalid JSON: " . json_last_error_msg());
            return;
        }

        if (!is_array($data)) {
            $this->command->error("❌ JSON data is not an array");
            return;
        }

        foreach ($data as $item) {
            Guest::create([
                'name'        => $item['name'] ?? 'No name',
                'email'       => $item['email'] ?? null,
                'password'    => bcrypt($item['password'] ?? '123456'),
                'role'        => $item['role'] ?? 'guest',
                'profile_pic' => $item['profilePic'] ?? null,
                'nickname'    => $item['nickname'] ?? null,
                'dob'         => $item['dob'] ?? null,
                'phone'       => $item['phone'] ?? null,
                'gender'      => $item['gender'] ?? null,
                'address'     => $item['address'] ?? null,
                'created_at'  => $item['createdAt'] ?? now(),
                'updated_at'  => $item['updatedAt'] ?? now(),
            ]);
        }

        $this->command->info('✅ Guests seeded successfully!');
    }
}
