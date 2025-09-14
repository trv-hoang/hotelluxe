// Utility functions for price calculations and common operations

export const calculateRoomPrice = (priceString: string, nights: number): number => {
    const basePrice = Number(priceString.replace(/[^\d]/g, '')) || 1500000;
    return Math.round(basePrice * nights);
};

export const extractPrice = (priceString: string): number => {
    return Number(priceString.replace(/[^\d]/g, '')) || 0;
};

export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
};

export const formatDate = (date: Date): string => {
    return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
};

export const generateBookingNumber = (index: number): string => {
    return `BK-2025-${String(index + 1).padStart(4, '0')}`;
};

export const generateRoomNumber = (hotelId: number, roomIndex: number): string => {
    return `${hotelId}${String(roomIndex + 101).slice(-2)}`;
};

export const calculateNights = (checkIn: Date, checkOut: Date): number => {
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
};
