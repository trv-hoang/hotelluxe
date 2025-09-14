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
    color = '#2196f3'
}) => {
    return (
        <div className="admin-card" style={{
            borderRadius: 8,
            padding: '1.5rem',
            borderLeft: `4px solid ${color}`,
            transition: 'transform 0.2s, box-shadow 0.2s',
            position: 'relative',
        }}
        onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px var(--admin-shadow-color)';
        }}
        onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--admin-box-shadow)';
        }}>
            {/* Icon đã được bỏ để có giao diện sạch hơn */}
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
                fontSize: 28, 
                fontWeight: 700,
                lineHeight: 1.2,
                letterSpacing: 1,
            }}>
                {(() => {
                    // Chỉ hiển thị VND cho các giá trị tiền tệ lớn hơn 1000 và không phải phần trăm hoặc số lượng phòng
                    if (typeof value === 'string') {
                        const num = Number(value.replace(/,/g, ''));
                        if (!isNaN(num) && num >= 1000 && !value.includes('%')) {
                            return `${value} VND`;
                        }
                        return value;
                    }
                    return value;
                })()}
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
    );
};

export default AdminCard;
