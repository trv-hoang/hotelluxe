import React from 'react';
import AdminCard from '../../components/admin/AdminCard';
import AdminButton from '../../components/admin/AdminButton';
import AdminPageHeader from '../../components/admin/AdminPageHeader';

const BookingsPage: React.FC = () => (
    <div>
        <AdminPageHeader
            title="Bookings Management"
            description="Manage all hotel bookings, reservations, and customer information"
            breadcrumb="Bookings"
        >
            <AdminButton variant="primary">Add New Booking</AdminButton>
            <AdminButton variant="secondary">Export Data</AdminButton>
            <AdminButton variant="success">Import Data</AdminButton>
        </AdminPageHeader>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <AdminCard
                title="Total Bookings"
                value="567"
                description="All time bookings"
                color="#2196f3"
                icon="📅"
            />
            
            <AdminCard
                title="Active Reservations"
                value="89"
                description="Current active bookings"
                color="#4caf50"
                icon="🏨"
            />
            
            <AdminCard
                title="Pending Confirmations"
                value="23"
                description="Awaiting confirmation"
                color="#ff9800"
                icon="⏳"
            />
            
            <AdminCard
                title="Cancelled"
                value="12"
                description="This month"
                color="#f44336"
                icon="❌"
            />
        </div>
        
        <div style={{
            background: '#fff',
            borderRadius: 8,
            padding: '2rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
            <h2 style={{ margin: '0 0 1rem 0', color: '#222', fontSize: 20, fontWeight: 600 }}>Recent Bookings</h2>
            <p style={{ color: '#666', fontSize: 14 }}>Booking management functionality will be implemented here.</p>
        </div>
    </div>
);

export default BookingsPage;
