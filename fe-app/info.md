# xoá toàn bộ

php artisan migrate:fresh --seed

# thêm toàn bộ

php artisan db:seed

# thêm theo lựa chọn

php artisan db:seed --class=GuestSeeder
php artisan db:seed --class=HomestaySeeder

chạy tất cả file seed:

```ts
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Gọi từng seeder
        $this->call([
            HomestaySeeder::class,
            GuestSeeder::class,
        ]);
    }
}

```
