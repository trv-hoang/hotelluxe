import React from 'react';

interface AdminLoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
}

const AdminLoadingSpinner: React.FC<AdminLoadingSpinnerProps> = ({ 
    size = 'md', 
    text = 'Loading...' 
}) => {
    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return 'h-6 w-6';
            case 'lg':
                return 'h-16 w-16';
            default:
                return 'h-12 w-12';
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-96">
            <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${getSizeClasses()}`}></div>
            {text && (
                <p className="text-gray-600 mt-4 text-sm">
                    {text}
                </p>
            )}
        </div>
    );
};

export default AdminLoadingSpinner;
