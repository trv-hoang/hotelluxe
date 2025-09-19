export interface GuestsObject {
    guestAdults?: number;
    guestChildren?: number;
    guestInfants?: number;
}

export type StaySearchFormFields = 'location' | 'guests' | 'dates';

export interface PropertyType {
    name: string;
    description: string;
    checked: boolean;
}

export interface User {
    id: number;
    name: string;
    email: string;
    // Remove password from frontend for security
    role: 'admin' | 'user';
    profile_pic?: string; // Match backend field name
    email_verified_at?: string;
    created_at?: string;
    updated_at?: string;
    // Additional fields
    nickname?: string;
    dob?: string; // yyyy-mm-dd
    phone?: string;
    gender?: string;
    address?: string;
}

export interface Hotel {
  id: number;
  name: string;
  location: string;
  totalRooms: number;
  availableRooms: number;
}


export type DateRange = [Date | null, Date | null];
