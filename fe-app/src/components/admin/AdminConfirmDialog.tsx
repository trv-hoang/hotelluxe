import React from 'react';
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import AdminButton from './AdminButton';

export type ConfirmDialogType = 'warning' | 'danger' | 'info' | 'success';

interface AdminConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    type?: ConfirmDialogType;
    confirmLabel?: string;
    cancelLabel?: string;
    isLoading?: boolean;
}

const AdminConfirmDialog: React.FC<AdminConfirmDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    type = 'warning',
    confirmLabel = 'Xác nhận',
    cancelLabel = 'Hủy',
    isLoading = false
}) => {
    if (!isOpen) return null;

    const getTypeConfig = () => {
        switch (type) {
            case 'danger':
                return {
                    icon: XCircle,
                    iconColor: '#dc2626',
                    iconBgColor: '#fef2f2',
                    confirmVariant: 'danger' as const
                };
            case 'success':
                return {
                    icon: CheckCircle,
                    iconColor: '#059669',
                    iconBgColor: '#f0fdf4',
                    confirmVariant: 'primary' as const
                };
            case 'info':
                return {
                    icon: Info,
                    iconColor: '#2563eb',
                    iconBgColor: '#eff6ff',
                    confirmVariant: 'primary' as const
                };
            case 'warning':
            default:
                return {
                    icon: AlertTriangle,
                    iconColor: '#d97706',
                    iconBgColor: '#fffbeb',
                    confirmVariant: 'warning' as const
                };
        }
    };

    const { icon: Icon, iconColor, iconBgColor, confirmVariant } = getTypeConfig();

    const handleConfirm = () => {
        if (!isLoading) {
            onConfirm();
        }
    };

    const handleCancel = () => {
        if (!isLoading) {
            onClose();
        }
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                animation: 'fadeIn 0.2s ease-out'
            }}
            onClick={handleCancel}
        >
            <div
                style={{
                    background: '#fff',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                    maxWidth: '500px',
                    width: '90%',
                    maxHeight: '90vh',
                    overflow: 'hidden',
                    animation: 'slideIn 0.3s ease-out'
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Content */}
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                    {/* Icon */}
                    <div
                        style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            backgroundColor: iconBgColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem auto'
                        }}
                    >
                        <Icon
                            size={32}
                            style={{ color: iconColor }}
                        />
                    </div>

                    {/* Title */}
                    <h3
                        style={{
                            margin: '0 0 1rem 0',
                            fontSize: '1.25rem',
                            fontWeight: 600,
                            color: '#111827'
                        }}
                    >
                        {title}
                    </h3>

                    {/* Message */}
                    <p
                        style={{
                            margin: '0 0 2rem 0',
                            color: '#6b7280',
                            fontSize: '1rem',
                            lineHeight: '1.5'
                        }}
                    >
                        {message}
                    </p>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <AdminButton
                            variant="secondary"
                            onClick={handleCancel}
                            disabled={isLoading}
                        >
                            {cancelLabel}
                        </AdminButton>
                        <AdminButton
                            variant={confirmVariant}
                            onClick={handleConfirm}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Đang xử lý...' : confirmLabel}
                        </AdminButton>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideIn {
                    from { 
                        opacity: 0;
                        transform: translateY(-20px) scale(0.95);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
            `}</style>
        </div>
    );
};

export default AdminConfirmDialog;
