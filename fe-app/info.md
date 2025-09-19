# 1. tạo env
cp .env.example .env 

# 2. 3tạo key
php artisan key:generate

# 3. clear config
php artisan config:clear

# 4. Tạo lại bảng và thêm luôn database từ seed
php artisan migrate:fresh --seed

# 5. Chạy server cho back-end
php artisan serve

# 6 tạo jwt env
php artisan jwt:secret

php artisan config:clear
php artisan cache:clear

# note:
# + Chỉ tạo bảng mới không có data
php artisan migrate


# thêm toàn bộ

php artisan db:seed

# thêm theo lựa chọn

php artisan db:seed --class=GuestSeeder
php artisan db:seed --class=HomestaySeeder
php artisan db:seed --class=AuthorSeeder

# fix: Chạy lệnh dọn cache autoload
composer dump-autoload
php artisan cache:clear
php artisan config:clear


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
