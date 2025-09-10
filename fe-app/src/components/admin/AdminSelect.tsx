import React from 'react';
import '../../styles/_admin_theme.css';

interface AdminSelectProps {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: { value: string; label: string }[];
    error?: string;
    disabled?: boolean;
    required?: boolean;
    style?: React.CSSProperties;
}

const AdminSelect: React.FC<AdminSelectProps> = ({
    label,
    value,
    onChange,
    options,
    error,
    disabled = false,
    required = false,
    style,
    ...props
}) => {
    return (
        <div style={style}>
            <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: 600,
                color: 'var(--admin-text-primary)',
                fontSize: '14px'
            }}>
                {label}
                {required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
            </label>
            
            <select
                value={value}
                onChange={onChange}
                disabled={disabled}
                required={required}
                className="admin-input"
                style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    border: error ? '2px solid #ef4444' : '1px solid var(--admin-border-primary)',
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
                    paddingRight: '40px'
                }}
                onFocus={(e) => {
                    if (!error) {
                        e.target.style.borderColor = 'var(--admin-sidebar-active)';
                        e.target.style.boxShadow = '0 0 0 2px rgba(14, 165, 233, 0.1)';
                    }
                }}
                onBlur={(e) => {
                    e.target.style.borderColor = error ? '#ef4444' : 'var(--admin-border-primary)';
                    e.target.style.boxShadow = 'none';
                }}
                {...props}
            >
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            
            {error && (
                <div style={{
                    marginTop: '0.5rem',
                    fontSize: '12px',
                    color: '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                }}>
                    <span>⚠️</span>
                    {error}
                </div>
            )}
        </div>
    );
};

export default AdminSelect;
