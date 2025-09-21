import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import '../../styles/_admin_theme.css';

interface AdminPasswordInputProps {
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

const AdminPasswordInput: React.FC<AdminPasswordInputProps> = ({
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
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div style={style}>
            {label && (
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
            )}
            <div style={{ position: 'relative' }}>
                <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    disabled={disabled}
                    required={required}
                    className="admin-input"
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        paddingRight: '2.5rem', // Space for the icon
                        borderRadius: '6px',
                        border: error ? '2px solid #ef4444' : '1px solid var(--admin-border-primary)',
                        background: disabled ? 'var(--admin-bg-tertiary)' : 'var(--admin-bg-primary)',
                        color: disabled ? 'var(--admin-text-tertiary)' : 'var(--admin-text-primary)',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                        outline: 'none',
                        transition: 'all 0.2s ease',
                        cursor: disabled ? 'not-allowed' : 'text'
                    }}
                    onFocus={e => {
                        if (!error) {
                            e.target.style.borderColor = 'var(--admin-sidebar-active)';
                            e.target.style.boxShadow = '0 0 0 2px rgba(14, 165, 233, 0.1)';
                        }
                    }}
                    onBlur={e => {
                        e.target.style.borderColor = error ? '#ef4444' : 'var(--admin-border-primary)';
                        e.target.style.boxShadow = 'none';
                    }}
                />
                <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    disabled={disabled}
                    style={{
                        position: 'absolute',
                        right: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        color: 'var(--admin-text-secondary)',
                        padding: '0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '20px',
                        height: '20px',
                        borderRadius: '2px',
                        transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={e => {
                        if (!disabled) {
                            e.currentTarget.style.color = 'var(--admin-text-primary)';
                        }
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.color = 'var(--admin-text-secondary)';
                    }}
                >
                    {showPassword ? (
                        <EyeOff size={16} />
                    ) : (
                        <Eye size={16} />
                    )}
                </button>
            </div>
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

export default AdminPasswordInput;