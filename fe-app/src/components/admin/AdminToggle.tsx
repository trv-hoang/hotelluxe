import React from 'react';

interface AdminToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string | React.ReactNode;
    description?: string;
    disabled?: boolean;
}

const AdminToggle: React.FC<AdminToggleProps> = ({ 
    checked, 
    onChange, 
    label, 
    description, 
    disabled = false 
}) => {
    return (
        <div className="flex items-center justify-between p-4 rounded-lg" 
             style={{ backgroundColor: 'var(--admin-bg-secondary)' }}>
            {(label || description) && (
                <div>
                    {label && (
                        <h4 className="font-medium" style={{ color: 'var(--admin-text-primary)' }}>
                            {typeof label === 'string' ? label : label}
                        </h4>
                    )}
                    {description && (
                        <p className="text-sm" style={{ color: 'var(--admin-text-secondary)' }}>
                            {description}
                        </p>
                    )}
                </div>
            )}
            
            <label className="admin-toggle">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    disabled={disabled}
                />
                <span className="admin-toggle-slider"></span>
            </label>
        </div>
    );
};

export default AdminToggle;
