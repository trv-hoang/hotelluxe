import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface AdminStatCardProps {
    title: string;
    value: string | number;
    change?: string;
    changeType?: 'increase' | 'decrease' | 'neutral';
    icon: LucideIcon;
    iconColor: string;
    iconBgColor: string;
}

const AdminStatCard: React.FC<AdminStatCardProps> = ({
    title,
    value,
    change,
    changeType = 'increase',
    icon: Icon,
    iconColor,
    iconBgColor
}) => {
    const getChangeColor = () => {
        switch (changeType) {
            case 'increase':
                return 'text-green-600';
            case 'decrease':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">
                        {value}
                    </p>
                    {change && (
                        <p className={`text-xs mt-1 ${getChangeColor()}`}>
                            {change}
                        </p>
                    )}
                </div>
                <div className={`${iconBgColor} p-3 rounded-lg`}>
                    <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>
            </div>
        </div>
    );
};

export default AdminStatCard;
