import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Lazy load admin pages for better performance
const AdminDashboardPage = React.lazy(() => import('./pages/admin/AdminDashboardPage'));
const UsersPage = React.lazy(() => import('./pages/admin/UsersPage'));
const BookingsPage = React.lazy(() => import('./pages/admin/BookingsPage'));
const SettingsPage = React.lazy(() => import('./pages/admin/SettingsPage'));

// Loading component
const AdminLoading = () => (
    <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        fontSize: '18px',
        color: '#666'
    }}>
        Loading admin panel...
    </div>
);

const AdminApp: React.FC = () => {
    return (
        <Suspense fallback={<AdminLoading />}>
            <Routes>
                <Route path="/dashboard" element={<AdminDashboardPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/bookings" element={<BookingsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                {/* Redirect admin root to dashboard */}
                <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
                {/* 404 for admin routes */}
                <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </Routes>
        </Suspense>
    );
};

export default AdminApp;
