import React from 'react';
import AdminButton from './AdminButton';
import type { LucideIcon } from 'lucide-react';

interface AdminPageHeaderProps {
    title: string;
    description?: string;
    actionButton?: {
        label: string;
        onClick: () => void;
        icon?: LucideIcon;
        className?: string;
    };
    extraContent?: React.ReactNode;
}

const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({
    title,
    description,
    actionButton,
    extraContent
}) => {
    return (
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    {title}
                </h1>
                {description && (
                    <p className="text-gray-600 mt-1">
                        {description}
                    </p>
                )}
            </div>
            <div className="flex items-center space-x-4">
                {extraContent}
                {actionButton && (
                    <AdminButton 
                        onClick={actionButton.onClick} 
                        className={actionButton.className || "bg-blue-600 hover:bg-blue-700"}
                    >
                        {actionButton.icon && <actionButton.icon className="w-4 h-4 mr-2" />}
                        {actionButton.label}
                    </AdminButton>
                )}
            </div>
        </div>
    );
};

export default AdminPageHeader;
