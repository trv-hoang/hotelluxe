import React from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';

const SettingsPage: React.FC = () => (
    <AdminSidebar>
        <div style={{ padding: '2rem' }}>
            <h1>Settings</h1>
            <p>Manage admin settings here.</p>
        </div>
    </AdminSidebar>
);

export default SettingsPage;
