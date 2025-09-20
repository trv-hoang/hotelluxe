<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Hotel;
use App\Models\BookingGuest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class BookingController extends Controller
{
    /**
     * Display user's bookings
     */
    public function index(Request $request)
    {
        $user = auth('api')->user();
        
        $query = Booking::with([
            'hotel:id,title,slug,featured_image,address,price_per_night',
            'hotel.category:id,name,icon',
            'guests',
            'payments'
        ])->where('user_id', $user->id);

        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // Sort by date
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // For debugging - temporarily return all bookings without pagination
        if ($request->get('debug') === 'true') {
            $allBookings = $query->get();
            return response()->json([
                'success' => true,
                'data' => $allBookings,
                'message' => 'Debug mode: All bookings returned',
                'total' => $allBookings->count(),
                'user_debug' => [
                    'user_id' => $user->id,
                    'user_email' => $user->email
                ]
            ]);
        }
        
        $perPage = $request->get('per_page', 10);
        
        if ($perPage > 100) {
            $perPage = 100; // Limit max per page
        }
        
        $bookings = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => [
                'data' => $bookings->items(),
                'current_page' => $bookings->currentPage(),
                'last_page' => $bookings->lastPage(),
                'per_page' => $bookings->perPage(),
                'total' => $bookings->total(),
                'from' => $bookings->firstItem(),
                'to' => $bookings->lastItem()
            ],
            'message' => 'Bookings retrieved successfully'
        ]);
    }

    /**
     * Get all bookings for admin panel
     */
    public function getAllBookings(Request $request)
    {
        $user = auth('api')->user();
        
        // Check if user is admin
        if ($user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access'
            ], 403);
        }

        $query = Booking::with([
            'hotel:id,title,slug,featured_image,address,price_per_night',
            'hotel.category:id,name,icon',
            'user:id,name,email,phone',
            'guests',
            'payments'
        ]);

        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // Filter by payment status through payments relationship
        if ($request->has('payment_status') && $request->payment_status) {
            $query->whereHas('payments', function ($q) use ($request) {
                $q->where('status', $request->payment_status);
            });
        }

        // Search by customer name, email, or booking number
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('booking_number', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($userQuery) use ($search) {
                      $userQuery->where('name', 'like', "%{$search}%")
                               ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        // Sort by date
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $perPage = $request->get('per_page', 20);
        $bookings = $query->paginate($perPage);

        // Transform data to match frontend expectations
        $transformedBookings = $bookings->getCollection()->map(function ($booking) {
            $paymentStatus = 'pending';
            if ($booking->payments && $booking->payments->count() > 0) {
                $latestPayment = $booking->payments->sortByDesc('created_at')->first();
                $paymentStatus = $latestPayment->status === 'completed' ? 'paid' : 
                               ($latestPayment->status === 'failed' ? 'failed' : 'pending');
            }

            return [
                'id' => $booking->id,
                'bookingNumber' => $booking->booking_number,
                'hotelId' => $booking->hotel_id,
                'customerId' => $booking->user_id,
                'customerName' => $booking->user->name ?? 'Unknown',
                'customerEmail' => $booking->user->email ?? '',
                'customerPhone' => $booking->user->phone ?? '',
                'checkIn' => $booking->check_in_date,
                'checkOut' => $booking->check_out_date,
                'nights' => $booking->nights,
                'paymentStatus' => $paymentStatus,
                'totalAmount' => (float) $booking->total_amount,
                'pricePerNight' => (float) $booking->price_per_night,
                'createdAt' => $booking->created_at->toISOString(),
                'updatedAt' => $booking->updated_at->toISOString(),
                'hotel' => $booking->hotel,
                'status' => $booking->status
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'data' => $transformedBookings,
                'pagination' => [
                    'current_page' => $bookings->currentPage(),
                    'per_page' => $bookings->perPage(),
                    'total' => $bookings->total(),
                    'last_page' => $bookings->lastPage()
                ]
            ]
        ]);
    }

    /**
     * Create a new booking
     */
    public function store(Request $request)
    {
                                $validator = Validator::make($request->all(), [
                'check_in_date' => 'sometimes|date|after_or_equal:today',
                'check_out_date' => 'sometimes|date|after:check_in_date',
                'adults' => 'sometimes|integer|min:1|max:10',
                'children' => 'sometimes|integer|min:0|max:10',
                'infants' => 'sometimes|integer|min:0|max:5',
                'special_requests' => 'sometimes|string|max:1000'
            ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            $hotel = Hotel::findOrFail($request->hotel_id);
            $user = auth('api')->user();

            // Calculate nights and validate total amount
            $checkIn = Carbon::parse($request->check_in_date);
            $checkOut = Carbon::parse($request->check_out_date);
            $nights = $checkIn->diffInDays($checkOut);
            $subtotal = $nights * $hotel->price_per_night;
            $expectedAmount = $subtotal; // Can add tax calculation later

            if (abs($request->total_amount - $expectedAmount) > 0.01) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid total amount. Expected: ' . $expectedAmount
                ], 422);
            }

            // Check if hotel is available for the dates
            $existingBooking = Booking::where('hotel_id', $request->hotel_id)
                ->where(function ($query) use ($checkIn, $checkOut) {
                    $query->whereBetween('check_in_date', [$checkIn, $checkOut])
                          ->orWhereBetween('check_out_date', [$checkIn, $checkOut])
                          ->orWhere(function ($q) use ($checkIn, $checkOut) {
                              $q->where('check_in_date', '<=', $checkIn)
                                ->where('check_out_date', '>=', $checkOut);
                          });
                })
                ->whereIn('status', ['confirmed', 'checked_in'])
                ->exists();

            if ($existingBooking) {
                return response()->json([
                    'success' => false,
                    'message' => 'Hotel is not available for the selected dates'
                ], 422);
            }

            // Generate booking code
            $bookingCode = 'BK' . strtoupper(uniqid());

            // Create booking
                        // Calculate nights and subtotal
            $nights = $checkIn->diffInDays($checkOut);
            $subtotal = $nights * $hotel->price_per_night;

            // Create the booking
            $booking = Booking::create([
                'user_id' => auth()->id(),
                'hotel_id' => $request->hotel_id,
                'check_in_date' => $checkIn,
                'check_out_date' => $checkOut,
                'adults' => $request->adults,
                'children' => $request->children ?? 0,
                'infants' => $request->infants ?? 0,
                'nights' => $nights,
                'price_per_night' => $hotel->price_per_night,
                'subtotal' => $subtotal,
                'tax_amount' => $request->tax_amount ?? 0,
                'total_amount' => $request->total_amount,
                'status' => 'confirmed',
                'booking_number' => $this->generateBookingCode(),
                'special_requests' => $request->special_requests
            ]);

            // Add guests if provided
            if ($request->has('guests') && is_array($request->guests)) {
                foreach ($request->guests as $guestData) {
                    BookingGuest::create([
                        'booking_id' => $booking->id,
                        'name' => $guestData['name'],
                        'email' => $guestData['email'] ?? null,
                        'phone' => $guestData['phone'] ?? null,
                        'age' => $guestData['age'] ?? null,
                        'guest_type' => $guestData['guest_type'] ?? 'adult',
                    ]);
                }
            }

            DB::commit();

            $booking->load(['hotel:id,title,slug,featured_image,address,price_per_night', 'guests']);

            return response()->json([
                'success' => true,
                'message' => 'Booking created successfully',
                'data' => $booking
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create booking',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified booking
     */
    public function show(string $id)
    {
        $user = auth('api')->user();
        
        $booking = Booking::with([
            'hotel:id,title,slug,description,featured_image,address,price_per_night',
            'hotel.category:id,name,icon',
            'hotel.amenities:id,name,icon',
            'guests',
            'payments'
        ])->where('user_id', $user->id)
          ->find($id);

        if (!$booking) {
            return response()->json([
                'success' => false,
                'message' => 'Booking not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $booking
        ]);
    }

    /**
     * Update booking status or details
     */
    public function update(Request $request, string $id)
    {
        $user = auth('api')->user();
        
        $booking = Booking::where('user_id', $user->id)->find($id);

        if (!$booking) {
            return response()->json([
                'success' => false,
                'message' => 'Booking not found'
            ], 404);
        }

        // Only allow updates for pending bookings
        if ($booking->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Cannot modify booking with status: ' . $booking->status
            ], 422);
        }

        $validator = Validator::make($request->all(), [
            'check_in' => 'sometimes|date|after:today',
            'check_out' => 'sometimes|date|after:check_in',
            'guests_count' => 'sometimes|integer|min:1',
            'special_requests' => 'nullable|string|max:1000',
            'guests' => 'sometimes|array|min:1',
            'guests.*.name' => 'required_with:guests|string|max:100',
            'guests.*.email' => 'nullable|email|max:100',
            'guests.*.phone' => 'nullable|string|max:20',
            'guests.*.age' => 'nullable|integer|min:0|max:120',
            'guests.*.guest_type' => 'required_with:guests|in:adult,child,infant',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            $updateData = [];

            // Update dates if provided
            if ($request->has('check_in') || $request->has('check_out')) {
                $checkIn = Carbon::parse($request->get('check_in', $booking->check_in));
                $checkOut = Carbon::parse($request->get('check_out', $booking->check_out));
                $nights = $checkIn->diffInDays($checkOut);
                $hotel = $booking->hotel;
                $newTotalAmount = $nights * $hotel->price_per_night;

                $updateData['check_in'] = $checkIn;
                $updateData['check_out'] = $checkOut;
                $updateData['nights'] = $nights;
                $updateData['total_amount'] = $newTotalAmount;
            }

            // Update other fields
            if ($request->has('guests_count')) {
                $updateData['guests_count'] = $request->guests_count;
            }
            if ($request->has('special_requests')) {
                $updateData['special_requests'] = $request->special_requests;
            }

            $booking->update($updateData);

            // Update guests if provided
            if ($request->has('guests')) {
                $booking->guests()->delete();
                foreach ($request->guests as $guestData) {
                    BookingGuest::create([
                        'booking_id' => $booking->id,
                        'name' => $guestData['name'],
                        'email' => $guestData['email'] ?? null,
                        'phone' => $guestData['phone'] ?? null,
                        'age' => $guestData['age'] ?? null,
                        'guest_type' => $guestData['guest_type'],
                    ]);
                }
            }

            DB::commit();

            $booking->load(['hotel:id,title,slug,featured_image,address,price_per_night', 'guests']);

            return response()->json([
                'success' => true,
                'message' => 'Booking updated successfully',
                'data' => $booking
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to update booking',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cancel a booking
     */
    public function destroy(string $id)
    {
        $user = auth('api')->user();
        
        $booking = Booking::where('user_id', $user->id)->find($id);

        if (!$booking) {
            return response()->json([
                'success' => false,
                'message' => 'Booking not found'
            ], 404);
        }

        // Check if booking can be cancelled
        if (!in_array($booking->status, ['pending', 'confirmed'])) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot cancel booking with status: ' . $booking->status
            ], 422);
        }

        // Check cancellation policy (e.g., can't cancel within 24 hours of check-in)
        $checkIn = Carbon::parse($booking->check_in);
        $now = Carbon::now();
        
        if ($checkIn->diffInHours($now) < 24) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot cancel booking within 24 hours of check-in'
            ], 422);
        }

        try {
            $booking->update(['status' => 'cancelled', 'cancelled_at' => now()]);

            return response()->json([
                'success' => true,
                'message' => 'Booking cancelled successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to cancel booking',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Check hotel availability for given dates
     */
    public function checkAvailability(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'hotel_id' => 'required|exists:hotels,id',
                'check_in_date' => 'required|date|after_or_equal:today',
                'check_out_date' => 'required|date|after:check_in_date'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $checkIn = Carbon::parse($request->check_in_date);
            $checkOut = Carbon::parse($request->check_out_date);

            $existingBooking = Booking::where('hotel_id', $request->hotel_id)
                ->where(function ($query) use ($checkIn, $checkOut) {
                    $query->whereBetween('check_in_date', [$checkIn, $checkOut])
                          ->orWhereBetween('check_out_date', [$checkIn, $checkOut])
                          ->orWhere(function ($q) use ($checkIn, $checkOut) {
                              $q->where('check_in_date', '<=', $checkIn)
                                ->where('check_out_date', '>=', $checkOut);
                          });
                })
                ->whereIn('status', ['confirmed', 'checked_in'])
                ->exists();

            $available = !$existingBooking;
            $nights = $checkIn->diffInDays($checkOut);
            $hotel = Hotel::find($request->hotel_id);
            $totalAmount = $nights * $hotel->price_per_night;

            return response()->json([
                'success' => true,
                'data' => [
                    'available' => $available,
                    'nights' => $nights,
                    'price_per_night' => $hotel->price_per_night,
                    'subtotal' => $totalAmount,
                    'total_amount' => $totalAmount,
                    'message' => $available ? 'Hotel is available' : 'Hotel is not available for selected dates'
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to check availability: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get booking by code (for admins or user verification)
     */
    public function getByCode(Request $request, string $code)
    {
        $user = auth('api')->user();
        
        $booking = Booking::with([
            'hotel:id,title,slug,featured_image,address,price_per_night',
            'hotel.category:id,name,icon',
            'guests',
            'user:id,name,email,phone'
        ])->where('booking_number', $code);

        // Users can only see their own bookings, admins can see all
        if ($user->role !== 'admin') {
            $booking->where('user_id', $user->id);
        }

        $booking = $booking->first();

        if (!$booking) {
            return response()->json([
                'success' => false,
                'message' => 'Booking not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $booking
        ]);
    }

    /**
     * Generate unique booking code
     */
    private function generateBookingCode()
    {
        do {
            $code = 'BK' . strtoupper(Str::random(8));
        } while (Booking::where('booking_number', $code)->exists());

        return $code;
    }
}
