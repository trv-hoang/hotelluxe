import api from './axios';
import hotelData from '../data/jsons/__homeStay.json';
import userData from '../data/jsons/__users.json';
import { calculateRoomPrice, generateBookingNumber, generateRoomNumber, calculateNights } from '../utils/calculatorPrice';

//=================================================
// Types
//=================================================
export interface Guest {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
}

export interface Room {
    id: number;
    number: string;
    floor: number;
    roomType: {
        id: number;
        name: string;
        description: string;
        basePrice: number;
        maxGuests: number;
    };
}

export interface Booking {
    id: number;
    bookingNumber: string;
    userId: number;
    roomId: number;
    room: Room;
    guests: {
        primary: Guest;
        additional: Guest[];
    };
    checkIn: Date;
    checkOut: Date;
    nights: number;
    totalAmount: number;
    status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
    paymentStatus: 'pending' | 'paid' | 'refunded';
    source: 'website' | 'phone' | 'walk_in';
    specialRequests?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateBookingData {
    userId: number;
    roomId: number;
    guests: {
        primary: Guest;
        additional: Guest[];
    };
    checkIn: string;
    checkOut: string;
    specialRequests?: string;
    source: 'website' | 'phone' | 'walk_in';
}

export interface UpdateBookingData {
    guests?: {
        primary: Guest;
        additional: Guest[];
    };
    checkIn?: string;
    checkOut?: string;
    status?: Booking['status'];
    paymentStatus?: Booking['paymentStatus'];
    specialRequests?: string;
}

export interface BookingFilters {
    search?: string;
    status?: string;
    paymentStatus?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
}

// Generate mock bookings từ JSON data
const generateMockBookings = (): Booking[] => {
    const statuses: Booking['status'][] = ['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'];
    const paymentStatuses: Booking['paymentStatus'][] = ['pending', 'paid', 'refunded'];
    const sources: Booking['source'][] = ['website', 'phone', 'walk_in'];

    return userData.slice(0, 15).map((user, idx) => {
        const hotel = hotelData[idx % hotelData.length];
        const checkInDate = new Date();
        checkInDate.setDate(checkInDate.getDate() + Math.floor(Math.random() * 30) - 15);
        const checkOutDate = new Date(checkInDate);
        checkOutDate.setDate(checkOutDate.getDate() + Math.floor(Math.random() * 7) + 1);
        const nights = calculateNights(checkInDate, checkOutDate);
        
        const hotelData_local = hotel as unknown as { price?: string | number; id: number; title?: string; description?: string; maxGuests?: number };
        const priceString = typeof hotelData_local.price === 'string' ? hotelData_local.price : String(hotelData_local.price || 1500000);
        const totalAmount = calculateRoomPrice(priceString, nights);

        return {
            id: idx + 1,
            bookingNumber: generateBookingNumber(idx),
            userId: user.id,
            roomId: hotelData_local.id,
            room: {
                id: hotelData_local.id,
                number: generateRoomNumber(hotelData_local.id, idx),
                floor: Math.floor(hotelData_local.id / 100) + 1,
                roomType: {
                    id: hotelData_local.id,
                    name: hotelData_local.title || 'Standard Room',
                    description: hotelData_local.description || '',
                    basePrice: Number(priceString.replace(/[^\d]/g, '')),
                    maxGuests: hotelData_local.maxGuests || 2,
                }
            },
            guests: {
                primary: {
                    firstName: user.name.split(' ')[0] || 'Guest',
                    lastName: user.name.split(' ').slice(1).join(' ') || 'User',
                    email: user.email,
                    phone: user.phone
                },
                additional: []
            },
            checkIn: checkInDate,
            checkOut: checkOutDate,
            nights,
            totalAmount,
            status: statuses[idx % statuses.length],
            paymentStatus: paymentStatuses[idx % paymentStatuses.length],
            source: sources[idx % sources.length],
            createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
            updatedAt: new Date()
        };
    });
};

// API Functions
export const bookingsApi = {
    // Lấy danh sách bookings với filters
    getBookings: async (filters?: BookingFilters) => {
        const params = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    params.append(key, value.toString());
                }
            });
        }
        const response = await api.get(`/bookings?${params.toString()}`);
        return response.data;
    },

    // Lấy chi tiết booking
    getBooking: async (id: number) => {
        const response = await api.get(`/bookings/${id}`);
        return response.data;
    },

    // Tạo booking mới
    createBooking: async (data: CreateBookingData) => {
        const response = await api.post('/bookings', data);
        return response.data;
    },

    // Cập nhật booking
    updateBooking: async (id: number, data: UpdateBookingData) => {
        const response = await api.put(`/bookings/${id}`, data);
        return response.data;
    },

    // Xóa booking
    deleteBooking: async (id: number) => {
        const response = await api.delete(`/bookings/${id}`);
        return response.data;
    },

    // Cập nhật trạng thái booking
    updateBookingStatus: async (id: number, status: Booking['status']) => {
        const response = await api.patch(`/bookings/${id}/status`, { status });
        return response.data;
    },

    // Cập nhật trạng thái thanh toán
    updatePaymentStatus: async (id: number, paymentStatus: Booking['paymentStatus']) => {
        const response = await api.patch(`/bookings/${id}/payment-status`, { paymentStatus });
        return response.data;
    },

    // Lấy thống kê bookings
    getBookingStats: async () => {
        const response = await api.get('/bookings/stats');
        return response.data;
    },

    // Export bookings
    exportBookings: async (filters?: BookingFilters) => {
        const params = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    params.append(key, value.toString());
                }
            });
        }
        const response = await api.get(`/bookings/export?${params.toString()}`, {
            responseType: 'blob'
        });
        return response.data;
    },

    // Mock API cho development - sử dụng JSON data trực tiếp
    getMockBookings: async (filters?: BookingFilters) => {
        const mockBookings = generateMockBookings();

        // Apply filters
        let filtered = [...mockBookings];

        if (filters?.search) {
            const searchTerm = filters.search.toLowerCase();
            filtered = filtered.filter(booking =>
                booking.bookingNumber.toLowerCase().includes(searchTerm) ||
                booking.guests.primary.firstName.toLowerCase().includes(searchTerm) ||
                booking.guests.primary.lastName.toLowerCase().includes(searchTerm) ||
                booking.guests.primary.email?.toLowerCase().includes(searchTerm) ||
                booking.room.roomType.name.toLowerCase().includes(searchTerm)
            );
        }

        if (filters?.status && filters.status !== 'all') {
            filtered = filtered.filter(booking => booking.status === filters.status);
        }

        if (filters?.paymentStatus && filters.paymentStatus !== 'all') {
            filtered = filtered.filter(booking => booking.paymentStatus === filters.paymentStatus);
        }

        // Simulate API response structure
        return {
            data: filtered,
            pagination: {
                total: filtered.length,
                page: filters?.page || 1,
                limit: filters?.limit || 20,
                totalPages: Math.ceil(filtered.length / (filters?.limit || 20))
            }
        };
    },

    // Mock stats
    getMockStats: async () => {
        const bookings = generateMockBookings();

        return {
            total: bookings.length,
            confirmed: bookings.filter((b: Booking) => b.status === 'confirmed').length,
            checkedIn: bookings.filter((b: Booking) => b.status === 'checked_in').length,
            revenue: bookings
                .filter((b: Booking) => b.paymentStatus === 'paid')
                .reduce((sum: number, b: Booking) => sum + b.totalAmount, 0)
        };
    }
};

export default bookingsApi;
