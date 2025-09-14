import React, { useState, useEffect } from 'react';
import type { Room, RoomStatus } from '@/types/hotel';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminButton from '@/components/admin/AdminButton';
import AdminCard from '@/components/admin/AdminCard';
import RoomCard from '@/components/admin/RoomCard';
import RoomTable from '@/components/admin/RoomTable';
import { useNotifications } from '@/hooks/useNotifications';
import { generateRoomNumber } from '../../utils/calculatorPrice';

import homeStayData from '../../data/jsons/__homeStay.json';

// Generate mock rooms từ JSON data
const generateMockRooms = () => {
    return homeStayData.flatMap((hotel, hotelIdx) => {
        // Mỗi khách sạn có 3-8 phòng
        const roomCount = 3 + (hotelIdx % 6);
        return Array.from({ length: roomCount }, (_, roomIdx) => ({
            id: hotelIdx * 100 + roomIdx + 1,
            number: generateRoomNumber((hotel as { id: number }).id, roomIdx),
            floor: Math.floor(roomIdx / 4) + 1,
            roomType: {
                id: (hotel as { id: number }).id,
                name: (hotel as { title?: string }).title || '',
                description: (hotel as { description?: string }).description || '',
                basePrice: (() => {
                    const hotelPrice = (hotel as unknown as { price?: string | number }).price;
                    const priceStr = typeof hotelPrice === 'string' ? hotelPrice : String(hotelPrice || 0);
                    return Number(priceStr.replace(/[^\d]/g, ''));
                })(),
                maxGuests: (hotel as { maxGuests?: number }).maxGuests ?? 2,
                bedConfiguration: [{ type: 'king' as const, quantity: (hotel as { bedrooms?: number }).bedrooms ?? 1 }] as { type: 'king' | 'queen' | 'single' | 'double' | 'sofa_bed'; quantity: number; }[],
                size: 25,
                amenities: [],
                images: (() => {
                    const galleryImgs = (hotel as { galleryImgs?: string[] }).galleryImgs;
                    return Array.isArray(galleryImgs) && galleryImgs.length > 0 ? galleryImgs : ['/src/assets/logo.png'];
                })(),
                isActive: true
            },
            status: (hotelIdx + roomIdx) % 3 === 0 ? 'available' as const : 
                    ((hotelIdx + roomIdx) % 3 === 1 ? 'occupied' as const : 'maintenance' as const),
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        }));
    });
};

const RoomsPage: React.FC = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const { addNotification } = useNotifications();

    // Load rooms data với cleanup
    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        
        const timeoutId = setTimeout(() => {
            if (isMounted) {
                const mockRooms = generateMockRooms();
                setRooms(mockRooms);
                setLoading(false);
            }
        }, 200);

        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
        };
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
                    <div className="flex gap-2">
                        <AdminButton
                            onClick={() => setViewMode('grid')}
                            style={{
                                background: viewMode === 'grid' ? '#3b82f6' : 'var(--admin-bg-primary)',
                                color: viewMode === 'grid' ? '#fff' : 'var(--admin-text-primary)',
                                border: '1px solid var(--admin-border)',
                                borderRadius: '8px',
                                padding: '10px 16px',
                                fontSize: '14px',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                boxShadow: viewMode === 'grid' ? '0 4px 12px rgba(59, 130, 246, 0.3)' : '0 2px 4px rgba(0,0,0,0.1)',
                                transition: 'all 0.3s ease'
                            }}
                            className="hover:shadow-lg hover:-translate-y-0.5 transform transition-all duration-300"
                        >
                            Grid View
                        </AdminButton>
                        <AdminButton
                            onClick={() => setViewMode('table')}
                            style={{
                                background: viewMode === 'table' ? '#3b82f6' : 'var(--admin-bg-primary)',
                                color: viewMode === 'table' ? '#fff' : 'var(--admin-text-primary)',
                                border: '1px solid var(--admin-border)',
                                borderRadius: '8px',
                                padding: '10px 16px',
                                fontSize: '14px',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                boxShadow: viewMode === 'table' ? '0 4px 12px rgba(59, 130, 246, 0.3)' : '0 2px 4px rgba(0,0,0,0.1)',
                                transition: 'all 0.3s ease'
                            }}
                            className="hover:shadow-lg hover:-translate-y-0.5 transform transition-all duration-300"
                        >
                            Table View
                        </AdminButton>
                    </div>
                    
                    <AdminButton 
                        onClick={handleAddRoom}
                        style={{
                            background: '#22c55e',
                            color: '#fff',
                            boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
                            borderRadius: '8px',
                            fontWeight: '600',
                            padding: '12px 20px',
                            fontSize: '14px',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                        className="hover:bg-green-600 hover:shadow-lg hover:-translate-y-0.5 transform transition-all duration-300"
                    >
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
                />
                <AdminCard
                    title="Available"
                    value={stats.available.toString()}
                    description="Ready for booking"
                    color="#4caf50"
                />
                <AdminCard
                    title="Occupied"
                    value={stats.occupied.toString()}
                    description="Currently in use"
                    color="#ff9800"
                />
                <AdminCard
                    title="Occupancy Rate"
                    value={`${stats.occupancyRate}%`}
                    description="Current occupancy"
                    color="#9c27b0"
                />
                <AdminCard
                    title="Maintenance"
                    value={stats.maintenance.toString()}
                    description="Under maintenance"
                    color="#f44336"
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
                    <div style={{ fontSize: '48px', marginBottom: '16px', color: 'var(--admin-text-secondary)', opacity: 0.5 }}>🏨</div>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>No Rooms Found</h3>
                    <p style={{ margin: '0 0 20px 0' }}>Start by adding your first room</p>
                    <AdminButton 
                        onClick={handleAddRoom}
                        style={{
                            background: '#22c55e',
                            color: '#fff',
                            boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
                            borderRadius: '8px',
                            fontWeight: '600',
                            padding: '12px 24px',
                            fontSize: '14px',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                        className="hover:bg-green-600 hover:shadow-lg hover:-translate-y-0.5 transform transition-all duration-300"
                    >
                        Add Your First Room
                    </AdminButton>
                </div>
            )}
        </div>
    );
};

export default RoomsPage;
