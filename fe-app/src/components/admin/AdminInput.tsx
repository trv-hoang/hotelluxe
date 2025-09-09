import React from 'react';

interface AdminInputProps {
    type?: 'text' | 'email' | 'password' | 'number' | 'search';
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    label?: string;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    style?: React.CSSProperties;
}

const AdminInput: React.FC<AdminInputProps> = ({
    type = 'text',
    placeholder,
    value,
    onChange,
    onKeyDown,
    label,
    error,
    disabled = false,
    required = false,
    style = {}
}) => {
    const inputStyles: React.CSSProperties = {
        width: '100%',
        padding: '8px 12px',
        border: error ? '2px solid #ef4444' : '1px solid #d1d5db',
        borderRadius: '4px',
        fontSize: '16px',
        outline: 'none',
        transition: 'border-color 0.2s',
        background: disabled ? '#f9fafb' : '#fff',
        color: disabled ? '#6b7280' : '#111827',
        ...style
    };

    return (
        <div style={{ marginBottom: '1rem' }}>
            {label && (
                <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#374151'
                }}>
                    {label}
                    {required && <span style={{ color: '#ef4444', marginLeft: '2px' }}>*</span>}
                </label>
            )}
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onKeyDown={onKeyDown}
                disabled={disabled}
                required={required}
                style={inputStyles}
                onFocus={e => {
                    if (!error) {
                        e.target.style.borderColor = '#2563eb';
                        e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                    }
                }}
                onBlur={e => {
                    e.target.style.borderColor = error ? '#ef4444' : '#d1d5db';
                    e.target.style.boxShadow = 'none';
                }}
            />
            {error && (
                <div style={{
                    color: '#ef4444',
                    fontSize: '14px',
                    marginTop: '0.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                }}>
                    <span>⚠</span>
                    {error}
                </div>
            )}
        </div>
    );
};

export default AdminInput;
