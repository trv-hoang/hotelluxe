// Dữ liệu signup
// export interface SignupPayload {
//     name: string;
//     email: string;
//     password: string;
// }

// // Dữ liệu login
// export interface LoginPayload {
//     email: string;
//     password: string;
// }

// // Dữ liệu update profile
// export interface UpdateProfilePayload {
//     name?: string;
//     email?: string;
//     password?: string;
//     profilePic?: string;
//     // tuỳ theo API của bạn
// }

// Kiểu dữ liệu User - Match với Backend User Model
export interface User {
  id: number;
  name: string;
  email: string;
  // Remove password from frontend for security
  role: "admin" | "user";
  profile_pic?: string; // Match backend field name
  nickname?: string;
  dob?: string;
  phone?: string;
  gender?: string;
  address?: string;
  email_verified_at?: string;
  created_at?: string;
  updated_at?: string;
}

// Payloads
export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export interface UpdateProfilePayload {
  name?: string;
  nickname?: string;
  dob?: string;
  phone?: string;
  address?: string;
  gender?: string;
  profile_pic?: string; // Match backend field name
}
