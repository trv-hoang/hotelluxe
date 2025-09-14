import React, { useState } from 'react';
import type { Room, RoomStatus } from '@/types/hotel';
import AdminButton from './AdminButton';
import AdminInput from './AdminInput';

interface RoomTableProps {
    rooms: Room[];
    onEdit: (room: Room) => void;
    onDelete: (roomId: number) => void;
    onStatusChange: (roomId: number, status: RoomStatus) => void;
    onBulkAction: (roomIds: number[], action: string) => void;
    loading?: boolean;
}

const RoomTable: React.FC<RoomTableProps> = ({
    rooms,
    onEdit,
    onDelete,
    onStatusChange,
    onBulkAction,
    loading = false
}) => {
    const [selectedRooms, setSelectedRooms] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<RoomStatus | ''>('');
    const [floorFilter, setFloorFilter] = useState<number | ''>('');

    const getStatusBadge = (status: RoomStatus) => {
        const statusConfig = {
            available: { color: '#10b981', bg: '#dcfce7', text: 'Available' },
            occupied: { color: '#ef4444', bg: '#fee2e2', text: 'Occupied' },
            maintenance: { color: '#f59e0b', bg: '#fef3c7', text: 'Maintenance' },
            out_of_order: { color: '#6b7280', bg: '#f3f4f6', text: 'Out of Order' },
            cleaning: { color: '#3b82f6', bg: '#dbeafe', text: 'Cleaning' },
            reserved: { color: '#8b5cf6', bg: '#f3e8ff', text: 'Reserved' }
        };
        
        const config = statusConfig[status] || statusConfig.available;
        
        return (
            <span style={{
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500',
                color: config.color,
                backgroundColor: config.bg
            }}>
                {config.text}
            </span>
        );
    };

    const filteredRooms = rooms.filter(room => {
        const matchesSearch = searchTerm === '' || 
            room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            room.roomType.name.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === '' || room.status === statusFilter;
        const matchesFloor = floorFilter === '' || room.floor === floorFilter;
        
        return matchesSearch && matchesStatus && matchesFloor;
    });

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '200px',
                color: 'var(--admin-text-secondary)'
            }}>
                Loading rooms...
            </div>
        );
    }

    return (
        <div>
            {/* Filters */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '20px',
                padding: '20px',
                background: 'var(--admin-bg-secondary)',
                borderRadius: '8px'
            }}>
                <AdminInput
                    label="Search Rooms"
                    placeholder="Room number or type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                
                <div>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: 'var(--admin-text-primary)'
                    }}>
                        Status Filter
                    </label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as RoomStatus | '')}
                        style={{
                            width: '100%',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1px solid var(--admin-border)',
                            background: 'var(--admin-bg-primary)',
                            color: 'var(--admin-text-primary)',
                            fontSize: '14px'
                        }}
                    >
                        <option value="">All Status</option>
                        <option value="available">Available</option>
                        <option value="occupied">Occupied</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="out_of_order">Out of Order</option>
                        <option value="cleaning">Cleaning</option>
                        <option value="reserved">Reserved</option>
                    </select>
                </div>

                <div>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: 'var(--admin-text-primary)'
                    }}>
                        Floor Filter
                    </label>
                    <select
                        value={floorFilter}
                        onChange={(e) => setFloorFilter(e.target.value ? parseInt(e.target.value) : '')}
                        style={{
                            width: '100%',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1px solid var(--admin-border)',
                            background: 'var(--admin-bg-primary)',
                            color: 'var(--admin-text-primary)',
                            fontSize: '14px'
                        }}
                    >
                        <option value="">All Floors</option>
                        {Array.from(new Set(rooms.map(room => room.floor))).sort().map(floor => (
                            <option key={floor} value={floor}>Floor {floor}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Bulk Actions */}
            {selectedRooms.length > 0 && (
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginBottom: '20px',
                    padding: '16px',
                    background: 'var(--admin-bg-tertiary)',
                    borderRadius: '8px',
                    alignItems: 'center'
                }}>
                    <span style={{ 
                        fontSize: '14px', 
                        color: 'var(--admin-text-secondary)' 
                    }}>
                        {selectedRooms.length} room(s) selected
                    </span>
                    
                    <AdminButton
                        onClick={() => onBulkAction(selectedRooms, 'maintenance')}
                        style={{
                            background: '#f59e0b',
                            color: '#fff',
                            boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)',
                            borderRadius: '6px',
                            fontWeight: '600',
                            padding: '8px 16px',
                            fontSize: '12px',
                            transition: 'all 0.3s ease'
                        }}
                        className="hover:bg-yellow-600 hover:shadow-lg hover:-translate-y-0.5 transform transition-all duration-300"
                    >
                        Set Maintenance
                    </AdminButton>
                    
                    <AdminButton
                        onClick={() => onBulkAction(selectedRooms, 'available')}
                        style={{
                            background: '#22c55e',
                            color: '#fff',
                            boxShadow: '0 2px 8px rgba(34, 197, 94, 0.3)',
                            borderRadius: '6px',
                            fontWeight: '600',
                            padding: '8px 16px',
                            fontSize: '12px',
                            transition: 'all 0.3s ease'
                        }}
                        className="hover:bg-green-600 hover:shadow-lg hover:-translate-y-0.5 transform transition-all duration-300"
                    >
                        Set Available
                    </AdminButton>
                    
                    <AdminButton
                        onClick={() => onBulkAction(selectedRooms, 'delete')}
                        style={{
                            background: '#ef4444',
                            color: '#fff',
                            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
                            borderRadius: '6px',
                            fontWeight: '600',
                            padding: '8px 16px',
                            fontSize: '12px',
                            transition: 'all 0.3s ease'
                        }}
                        className="hover:bg-red-600 hover:shadow-lg hover:-translate-y-0.5 transform transition-all duration-300"
                    >
                        Delete Selected
                    </AdminButton>
                </div>
            )}

            {/* Custom Table */}
            <div style={{
                background: 'var(--admin-bg-primary)',
                borderRadius: '8px',
                border: '1px solid var(--admin-border)',
                overflow: 'hidden'
            }}>
                {/* Table Header */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '50px 100px 150px 80px 120px 100px 120px 250px',
                    gap: '12px',
                    padding: '16px',
                    background: 'var(--admin-bg-secondary)',
                    borderBottom: '1px solid var(--admin-border)',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'var(--admin-text-primary)'
                }}>
                    <div>
                        <input
                            type="checkbox"
                            checked={selectedRooms.length === filteredRooms.length && filteredRooms.length > 0}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setSelectedRooms(filteredRooms.map(room => room.id));
                                } else {
                                    setSelectedRooms([]);
                                }
                            }}
                        />
                    </div>
                    <div>Room</div>
                    <div>Type</div>
                    <div>Floor</div>
                    <div>Status</div>
                    <div>Capacity</div>
                    <div>Price/Night</div>
                    <div>Actions</div>
                </div>

                {/* Table Body */}
                {filteredRooms.length === 0 ? (
                    <div style={{
                        padding: '40px',
                        textAlign: 'center',
                        color: 'var(--admin-text-secondary)'
                    }}>
                        No rooms found
                    </div>
                ) : (
                    filteredRooms.map((room) => (
                        <div
                            key={room.id}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '50px 100px 150px 80px 120px 100px 120px 250px',
                                gap: '12px',
                                padding: '16px',
                                borderBottom: '1px solid var(--admin-border)',
                                fontSize: '14px',
                                alignItems: 'center'
                            }}
                        >
                            <div>
                                <input
                                    type="checkbox"
                                    checked={selectedRooms.includes(room.id)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedRooms([...selectedRooms, room.id]);
                                        } else {
                                            setSelectedRooms(selectedRooms.filter(id => id !== room.id));
                                        }
                                    }}
                                />
                            </div>
                            <div style={{ fontWeight: '600', color: 'var(--admin-text-primary)' }}>
                                {room.number}
                            </div>
                            <div>{room.roomType.name}</div>
                            <div>{room.floor}</div>
                            <div>{getStatusBadge(room.status)}</div>
                            <div>{room.roomType.maxGuests} guests</div>
                            <div>{room.roomType.basePrice} VND</div>
                            <div style={{ display: 'flex', gap: '6px' }}>
                                <button
                                    onClick={() => onEdit(room)}
                                    style={{
                                        padding: '6px 12px',
                                        borderRadius: '6px',
                                        border: 'none',
                                        background: '#f59e0b',
                                        color: '#fff',
                                        fontSize: '11px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 2px 4px rgba(245, 158, 11, 0.3)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = '#d97706';
                                        e.currentTarget.style.transform = 'translateY(-1px)';
                                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(245, 158, 11, 0.4)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = '#f59e0b';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(245, 158, 11, 0.3)';
                                    }}
                                >
                                    Edit
                                </button>
                                <select
                                    value={room.status}
                                    onChange={(e) => onStatusChange(room.id, e.target.value as RoomStatus)}
                                    style={{
                                        padding: '6px 8px',
                                        borderRadius: '6px',
                                        border: 'none',
                                        background: (() => {
                                            const statusColors = {
                                                available: '#10b981',
                                                occupied: '#ef4444',
                                                maintenance: '#f59e0b',
                                                out_of_order: '#6b7280',
                                                cleaning: '#3b82f6',
                                                reserved: '#8b5cf6'
                                            };
                                            return statusColors[room.status] || '#6b7280';
                                        })(),
                                        color: '#fff',
                                        fontSize: '11px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        boxShadow: `0 2px 4px ${(() => {
                                            const statusColors = {
                                                available: '#10b981',
                                                occupied: '#ef4444',
                                                maintenance: '#f59e0b',
                                                out_of_order: '#6b7280',
                                                cleaning: '#3b82f6',
                                                reserved: '#8b5cf6'
                                            };
                                            return statusColors[room.status] || '#6b7280';
                                        })()}40`,
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <option value="available">Available</option>
                                    <option value="occupied">Occupied</option>
                                    <option value="maintenance">Maintenance</option>
                                    <option value="out_of_order">Out of Order</option>
                                    <option value="cleaning">Cleaning</option>
                                    <option value="reserved">Reserved</option>
                                </select>
                                <button
                                    onClick={() => onDelete(room.id)}
                                    style={{
                                        padding: '6px 12px',
                                        borderRadius: '6px',
                                        border: 'none',
                                        background: '#ef4444',
                                        color: '#fff',
                                        fontSize: '11px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = '#dc2626';
                                        e.currentTarget.style.transform = 'translateY(-1px)';
                                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(239, 68, 68, 0.4)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = '#ef4444';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(239, 68, 68, 0.3)';
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Summary */}
            <div style={{
                marginTop: '20px',
                padding: '16px',
                background: 'var(--admin-bg-secondary)',
                borderRadius: '8px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '16px',
                fontSize: '14px'
            }}>
                <div>
                    <strong>Total Rooms:</strong> {filteredRooms.length}
                </div>
                <div>
                    <strong>Available:</strong> {filteredRooms.filter(r => r.status === 'available').length}
                </div>
                <div>
                    <strong>Occupied:</strong> {filteredRooms.filter(r => r.status === 'occupied').length}
                </div>
                <div>
                    <strong>Maintenance:</strong> {filteredRooms.filter(r => r.status === 'maintenance').length}
                </div>
            </div>
        </div>
    );
};

export default RoomTable;
