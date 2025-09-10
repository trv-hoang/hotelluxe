import React from 'react';

const sidebarItems = [
    { name: 'Dashboard', link: '/admin/dashboard' },
    { name: 'Users', link: '/admin/users' },
    { name: 'Bookings', link: '/admin/bookings' },
    { name: 'Settings', link: '/admin/settings' },
];

const Sidebar: React.FC = () => (
    <aside style={{
        width: '220px',
        background: '#f4f4f4',
        padding: '1rem',
        height: '100vh',
        boxSizing: 'border-box',
        borderRight: '1px solid #ddd'
    }}>
        <h2 style={{ marginBottom: '2rem' }}>Admin</h2>
        <nav>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {sidebarItems.map(item => (
                    <li key={item.name} style={{ marginBottom: '1rem' }}>
                        <a href={item.link} style={{ textDecoration: 'none', color: '#333' }}>
                            {item.name}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    </aside>
);

const AdminDashboardPage: React.FC = () => (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '2rem' }}>
            <h1>Admin Dashboard</h1>
            <p>Welcome to the admin dashboard. Select an option from the sidebar.</p>
        </main>
    </div>
);

export default AdminDashboardPage;