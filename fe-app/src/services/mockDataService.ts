import homeStayData from '../data/jsons/__homeStay.json';
import userData from '../data/jsons/__users.json';
import { 
    calculateRoomPrice, 
    generateBookingNumber, 
    generateRoomNumber, 
    calculateNights 
} from '../utils/calculations';

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

export interface RoomStatus {
    id: number;
    number: string;
    floor: number;
    roomType: {
        id: number;
        name: string;
        description: string;
        basePrice: number;
        maxGuests: number;
        bedConfiguration: { type: 'king' | 'queen' | 'single' | 'double' | 'sofa_bed'; quantity: number; }[];
        size: number;
        amenities: string[];
        images: string[];
        isActive: boolean;
    };
    status: 'available' | 'occupied' | 'maintenance';
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

class MockDataService {
    private static instance: MockDataService;
    private bookingsCache: Booking[] | null = null;
    private roomsCache: RoomStatus[] | null = null;

    private constructor() {}

    static getInstance(): MockDataService {
        if (!MockDataService.instance) {
            MockDataService.instance = new MockDataService();
        }
        return MockDataService.instance;
    }

    generateBookings(): Booking[] {
        if (this.bookingsCache) {
            return this.bookingsCache;
        }

        const statuses: Booking['status'][] = ['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'];
        const paymentStatuses: Booking['paymentStatus'][] = ['pending', 'paid', 'refunded'];
        const sources: Booking['source'][] = ['website', 'phone', 'walk_in'];

        this.bookingsCache = userData.slice(0, 15).map((user, idx) => {
            const hotel = homeStayData[idx % homeStayData.length];
            const checkInDate = new Date();
            checkInDate.setDate(checkInDate.getDate() + Math.floor(Math.random() * 30) - 15);
            const checkOutDate = new Date(checkInDate);
            checkOutDate.setDate(checkOutDate.getDate() + Math.floor(Math.random() * 7) + 1);
            const nights = calculateNights(checkInDate, checkOutDate);
            
            const hotelData = hotel as unknown as { price?: string | number; id: number; title?: string; description?: string; maxGuests?: number };
            const priceString = typeof hotelData.price === 'string' ? hotelData.price : String(hotelData.price || 1500000);
            const roomPricePerNight = Number(priceString);
            const totalAmount = calculateRoomPrice(priceString, nights);

            return {
                id: idx + 1,
                bookingNumber: generateBookingNumber(idx),
                userId: user.id,
                roomId: hotelData.id,
                room: {
                    id: hotelData.id,
                    number: generateRoomNumber(hotelData.id, idx),
                    floor: Math.floor(hotelData.id / 100) + 1,
                    roomType: {
                        id: hotelData.id,
                        name: hotelData.title || 'Standard Room',
                        description: hotelData.description || '',
                        basePrice: Math.round(roomPricePerNight),
                        maxGuests: hotelData.maxGuests || 2,
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

        return this.bookingsCache;
    }

    generateRooms(): RoomStatus[] {
        if (this.roomsCache) {
            return this.roomsCache;
        }

        this.roomsCache = homeStayData.flatMap((hotel, hotelIdx) => {
            const roomCount = 3 + (hotelIdx % 6);
            return Array.from({ length: roomCount }, (_, roomIdx) => ({
                id: hotelIdx * 100 + roomIdx + 1,
                number: generateRoomNumber((hotel as { id: number }).id, roomIdx),
                floor: Math.floor(roomIdx / 4) + 1,
                roomType: {
                    id: (hotel as { id: number }).id,
                    name: (hotel as { title?: string }).title || '',
                    description: (hotel as { description?: string }).description || '',
                    basePrice: (() => {
                        const hotelPrice = (hotel as unknown as { price?: string | number }).price;
                        const priceStr = typeof hotelPrice === 'string' ? hotelPrice : String(hotelPrice || 0);
                        return Number(priceStr.replace(/[^\d]/g, ''));
                    })(),
                    maxGuests: (hotel as { maxGuests?: number }).maxGuests ?? 2,
                    bedConfiguration: [{ type: 'king' as const, quantity: (hotel as { bedrooms?: number }).bedrooms ?? 1 }] as { type: 'king' | 'queen' | 'single' | 'double' | 'sofa_bed'; quantity: number; }[],
                    size: 25,
                    amenities: [],
                    images: (() => {
                        const galleryImgs = (hotel as { galleryImgs?: string[] }).galleryImgs;
                        return Array.isArray(galleryImgs) && galleryImgs.length > 0 ? galleryImgs : ['/src/assets/logo.png'];
                    })(),
                    isActive: true
                },
                status: (hotelIdx + roomIdx) % 3 === 0 ? 'available' as const : 
                        ((hotelIdx + roomIdx) % 3 === 1 ? 'occupied' as const : 'maintenance' as const),
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }));
        });

        return this.roomsCache || [];
    }

    clearCache(): void {
        this.bookingsCache = null;
        this.roomsCache = null;
    }
}

export default MockDataService;
