import api from './axios';

// Types for admin API responses
export interface AdminDashboardStats {
    users: {
        total: number;
        new_this_month: number;
        active_users: number;
        verified_users: number;
    };
    hotels: {
        total: number;
        active: number;
        pending_approval: number;
        average_rating: number;
    };
    bookings: {
        total: number;
        today: number;
        this_month: number;
        confirmed: number;
        pending: number;
        cancelled: number;
    };
    payments: {
        total_revenue: number;
        today_revenue: number;
        this_month_revenue: number;
        pending_payments: number;
        failed_payments: number;
    };
    reviews: {
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
        const response = await api.get('/test/dashboard/overview');
        return response.data.data;
    },

    getRevenueAnalytics: async () => {
        const response = await api.get('/admin/dashboard/revenue-analytics');
        return response.data.data;
    },

    getDashboardBookingAnalytics: async () => {
        const response = await api.get('/admin/dashboard/booking-analytics');
        return response.data.data;
    },

    getUserAnalytics: async () => {
        const response = await api.get('/admin/dashboard/user-analytics');
        return response.data.data;
    },

    getSystemHealth: async () => {
        const response = await api.get('/admin/dashboard/system-health');
        return response.data.data;
    },

    // User management
    getUsers: async () => {
        const response = await api.get('/admin/users');
        return response.data;
    },

    // Hotel management  
    getHotels: async () => {
        const response = await api.get('/admin/hotels');
        return response.data;
    },

    // Public hotels (for non-admin components)
    getPublicHotels: async () => {
        const response = await api.get('/hotels');
        return response.data;
    },

    // Booking management
    getBookings: async () => {
        const response = await api.get('/admin/bookings');
        return response.data;
    },
};