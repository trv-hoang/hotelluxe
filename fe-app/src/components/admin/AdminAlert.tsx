import React from 'react';

interface AdminAlertProps {
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    className?: string;
    style?: React.CSSProperties;
}

const AdminAlert: React.FC<AdminAlertProps> = ({
    type,
    message,
    className = '',
    style = {}
}) => {
    const getAlertStyles = () => {
        const baseStyles = {
            marginBottom: '1rem',
            padding: '12px',
            borderRadius: '6px',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        };

        switch (type) {
            case 'success':
                return {
                    ...baseStyles,
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    color: '#15803d'
                };
            case 'error':
                return {
                    ...baseStyles,
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#dc2626'
                };
            case 'warning':
                return {
                    ...baseStyles,
                    backgroundColor: '#fffbeb',
                    border: '1px solid #fed7aa',
                    color: '#d97706'
                };
            case 'info':
                return {
                    ...baseStyles,
                    backgroundColor: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    color: '#2563eb'
                };
            default:
                return baseStyles;
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return '✅';
            case 'error':
                return '⚠️';
            case 'warning':
                return '⚠️';
            case 'info':
                return 'ℹ️';
            default:
                return '';
        }
    };

    return (
        <div 
            className={className}
            style={{
                ...getAlertStyles(),
                ...style
            }}
        >
            <span>{getIcon()}</span>
            {message}
        </div>
    );
};

export default AdminAlert;
