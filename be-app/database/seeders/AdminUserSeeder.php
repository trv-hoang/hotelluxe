<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user if not exists
        $adminUser = User::where('email', 'admin@hotel.com')->first();
        
        if (!$adminUser) {
            User::create([
                'name' => 'Hotel Admin',
                'email' => 'admin@hotel.com',
                'email_verified_at' => now(),
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'phone' => '+1234567890',
                'dob' => '1990-01-01',
                'gender' => 'other',
                'address' => '123 Admin Street, Admin City, Vietnam',
                'nickname' => 'Admin',
            ]);
            
            $this->command->info('Admin user created successfully');
        } else {
            $this->command->info('Admin user already exists');
        }
        
        // Create test customer user if not exists
        $customerUser = User::where('email', 'customer@hotel.com')->first();
        
        if (!$customerUser) {
            User::create([
                'name' => 'Test Customer',
                'email' => 'customer@hotel.com',
                'email_verified_at' => now(),
                'password' => Hash::make('customer123'),
                'role' => 'user',
                'phone' => '+0987654321',
                'dob' => '1995-05-15',
                'gender' => 'male',
                'address' => '456 Customer Street, Ho Chi Minh City, Vietnam',
                'nickname' => 'Customer',
            ]);
            
            $this->command->info('Customer user created successfully');
        } else {
            $this->command->info('Customer user already exists');
        }
    }
}
