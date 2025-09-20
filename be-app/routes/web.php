<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Mail;

Route::get('/', function () {
    return view('welcome');
});

// Test email route
Route::get('/test-mail', function () {
    try {
        Mail::raw('Test email from Hotel Luxe', function ($message) {
            $message->to('nguoidirunglacleo@gmail.com')
                    ->subject('Test Email');
        });
        return 'Email sent successfully!';
    } catch (\Exception $e) {
        return 'Error: ' . $e->getMessage();
    }
});

// Test OTP forgot password route
Route::get('/test-otp-forgot', function () {
    try {
        $email = 'nguoidirunglacleo@gmail.com';
        
        // Check if user exists
        $user = \App\Models\User::where('email', $email)->first();
        if (!$user) {
            return 'User not found';
        }
        
        // Generate OTP 6 digits
        $otpCode = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $token = \Illuminate\Support\Str::random(64);
        
        // Save OTP
        \Illuminate\Support\Facades\DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $email],
            [
                'token' => $token, 
                'otp_code' => $otpCode,
                'is_verified' => false,
                'created_at' => now()
            ]
        );
        
        // Send email
        Mail::send('emails.password-reset-otp', [
            'otpCode' => $otpCode,
            'email' => $email
        ], function ($message) use ($email) {
            $message->to($email)
                    ->subject('Mã xác thực reset password - Hotel Luxe');
        });
        
        return 'OTP email sent successfully! OTP: ' . $otpCode . ', Token: ' . $token;
        
    } catch (\Exception $e) {
        return 'Error: ' . $e->getMessage() . '<br>Line: ' . $e->getLine() . '<br>File: ' . $e->getFile();
    }
});
