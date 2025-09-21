import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuthStore } from '@/store/useAdminAuthStore';

interface AdminProtectedRouteProps {
    children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
    const { isAdminAuthenticated, isLoading } = useAdminAuthStore();
    const location = useLocation();

    console.log('AdminProtectedRoute: Checking auth for:', location.pathname, {
        isAdminAuthenticated,
        isLoading
    });

    if (isLoading) {
        console.log('AdminProtectedRoute: Loading...');
        return <div>Loading...</div>;
    }

    if (!isAdminAuthenticated) {
        console.log('AdminProtectedRoute: Not authenticated, redirecting to login');
        return <Navigate to="/admin/login" replace />;
    }

    console.log('AdminProtectedRoute: Authenticated, rendering content');
    return <>{children}</>;
};

export default AdminProtectedRoute;