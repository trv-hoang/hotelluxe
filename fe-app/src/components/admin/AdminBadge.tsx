import React from 'react';

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'primary';
export type BadgeSize = 'small' | 'medium' | 'large';

interface AdminBadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    size?: BadgeSize;
    className?: string;
    style?: React.CSSProperties;
}

const AdminBadge: React.FC<AdminBadgeProps> = ({
    children,
    variant = 'neutral',
    size = 'medium',
    className = '',
    style = {}
}) => {
    const getVariantStyles = (): React.CSSProperties => {
        switch (variant) {
            case 'success':
                return {
                    backgroundColor: '#f0fdf4',
                    color: '#15803d',
                    border: '1px solid #bbf7d0'
                };
            case 'warning':
                return {
                    backgroundColor: '#fffbeb',
                    color: '#d97706',
                    border: '1px solid #fed7aa'
                };
            case 'error':
                return {
                    backgroundColor: '#fef2f2',
                    color: '#dc2626',
                    border: '1px solid #fecaca'
                };
            case 'info':
                return {
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    border: '1px solid #bfdbfe'
                };
            case 'primary':
                return {
                    backgroundColor: 'var(--admin-sidebar-active)',
                    color: '#ffffff',
                    border: '1px solid var(--admin-sidebar-active)'
                };
            case 'neutral':
            default:
                return {
                    backgroundColor: 'var(--admin-bg-secondary)',
                    color: 'var(--admin-text-secondary)',
                    border: '1px solid var(--admin-border-secondary)'
                };
        }
    };

    const getSizeStyles = (): React.CSSProperties => {
        switch (size) {
            case 'small':
                return {
                    padding: '0.125rem 0.5rem',
                    fontSize: '0.75rem',
                    borderRadius: '0.375rem'
                };
            case 'large':
                return {
                    padding: '0.5rem 1rem',
                    fontSize: '0.875rem',
                    borderRadius: '0.5rem'
                };
            case 'medium':
            default:
                return {
                    padding: '0.25rem 0.75rem',
                    fontSize: '0.75rem',
                    borderRadius: '9999px'
                };
        }
    };

    const baseStyles: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        transition: 'all 0.2s ease',
        whiteSpace: 'nowrap',
        ...getVariantStyles(),
        ...getSizeStyles(),
        ...style
    };

    return (
        <span
            className={`admin-badge ${className}`}
            style={baseStyles}
        >
            {children}
        </span>
    );
};

// Helper functions for common badge types
export const PaymentStatusBadge: React.FC<{ status: 'paid' | 'pending' | 'failed' }> = ({ status }) => {
    const variantMap: Record<typeof status, BadgeVariant> = {
        paid: 'success',
        pending: 'warning',
        failed: 'error'
    };

    const labelMap: Record<typeof status, string> = {
        paid: 'Đã thanh toán',
        pending: 'Chờ thanh toán',
        failed: 'Thanh toán lỗi'
    };

    return (
        <AdminBadge variant={variantMap[status]}>
            {labelMap[status]}
        </AdminBadge>
    );
};

export const UserRoleBadge: React.FC<{ role: 'admin' | 'manager' | 'user' }> = ({ role }) => {
    const variantMap: Record<typeof role, BadgeVariant> = {
        admin: 'error',
        manager: 'warning',
        user: 'info'
    };

    const labelMap: Record<typeof role, string> = {
        admin: 'Quản trị viên',
        manager: 'Quản lý',
        user: 'Người dùng'
    };

    return (
        <AdminBadge variant={variantMap[role]}>
            {labelMap[role]}
        </AdminBadge>
    );
};

export const BookingStatusBadge: React.FC<{ status: 'confirmed' | 'cancelled' | 'completed' | 'pending' }> = ({ status }) => {
    const variantMap: Record<typeof status, BadgeVariant> = {
        confirmed: 'success',
        cancelled: 'error',
        completed: 'primary',
        pending: 'warning'
    };

    const labelMap: Record<typeof status, string> = {
        confirmed: 'Đã xác nhận',
        cancelled: 'Đã hủy',
        completed: 'Hoàn thành',
        pending: 'Chờ xác nhận'
    };

    return (
        <AdminBadge variant={variantMap[status]}>
            {labelMap[status]}
        </AdminBadge>
    );
};

export default AdminBadge;
