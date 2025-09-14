import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface TabItem {
    id: string;
    name: string;
    icon?: LucideIcon;
    disabled?: boolean;
    badge?: string | number;
}

interface AdminTabsProps {
    tabs: TabItem[];
    activeTab: string;
    onChange: (tabId: string) => void;
    variant?: 'default' | 'pills' | 'underline';
    size?: 'small' | 'medium' | 'large';
    className?: string;
    style?: React.CSSProperties;
}

const AdminTabs: React.FC<AdminTabsProps> = ({
    tabs,
    activeTab,
    onChange,
    variant = 'underline',
    size = 'medium',
    className = '',
    style = {}
}) => {
    const getSizeStyles = () => {
        switch (size) {
            case 'small':
                return {
                    fontSize: '0.875rem',
                    padding: '0.5rem 1rem'
                };
            case 'large':
                return {
                    fontSize: '1rem',
                    padding: '1rem 1.5rem'
                };
            case 'medium':
            default:
                return {
                    fontSize: '0.875rem',
                    padding: '0.75rem 1rem'
                };
        }
    };

    const getVariantStyles = (tab: TabItem, isActive: boolean) => {
        const baseStyles = {
            display: 'flex',
            alignItems: 'center',
            fontWeight: isActive ? '600' : '500',
            transition: 'all 0.2s ease',
            cursor: tab.disabled ? 'not-allowed' : 'pointer',
            opacity: tab.disabled ? 0.5 : 1,
            textDecoration: 'none',
            border: 'none',
            background: 'none',
            ...getSizeStyles()
        };

        switch (variant) {
            case 'pills':
                return {
                    ...baseStyles,
                    borderRadius: '9999px',
                    backgroundColor: isActive ? 'var(--admin-sidebar-active)' : 'transparent',
                    color: isActive ? '#ffffff' : 'var(--admin-text-secondary)',
                    ':hover': {
                        backgroundColor: isActive ? 'var(--admin-sidebar-active)' : 'var(--admin-bg-hover)'
                    }
                };

            case 'default':
                return {
                    ...baseStyles,
                    borderRadius: '0.375rem',
                    border: '1px solid',
                    borderColor: isActive ? 'var(--admin-sidebar-active)' : 'var(--admin-border-secondary)',
                    backgroundColor: isActive ? 'var(--admin-sidebar-active)' : 'transparent',
                    color: isActive ? '#ffffff' : 'var(--admin-text-secondary)'
                };

            case 'underline':
            default:
                return {
                    ...baseStyles,
                    borderBottom: '2px solid',
                    borderBottomColor: isActive ? 'var(--admin-sidebar-active)' : 'transparent',
                    color: isActive ? 'var(--admin-sidebar-active)' : 'var(--admin-text-secondary)',
                    borderRadius: '0'
                };
        }
    };

    const getContainerStyles = () => {
        switch (variant) {
            case 'pills':
            case 'default':
                return {
                    display: 'flex',
                    gap: '0.5rem',
                    padding: '0.25rem',
                    backgroundColor: 'var(--admin-bg-secondary)',
                    borderRadius: '0.5rem'
                };
            case 'underline':
            default:
                return {
                    display: 'flex',
                    borderBottom: '1px solid var(--admin-border-primary)'
                };
        }
    };

    const handleTabClick = (tab: TabItem) => {
        if (!tab.disabled) {
            onChange(tab.id);
        }
    };

    return (
        <div className={className} style={{ ...getContainerStyles(), ...style }}>
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const tabStyles = getVariantStyles(tab, isActive);
                
                return (
                    <button
                        key={tab.id}
                        onClick={() => handleTabClick(tab)}
                        style={tabStyles}
                        disabled={tab.disabled}
                        className="admin-tab-button"
                        onMouseEnter={e => {
                            if (!tab.disabled && !isActive) {
                                e.currentTarget.style.color = 'var(--admin-text-primary)';
                                if (variant === 'underline') {
                                    e.currentTarget.style.borderBottomColor = 'var(--admin-border-secondary)';
                                } else {
                                    e.currentTarget.style.backgroundColor = 'var(--admin-bg-hover)';
                                }
                            }
                        }}
                        onMouseLeave={e => {
                            if (!tab.disabled && !isActive) {
                                e.currentTarget.style.color = 'var(--admin-text-secondary)';
                                if (variant === 'underline') {
                                    e.currentTarget.style.borderBottomColor = 'transparent';
                                } else {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }
                            }
                        }}
                    >
                        {tab.icon && (
                            <tab.icon 
                                size={16} 
                                style={{ marginRight: '0.5rem' }} 
                            />
                        )}
                        
                        <span>{tab.name}</span>
                        
                        {tab.badge && (
                            <span
                                style={{
                                    marginLeft: '0.5rem',
                                    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : 'var(--admin-sidebar-active)',
                                    color: isActive ? '#ffffff' : '#ffffff',
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    padding: '0.125rem 0.375rem',
                                    borderRadius: '9999px',
                                    minWidth: '1.25rem',
                                    height: '1.25rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                {tab.badge}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default AdminTabs;
