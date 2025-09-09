import React from 'react';

interface AdminPageHeaderProps {
    title: string;
    description?: string;
    breadcrumb?: string;
    children?: React.ReactNode;
}

const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({ 
    title, 
    description, 
    breadcrumb = title,
    children 
}) => {
    return (
        <div style={{ 
            marginBottom: '2rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid #e5e7eb'
        }}>
            {/* Breadcrumb */}
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                fontSize: '14px',
                color: '#6b7280',
                marginBottom: '0.5rem'
            }}>
                <span>Admin</span>
                <span>/</span>
                <span style={{ color: '#2563eb', fontWeight: '600' }}>{breadcrumb}</span>
            </div>
            
            {/* Title and Description */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                gap: '1rem'
            }}>
                <div>
                    <h1 style={{ 
                        margin: 0,
                        fontSize: '24px',
                        fontWeight: '700',
                        color: '#111827'
                    }}>
                        {title}
                    </h1>
                    {description && (
                        <p style={{ 
                            margin: '0.5rem 0 0 0',
                            color: '#6b7280',
                            fontSize: '14px'
                        }}>
                            {description}
                        </p>
                    )}
                </div>
                
                {/* Action buttons area */}
                {children && (
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPageHeader;
