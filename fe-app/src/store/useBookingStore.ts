// stores/useBookingStore.ts
import { create } from 'zustand';
import type { DateRange } from 'react-day-picker';

interface BookingState {
    date: DateRange | undefined;
    guests: {
        adults: number;
        children: number;
        infants: number;
    };
    setDate: (date: DateRange | undefined) => void;
    setGuests: (guests: BookingState['guests']) => void;
    clearDate: () => void;
    clearGuests: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
    date: undefined,
    guests: { adults: 2, children: 1, infants: 1 },
    setDate: (date) => set({ date }),
    setGuests: (guests) => set({ guests }),
    clearDate: () => set({ date: undefined }),
    clearGuests: () => set({ guests: { adults: 0, children: 0, infants: 0 } }),
}));
