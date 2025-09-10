import React from 'react';
import { useAdminTheme } from '../../hooks/useAdminTheme';
import '../../styles/_admin_theme.css';

const AdminThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useAdminTheme();

    return (
        <button
            onClick={toggleTheme}
            className="admin-theme-toggle"
            style={{
                padding: '8px 12px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
            }}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        >
            <span style={{ fontSize: '16px' }}>
                {theme === 'light' ? '☀️' : '🌙'}
            </span>
            <span>
                {theme === 'light' ? 'Light' : 'Dark'}
            </span>
        </button>
    );
};

export default AdminThemeToggle;
