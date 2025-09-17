import React, { createContext, useState, useEffect } from 'react';
import { axiosInstance } from '@/lib/axios';

interface AdminUser {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface AdminAuthContextType {
    adminUser: AdminUser | null;
    isAdminAuthenticated: boolean;
    isLoading: boolean;
    adminLogin: (email: string, password: string) => Promise<void>;
    adminLogout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export { AdminAuthContext };

interface AdminAuthProviderProps {
    children: React.ReactNode;
}

const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
    const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const isAdminAuthenticated = !!adminUser;

    // Check if admin is authenticated on app load
    const checkAdminAuth = async () => {
        try {
            const adminToken = localStorage.getItem('admin-token');
            const storedAdminUser = localStorage.getItem('admin-user');
            
            if (adminToken && storedAdminUser) {
                const user = JSON.parse(storedAdminUser);
                if (user.role === 'admin') { // Updated to match API role
                    // Set Authorization header for all requests
                    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${adminToken}`;
                    setAdminUser(user);
                }
            }
        } catch (error) {
            console.error('Admin auth check failed:', error);
            localStorage.removeItem('admin-token');
            localStorage.removeItem('admin-user');
            delete axiosInstance.defaults.headers.common['Authorization'];
        } finally {
            setIsLoading(false);
        }
    };

    const adminLogin = async (email: string, password: string) => {
        setIsLoading(true);
        console.log('🔐 Admin login attempt:', { email, baseURL: axiosInstance.defaults.baseURL });
        
        try {
            // Call real API endpoint
            const response = await axiosInstance.post('/auth/login', {
                email,
                password
            });

            console.log('✅ Login response received:', response.status, response.data);
            const { data } = response.data;
            
            // Check if user has admin role
            if (data.user.role !== 'admin') {
                throw new Error('Access denied. Admin privileges required.');
            }

            const adminUser: AdminUser = {
                id: data.user.id,
                name: data.user.name,
                email: data.user.email,
                role: data.user.role
            };
            
            // Store admin session
            const token = data.token;
            localStorage.setItem('admin-token', token);
            localStorage.setItem('admin-user', JSON.stringify(adminUser));
            
            // Set Authorization header for future requests
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            setAdminUser(adminUser);
        } catch (error: unknown) {
            console.error('❌ Admin login failed:', error);
            let errorMessage = 'Login failed';
            
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
                console.error('API Error details:', {
                    status: axiosError.response?.status,
                    message: axiosError.response?.data?.message,
                    fullResponse: axiosError.response?.data
                });
                errorMessage = axiosError.response?.data?.message || 'Login failed';
            }
            
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const adminLogout = () => {
        localStorage.removeItem('admin-token');
        localStorage.removeItem('admin-user');
        delete axiosInstance.defaults.headers.common['Authorization'];
        setAdminUser(null);
    };

    useEffect(() => {
        checkAdminAuth();
    }, []);

    const value: AdminAuthContextType = {
        adminUser,
        isAdminAuthenticated,
        isLoading,
        adminLogin,
        adminLogout
    };

    return (
        <AdminAuthContext.Provider value={value}>
            {children}
        </AdminAuthContext.Provider>
    );
};

export default AdminAuthProvider;
