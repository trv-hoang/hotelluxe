<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $json = File::get(database_path('data/__users.json'));
        $users = json_decode($json, true);

        foreach ($users as $user) {
           User::create([
    'id' => $user['id'] ?? null,
    'name' => $user['name'],
    'email' => $user['email'],
    'email_verified_at' => $user['email_verified_at'] ?? null,
    'password' => Hash::make($user['password']),
    'role' => $user['role'] ?? 'user',
    'profile_pic' => $user['profilePic'] ?? null,
    'nickname' => $user['nickname'] ?? null,
    'dob' => $user['dob'] ?? null,
    'phone' => $user['phone'] ?? null,
    'gender' => $user['gender'] ?? null,
    'address' => $user['address'] ?? null,
    'remember_token' => $user['remember_token'] ?? null,
    'created_at' => $user['createdAt'] ?? now(),
    'updated_at' => $user['updatedAt'] ?? now(),
]);

        }
    }
}
