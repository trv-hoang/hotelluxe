import React from 'react';

interface ChartData {
    label: string;
    value: number;
    color: string;
}

interface AdminBarChartProps {
    title: string;
    data: ChartData[];
    height?: number;
}

const AdminBarChart: React.FC<AdminBarChartProps> = ({ title, data, height = 200 }) => {
    const maxValue = Math.max(...data.map(d => d.value));

    return (
        <div className="admin-card" style={{
            padding: '1.5rem',
            borderRadius: '8px'
        }}>
            <h3 style={{
                margin: '0 0 1rem 0',
                color: 'var(--admin-text-primary)',
                fontSize: '16px',
                fontWeight: '600'
            }}>
                {title}
            </h3>
            
            <div style={{
                display: 'flex',
                alignItems: 'end',
                gap: '12px',
                height: `${height}px`,
                padding: '10px 0'
            }}>
                {data.map((item, index) => (
                    <div key={index} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        flex: 1,
                        height: '100%'
                    }}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'end',
                            height: '100%',
                            width: '100%',
                            position: 'relative'
                        }}>
                            <div
                                style={{
                                    backgroundColor: item.color,
                                    height: `${(item.value / maxValue) * 100}%`,
                                    minHeight: '4px',
                                    borderRadius: '4px 4px 0 0',
                                    transition: 'all 0.3s ease',
                                    position: 'relative'
                                }}
                                title={`${item.label}: ${item.value}`}
                            >
                                <div style={{
                                    position: 'absolute',
                                    top: '-20px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    color: 'var(--admin-text-primary)',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {item.value}
                                </div>
                            </div>
                        </div>
                        
                        <div style={{
                            marginTop: '8px',
                            fontSize: '12px',
                            color: 'var(--admin-text-secondary)',
                            textAlign: 'center',
                            fontWeight: '500'
                        }}>
                            {item.label}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

interface AdminLineChartProps {
    title: string;
    data: ChartData[];
    height?: number;
}

const AdminLineChart: React.FC<AdminLineChartProps> = ({ title, data, height = 200 }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    const points = data.map((item, index) => {
        const x = (index / (data.length - 1)) * 100;
        const y = 100 - (item.value / maxValue) * 80;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="admin-card" style={{
            padding: '1.5rem',
            borderRadius: '8px'
        }}>
            <h3 style={{
                margin: '0 0 1rem 0',
                color: 'var(--admin-text-primary)',
                fontSize: '16px',
                fontWeight: '600'
            }}>
                {title}
            </h3>
            
            <div style={{ position: 'relative' }}>
                <svg width="100%" height={height} style={{ display: 'block' }}>
                    {/* Grid lines */}
                    {[0, 25, 50, 75, 100].map(y => (
                        <line
                            key={y}
                            x1="0"
                            y1={`${y}%`}
                            x2="100%"
                            y2={`${y}%`}
                            stroke="var(--admin-border-primary)"
                            strokeWidth="1"
                            opacity="0.3"
                        />
                    ))}
                    
                    {/* Line */}
                    <polyline
                        points={points}
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    
                    {/* Points */}
                    {data.map((item, index) => {
                        const x = (index / (data.length - 1)) * 100;
                        const y = 100 - (item.value / maxValue) * 80;
                        return (
                            <circle
                                key={index}
                                cx={`${x}%`}
                                cy={`${y}%`}
                                r="4"
                                fill="#3b82f6"
                                stroke="var(--admin-bg-primary)"
                                strokeWidth="2"
                            />
                        );
                    })}
                </svg>
                
                {/* Labels */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '8px'
                }}>
                    {data.map((item, index) => (
                        <div key={index} style={{
                            fontSize: '12px',
                            color: 'var(--admin-text-secondary)',
                            textAlign: 'center'
                        }}>
                            {item.label}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export { AdminBarChart, AdminLineChart };
