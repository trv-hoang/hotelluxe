// Dữ liệu signup
export interface SignupPayload {
    name: string;
    email: string;
    password: string;
}

// Dữ liệu login
export interface LoginPayload {
    email: string;
    password: string;
}

// Dữ liệu update profile
export interface UpdateProfilePayload {
    name?: string;
    email?: string;
    password?: string;
    profilePic?: string;
    // tuỳ theo API của bạn
}
