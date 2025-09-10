import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import type { User } from '@/types/type';
import type {
    LoginPayload,
    SignupPayload,
    UpdateProfilePayload,
} from '@/types/profile';

// Định nghĩa kiểu dữ liệu User (tùy theo backend của bạn trả về gì)

// Định nghĩa type cho Zustand store
interface AuthState {
    authUser: User | null;
    isCheckingAuth: boolean;
    isLoggingIn: boolean;
    isSigningUp: boolean;
    isUpdatingProfile: boolean;

    checkAuth: () => Promise<void>;
    setAuthUser: (user: User | null) => void;
    signup: (data: SignupPayload) => Promise<void>;
    login: (data: LoginPayload) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (data: UpdateProfilePayload) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    authUser: null,
    isCheckingAuth: true,
    isLoggingIn: false,
    isSigningUp: false,
    isUpdatingProfile: false,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get<User>('/auth/check-auth');
            set({ authUser: res.data });
        } catch (error) {
            console.log('Error in checkAuth', error);
            set({ authUser: null, isCheckingAuth: false });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    setAuthUser: (user) => set({ authUser: user, isCheckingAuth: false }),

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post<User>('/auth/signup', data);
            set({ authUser: res.data });
            toast.success('Account created successfully');
        } catch (error) {
            console.log('Error in signup', error);
            toast.error('Signup failed');
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post<User>('/auth/login', data);
            set({ authUser: res.data });
            toast.success('Login successful');
        } catch (error) {
            toast.error('Invalid email or password');
            console.log('Error in login', error);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post('/auth/logout');
            set({ authUser: null });
            toast.success('Logout successful');
        } catch (error) {
            console.log('Error in logout', error);
            toast.error('Logout failed');
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put<User>(
                '/auth/update-profile',
                data,
            );
            set({ authUser: res.data });
            toast.success('Profile updated successfully');
        } catch (error) {
            console.log('Error in update profile:', error);
            toast.error('Failed to update profile');
        } finally {
            set({ isUpdatingProfile: false });
        }
    },
}));
