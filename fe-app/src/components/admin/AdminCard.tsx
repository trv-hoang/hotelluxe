import React from 'react';

interface AdminCardProps {
    title: string;
    value: string | number;
    description?: string;
    color?: string;
    icon?: React.ReactNode;
}

const AdminCard: React.FC<AdminCardProps> = ({ 
    title, 
    value, 
    description, 
    color = '#2196f3',
    icon 
}) => {
    return (
        <div className="admin-card" style={{
            borderRadius: 8,
            padding: '1.5rem',
            borderLeft: `4px solid ${color}`,
            transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px var(--admin-shadow-color)';
        }}
        onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--admin-box-shadow)';
        }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ flex: 1 }}>
                    <h3 style={{ 
                        margin: '0 0 0.5rem 0', 
                        color: 'var(--admin-text-primary)', 
                        fontSize: 18,
                        fontWeight: 600 
                    }}>
                        {title}
                    </h3>
                    <p style={{ 
                        margin: '0 0 0.5rem 0', 
                        color: color, 
                        fontSize: 24, 
                        fontWeight: 700,
                        lineHeight: 1.2
                    }}>
                        {value}
                    </p>
                    {description && (
                        <p style={{ 
                            margin: 0, 
                            color: 'var(--admin-text-secondary)', 
                            fontSize: 14,
                            lineHeight: 1.4
                        }}>
                            {description}
                        </p>
                    )}
                </div>
                {icon && (
                    <div style={{
                        marginLeft: '1rem',
                        opacity: 0.7,
                        fontSize: '2rem',
                        color: color
                    }}>
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCard;
