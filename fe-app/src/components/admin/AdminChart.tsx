import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface ChartDataItem {
    label: string;
    value: number;
}

interface AdminChartProps {
    title: string;
    data: ChartDataItem[];
    icon: LucideIcon;
    iconColor: string;
    barColor: string;
    barHoverColor: string;
    height?: string;
    unit?: string;
}

const AdminChart: React.FC<AdminChartProps> = ({
    title,
    data,
    icon: Icon,
    iconColor,
    barColor,
    barHoverColor,
    height = 'h-48',
    unit = ''
}) => {
    const maxValue = Math.max(...data.map(d => d.value));

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
            <div className={`flex items-end justify-between ${height}`}>
                {data.map((item, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                        <div
                            className={`${barColor} rounded-t-md w-8 transition-all duration-300 hover:${barHoverColor}`}
                            style={{
                                height: `${(item.value / maxValue) * 100}%`,
                                minHeight: '20px'
                            }}
                            title={`${item.value}${unit}`}
                        />
                        <span className="text-sm text-gray-600 mt-2">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminChart;
