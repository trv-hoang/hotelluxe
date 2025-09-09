import React, { useState } from 'react';

const sidebarItems = [
    { name: 'Dashboard', link: '/admin/dashboard' },
    { name: 'Users', link: '/admin/users' },
    { name: 'Bookings', link: '/admin/bookings' },
    { name: 'Settings', link: '/admin/settings' },
];

const BurgerIcon = () => (
    <span style={{ display: 'inline-block', width: 24, height: 24, position: 'relative' }}>
        <span style={{
            position: 'absolute',
            top: 6,
            left: 0,
            width: '100%',
            height: 3,
            background: '#333',
            borderRadius: 2,
        }} />
        <span style={{
            position: 'absolute',
            top: 12,
            left: 0,
            width: '100%',
            height: 3,
            background: '#333',
            borderRadius: 2,
        }} />
        <span style={{
            position: 'absolute',
            top: 18,
            left: 0,
            width: '100%',
            height: 3,
            background: '#333',
            borderRadius: 2,
        }} />
    </span>
);

const Sidebar: React.FC<{collapsed: boolean, onToggle: () => void, currentPath: string}> = ({ collapsed, onToggle, currentPath }) => (
    <aside style={{
        width: collapsed ? '64px' : '220px',
        background: '#fff',
        color: '#222',
        height: '100vh',
        boxSizing: 'border-box',
        borderRight: '1px solid #eee',
        transition: 'width 0.3s',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: collapsed ? 'center' : 'flex-start',
        boxShadow: '2px 0 8px rgba(0,0,0,0.04)',
    }}>
        <div style={{
            width: '100%',
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
            padding: collapsed ? '0' : '0 18px',
            borderBottom: '1px solid #eee',
            boxSizing: 'border-box',
            background: '#fff',
        }}>
            {!collapsed && <h2 style={{ fontWeight: 700, fontSize: 22, letterSpacing: 1, color: '#222', margin: 0 }}>Admin Panel</h2>}
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
                }}
                title={collapsed ? 'Mở rộng' : 'Thu nhỏ'}
            >
                <BurgerIcon />
            </button>
        </div>
        <nav style={{ width: '100%', marginTop: 24, padding: '0 8px' }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {sidebarItems.map(item => {
                    const isActive = currentPath === item.link;
                    return (
                        <li key={item.name} style={{ marginBottom: '1rem' }}>
                            <a
                                href={item.link}
                                style={{
                                    display: 'block',
                                    textDecoration: 'none',
                                    color: isActive ? '#1976d2' : '#222',
                                    background: isActive ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                                    borderRadius: 8,
                                    padding: collapsed ? '12px 0' : '12px 16px',
                                    fontSize: collapsed ? 0 : 16,
                                    fontWeight: isActive ? 600 : 500,
                                    letterSpacing: 0.5,
                                    transition: 'all 0.3s',
                                    opacity: collapsed ? 0 : 1,
                                    textAlign: collapsed ? 'center' : 'left',
                                    position: 'relative',
                                }}
                                onMouseEnter={e => {
                                    if (!isActive) {
                                        e.currentTarget.style.color = '#1976d2';
                                        e.currentTarget.style.background = 'rgba(25, 118, 210, 0.04)';
                                    }
                                }}
                                onMouseLeave={e => {
                                    if (!isActive) {
                                        e.currentTarget.style.color = '#222';
                                        e.currentTarget.style.background = 'transparent';
                                    }
                                }}
                            >
                                {isActive && !collapsed && (
                                    <span style={{
                                        position: 'absolute',
                                        left: 0,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        width: 3,
                                        height: 20,
                                        background: '#1976d2',
                                        borderRadius: '0 2px 2px 0',
                                    }} />
                                )}
                                {collapsed ? <span style={{ fontSize: 18, fontWeight: 600 }}>{item.name[0]}</span> : item.name}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </nav>
    </aside>
);

interface AdminSidebarProps {
    children: React.ReactNode;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const currentPath = window.location.pathname;
    
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} currentPath={currentPath} />
            <main style={{ flex: 1, background: '#f8f9fa' }}>
                {children}
            </main>
        </div>
    );
};

export default AdminSidebar;
