import React from 'react';
import AdminFormCard from './AdminFormCard';

interface AdminSuccessCardProps {
    title: string;
    message: string;
    iconComponent?: React.ReactNode;
    children?: React.ReactNode;
}

const AdminSuccessCard: React.FC<AdminSuccessCardProps> = ({
    title,
    message,
    iconComponent,
    children
}) => {
    return (
        <AdminFormCard
            title={title}
            className="text-center"
        >
            {iconComponent && (
                <div style={{ 
                    fontSize: '48px', 
                    marginBottom: '1rem',
                    color: '#10b981'
                }}>
                    {iconComponent}
                </div>
            )}
            
            <p style={{
                color: 'var(--admin-text-secondary)',
                fontSize: '14px',
                marginBottom: '2rem'
            }}>
                {message}
            </p>
            
            {children}
        </AdminFormCard>
    );
};

export default AdminSuccessCard;
