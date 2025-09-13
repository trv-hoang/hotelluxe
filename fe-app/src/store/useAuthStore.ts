import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';
import users from '@/data/jsons/__users.json';
import avatarImg from '@/assets/avatar.png';
import type {
    User,
    LoginPayload,
    SignupPayload,
    UpdateProfilePayload,
} from '@/types/profile';

interface AuthState {
    authUser: User | null;
    isLoggingIn: boolean;
    isSigningUp: boolean;
    isUpdatingProfile: boolean;

    login: (data: LoginPayload) => Promise<void>;
    logout: () => void;
    signup: (data: SignupPayload) => Promise<void>;
    updateProfile: (data: UpdateProfilePayload) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            authUser: null,
            isLoggingIn: false,
            isSigningUp: false,
            isUpdatingProfile: false,

            login: async ({ email, password }) => {
                set({ isLoggingIn: true });
                try {
                    const user = users.find(
                        (u) => u.email === email && u.password === password,
                    );
                    if (!user) throw new Error('Sai email hoặc mật khẩu');

                    set({
                        authUser: {
                            ...user,
                            role: user.role as 'admin' | 'user', // ép kiểu cho đúng type
                        },
                    });

                    toast.success('Đăng nhập thành công');
                } catch (error) {
                    toast.error('Sai email hoặc mật khẩu');
                    console.error('Login error:', error);
                } finally {
                    set({ isLoggingIn: false });
                }
            },

            logout: () => {
                set({ authUser: null });
                toast.success('Đã đăng xuất');
                window.location.href = '/login';
            },

            signup: async (data) => {
                set({ isSigningUp: true });
                try {
                    const exists = users.find((u) => u.email === data.email);
                    if (exists) throw new Error('Email đã tồn tại');

                    const newUser: User = {
                        id: users.length + 1,
                        name: data.name,
                        email: data.email,
                        password: data.password,
                        role: 'user',
                        profilePic: avatarImg || 'Avatar',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    };

                    // mock: không thật sự ghi file, chỉ set vào state
                    set({ authUser: newUser });
                    toast.success('Tạo tài khoản thành công');
                } catch (error) {
                    toast.error('Đăng ký thất bại');
                    console.error('Signup error:', error);
                } finally {
                    set({ isSigningUp: false });
                }
            },

            updateProfile: async (data) => {
                set({ isUpdatingProfile: true });
                try {
                    const current = get().authUser;
                    if (!current) throw new Error('Chưa đăng nhập');

                    const updated: User = {
                        ...current,
                        ...data,
                        updatedAt: new Date().toISOString(),
                    };

                    set({ authUser: updated });
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
            name: 'luxe-auth-storage', // key lưu trong localStorage
        },
    ),
);
