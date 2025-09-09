import React from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminCard from '../../components/admin/AdminCard';

const AdminDashboardPage: React.FC = () => {
    return (
        <AdminSidebar>
            <div style={{ padding: '2rem' }}>
                <div style={{
                    background: '#fff',
                    borderRadius: 8,
                    padding: '2rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    marginBottom: '2rem'
                }}>
                    <h1 style={{ margin: '0 0 1rem 0', color: '#222', fontSize: 28, fontWeight: 700 }}>Admin Dashboard</h1>
                    <p style={{ margin: 0, color: '#666', fontSize: 16, lineHeight: 1.6 }}>Welcome to the admin dashboard. Select an option from the sidebar to manage your application.</p>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    <AdminCard
                        title="Total Users"
                        value="1,234"
                        description="Active registered users"
                        color="#4caf50"
                        icon="👥"
                    />
                    
                    <AdminCard
                        title="Total Bookings"
                        value="567"
                        description="Completed bookings"
                        color="#2196f3"
                        icon="📅"
                    />
                    
                    <AdminCard
                        title="Revenue"
                        value="1,220,345 VND"
                        description="This month's revenue"
                        color="#ff9800"
                        icon="💰"
                    />
                </div>
            </div>
        </AdminSidebar>
    );
};

export default AdminDashboardPage;
