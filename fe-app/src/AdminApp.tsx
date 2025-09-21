import React, { Suspense, useState } from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import NotificationProvider from './contexts/NotificationContext';
import AdminNotificationContainer from './components/admin/AdminNotificationContainer';
import { useAdminAuthStore } from './store/useAdminAuthStore';
import './styles/_admin_theme.css';

// Lazy load admin pages for better performance
const AdminDashboardPage = React.lazy(() => import('./pages/admin/AdminDashboardPage'));
const UsersPage = React.lazy(() => import('./pages/admin/UsersPage'));
const BookingsPage = React.lazy(() => import('./pages/admin/BookingsPage'));
const HotelPage = React.lazy(() => import('./pages/admin/HotelPage'));
const SettingsPage = React.lazy(() => import('./pages/admin/SettingsPage'));
const AboutPage = React.lazy(() => import('./pages/admin/AboutPage'));
const AdminLoginPage = React.lazy(() => import('./pages/admin/AdminLoginPage'));
const AdminForgotPasswordPage = React.lazy(
    () => import('./pages/admin/AdminForgotPasswordPage'),
);
const AdminResetPasswordPage = React.lazy(
    () => import('./pages/admin/AdminResetPasswordPage'),
);

// Admin Sidebar Items
const sidebarItems = [
    { name: 'Dashboard', link: '/admin/dashboard' },
    { name: 'Users', link: '/admin/users' },
    { name: 'Bookings', link: '/admin/bookings' },
    { name: 'Hotel', link: '/admin/hotel' },
    { name: 'About', link: '/admin/about' },
    { name: 'Settings', link: '/admin/settings' },
];

// Burger Icon Component
const BurgerIcon = () => (
    <span
        style={{
            display: 'inline-block',
            width: 24,
            height: 24,
            position: 'relative',
        }}
    >
        <span
            style={{
                position: 'absolute',
                top: 6,
                left: 0,
                width: '100%',
                height: 3,
                background: 'var(--admin-sidebar-text)',
                borderRadius: 2,
            }}
        />
        <span
            style={{
                position: 'absolute',
                top: 12,
                left: 0,
                width: '100%',
                height: 3,
                background: 'var(--admin-sidebar-text)',
                borderRadius: 2,
            }}
        />
        <span
            style={{
                position: 'absolute',
                top: 18,
                left: 0,
                width: '100%',
                height: 3,
                background: 'var(--admin-sidebar-text)',
                borderRadius: 2,
            }}
        />
    </span>
);

// Loading component
const AdminLoading = () => (
    <div
        style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
            fontSize: '18px',
            color: '#666',
        }}
    >
        Loading admin panel...
    </div>
);

// Standalone Admin Sidebar
const AdminSidebarStandalone: React.FC<{
    collapsed: boolean;
    onToggle: () => void;
}> = ({ collapsed, onToggle }) => {
    const location = useLocation();
    const { adminLogout, adminUser } = useAdminAuthStore();

    const handleLogout = () => {
        adminLogout();
    };

    return (
        <aside
            className='admin-sidebar'
            style={{
                width: collapsed ? '64px' : '220px',
                height: '100vh',
                boxSizing: 'border-box',
                transition: 'width 0.3s',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                alignItems: collapsed ? 'center' : 'flex-start',
                boxShadow: '2px 0 8px var(--admin-shadow)',
            }}
        >
            <div
                style={{
                    width: '100%',
                    height: 64,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'space-between',
                    padding: collapsed ? '0' : '0 18px',
                    borderBottom: '1px solid var(--admin-border-primary)',
                    boxSizing: 'border-box',
                }}
            >
                {!collapsed && (
                    <h2
                        style={{
                            fontWeight: 700,
                            fontSize: 22,
                            letterSpacing: 1,
                            color: 'var(--admin-sidebar-text)',
                            margin: 0,
                        }}
                    >
                        Admin Panel
                    </h2>
                )}
                <button
                    onClick={onToggle}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        outline: 'none',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--admin-sidebar-text)',
                    }}
                    title={collapsed ? 'Mở rộng' : 'Thu nhỏ'}
                >
                    <BurgerIcon />
                </button>
            </div>

            {/* Theme Toggle moved to Settings Page */}

            <nav style={{ width: '100%', padding: '0 8px', flex: 1 }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {sidebarItems.map((item) => {
                        const isActive = location.pathname === item.link;
                        return (
                            <li
                                key={item.name}
                                style={{ marginBottom: '1rem' }}
                            >
                                <Link
                                    to={item.link}
                                    className={`admin-sidebar-item ${
                                        isActive ? 'active' : ''
                                    }`}
                                    style={{
                                        display: 'block',
                                        textDecoration: 'none',
                                        borderRadius: 8,
                                        padding: collapsed
                                            ? '12px 0'
                                            : '12px 16px',
                                        fontSize: collapsed ? 0 : 16,
                                        fontWeight: isActive ? 600 : 500,
                                        letterSpacing: 0.5,
                                        textAlign: collapsed
                                            ? 'center'
                                            : 'left',
                                        position: 'relative',
                                    }}
                                >
                                    {isActive && !collapsed && (
                                        <span
                                            style={{
                                                position: 'absolute',
                                                left: 0,
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                width: 3,
                                                height: 20,
                                                background:
                                                    'var(--admin-sidebar-active)',
                                                borderRadius: '0 2px 2px 0',
                                            }}
                                        />
                                    )}
                                    {collapsed ? (
                                        <span
                                            style={{
                                                fontSize: 18,
                                                fontWeight: 600,
                                            }}
                                        >
                                            {item.name[0]}
                                        </span>
                                    ) : (
                                        item.name
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Admin User Info - Moved to bottom */}
            {!collapsed && adminUser && (
                <div
                    style={{
                        padding: '16px',
                        width: '100%',
                        boxSizing: 'border-box',
                        borderTop: '1px solid var(--admin-border-primary)',
                        marginTop: 'auto',
                    }}
                >
                    <div
                        style={{
                            fontSize: '14px',
                            color: 'var(--admin-text-secondary)',
                            marginBottom: '8px',
                        }}
                    >
                        Welcome back,
                    </div>
                    <div
                        style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: 'var(--admin-sidebar-text)',
                            marginBottom: '8px',
                        }}
                    >
                        {adminUser.name}
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            background: 'transparent',
                            border: '1px solid var(--admin-border)',
                            color: 'var(--admin-text-secondary)',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                    >
                        Logout
                    </button>
                </div>
            )}
        </aside>
    );
};

const AdminApp: React.FC = () => {
    console.log('AdminApp: Component mounted for URL:', window.location.href);
    
    return (
        <NotificationProvider>
            <AdminAppContent />
            <AdminNotificationContainer />
        </NotificationProvider>
    );
};

const AdminAppContent: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();
    const { isAdminAuthenticated, isLoading, checkAdminAuth } = useAdminAuthStore();

    // Don't show sidebar on auth pages
    const isAuthPage = [
        '/admin/login',
        '/admin/forgot-password',
        '/admin/reset-password',
    ].includes(location.pathname);

    // Check admin auth on mount và khi location thay đổi
    React.useEffect(() => {
        console.log('AdminApp: Checking auth for path:', location.pathname);
        if (location.pathname.startsWith('/admin')) {
            console.log('AdminApp: Running checkAdminAuth for location change');
            checkAdminAuth();
        }
    }, [location.pathname, checkAdminAuth]); // Trigger khi path thay đổi

    // Redirect to login if not authenticated and not on auth page
    React.useEffect(() => {
        if (!isLoading && !isAdminAuthenticated && !isAuthPage) {
            console.log('AdminApp: Not authenticated, redirecting to login');
            window.location.href = '/admin/login';
        }
    }, [isAdminAuthenticated, isLoading, isAuthPage]);

    // Debug logging
    React.useEffect(() => {
        console.log('AdminApp state:', {
            isAdminAuthenticated,
            isLoading,
            pathname: location.pathname,
            adminToken: localStorage.getItem('admin-token') ? 'present' : 'missing'
        });
    }, [isAdminAuthenticated, isLoading, location.pathname]);

    // DISABLE redirect từ auth pages - để debug
    if (isAuthPage && isAdminAuthenticated && !isLoading) {
        console.log('AdminApp: User authenticated but STAYING on auth page for debug');
        // Không redirect, để ở trang hiện tại
    }

    // Show loading while checking authentication
    if (isLoading) {
        console.log('AdminApp: Showing loading state');
        return <AdminLoading />;
    }

    if (isAuthPage) {
        console.log('AdminApp: Rendering auth page:', location.pathname);
        return (
            <div style={{ minHeight: '100vh' }}>
                <Suspense fallback={<AdminLoading />}>
                    <Routes>
                        <Route path='/login' element={<AdminLoginPage />} />
                        <Route
                            path='/forgot-password'
                            element={<AdminForgotPasswordPage />}
                        />
                        <Route
                            path='/reset-password'
                            element={<AdminResetPasswordPage />}
                        />
                        <Route
                            path='*'
                            element={<Navigate to='/admin/login' replace />}
                        />
                    </Routes>
                </Suspense>
            </div>
        );
    }

    return (
        <div
            className='admin-container'
            style={{
                minHeight: '100vh',
            }}
        >
            <AdminSidebarStandalone
                collapsed={collapsed}
                onToggle={() => setCollapsed((c) => !c)}
            />
            <div
                className='admin-content'
                style={{
                    marginLeft: collapsed ? '64px' : '220px',
                    minHeight: '100vh',
                    padding: '24px',
                    background: 'var(--admin-bg-secondary)',
                    transition: 'margin-left 0.3s',
                    boxSizing: 'border-box',
                }}
            >
                <Suspense fallback={<AdminLoading />}>
                    <Routes>
                        {/* Admin routes - no protection for now */}
                        <Route
                            path='/dashboard'
                            element={<AdminDashboardPage />}
                        />
                        <Route
                            path='/users'
                            element={<UsersPage />}
                        />
                        <Route
                            path='/bookings'
                            element={<BookingsPage />}
                        />
                        <Route
                            path='/hotel'
                            element={<HotelPage />}
                        />
                        <Route
                            path='/about'
                            element={<AboutPage />}
                        />
                        <Route
                            path='/settings'
                            element={<SettingsPage />}
                        />

                        {/* Redirect admin root to dashboard */}
                        <Route
                            path='/'
                            element={<Navigate to='/admin/dashboard' replace />}
                        />
                        {/* 404 for admin routes */}
                        <Route
                            path='*'
                            element={<Navigate to='/admin/dashboard' replace />}
                        />
                    </Routes>
                </Suspense>
            </div>
        </div>
    );
};

export default AdminApp;
