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
            const adminToken = localStorage.getItem('admin-token');
            const storedAdminUser = localStorage.getItem('admin-user');
            
            if (adminToken && storedAdminUser) {
                const user = JSON.parse(storedAdminUser);
                if (user.role === 'Admin') {
                    setAdminUser(user);
                }
            }
        } catch (error) {
            console.error('Admin auth check failed:', error);
            localStorage.removeItem('admin-token');
            localStorage.removeItem('admin-user');
        } finally {
            setIsLoading(false);
        }
    };

    const adminLogin = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            // Demo credentials - replace with real API call
            if (email === 'admin@luxe.com' && password === 'admin123') {
                const adminUser: AdminUser = {
                    id: 1,
                    name: 'Admin User',
                    email: 'admin@luxe.com',
                    role: 'Admin'
                };
                
                // Store admin session
                localStorage.setItem('admin-token', 'admin-jwt-token');
                localStorage.setItem('admin-user', JSON.stringify(adminUser));
                setAdminUser(adminUser);
            } else {
                throw new Error('Invalid admin credentials');
            }
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
