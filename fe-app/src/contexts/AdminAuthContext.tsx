import React, { createContext, useState, useEffect } from 'react';

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
    const checkAdminAuth = () => {
        try {
            const adminTokenData = localStorage.getItem('admin-token');
            const storedAdminUser = localStorage.getItem('admin-user');
            
            if (adminTokenData && storedAdminUser) {
                const tokenData = JSON.parse(adminTokenData);
                const user = JSON.parse(storedAdminUser);
                
                // Check token expiry
                if (tokenData.expiresAt && Date.now() > tokenData.expiresAt) {
                    throw new Error('Token expired');
                }
                
                // Validate user role
                if (user.role === 'Admin' && user.email && user.id) {
                    setAdminUser(user);
                } else {
                    throw new Error('Invalid user data');
                }
            }
        } catch (error) {
            console.error('Admin auth check failed:', error);
            // Clear invalid session data
            localStorage.removeItem('admin-token');
            localStorage.removeItem('admin-user');
        } finally {
            setIsLoading(false);
        }
    };

    const adminLogin = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            // Input validation và sanitization
            if (!email || !password) {
                throw new Error('Email và password không được để trống');
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw new Error('Email không hợp lệ');
            }

            // Sanitize inputs (remove potential harmful characters)
            const sanitizedEmail = email.trim().toLowerCase();
            const sanitizedPassword = password.trim();

            // Length validation
            if (sanitizedPassword.length < 6) {
                throw new Error('Password phải có ít nhất 6 ký tự');
            }

            // TODO: Replace with real API call
            // const response = await fetch('/api/admin/login', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({
            //         email: sanitizedEmail,
            //         password: sanitizedPassword
            //     })
            // });
            
            // Demo credentials - REMOVE IN PRODUCTION
            if (sanitizedEmail === 'admin@luxe.com' && sanitizedPassword === 'admin123') {
                const adminUser: AdminUser = {
                    id: 1,
                    name: 'Admin User',
                    email: sanitizedEmail,
                    role: 'Admin'
                };
                
                // Store admin session với expiry time
                const tokenData = {
                    token: 'admin-jwt-token', // TODO: Replace with real JWT
                    expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
                };
                
                localStorage.setItem('admin-token', JSON.stringify(tokenData));
                localStorage.setItem('admin-user', JSON.stringify(adminUser));
                setAdminUser(adminUser);
            } else {
                throw new Error('Thông tin đăng nhập không chính xác');
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Đăng nhập thất bại');
        } finally {
            setIsLoading(false);
        }
    };

    const adminLogout = () => {
        localStorage.removeItem('admin-token');
        localStorage.removeItem('admin-user');
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
