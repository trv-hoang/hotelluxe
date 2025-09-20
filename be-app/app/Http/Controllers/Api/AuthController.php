<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    /**
     * Register a new user
     */
 public function register(Request $request)
{
    $validator = Validator::make($request->all(), [
        'name' => 'required|string|between:2,100',
        'email' => 'required|string|email|max:100|unique:users',
        'password' => 'required|string|min:6|confirmed',
        'phone' => 'nullable|string|max:15',
        'address' => 'nullable|string|max:255',
        'dob' => 'nullable|date|before:today',
        'gender' => 'nullable|in:male,female,other',
        'nickname' => 'nullable|string|max:50',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'message' => 'Validation errors',
            'errors' => $validator->errors()
        ], 422);
    }

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
        'phone' => $request->phone,
        'address' => $request->address,
        'dob' => $request->dob,
        'gender' => $request->gender,
        'nickname' => $request->nickname,
        'role' => 'user',
    ]);

    try {
        $token = JWTAuth::fromUser($user);
    } catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {
        \Log::error('JWTException: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Token creation failed: ' . $e->getMessage()
        ], 500);
    } catch (\Exception $e) {
        \Log::error('General Exception: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Server error during token generation'
        ], 500);
    }

    return response()->json([
        'success' => true,
        'message' => 'User registered successfully',
        'data' => [
            'user' => $user,
            'token' => $token,
            'token_type' => 'bearer',
            'expires_in' => config('jwt.ttl') * 60 // ✅ Sửa ở đây
        ]
    ], 201);
}

    /**
     * Login user
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $credentials = $request->only('email', 'password');

        if (!$token = auth('api')->attempt($credentials)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials'
            ], 401);
        }

        $user = auth('api')->user();

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'data' => [
                'user' => $user,
                'token' => $token,
                'token_type' => 'bearer',
              'expires_in' => config('jwt.ttl') * 60
            ]
        ]);
    }

    /**
     * Get user profile
     */
    public function profile()
    {
        $user = auth('api')->user();

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user
            ]
        ]);
    }

    /**
     * Update user profile
     */
    public function updateProfile(Request $request)
    {
        $user = auth('api')->user();

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|between:2,100',
            'phone' => 'sometimes|string|max:15',
            'address' => 'sometimes|string|max:255',
            'dob' => 'sometimes|date|before:today',
            'gender' => 'sometimes|in:male,female,other',
            'nickname' => 'sometimes|string|max:50',
            'profile_pic' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048', // Hỗ trợ file upload
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        // Xử lý upload ảnh profile
        $updateData = $request->only([
            'name', 'phone', 'address', 'dob', 'gender', 'nickname'
        ]);

        if ($request->hasFile('profile_pic')) {
            try {
                // Xóa ảnh cũ nếu có
                if ($user->profile_pic && file_exists(public_path($user->profile_pic))) {
                    unlink(public_path($user->profile_pic));
                }

                // Upload ảnh mới vào thư mục /public/avatars/
                $file = $request->file('profile_pic');
                $fileName = 'avatar_' . $user->id . '_' . time() . '.' . $file->getClientOriginalExtension();
                $destinationPath = public_path('avatars');
                
                // Tạo thư mục nếu chưa tồn tại
                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0755, true);
                }
                
                $file->move($destinationPath, $fileName);
                $updateData['profile_pic'] = '/avatars/' . $fileName;
                
            } catch (\Exception $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to upload profile picture: ' . $e->getMessage()
                ], 500);
            }
        }

        $user->update($updateData);

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'data' => [
                'user' => $user->fresh()
            ]
        ]);
    }

    /**
     * Refresh token
     */
    public function refresh()
    {
        $newToken = auth('api')->refresh();

        return response()->json([
            'success' => true,
            'message' => 'Token refreshed successfully',
            'data' => [
                'token' => $newToken,
                'token_type' => 'bearer',
              'expires_in' => config('jwt.ttl') * 60
            ]
        ]);
    }

    /**
     * Logout user
     */
    public function logout()
    {
        auth('api')->logout();

        return response()->json([
            'success' => true,
            'message' => 'Logout successful'
        ]);
    }

    /**
     * Send password reset email with OTP
     */
    public function forgotPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $email = $request->email;
        
        // Tạo OTP 6 chữ số
        $otpCode = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $token = Str::random(64); // Vẫn tạo token để bảo mật

        // Xóa OTP cũ nếu có
        DB::table('password_reset_tokens')->where('email', $email)->delete();

        // Lưu OTP mới
        DB::table('password_reset_tokens')->insert([
            'email' => $email,
            'token' => $token,
            'otp_code' => $otpCode,
            'is_verified' => false,
            'created_at' => Carbon::now()
        ]);

        // Gửi email với OTP
        try {
            Mail::send('emails.password-reset-otp', [
                'otpCode' => $otpCode,
                'email' => $email
            ], function ($message) use ($email) {
                $message->to($email)
                        ->subject('Mã xác thực reset password - Hotel Luxe');
            });

            return response()->json([
                'success' => true,
                'message' => 'Mã xác thực đã được gửi đến email của bạn'
            ]);

        } catch (\Exception $e) {
            // Xóa OTP nếu gửi email thất bại
            DB::table('password_reset_tokens')->where('email', $email)->delete();
            
            return response()->json([
                'success' => false,
                'message' => 'Không thể gửi email: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Verify OTP code
     */
    public function verifyOTP(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'otp_code' => 'required|string|size:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        // Tìm OTP trong database
        $resetRecord = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->where('otp_code', $request->otp_code)
            ->where('is_verified', false)
            ->first();

        if (!$resetRecord) {
            return response()->json([
                'success' => false,
                'message' => 'Mã OTP không hợp lệ hoặc đã được sử dụng'
            ], 400);
        }

        // Kiểm tra OTP có hết hạn không (10 phút)
        if (Carbon::parse($resetRecord->created_at)->addMinutes(10)->isPast()) {
            // Xóa OTP hết hạn
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            
            return response()->json([
                'success' => false,
                'message' => 'Mã OTP đã hết hạn'
            ], 400);
        }

        // Đánh dấu OTP đã được verify
        DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->where('otp_code', $request->otp_code)
            ->update(['is_verified' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Xác thực thành công. Bạn có thể đặt mật khẩu mới.',
            'data' => [
                'reset_token' => $resetRecord->token
            ]
        ]);
    }

    /**
     * Reset password with verified token
     */
    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        // Tìm token đã được verify trong database
        $resetRecord = DB::table('password_reset_tokens')
            ->where('token', $request->token)
            ->where('is_verified', true)
            ->first();

        if (!$resetRecord) {
            return response()->json([
                'success' => false,
                'message' => 'Token không hợp lệ hoặc chưa được xác thực'
            ], 400);
        }

        // Kiểm tra token có hết hạn không (24 giờ từ khi tạo)
        if (Carbon::parse($resetRecord->created_at)->addHours(24)->isPast()) {
            // Xóa token hết hạn
            DB::table('password_reset_tokens')->where('token', $request->token)->delete();
            
            return response()->json([
                'success' => false,
                'message' => 'Token đã hết hạn'
            ], 400);
        }

        // Tìm user và cập nhật password
        $user = User::where('email', $resetRecord->email)->first();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy user'
            ], 404);
        }

        // Cập nhật password
        $user->update([
            'password' => Hash::make($request->password)
        ]);

        // Xóa token sau khi sử dụng
        DB::table('password_reset_tokens')->where('token', $request->token)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Mật khẩu đã được cập nhật thành công'
        ]);
    }
}
