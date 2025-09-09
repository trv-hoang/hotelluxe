import React from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';

const BookingsPage: React.FC = () => (
    <AdminSidebar>
        <div style={{ padding: '2rem' }}>
            <h1>Bookings</h1>
            <p>Manage bookings here.</p>
        </div>
    </AdminSidebar>
);

export default BookingsPage;
