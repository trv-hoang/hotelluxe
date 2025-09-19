import React from 'react';

interface AdminButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    style?: React.CSSProperties;
    className?: string;
}

const AdminButton: React.FC<AdminButtonProps> = ({
    children,
    onClick,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    type = 'button',
    style = {},
    className = ''
}) => {
    const getVariantStyles = () => {
        switch (variant) {
            case 'primary':
                return { background: '#2563eb', color: '#fff', border: 'none' };
            case 'secondary':
                return { background: '#6b7280', color: '#fff', border: 'none' };
            case 'danger':
                return { background: '#ef4444', color: '#fff', border: 'none' };
            case 'success':
                return { background: '#10b981', color: '#fff', border: 'none' };
            case 'warning':
                return { background: '#f59e0b', color: '#fff', border: 'none' };
            default:
                return { background: '#2563eb', color: '#fff', border: 'none' };
        }
    };

    const getSizeStyles = () => {
        switch (size) {
            case 'small':
                return { padding: '6px 12px', fontSize: '14px' };
            case 'medium':
                return { padding: '8px 16px', fontSize: '16px' };
            case 'large':
                return { padding: '12px 24px', fontSize: '18px' };
            default:
                return { padding: '8px 16px', fontSize: '16px' };
        }
    };

    const baseStyles: React.CSSProperties = {
        borderRadius: '4px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s',
        fontWeight: 500,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        opacity: disabled ? 0.6 : 1,
        ...getVariantStyles(),
        ...getSizeStyles(),
        ...style
    };

    return (
        <button
            type={type}
            onClick={disabled ? undefined : onClick}
            style={baseStyles}
            className={className}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default AdminButton;
