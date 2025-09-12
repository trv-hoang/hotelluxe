import React, { useState, useEffect } from 'react';
import type { Room, RoomStatus } from '@/types/hotel';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminButton from '@/components/admin/AdminButton';
import AdminCard from '@/components/admin/AdminCard';
import RoomCard from '@/components/admin/RoomCard';
import RoomTable from '@/components/admin/RoomTable';
import { useNotifications } from '@/hooks/useNotifications';

// Mock data - replace with real API calls
const mockRooms: Room[] = [
    {
        id: 1,
        number: '101',
        floor: 1,
        roomType: {
            id: 1,
            name: 'Deluxe Room',
            description: 'Comfortable room with city view',
            basePrice: 150,
            maxGuests: 2,
            bedConfiguration: [{ type: 'queen', quantity: 1 }],
            size: 25,
            amenities: [],
            images: [],
            isActive: true
        },
        status: 'available',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 2,
        number: '102',
        floor: 1,
        roomType: {
            id: 2,
            name: 'Suite',
            description: 'Luxury suite with ocean view',
            basePrice: 300,
            maxGuests: 4,
            bedConfiguration: [{ type: 'king', quantity: 1 }, { type: 'sofa_bed', quantity: 1 }],
            size: 50,
            amenities: [],
            images: [],
            isActive: true
        },
        status: 'occupied',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 3,
        number: '201',
        floor: 2,
        roomType: {
            id: 1,
            name: 'Deluxe Room',
            description: 'Comfortable room with city view',
            basePrice: 150,
            maxGuests: 2,
            bedConfiguration: [{ type: 'queen', quantity: 1 }],
            size: 25,
            amenities: [],
            images: [],
            isActive: true
        },
        status: 'maintenance',
        notes: 'AC repair scheduled',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

const RoomsPage: React.FC = () => {
    const [rooms, setRooms] = useState<Room[]>(mockRooms);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const { addNotification } = useNotifications();

    // Load rooms data - optimized for faster loading
    useEffect(() => {
        // TODO: Replace with real API call
        setLoading(true);
        setTimeout(() => {
            setRooms(mockRooms);
            setLoading(false);
        }, 200); // Reduced from 1000 to 200ms
    }, []);

    const handleEditRoom = (room: Room) => {
        // TODO: Open edit modal or navigate to edit page
        addNotification({
            type: 'info',
            title: 'Edit Room',
            message: `Edit room ${room.number} functionality will be implemented`
        });
    };

    const handleDeleteRoom = (roomId: number) => {
        if (window.confirm('Are you sure you want to delete this room?')) {
            setRooms(prev => prev.filter(room => room.id !== roomId));
            addNotification({
                type: 'success',
                title: 'Room Deleted',
                message: 'Room has been deleted successfully'
            });
        }
    };

    const handleStatusChange = (roomId: number, status: RoomStatus) => {
        setRooms(prev => 
            prev.map(room => 
                room.id === roomId ? { ...room, status } : room
            )
        );
        addNotification({
            type: 'success',
            title: 'Status Updated',
            message: `Room status changed to ${status}`
        });
    };

    const handleBulkAction = (roomIds: number[], action: string) => {
        if (action === 'delete') {
            if (window.confirm(`Are you sure you want to delete ${roomIds.length} room(s)?`)) {
                setRooms(prev => prev.filter(room => !roomIds.includes(room.id)));
                addNotification({
                    type: 'success',
                    title: 'Rooms Deleted',
                    message: `${roomIds.length} room(s) deleted successfully`
                });
            }
        } else {
            setRooms(prev => 
                prev.map(room => 
                    roomIds.includes(room.id) 
                        ? { ...room, status: action as RoomStatus }
                        : room
                )
            );
            addNotification({
                type: 'success',
                title: 'Bulk Update',
                message: `${roomIds.length} room(s) status updated to ${action}`
            });
        }
    };

    const handleViewDetails = (room: Room) => {
        // TODO: Open room details modal or navigate to details page
        addNotification({
            type: 'info',
            title: 'Room Details',
            message: `View details for room ${room.number} will be implemented`
        });
    };

    const handleAddRoom = () => {
        // TODO: Open add room modal or navigate to add page
        addNotification({
            type: 'info',
            title: 'Add Room',
            message: 'Add new room functionality will be implemented'
        });
    };

    // Calculate statistics
    const stats = {
        total: rooms.length,
        available: rooms.filter(r => r.status === 'available').length,
        occupied: rooms.filter(r => r.status === 'occupied').length,
        maintenance: rooms.filter(r => r.status === 'maintenance').length,
        occupancyRate: rooms.length > 0 ? Math.round((rooms.filter(r => r.status === 'occupied').length / rooms.length) * 100) : 0
    };

    return (
        <div>
            <AdminPageHeader
                title="Room Management"
                description="Manage hotel rooms, room types, and availability"
            >
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {/* View Mode Toggle */}
                    <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                            onClick={() => setViewMode('grid')}
                            style={{
                                padding: '8px 12px',
                                borderRadius: '6px',
                                border: '1px solid var(--admin-border)',
                                background: viewMode === 'grid' ? 'var(--admin-primary)' : 'transparent',
                                color: viewMode === 'grid' ? 'white' : 'var(--admin-text-primary)',
                                fontSize: '12px',
                                cursor: 'pointer'
                            }}
                        >
                            Grid View
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            style={{
                                padding: '8px 12px',
                                borderRadius: '6px',
                                border: '1px solid var(--admin-border)',
                                background: viewMode === 'table' ? 'var(--admin-primary)' : 'transparent',
                                color: viewMode === 'table' ? 'white' : 'var(--admin-text-primary)',
                                fontSize: '12px',
                                cursor: 'pointer'
                            }}
                        >
                            Table View
                        </button>
                    </div>
                    
                    <AdminButton variant="primary" onClick={handleAddRoom}>
                        Add Room
                    </AdminButton>
                </div>
            </AdminPageHeader>

            {/* Statistics Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                marginBottom: '32px'
            }}>
                <AdminCard
                    title="Total Rooms"
                    value={stats.total.toString()}
                    description="All rooms in hotel"
                    color="#2196f3"
                    icon="🏨"
                />
                <AdminCard
                    title="Available"
                    value={stats.available.toString()}
                    description="Ready for booking"
                    color="#4caf50"
                    icon="✅"
                />
                <AdminCard
                    title="Occupied"
                    value={stats.occupied.toString()}
                    description="Currently in use"
                    color="#ff9800"
                    icon="🏠"
                />
                <AdminCard
                    title="Occupancy Rate"
                    value={`${stats.occupancyRate}%`}
                    description="Current occupancy"
                    color="#9c27b0"
                    icon="📊"
                />
                <AdminCard
                    title="Maintenance"
                    value={stats.maintenance.toString()}
                    description="Under maintenance"
                    color="#f44336"
                    icon="🔧"
                />
            </div>

            {/* Room List */}
            {loading ? (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '200px',
                    color: 'var(--admin-text-secondary)'
                }}>
                    Loading rooms...
                </div>
            ) : viewMode === 'grid' ? (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '20px'
                }}>
                    {rooms.map(room => (
                        <RoomCard
                            key={room.id}
                            room={room}
                            onEdit={handleEditRoom}
                            onViewDetails={handleViewDetails}
                            onStatusChange={handleStatusChange}
                        />
                    ))}
                </div>
            ) : (
                <RoomTable
                    rooms={rooms}
                    onEdit={handleEditRoom}
                    onDelete={handleDeleteRoom}
                    onStatusChange={handleStatusChange}
                    onBulkAction={handleBulkAction}
                    loading={loading}
                />
            )}

            {rooms.length === 0 && !loading && (
                <div style={{
                    textAlign: 'center',
                    padding: '60px 20px',
                    color: 'var(--admin-text-secondary)'
                }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏨</div>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>No Rooms Found</h3>
                    <p style={{ margin: '0 0 20px 0' }}>Start by adding your first room</p>
                    <AdminButton variant="primary" onClick={handleAddRoom}>
                        Add Your First Room
                    </AdminButton>
                </div>
            )}
        </div>
    );
};

export default RoomsPage;
