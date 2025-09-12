import React from 'react';
import type { Room, RoomStatus } from '@/types/hotel';

interface RoomCardProps {
    room: Room;
    onEdit: (room: Room) => void;
    onViewDetails: (room: Room) => void;
    onStatusChange: (roomId: number, status: RoomStatus) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ 
    room, 
    onEdit, 
    onViewDetails, 
    onStatusChange 
}) => {
    const getStatusColor = (status: RoomStatus) => {
        const colors = {
            available: '#10b981',
            occupied: '#ef4444',
            maintenance: '#f59e0b',
            out_of_order: '#6b7280',
            cleaning: '#3b82f6',
            reserved: '#8b5cf6'
        };
        return colors[status] || '#6b7280';
    };

    const getStatusIcon = (status: RoomStatus) => {
        const icons = {
            available: '✅',
            occupied: '🏠',
            maintenance: '🔧',
            out_of_order: '❌',
            cleaning: '🧹',
            reserved: '📅'
        };
        return icons[status] || '❓';
    };

    return (
        <div className="admin-card" style={{
            position: 'relative',
            padding: '20px',
            borderRadius: '12px',
            background: 'var(--admin-bg-primary)',
            border: '1px solid var(--admin-border-primary)',
            boxShadow: '0 2px 8px var(--admin-shadow)',
            transition: 'all 0.2s ease',
            cursor: 'pointer'
        }}
        onClick={() => onViewDetails(room)}
        onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px var(--admin-shadow-lg)';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px var(--admin-shadow)';
        }}>
            {/* Status Badge */}
            <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                borderRadius: '20px',
                backgroundColor: getStatusColor(room.status),
                color: 'white',
                fontSize: '12px',
                fontWeight: '600'
            }}>
                <span>{getStatusIcon(room.status)}</span>
                {room.status.replace('_', ' ').toUpperCase()}
            </div>

            {/* Room Number */}
            <div style={{
                fontSize: '24px',
                fontWeight: '700',
                color: 'var(--admin-text-primary)',
                marginBottom: '8px'
            }}>
                Room {room.number}
            </div>

            {/* Room Type */}
            <div style={{
                fontSize: '16px',
                color: 'var(--admin-text-secondary)',
                marginBottom: '12px'
            }}>
                {room.roomType.name}
            </div>

            {/* Room Details */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                fontSize: '14px',
                color: 'var(--admin-text-secondary)',
                marginBottom: '16px'
            }}>
                <div>Floor: {room.floor}</div>
                <div>Max: {room.roomType.maxGuests} guests</div>
                <div>Size: {room.roomType.size}m²</div>
                <div>${room.roomType.basePrice}/night</div>
            </div>

            {/* Actions */}
            <div style={{
                display: 'flex',
                gap: '8px',
                marginTop: '16px'
            }}>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(room);
                    }}
                    style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid var(--admin-border)',
                        background: 'transparent',
                        color: 'var(--admin-text-primary)',
                        fontSize: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--admin-bg-secondary)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                    }}
                >
                    Edit
                </button>
                
                <select
                    value={room.status}
                    onChange={(e) => {
                        e.stopPropagation();
                        onStatusChange(room.id, e.target.value as RoomStatus);
                    }}
                    style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid var(--admin-border)',
                        background: 'var(--admin-bg-primary)',
                        color: 'var(--admin-text-primary)',
                        fontSize: '12px',
                        cursor: 'pointer'
                    }}
                >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="out_of_order">Out of Order</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="reserved">Reserved</option>
                </select>
            </div>

            {/* Notes */}
            {room.notes && (
                <div style={{
                    marginTop: '12px',
                    padding: '8px',
                    borderRadius: '4px',
                    background: 'var(--admin-bg-secondary)',
                    fontSize: '12px',
                    color: 'var(--admin-text-secondary)',
                    fontStyle: 'italic'
                }}>
                    Note: {room.notes}
                </div>
            )}
        </div>
    );
};

export default RoomCard;
