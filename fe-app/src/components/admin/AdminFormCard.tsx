import React from 'react';

interface AdminFormCardProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    maxWidth?: string;
    className?: string;
    style?: React.CSSProperties;
}

const AdminFormCard: React.FC<AdminFormCardProps> = ({
    title,
    subtitle,
    children,
    maxWidth = '400px',
    className = '',
    style = {}
}) => {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '1rem',
            ...style
        }}>
            <div className={`admin-card ${className}`} style={{
                width: '100%',
                maxWidth,
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{
                        fontSize: '28px',
                        fontWeight: '700',
                        color: 'var(--admin-text-primary)',
                        margin: '0 0 0.5rem 0'
                    }}>
                        {title}
                    </h1>
                    {subtitle && (
                        <p style={{
                            color: 'var(--admin-text-secondary)',
                            fontSize: '14px',
                            margin: 0
                        }}>
                            {subtitle}
                        </p>
                    )}
                </div>
                
                {children}
            </div>
        </div>
    );
};

export default AdminFormCard;
