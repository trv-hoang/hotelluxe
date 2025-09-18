<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\HotelController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\UserManagementController;
use App\Http\Controllers\Api\Admin\HotelManagementController;
use App\Http\Controllers\Api\Admin\BookingManagementController;
use App\Http\Controllers\Api\Admin\ReviewModerationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
});

// Public hotel routes (no auth required for viewing)
Route::prefix('hotels')->group(function () {
    Route::get('/', [HotelController::class, 'index']);
    Route::get('categories', [HotelController::class, 'categories']);
    Route::get('amenities', [HotelController::class, 'amenities']);
    Route::get('{id}', [HotelController::class, 'show']);
    Route::post('search/location', [HotelController::class, 'searchByLocation']);
});

// Public booking availability check
Route::post('bookings/check-availability', [BookingController::class, 'checkAvailability']);

// Public review routes (no auth required for viewing)
Route::prefix('reviews')->group(function () {
    Route::get('/', [ReviewController::class, 'index']); // Get reviews for a hotel
});

// Public payment routes (no auth required)
Route::prefix('payment')->group(function () {
    Route::get('methods', [PaymentController::class, 'getPaymentMethods']);
    Route::post('momo/webhook', [PaymentController::class, 'momoWebhook']);
    Route::post('stripe/webhook', [PaymentController::class, 'stripeWebhook']);
});

// Protected routes
Route::middleware('auth.api')->group(function () {
    // Auth routes
    Route::prefix('auth')->group(function () {
        Route::get('profile', [AuthController::class, 'profile']);
        Route::put('profile', [AuthController::class, 'updateProfile']);
        Route::post('refresh', [AuthController::class, 'refresh']);
        Route::post('logout', [AuthController::class, 'logout']);
    });
    
    // Test protected route
    Route::get('user', function (Request $request) {
        return response()->json([
            'success' => true,
            'data' => $request->user()
        ]);
    });

    // Protected hotel management routes (Admin only)
    Route::prefix('hotels')->middleware('role:admin')->group(function () {
        Route::post('/', [HotelController::class, 'store']);
        Route::put('{id}', [HotelController::class, 'update']);
        Route::delete('{id}', [HotelController::class, 'destroy']);
    });

    // Booking management routes (User access)
    Route::prefix('bookings')->group(function () {
        Route::get('/', [BookingController::class, 'index']);
        Route::post('/', [BookingController::class, 'store']);
        Route::get('{id}', [BookingController::class, 'show']);
        Route::put('{id}', [BookingController::class, 'update']);
        Route::delete('{id}', [BookingController::class, 'destroy']);
        Route::get('code/{code}', [BookingController::class, 'getByCode']);
    });

    // Review management routes (User access)
    Route::prefix('reviews')->group(function () {
        Route::get('my', [ReviewController::class, 'myReviews']);
        Route::post('/', [ReviewController::class, 'store']);
        Route::get('{review}', [ReviewController::class, 'show']);
        Route::put('{review}', [ReviewController::class, 'update']);
        Route::delete('{review}', [ReviewController::class, 'destroy']);
        Route::post('{review}/helpful', [ReviewController::class, 'markHelpful']);
    });

    // Payment routes (User access)
    Route::prefix('payments')->group(function () {
        Route::get('/', [PaymentController::class, 'getUserPayments']);
        Route::post('/', [PaymentController::class, 'createPayment']);
        Route::post('confirm-card', [PaymentController::class, 'confirmCardPayment']);
        Route::get('{paymentId}', [PaymentController::class, 'getPayment']);
        Route::post('{paymentId}/cancel', [PaymentController::class, 'cancelPayment']);
        Route::post('{paymentId}/refund', [PaymentController::class, 'requestRefund']);
    });

    // Admin Panel Routes (Admin only)
    Route::prefix('admin')->middleware('role:admin')->group(function () {
        // Dashboard Analytics
        Route::prefix('dashboard')->group(function () {
            Route::get('overview', [DashboardController::class, 'overview']);
            Route::get('revenue-analytics', [DashboardController::class, 'revenueAnalytics']);
            Route::get('booking-analytics', [DashboardController::class, 'bookingAnalytics']);
            Route::get('user-analytics', [DashboardController::class, 'userAnalytics']);
            Route::get('recent-activities', [DashboardController::class, 'recentActivities']);
            Route::get('system-health', [DashboardController::class, 'systemHealth']);
        });

        // User Management
        Route::prefix('users')->group(function () {
            Route::get('/', [UserManagementController::class, 'index']);
            Route::get('statistics', [UserManagementController::class, 'statistics']);
            Route::post('/', [UserManagementController::class, 'store']);
            Route::get('{id}', [UserManagementController::class, 'show']);
            Route::put('{id}', [UserManagementController::class, 'update']);
            Route::delete('{id}', [UserManagementController::class, 'destroy']);
            Route::post('bulk-action', [UserManagementController::class, 'bulkAction']);
            Route::get('export', [UserManagementController::class, 'export']);
        });

        // Hotel Management
        Route::prefix('hotels')->group(function () {
            Route::get('/', [HotelManagementController::class, 'index']);
            Route::post('/', [HotelManagementController::class, 'store']);
            Route::get('analytics', [HotelManagementController::class, 'analytics']);
            Route::get('export', [HotelManagementController::class, 'export']);
            Route::get('{id}', [HotelManagementController::class, 'show']);
            Route::put('{id}', [HotelManagementController::class, 'update']);
            Route::delete('{id}', [HotelManagementController::class, 'destroy']);
            Route::put('{id}/status', [HotelManagementController::class, 'updateStatus']);
            Route::post('bulk-action', [HotelManagementController::class, 'bulkAction']);
        });

        // Booking Management
        Route::prefix('bookings')->group(function () {
            Route::get('/', [BookingManagementController::class, 'index']);
            Route::get('analytics', [BookingManagementController::class, 'analytics']);
            Route::get('upcoming-events', [BookingManagementController::class, 'upcomingEvents']);
            Route::get('{id}', [BookingManagementController::class, 'show']);
            Route::put('{id}/status', [BookingManagementController::class, 'updateStatus']);
            Route::post('bulk-action', [BookingManagementController::class, 'bulkAction']);
            Route::get('export', [BookingManagementController::class, 'export']);
        });

        // Review Moderation
        Route::prefix('reviews')->group(function () {
            Route::get('/', [ReviewModerationController::class, 'index']);
            Route::get('analytics', [ReviewModerationController::class, 'analytics']);
            Route::get('requires-attention', [ReviewModerationController::class, 'requiresAttention']);
            Route::get('{id}', [ReviewModerationController::class, 'show']);
            Route::post('{id}/moderate', [ReviewModerationController::class, 'moderateReview']);
            Route::post('bulk-action', [ReviewModerationController::class, 'bulkAction']);
            Route::get('export', [ReviewModerationController::class, 'export']);
        });
    });
});

// Health check
Route::get('health', function () {
    return response()->json([
        'success' => true,
        'message' => 'Hotel Booking API is running',
        'timestamp' => now()->toISOString()
    ]);
});


// kha test - guest và author routes

use App\Http\Controllers\Api\GuestController;
use App\Http\Controllers\Api\AuthorController;
Route::get('/guests', [GuestController::class, 'index']);
Route::get('/guests/{id}', [GuestController::class, 'show']);
Route::get('/authors', [AuthorController::class, 'index']);
Route::get('/authors/{id}', [AuthorController::class, 'show']);
use App\Http\Controllers\GuestAuthController;

Route::prefix('guest')->group(function () {
    Route::post('/register', [GuestAuthController::class, 'register']);
    Route::post('/login', [GuestAuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [GuestAuthController::class, 'logout']);
        Route::get('/profile', [GuestAuthController::class, 'profile']);
    });
});
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/guest/profile', [GuestAuthController::class, 'profile']);
    Route::put('/guest/profile', [GuestAuthController::class, 'updateProfile']); // FE gọi PUT để update
});
