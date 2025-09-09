import React from 'react';
import AdminCard from '../../components/admin/AdminCard';
import AdminPageHeader from '../../components/admin/AdminPageHeader';

const AdminDashboardPage: React.FC = () => {
    return (
        <div>
            <AdminPageHeader
                title="Admin Dashboard"
                description="Welcome to the admin dashboard. Monitor your application performance and manage resources."
                breadcrumb="Dashboard"
            />
            
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
                    icon="🏨"
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
    );
};

export default AdminDashboardPage;
