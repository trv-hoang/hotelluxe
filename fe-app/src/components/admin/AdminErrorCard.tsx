import React from 'react';
import AdminFormCard from './AdminFormCard';

interface AdminErrorCardProps {
    title: string;
    message: string;
    iconComponent?: React.ReactNode;
    children?: React.ReactNode;
}

const AdminErrorCard: React.FC<AdminErrorCardProps> = ({
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
                    color: '#dc2626'
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

export default AdminErrorCard;
