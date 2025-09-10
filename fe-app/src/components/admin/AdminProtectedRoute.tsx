import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';

interface AdminProtectedRouteProps {
    children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
    const { isAdminAuthenticated, isLoading } = useAdminAuth();
    const location = useLocation();

    // Show loading while checking authentication
    if (isLoading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--admin-bg-primary)',
                color: 'var(--admin-text-primary)'
            }}>
                <div style={{
                    textAlign: 'center',
                    padding: '2rem'
                }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        border: '4px solid var(--admin-border)',
                        borderTop: '4px solid var(--admin-primary)',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 1rem'
                    }}></div>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    // If not authenticated, redirect to admin login
    if (!isAdminAuthenticated) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    // If authenticated, render the protected content
    return <>{children}</>;
};

export default AdminProtectedRoute;
