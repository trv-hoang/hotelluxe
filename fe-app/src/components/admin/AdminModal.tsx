import React from 'react';

interface AdminModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: 'small' | 'medium' | 'large';
}

const AdminModal: React.FC<AdminModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'medium'
}) => {
    if (!isOpen) return null;

    const getModalSize = () => {
        switch (size) {
            case 'small':
                return { maxWidth: '400px', width: '90%' };
            case 'medium':
                return { maxWidth: '600px', width: '90%' };
            case 'large':
                return { maxWidth: '800px', width: '95%' };
            default:
                return { maxWidth: '600px', width: '90%' };
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
            onClick={onClose}
        >
            <div
                style={{
                    background: '#fff',
                    borderRadius: '8px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                    ...getModalSize(),
                    maxHeight: '90vh',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    animation: 'slideIn 0.3s ease-out'
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div style={{
                    padding: '1.5rem',
                    borderBottom: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <h2 style={{
                        margin: 0,
                        fontSize: '1.5rem',
                        fontWeight: 600,
                        color: '#111827'
                    }}>
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            padding: '0.5rem',
                            borderRadius: '4px',
                            color: '#6b7280',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.backgroundColor = '#f3f4f6';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                    >
                        ×
                    </button>
                </div>

                {/* Body */}
                <div style={{
                    padding: '1.5rem',
                    overflowY: 'auto',
                    flex: 1
                }}>
                    {children}
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

export default AdminModal;
