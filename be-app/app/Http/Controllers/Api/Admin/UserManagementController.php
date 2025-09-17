<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Booking;
use App\Models\Payment;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class UserManagementController extends Controller
{
    /**
     * Get all users with filters and pagination
     */
    public function index(Request $request)
    {
        try {
            $query = User::query();

            // Search by name or email
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            }

            // Filter by role
            if ($request->has('role')) {
                $query->where('role', $request->role);
            }

            // Filter by status
            if ($request->has('status')) {
                if ($request->status === 'active') {
                    $query->whereNotNull('email_verified_at');
                } elseif ($request->status === 'inactive') {
                    $query->whereNull('email_verified_at');
                }
            }

            // Filter by registration date
            if ($request->has('date_from')) {
                $query->whereDate('created_at', '>=', $request->date_from);
            }
            if ($request->has('date_to')) {
                $query->whereDate('created_at', '<=', $request->date_to);
            }

            // Sort options
            $sortField = $request->get('sort_by', 'created_at');
            $sortDirection = $request->get('sort_direction', 'desc');
            $query->orderBy($sortField, $sortDirection);

            // Include additional statistics
            $query->withCount(['bookings', 'payments', 'reviews']);
            $query->withSum('payments as total_spent', 'amount');

            $users = $query->paginate($request->per_page ?? 15);

            return response()->json([
                'success' => true,
                'data' => $users
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch users: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get specific user details
     */
    public function show($id)
    {
        try {
            $user = User::with([
                'bookings' => function($query) {
                    $query->with('hotel')->latest()->limit(10);
                },
                'payments' => function($query) {
                    $query->latest()->limit(10);
                },
                'reviews' => function($query) {
                    $query->with('hotel')->latest()->limit(5);
                }
            ])
            ->withCount(['bookings', 'payments', 'reviews'])
            ->withSum('payments as total_spent', 'amount')
            ->findOrFail($id);

            // Get user statistics
            $stats = [
                'total_bookings' => $user->bookings_count,
                'confirmed_bookings' => $user->bookings()->where('status', 'confirmed')->count(),
                'cancelled_bookings' => $user->bookings()->where('status', 'cancelled')->count(),
                'total_spent' => $user->total_spent ?? 0,
                'average_booking_value' => $user->bookings_count > 0 
                    ? ($user->total_spent ?? 0) / $user->bookings_count 
                    : 0,
                'reviews_count' => $user->reviews_count,
                'average_rating_given' => $user->reviews()->avg('overall_rating') ?? 0,
                'last_booking_date' => $user->bookings()->latest()->first()?->created_at,
                'last_login_date' => $user->last_login_at,
            ];

            return response()->json([
                'success' => true,
                'data' => [
                    'user' => $user,
                    'statistics' => $stats
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch user details: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create new user
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users',
                'password' => 'required|string|min:8',
                'phone' => 'nullable|string|max:20',
                'role' => 'required|in:user,admin,manager',
                'email_verified' => 'boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'phone' => $request->phone,
                'role' => $request->role,
                'email_verified_at' => $request->email_verified ? now() : null,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'User created successfully',
                'data' => $user
            ], 201);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create user: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update user information
     */
    public function update(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|unique:users,email,' . $id,
                'password' => 'sometimes|string|min:8',
                'phone' => 'nullable|string|max:20',
                'role' => 'sometimes|in:user,admin,manager',
                'status' => 'sometimes|in:active,inactive,suspended'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

            // Update basic information
            if ($request->has('name')) {
                $user->name = $request->name;
            }
            if ($request->has('email')) {
                $user->email = $request->email;
            }
            if ($request->has('phone')) {
                $user->phone = $request->phone;
            }
            if ($request->has('role')) {
                $user->role = $request->role;
            }
            if ($request->has('password')) {
                $user->password = Hash::make($request->password);
            }

            // Handle status changes
            if ($request->has('status')) {
                switch ($request->status) {
                    case 'active':
                        $user->email_verified_at = $user->email_verified_at ?? now();
                        break;
                    case 'inactive':
                        $user->email_verified_at = null;
                        break;
                    case 'suspended':
                        // Add suspended_at timestamp if column exists
                        break;
                }
            }

            $user->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'User updated successfully',
                'data' => $user
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => 'Failed to update user: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete user (soft delete recommended)
     */
    public function destroy($id)
    {
        try {
            $user = User::findOrFail($id);

            // Check if user has active bookings
            $activeBookings = $user->bookings()
                ->whereIn('status', ['confirmed', 'checked_in'])
                ->count();

            if ($activeBookings > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete user with active bookings'
                ], 400);
            }

            DB::beginTransaction();

            // For now, we'll just deactivate the user instead of deleting
            // In production, you might want to implement soft deletes
            $user->email_verified_at = null;
            $user->email = 'deleted_' . time() . '_' . $user->email;
            $user->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'User deactivated successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete user: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user statistics
     */
    public function statistics()
    {
        try {
            $stats = [
                'total_users' => User::count(),
                'active_users' => User::whereNotNull('email_verified_at')->count(),
                'inactive_users' => User::whereNull('email_verified_at')->count(),
                'admin_users' => User::where('role', 'admin')->count(),
                'regular_users' => User::where('role', 'user')->count(),
                'new_users_today' => User::whereDate('created_at', today())->count(),
                'new_users_this_week' => User::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count(),
                'new_users_this_month' => User::whereMonth('created_at', now()->month)->count(),
            ];

            // User registration trend (last 30 days)
            $registrationTrend = User::selectRaw('DATE(created_at) as date, COUNT(*) as count')
                ->where('created_at', '>=', now()->subDays(30))
                ->groupBy('date')
                ->orderBy('date')
                ->get();

            // Top users by booking count
            $topUsers = User::withCount('bookings')
                ->whereHas('bookings')
                ->orderBy('bookings_count', 'desc')
                ->limit(10)
                ->get(['id', 'name', 'email']);

            return response()->json([
                'success' => true,
                'data' => [
                    'overview' => $stats,
                    'registration_trend' => $registrationTrend,
                    'top_users' => $topUsers
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch user statistics: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Bulk actions for users
     */
    public function bulkAction(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'action' => 'required|in:activate,deactivate,delete,change_role',
                'user_ids' => 'required|array|min:1',
                'user_ids.*' => 'exists:users,id',
                'role' => 'required_if:action,change_role|in:user,admin,manager'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $userIds = $request->user_ids;
            $action = $request->action;

            DB::beginTransaction();

            $affectedCount = 0;

            switch ($action) {
                case 'activate':
                    $affectedCount = User::whereIn('id', $userIds)
                        ->whereNull('email_verified_at')
                        ->update(['email_verified_at' => now()]);
                    break;

                case 'deactivate':
                    $affectedCount = User::whereIn('id', $userIds)
                        ->whereNotNull('email_verified_at')
                        ->update(['email_verified_at' => null]);
                    break;

                case 'change_role':
                    $affectedCount = User::whereIn('id', $userIds)
                        ->update(['role' => $request->role]);
                    break;

                case 'delete':
                    // Check for active bookings
                    $usersWithActiveBookings = User::whereIn('id', $userIds)
                        ->whereHas('bookings', function($query) {
                            $query->whereIn('status', ['confirmed', 'checked_in']);
                        })->count();

                    if ($usersWithActiveBookings > 0) {
                        DB::rollback();
                        return response()->json([
                            'success' => false,
                            'message' => "Cannot delete {$usersWithActiveBookings} users with active bookings"
                        ], 400);
                    }

                    // Deactivate users instead of deleting
                    $affectedCount = User::whereIn('id', $userIds)
                        ->update([
                            'email_verified_at' => null,
                            'email' => DB::raw("CONCAT('deleted_', UNIX_TIMESTAMP(), '_', email)")
                        ]);
                    break;
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Bulk action '{$action}' completed successfully",
                'affected_count' => $affectedCount
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => 'Failed to perform bulk action: ' . $e->getMessage()
            ], 500);
        }
    }
}