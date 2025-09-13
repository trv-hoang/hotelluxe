import React, { useEffect } from 'react';
import AdminCard from '../../components/admin/AdminCard';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import { AdminBarChart, AdminLineChart } from '../../components/admin/AdminChart';
import { useNotifications } from '../../hooks/useNotifications';
import usersData from '../../data/jsons/__users.json';
import homeStayData from '../../data/jsons/__homeStay.json';

const AdminDashboardPage: React.FC = () => {
    const { addNotification } = useNotifications();

    useEffect(() => {
        // Use sessionStorage to ensure notification only shows once per session
        const welcomeShown = sessionStorage.getItem('admin-welcome-shown');
        
        if (!welcomeShown) {
            // Mark as shown immediately to prevent duplicates
            sessionStorage.setItem('admin-welcome-shown', 'true');
            
            // Small delay to ensure component is fully mounted
            const timer = setTimeout(() => {
                addNotification({
                    type: 'info',
                    title: 'Welcome to Admin Dashboard',
                    message: 'All systems are running smoothly. Check analytics below.',
                    duration: 4000
                });
            }, 300);

            return () => clearTimeout(timer);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency array to ensure it only runs once

    const totalUsers = usersData.length;
    const totalHotels = homeStayData.length;
    const totalBookings = homeStayData.length;
    const revenueData = [
        { label: 'Jan', value: 125000, color: '#3b82f6' },
        { label: 'Feb', value: 140000, color: '#3b82f6' },
        { label: 'Mar', value: 135000, color: '#3b82f6' },
        { label: 'Apr', value: 160000, color: '#3b82f6' },
        { label: 'May', value: 185000, color: '#3b82f6' },
        { label: 'Jun', value: 220000, color: '#3b82f6' },
    ];
    const bookingsData = [
        { label: 'Mon', value: 12, color: '#10b981' },
        { label: 'Tue', value: 19, color: '#10b981' },
        { label: 'Wed', value: 15, color: '#10b981' },
        { label: 'Thu', value: 25, color: '#10b981' },
        { label: 'Fri', value: 30, color: '#10b981' },
        { label: 'Sat', value: 35, color: '#10b981' },
        { label: 'Sun', value: 28, color: '#10b981' },
    ];

    return (
        <div>
            <AdminPageHeader
                title="Admin Dashboard"
                description="Welcome to the admin dashboard. Monitor your application performance and manage resources."
                breadcrumb="Dashboard"
            />
            
            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <AdminCard
                    title="Total Users"
                    value={totalUsers.toString()}
                    description="Active registered users"
                    color="#4caf50"
                    icon="👥"
                />
                <AdminCard
                    title="Total Hotels"
                    value={totalHotels.toString()}
                    description="Hotels/Homestays"
                    color="#2196f3"
                    icon="🏨"
                />
                <AdminCard
                    title="Total Bookings"
                    value={totalBookings.toString()}
                    description="Completed bookings"
                    color="#ff9800"
                    icon="💳"
                />
                <AdminCard
                    title="Active Sessions"
                    value="42"
                    description="Current user sessions"
                    color="#9c27b0"
                    icon="🔗"
                />
            </div>

            {/* Analytics Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <AdminLineChart
                    title="Monthly Revenue (VND)"
                    data={revenueData}
                    height={250}
                />
                
                <AdminBarChart
                    title="Weekly Bookings"
                    data={bookingsData}
                    height={250}
                />
            </div>

            {/* Quick Actions */}
            <div className="admin-card" style={{ padding: '1.5rem', borderRadius: '8px' }}>
                <h3 style={{ 
                    margin: '0 0 1rem 0', 
                    color: 'var(--admin-text-primary)', 
                    fontSize: '18px', 
                    fontWeight: '600' 
                }}>
                    Quick Actions
                </h3>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => addNotification({
                            type: 'success',
                            title: 'System Check Complete',
                            message: 'All systems are operational and running smoothly.'
                        })}
                        style={{
                            padding: '12px 24px',
                            borderRadius: '6px',
                            border: 'none',
                            background: '#10b981',
                            color: '#ffffff',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#059669'}
                        onMouseLeave={e => e.currentTarget.style.background = '#10b981'}
                    >
                        Run System Check
                    </button>
                    
                    <button
                        onClick={() => addNotification({
                            type: 'warning',
                            title: 'Backup Initiated',
                            message: 'Database backup process started. This may take a few minutes.'
                        })}
                        style={{
                            padding: '12px 24px',
                            borderRadius: '6px',
                            border: 'none',
                            background: '#f59e0b',
                            color: '#ffffff',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#d97706'}
                        onMouseLeave={e => e.currentTarget.style.background = '#f59e0b'}
                    >
                        Backup Database
                    </button>
                    
                    <button
                        onClick={() => addNotification({
                            type: 'error',
                            title: 'Error Simulation',
                            message: 'This is a test error notification to demonstrate the system.'
                        })}
                        style={{
                            padding: '12px 24px',
                            borderRadius: '6px',
                            border: 'none',
                            background: '#ef4444',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#dc2626'}
                        onMouseLeave={e => e.currentTarget.style.background = '#ef4444'}
                    >
                        Test Error Alert
                    </button>
                </div>
            </div>
        </div>
    );
};


export default AdminDashboardPage;
