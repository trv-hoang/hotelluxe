import React from 'react';

interface AdminSearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    icon?: string;
    style?: React.CSSProperties;
}

const AdminSearchBar: React.FC<AdminSearchBarProps> = ({
    value,
    onChange,
    placeholder = "Search...",
    icon = "🔍",
    style
}) => {
    return (
        <div style={{
            position: 'relative',
            display: 'inline-block',
            ...style
        }}>
            <div style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af',
                fontSize: '14px',
                pointerEvents: 'none'
            }}>
                {icon}
            </div>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                style={{
                    width: '100%',
                    padding: '8px 12px 8px 36px',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    background: '#fff',
                    color: '#374151',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    minWidth: '250px',
                    boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                }}
            />
        </div>
    );
};

export default AdminSearchBar;
