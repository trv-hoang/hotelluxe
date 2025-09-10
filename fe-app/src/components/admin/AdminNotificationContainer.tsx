import React from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import type { Notification, NotificationType } from '../../contexts/NotificationContext';
import '../../styles/_admin_theme.css';

const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
        case 'success': return '✅';
        case 'error': return '❌';
        case 'warning': return '⚠️';
        case 'info': return 'ℹ️';
        default: return 'ℹ️';
    }
};

const getNotificationColor = (type: NotificationType) => {
    switch (type) {
        case 'success': return '#10b981';
        case 'error': return '#ef4444';
        case 'warning': return '#f59e0b';
        case 'info': return '#3b82f6';
        default: return '#6b7280';
    }
};

interface NotificationItemProps {
    notification: Notification;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
    const { removeNotification } = useNotifications();

    return (
        <div
            style={{
                backgroundColor: 'var(--admin-bg-primary)',
                border: `1px solid ${getNotificationColor(notification.type)}`,
                borderRadius: '8px',
                padding: '12px 16px',
                marginBottom: '8px',
                boxShadow: '0 4px 12px var(--admin-shadow)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                minWidth: '320px',
                maxWidth: '400px',
                animation: 'slideInRight 0.3s ease-out'
            }}
        >
            <span style={{ fontSize: '16px', flexShrink: 0 }}>
                {getNotificationIcon(notification.type)}
            </span>
            
            <div style={{ flex: 1 }}>
                <h4 style={{
                    margin: '0 0 4px 0',
                    color: 'var(--admin-text-primary)',
                    fontSize: '14px',
                    fontWeight: '600'
                }}>
                    {notification.title}
                </h4>
                
                {notification.message && (
                    <p style={{
                        margin: 0,
                        color: 'var(--admin-text-secondary)',
                        fontSize: '13px',
                        lineHeight: '1.4'
                    }}>
                        {notification.message}
                    </p>
                )}
                
                <div style={{
                    marginTop: '4px',
                    fontSize: '11px',
                    color: 'var(--admin-text-tertiary)'
                }}>
                    {notification.timestamp.toLocaleTimeString()}
                </div>
            </div>
            
            <button
                onClick={() => removeNotification(notification.id)}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--admin-text-tertiary)',
                    cursor: 'pointer',
                    fontSize: '16px',
                    padding: '0',
                    flexShrink: 0
                }}
                title="Close notification"
            >
                ×
            </button>
        </div>
    );
};

const AdminNotificationContainer: React.FC = () => {
    const { notifications } = useNotifications();

    if (notifications.length === 0) {
        return null;
    }

    return (
        <>
            <style>{`
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `}</style>
            
            <div
                style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                {notifications.map(notification => (
                    <NotificationItem
                        key={notification.id}
                        notification={notification}
                    />
                ))}
            </div>
        </>
    );
};

export default AdminNotificationContainer;
