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
  role: "admin" | "staff" | "customer";
}

export interface Hotel {
  id: number;
  name: string;
  location: string;
  totalRooms: number;
  availableRooms: number;
}


export type DateRange = [Date | null, Date | null];
