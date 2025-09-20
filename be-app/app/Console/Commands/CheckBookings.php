<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Booking;
use App\Models\User;

class CheckBookings extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'check:bookings {user_id?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check bookings for a user';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $userId = $this->argument('user_id');
        
        if ($userId) {
            $user = User::find($userId);
            if (!$user) {
                $this->error("User with ID {$userId} not found");
                return;
            }
            
            $bookings = Booking::where('user_id', $userId)->get();
            $this->info("User: {$user->name} ({$user->email})");
            $this->info("Total bookings: " . $bookings->count());
            
            foreach ($bookings as $booking) {
                $this->line("- Booking #{$booking->booking_number} - Status: {$booking->status} - Created: {$booking->created_at}");
            }
        } else {
            $totalBookings = Booking::count();
            $totalUsers = User::count();
            
            $this->info("Total bookings in system: {$totalBookings}");
            $this->info("Total users in system: {$totalUsers}");
            
            $recentBookings = Booking::with('user')->latest()->take(5)->get();
            $this->info("\nRecent bookings:");
            foreach ($recentBookings as $booking) {
                $this->line("- #{$booking->booking_number} by {$booking->user->name} - {$booking->created_at}");
            }
        }
    }
}
