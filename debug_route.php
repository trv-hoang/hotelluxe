<?php

// Debug route to check bookings
// Add this to routes/api.php temporarily

Route::get('/debug/bookings', function () {
    $user = auth('api')->user();
    
    if (!$user) {
        return response()->json(['error' => 'Not authenticated']);
    }
    
    $bookings = \App\Models\Booking::with(['hotel', 'payments'])
        ->where('user_id', $user->id)
        ->orderBy('created_at', 'desc')
        ->get();
    
    return response()->json([
        'user_id' => $user->id,
        'total_bookings' => $bookings->count(),
        'bookings' => $bookings->toArray()
    ]);
});