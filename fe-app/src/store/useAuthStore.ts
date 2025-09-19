import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';
import type {
    User,
    LoginPayload,
    SignupPayload,
    UpdateProfilePayload,
} from '@/types/profile';
import api from '@/api/axios'; // axios instance

interface AuthState {
    authUser: User | null;
    isLoggingIn: boolean;
    isSigningUp: boolean;
    isUpdatingProfile: boolean;

    login: (data: LoginPayload) => Promise<void>;
    logout: () => Promise<void>;
    signup: (data: SignupPayload) => Promise<void>;
    updateProfile: (data: UpdateProfilePayload) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            authUser: null,
            isLoggingIn: false,
            isSigningUp: false,
            isUpdatingProfile: false,

            //  ĐÃ SỬA: Lấy data.data.user và data.data.token
            login: async ({ email, password }) => {
                set({ isLoggingIn: true });
                try {
                    const response = await api.post('/auth/login', {
                        email,
                        password,
                    });

                    // Lấy data từ response.data.data
                    const apiData = response.data.data;
                    console.log('Login response data:', apiData);
                    localStorage.setItem('token', apiData.token);
                    set({ authUser: apiData.user });

                    toast.success('Đăng nhập thành công');
                } catch (error) {
                    toast.error('Sai email hoặc mật khẩu');
                    console.error('Login error:', error);
                    throw error;
                } finally {
                    set({ isLoggingIn: false });
                }
            },

            logout: async () => {
                try {
                    const token = localStorage.getItem('token');
                    if (token) {
                        await api.post(
                            '/auth/logout',
                            {},
                            {
                                headers: { Authorization: `Bearer ${token}` },
                            },
                        );
                    }
                } catch (error) {
                    console.error('Logout error:', error);
                } finally {
                    localStorage.removeItem('token');
                    set({ authUser: null });
                    toast.success('Đã đăng xuất');
                    window.location.href = '/login';
                }
            },

            //  ĐÃ SỬA: Giả sử /auth/register cũng trả về cấu trúc tương tự
            signup: async (data) => {
                set({ isSigningUp: true });
                try {
                    const response = await api.post('/auth/register', data);
                    const apiData = response.data.data; // 👈 giống login

                    localStorage.setItem('token', apiData.token);
                    set({ authUser: apiData.user });

                    toast.success('Tạo tài khoản thành công');
                } catch (error) {
                    toast.error('Đăng ký thất bại');
                    console.error('Signup error:', error);
                } finally {
                    set({ isSigningUp: false });
                }
            },

            //  ĐÃ SỬA: Giả sử /auth/profile trả về user trong data.data.user
            updateProfile: async (data) => {
                set({ isUpdatingProfile: true });
                try {
                    const token = localStorage.getItem('token');
                    const response = await api.put('/auth/profile', data, {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    const apiData = response.data.data; // 👈 đồng bộ cấu trúc

                    set({ authUser: apiData.user });
                    toast.success('Cập nhật hồ sơ thành công');
                } catch (error) {
                    toast.error('Không thể cập nhật hồ sơ');
                    console.error('Update profile error:', error);
                } finally {
                    set({ isUpdatingProfile: false });
                }
            },
        }),
        {
            name: 'luxe-auth-storage',
        },
    ),
);