import React from 'react';

interface AdminSelectSimpleProps {
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    children: React.ReactNode;
    disabled?: boolean;
    style?: React.CSSProperties;
}

const AdminSelectSimple: React.FC<AdminSelectSimpleProps> = ({
    value,
    onChange,
    children,
    disabled = false,
    style,
    ...props
}) => {
    return (
        <select
            value={value}
            onChange={onChange}
            disabled={disabled}
            className="admin-select"
            style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '6px',
                border: '1px solid var(--admin-border-primary)',
                background: 'var(--admin-bg-primary)',
                color: 'var(--admin-text-primary)',
                fontSize: '14px',
                fontFamily: 'inherit',
                outline: 'none',
                transition: 'all 0.2s ease',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.6 : 1,
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                backgroundSize: '16px',
                paddingRight: '40px',
                ...style
            }}
            onFocus={(e) => {
                e.target.style.borderColor = 'var(--admin-sidebar-active)';
                e.target.style.boxShadow = '0 0 0 2px rgba(14, 165, 233, 0.1)';
            }}
            onBlur={(e) => {
                e.target.style.borderColor = 'var(--admin-border-primary)';
                e.target.style.boxShadow = 'none';
            }}
            {...props}
        >
            {children}
        </select>
    );
};

export default AdminSelectSimple;
