<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // Lấy tất cả user
    public function index()
    {
        $users = User::all();
        return UserResource::collection($users);
    }

    // Tạo user mới từ JSON
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'nickname' => 'nullable|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|in:admin,user',
            'profilePic' => 'nullable|url',
            'dob' => 'nullable|date',
            'phone' => 'nullable|string|max:20',
            'gender' => 'nullable|in:male,female,other',
            'address' => 'nullable|string|max:255',
        ]);

        // Map profilePic sang profile_pic
        if(isset($data['profilePic'])){
            $data['profile_pic'] = $data['profilePic'];
            unset($data['profilePic']);
        }

        $data['password'] = Hash::make($data['password']);

        $user = User::create($data);

        return new UserResource($user);
    }
}
