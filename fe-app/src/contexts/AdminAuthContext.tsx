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
    const checkAdminAuth = async () => {
        try {
            const adminToken = localStorage.getItem('admin-token');
            const storedAdminUser = localStorage.getItem('admin-user');

            if (adminToken && storedAdminUser) {
                // Verify token with backend
                const response = await fetch(
                    'http://localhost:8000/api/auth/profile',
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${adminToken}`,
                            Accept: 'application/json',
                        },
                    },
                );

                if (response.ok) {
                    const data = await response.json();

                    if (data.success && data.data.user.role === 'admin') {
                        const user = {
                            id: data.data.user.id,
                            name: data.data.user.name,
                            email: data.data.user.email,
                            role: data.data.user.role,
                        };
                        setAdminUser(user);
                        // Update stored user data if needed
                        localStorage.setItem(
                            'admin-user',
                            JSON.stringify(user),
                        );
                        return;
                    }
                }

                // Token is invalid or expired, clear it
                localStorage.removeItem('admin-token');
                localStorage.removeItem('admin-user');
                setAdminUser(null);
            }
        } catch (error) {
            console.error('Admin auth check failed:', error);
            localStorage.removeItem('admin-token');
            localStorage.removeItem('admin-user');
            setAdminUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const adminLogin = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            // Real API call to login
            const response = await fetch(
                'http://localhost:8000/api/auth/login',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                },
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Login failed');
            }

            // Check if user is admin
            if (data.data.user.role !== 'admin') {
                throw new Error('Access denied. Admin privileges required.');
            }

            const adminUser: AdminUser = {
                id: data.data.user.id,
                name: data.data.user.name,
                email: data.data.user.email,
                role: data.data.user.role,
            };

            // Store admin session
            localStorage.setItem('admin-token', data.data.token);
            localStorage.setItem('admin-user', JSON.stringify(adminUser));
            setAdminUser(adminUser);
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
