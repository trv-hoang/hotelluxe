import api from './axios';

// Types for admin API responses
export interface AdminDashboardStats {
    totalUsers: number;
    totalBookings: number;
    totalRevenue: number;
    activeHotels: number;
    monthlyRevenue: Array<{
        month: string;
        revenue: number;
    }>;
    bookingTrends: Array<{
        date: string;
        bookings: number;
    }>;
    topHotels: Array<{
        id: number;
        name: string;
        bookings: number;
    }>;
    users?: {
        total: number;
        new_this_month: number;
        active_users: number;
        verified_users: number;
    };
    hotels?: {
        total: number;
        active: number;
        pending_approval: number;
        average_rating: number;
    };
    bookings?: {
        total: number;
        today: number;
        this_month: number;
        confirmed: number;
        pending: number;
        cancelled: number;
    };
    payments?: {
        total_revenue: number;
        today_revenue: number;
        this_month_revenue: number;
        pending_payments: number;
        failed_payments: number;
    };
    reviews?: {
        total: number;
        pending_approval: number;
        approved: number;
        average_rating: number;
    };
}

export interface AdminUser {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user';
    created_at: string;
    updated_at: string;
}

export interface AdminHotel {
    id: number;
    title: string;
    address: string;
    price_per_night: number;
    is_active: boolean;
    created_at: string;
}

export interface AdminBooking {
    id: number;
    booking_number: string;
    user_id: number;
    hotel_id: number;
    total_amount: number;
    status: string;
    created_at: string;
}

// Admin API endpoints
export const adminApi = {
    // Dashboard endpoints
    getDashboardOverview: async (): Promise<AdminDashboardStats> => {
        // Get real data from API endpoints where possible, fallback to mock
        try {
            // Try to get real data from existing endpoints
            const [usersResponse, hotelsResponse, bookingsResponse] = await Promise.allSettled([
                api.get('/admin/users').catch(() => ({ data: { data: [] } })),
                api.get('/hotels').catch(() => ({ data: { data: [] } })),
                api.get('/bookings/admin/all').catch(() => ({ data: { data: [] } }))
            ]);

            const realUserCount = usersResponse.status === 'fulfilled' ? 
                (usersResponse.value.data.data?.length || 0) : 48; // Fallback to known count
            const realHotelCount = hotelsResponse.status === 'fulfilled' ? 
                (hotelsResponse.value.data.data?.length || 0) : 25;
            const realBookingCount = bookingsResponse.status === 'fulfilled' ? 
                (bookingsResponse.value.data.data?.length || 0) : 75;
            const realRevenue = realBookingCount > 0 ? realBookingCount * 1500000 : 125000000; // Estimate: 1.5M per booking

            return {
                totalUsers: realUserCount,
                totalBookings: realBookingCount, 
                totalRevenue: realRevenue,
                activeHotels: realHotelCount,
            monthlyRevenue: [
                { month: 'Jan', revenue: 8500000 },
                { month: 'Feb', revenue: 9200000 },
                { month: 'Mar', revenue: 7800000 },
                { month: 'Apr', revenue: 10500000 },
                { month: 'May', revenue: 12300000 },
                { month: 'Jun', revenue: 11800000 }
            ],
            bookingTrends: [
                { date: '2024-01-01', bookings: 12 },
                { date: '2024-01-02', bookings: 8 },
                { date: '2024-01-03', bookings: 15 },
                { date: '2024-01-04', bookings: 22 },
                { date: '2024-01-05', bookings: 18 }
            ],
            topHotels: [
                { id: 1, name: 'Khách sạn Rex Sài Gòn', bookings: 45 },
                { id: 2, name: 'Hotel Continental', bookings: 32 },
                { id: 3, name: 'Grand Hotel', bookings: 28 }
            ],
            users: {
                total: 150,
                new_this_month: 25,
                active_users: 125,
                verified_users: 140
            },
            hotels: {
                total: 25,
                active: 22,
                pending_approval: 3,
                average_rating: 4.2
            },
            bookings: {
                total: 75,
                today: 5,
                this_month: 45,
                confirmed: 50,
                pending: 15,
                cancelled: 10
            },
            payments: {
                total_revenue: 125000000,
                today_revenue: 2500000,
                this_month_revenue: 45000000,
                pending_payments: 5,
                failed_payments: 2
            },
            reviews: {
                total: 120,
                pending_approval: 8,
                approved: 110,
                average_rating: 4.3
            }
        };
        } catch (error) {
            console.error('Error fetching real dashboard data:', error);
            // Fallback to original mock data
            return {
                totalUsers: 150,
                totalBookings: 75,
                totalRevenue: 125000000,
                activeHotels: 25,
                monthlyRevenue: [
                    { month: 'Jan', revenue: 8500000 },
                    { month: 'Feb', revenue: 9200000 },
                    { month: 'Mar', revenue: 7800000 },
                    { month: 'Apr', revenue: 10500000 },
                    { month: 'May', revenue: 12300000 },
                    { month: 'Jun', revenue: 11800000 }
                ],
                bookingTrends: [
                    { date: '2024-01-01', bookings: 12 },
                    { date: '2024-01-02', bookings: 8 },
                    { date: '2024-01-03', bookings: 15 },
                    { date: '2024-01-04', bookings: 22 },
                    { date: '2024-01-05', bookings: 18 }
                ],
                topHotels: [
                    { id: 1, name: 'Khách sạn Rex Sài Gòn', bookings: 45 },
                    { id: 2, name: 'Hotel Continental', bookings: 32 },
                    { id: 3, name: 'Grand Hotel', bookings: 28 }
                ],
                users: {
                    total: 150,
                    new_this_month: 25,
                    active_users: 125,
                    verified_users: 140
                },
                hotels: {
                    total: 25,
                    active: 22,
                    pending_approval: 3,
                    average_rating: 4.2
                },
                bookings: {
                    total: 75,
                    today: 5,
                    this_month: 45,
                    confirmed: 50,
                    pending: 15,
                    cancelled: 10
                },
                payments: {
                    total_revenue: 125000000,
                    today_revenue: 2500000,
                    this_month_revenue: 45000000,
                    pending_payments: 5,
                    failed_payments: 2
                },
                reviews: {
                    total: 120,
                    pending_approval: 8,
                    approved: 110,
                    average_rating: 4.3
                }
            };
        }
    },

    getRevenueAnalytics: async () => {
        // Return mock revenue analytics
        return {
            totalRevenue: 125000000,
            monthlyGrowth: 12.5,
            dailyRevenue: [
                { date: '2024-01-01', revenue: 2500000 },
                { date: '2024-01-02', revenue: 3200000 },
                { date: '2024-01-03', revenue: 2800000 }
            ]
        };
    },

    getDashboardBookingAnalytics: async () => {
        // Return mock booking analytics
        return {
            totalBookings: 75,
            monthlyGrowth: 8.3,
            statusBreakdown: {
                confirmed: 45,
                pending: 20,
                cancelled: 10
            }
        };
    },

    getUserAnalytics: async () => {
        // Return mock user analytics  
        return {
            totalUsers: 150,
            activeUsers: 125,
            newUsersThisMonth: 25,
            userGrowth: 15.2
        };
    },

    getSystemHealth: async () => {
        // Return mock system health
        return {
            status: 'healthy',
            uptime: '99.9%',
            responseTime: '120ms',
            lastChecked: new Date().toISOString()
        };
    },

    // User management
    getUsers: async () => {
        // Mock user list - in real app this would call /admin/users
        return {
            success: true,
            data: [
                { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user', created_at: '2024-01-01' },
                { id: 2, name: 'Admin User', email: 'admin@hotel.com', role: 'admin', created_at: '2024-01-01' }
            ]
        };
    },

    // Hotel management  
    getHotels: async () => {
        // Mock hotel list - in real app this would call /admin/hotels
        return {
            success: true,
            data: [
                { id: 1, title: 'Khách sạn Rex Sài Gòn', address: '141 Nguyễn Huệ, Q1, TP.HCM', price_per_night: 600000, is_active: true, created_at: '2024-01-01' }
            ]
        };
    },

    // Public hotels (for non-admin components)
    getPublicHotels: async () => {
        const response = await api.get('/hotels');
        return response.data;
    },

    // Booking management
    getBookings: async () => {
        // Mock booking list - in real app this would call /admin/bookings 
        return {
            success: true,
            data: [
                { id: 1, booking_number: 'BK12345', user_id: 1, hotel_id: 1, total_amount: 1200000, status: 'confirmed', created_at: '2024-01-15' }
            ]
        };
    },
};