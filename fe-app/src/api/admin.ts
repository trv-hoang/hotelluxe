import { axiosInstance } from '@/lib/axios';

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
    role: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
    email_verified_at?: string | null;
    profile_pic?: string | null;
    nickname?: string | null;
    dob?: string | null;
    phone?: string | null;
    gender?: string | null;
    address?: string | null;
    bookings_count?: number;
    payments_count?: number;
    reviews_count?: number;
    total_spent?: string | null;
}

export interface AdminHotel {
    id: number;
    title: string;
    description?: string;
    address?: string;
    price_per_night: string;
    is_active: boolean;
    review_score: string;
    review_count: number;
    created_at: string;
    category_id?: number;
    latitude?: number;
    longitude?: number;
    max_guests?: number;
    bedrooms?: number;
    bathrooms?: number;
}

export interface AdminBooking {
    id: number;
    booking_number: string;
    status: string;
    total_amount: string;
    created_at: string;
    user: AdminUser;
    hotel: AdminHotel;
}

// Admin API endpoints
export const adminApi = {
    // Dashboard endpoints
    getDashboardOverview: async (): Promise<AdminDashboardStats> => {
        const response = await axiosInstance.get('/admin/dashboard/overview');
        return response.data.data;
    },

    getRevenueAnalytics: async () => {
        const response = await axiosInstance.get('/admin/dashboard/revenue-analytics');
        return response.data.data;
    },

    getDashboardBookingAnalytics: async () => {
        const response = await axiosInstance.get('/admin/dashboard/booking-analytics');
        return response.data.data;
    },

    getUserAnalytics: async () => {
        const response = await axiosInstance.get('/admin/dashboard/user-analytics');
        return response.data.data;
    },

    getSystemHealth: async () => {
        const response = await axiosInstance.get('/admin/dashboard/system-health');
        return response.data.data;
    },

    // User management endpoints
    getUsers: async (params?: { page?: number; search?: string; role?: string }) => {
        const response = await axiosInstance.get('/admin/users', { params });
        return response.data.data;
    },

    getUserStats: async () => {
        const response = await axiosInstance.get('/admin/users/statistics');
        return response.data.data;
    },

    createUser: async (userData: { name: string; email: string; password: string; role: string }) => {
        const response = await axiosInstance.post('/admin/users', userData);
        return response.data.data;
    },

    updateUser: async (id: number, userData: Partial<AdminUser> & { password?: string }) => {
        console.log('updateUser API call:', { id, userData });
        
        // Clean up userData to only include updatable fields
        const cleanedData: Record<string, string | undefined> = {
            name: userData.name,
            email: userData.email,
            role: userData.role,
        };
        
        // Only add optional fields if they have values
        if (userData.phone && userData.phone.trim() !== '') {
            cleanedData.phone = userData.phone;
        }
        
        if (userData.address && userData.address.trim() !== '') {
            cleanedData.address = userData.address;
        }
        
        // Only add password if provided (for edit mode)
        if (userData.password && userData.password.trim() !== '') {
            cleanedData.password = userData.password;
        }
        
        console.log('Cleaned data being sent:', cleanedData);
        
        try {
            // Try PUT method first (standard for updates)  
            const response = await axiosInstance.put(`/admin/users/${id}`, cleanedData);
            console.log('updateUser API response:', response);
            return response.data.data;
        } catch (error) {
            console.error('PUT /admin/users failed:', error);
            
            // Log detailed error information for debugging
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { data?: unknown; status?: number } };
                console.error('API Error Details:', {
                    status: axiosError.response?.status,
                    data: axiosError.response?.data
                });
            }
            
            throw error;
        }
    },

    deleteUser: async (id: number) => {
        const response = await axiosInstance.delete(`/admin/users/${id}`);
        return response.data;
    },

    // Hotel management endpoints
    getHotels: async (params?: { page?: number; search?: string; status?: string }) => {
        const response = await axiosInstance.get('/admin/hotels', { params });
        return response.data.data; // Return the paginated hotels data
    },

    getHotel: async (id: number) => {
        const response = await axiosInstance.get(`/admin/hotels/${id}`);
        return response.data.data;
    },

    createHotel: async (hotelData: {
        title: string;
        description: string;
        address: string;
        price_per_night: number;
        category_id?: number;
        latitude?: number | null;
        longitude?: number | null;
        max_guests?: number;
        bedrooms?: number;
        bathrooms?: number;
    }) => {
        const response = await axiosInstance.post('/admin/hotels', hotelData);
        return response.data.data;
    },

    updateHotel: async (id: number, hotelData: Partial<AdminHotel>) => {
        const response = await axiosInstance.put(`/admin/hotels/${id}`, hotelData);
        return response.data.data;
    },

    updateHotelStatus: async (id: number, status: boolean) => {
        const statusValue = status ? 'active' : 'inactive';
        const response = await axiosInstance.put(`/admin/hotels/${id}/status`, { status: statusValue });
        return response.data.data;
    },

    deleteHotel: async (id: number) => {
        const response = await axiosInstance.delete(`/admin/hotels/${id}`);
        return response.data;
    },

    getHotelAnalytics: async () => {
        const response = await axiosInstance.get('/admin/hotels/analytics');
        return response.data.data;
    },

    // Booking management endpoints
    getBookings: async (params?: { page?: number; search?: string; status?: string }) => {
        const response = await axiosInstance.get('/admin/bookings', { params });
        return response.data.data;
    },

    getBooking: async (id: number) => {
        const response = await axiosInstance.get(`/admin/bookings/${id}`);
        return response.data.data;
    },

    updateBookingStatus: async (id: number, status: string) => {
        const response = await axiosInstance.put(`/admin/bookings/${id}/status`, { status });
        return response.data.data;
    },

    getBookingAnalytics: async () => {
        const response = await axiosInstance.get('/admin/bookings/analytics');
        return response.data.data;
    },

    // Review management endpoints
    getReviews: async (params?: { page?: number; search?: string; status?: string }) => {
        const response = await axiosInstance.get('/admin/reviews', { params });
        return response.data.data;
    },

    moderateReview: async (id: number, action: 'approve' | 'reject', reason?: string) => {
        const response = await axiosInstance.post(`/admin/reviews/${id}/moderate`, { 
            action, 
            reason 
        });
        return response.data.data;
    },

    getReviewAnalytics: async () => {
        const response = await axiosInstance.get('/admin/reviews/analytics');
        return response.data.data;
    }
};