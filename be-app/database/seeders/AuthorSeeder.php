<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use App\Models\Author;

class AuthorSeeder extends Seeder
{
    public function run(): void
    {
         Author::truncate();

        // Đường dẫn tới file JSON
        $path = database_path('data/__authors.json');

        // Kiểm tra file tồn tại
        if (!File::exists($path)) {
            $this->command->error(" File not found: $path");
            return;
        }

        // Đọc dữ liệu JSON
        $json = File::get($path);
        $data = json_decode($json, true);

        // Kiểm tra dữ liệu hợp lệ
        if (!is_array($data)) {
            $this->command->error(" Invalid JSON format in __authors.json");
            return;
        }

        // Xóa dữ liệu cũ
        Author::truncate();

        $count = 0;
        foreach ($data as $item) {
            Author::create([
                'first_name'   => $item['firstName'] ?? '',
                'last_name'    => $item['lastName'] ?? '',
                'display_name' => $item['displayName'] ?? '',
                'email'        => $item['email'] ?? '',
                'gender'       => $item['gender'] ?? null,
                'avatar'       => $item['avatar'] ?? null,
                'bg_image'     => $item['bgImage'] ?? null,
                'count'        => $item['count'] ?? 0,
                'href'         => $item['href'] ?? null,
                'desc'         => $item['desc'] ?? null,
                'job_name'     => $item['jobName'] ?? null,
                'address'      => $item['address'] ?? null,
                'created_at'   => $item['createdAt'] ?? now(),
                'updated_at'   => $item['updatedAt'] ?? now(),
            ]);
            $count++;
        }

        $this->command->info("✅ Seeded $count authors successfully!");
    }
}
