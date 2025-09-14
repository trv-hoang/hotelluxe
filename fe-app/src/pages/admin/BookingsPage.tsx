import React, { useState, useEffect, useMemo } from 'react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminButton from '@/components/admin/AdminButton';
import AdminCard from '@/components/admin/AdminCard';
import AdminInput from '@/components/admin/AdminInput';
import { useNotifications } from '@/hooks/useNotifications';
import { formatCurrency, formatDate, calculateRoomPrice, generateBookingNumber, generateRoomNumber, calculateNights } from '../../utils/calculatorPrice';

import usersData from '../../data/jsons/__users.json';
import homeStayData from '../../data/jsons/__homeStay.json';

// Types
interface Guest {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
}

interface Room {
    id: number;
    number: string;
    floor: number;
    roomType: {
        id: number;
        name: string;
        description: string;
        basePrice: number;
        maxGuests: number;
    };
}

interface Booking {
    id: number;
    bookingNumber: string;
    userId: number;
    roomId: number;
    room: Room;
    guests: {
        primary: Guest;
        additional: Guest[];
    };
    checkIn: Date;
    checkOut: Date;
    nights: number;
    totalAmount: number;
    status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
    paymentStatus: 'pending' | 'paid' | 'refunded';
    source: 'website' | 'phone' | 'walk_in';
    specialRequests?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Generate mock bookings từ JSON data
const generateMockBookings = (): Booking[] => {
    const statuses: Booking['status'][] = ['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'];
    const paymentStatuses: Booking['paymentStatus'][] = ['pending', 'paid', 'refunded'];
    const sources: Booking['source'][] = ['website', 'phone', 'walk_in'];

    return usersData.slice(0, 15).map((user, idx) => {
        const hotel = homeStayData[idx % homeStayData.length];
        const checkInDate = new Date();
        checkInDate.setDate(checkInDate.getDate() + Math.floor(Math.random() * 30) - 15);
        const checkOutDate = new Date(checkInDate);
        checkOutDate.setDate(checkOutDate.getDate() + Math.floor(Math.random() * 7) + 1);
        const nights = calculateNights(checkInDate, checkOutDate);
        
        const hotelData = hotel as unknown as { price?: string | number; id: number; title?: string; description?: string; maxGuests?: number };
        const priceString = typeof hotelData.price === 'string' ? hotelData.price : String(hotelData.price || 1500000);
        const totalAmount = calculateRoomPrice(priceString, nights);

        return {
            id: idx + 1,
            bookingNumber: generateBookingNumber(idx),
            userId: user.id,
            roomId: hotelData.id,
            room: {
                id: hotelData.id,
                number: generateRoomNumber(hotelData.id, idx),
                floor: Math.floor(hotelData.id / 100) + 1,
                roomType: {
                    id: hotelData.id,
                    name: hotelData.title || 'Standard Room',
                    description: hotelData.description || '',
                    basePrice: Number(priceString.replace(/[^\d]/g, '')),
                    maxGuests: hotelData.maxGuests || 2,
                }
            },
            guests: {
                primary: {
                    firstName: user.name.split(' ')[0] || 'Guest',
                    lastName: user.name.split(' ').slice(1).join(' ') || 'User',
                    email: user.email,
                    phone: user.phone
                },
                additional: []
            },
            checkIn: checkInDate,
            checkOut: checkOutDate,
            nights,
            totalAmount,
            status: statuses[idx % statuses.length],
            paymentStatus: paymentStatuses[idx % paymentStatuses.length],
            source: sources[idx % sources.length],
            createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
            updatedAt: new Date()
        };
    });
};

const BookingsPage: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [paymentFilter, setPaymentFilter] = useState<string>('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
    const [selectedHotel, setSelectedHotel] = useState<string>('');
    const [selectedRoom, setSelectedRoom] = useState<string>('');
    
    const { addNotification } = useNotifications();

    // Load bookings data với cleanup để tránh memory leaks
    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        
        const timeoutId = setTimeout(() => {
            if (isMounted) {
                const mockBookings = generateMockBookings();
                setBookings(mockBookings);
                setLoading(false);
            }
        }, 300);

        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
        };
    }, []);

    // Optimized filter bookings với useMemo
    const filteredBookings = useMemo(() => {
        let filtered = [...bookings];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(booking =>
                booking.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.guests.primary.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.guests.primary.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.guests.primary.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.room.roomType.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(booking => booking.status === statusFilter);
        }

        // Payment filter
        if (paymentFilter !== 'all') {
            filtered = filtered.filter(booking => booking.paymentStatus === paymentFilter);
        }

        return filtered;
    }, [bookings, searchTerm, statusFilter, paymentFilter]);

    // Handlers
    const handleAddBooking = () => {
        // Reset form states
        setSelectedHotel('');
        setSelectedRoom('');
        setShowAddModal(true);
    };

    const handleEditBooking = (booking: Booking) => {
        setSelectedBooking(booking);
        setShowEditModal(true);
    };

    const handleDeleteBooking = (booking: Booking) => {
        setSelectedBooking(booking);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!selectedBooking) return;
        
        try {
            setBookings(prev => prev.filter(b => b.id !== selectedBooking.id));
            addNotification({
                type: 'success',
                title: 'Booking Deleted',
                message: `Booking ${selectedBooking.bookingNumber} has been deleted successfully`
            });
        } catch {
            addNotification({
                type: 'error',
                title: 'Delete Failed',
                message: 'Failed to delete booking'
            });
        } finally {
            setShowDeleteModal(false);
            setSelectedBooking(null);
        }
    };

    const updateBookingStatus = async (bookingId: number, newStatus: Booking['status']) => {
        try {
            setBookings(prev => prev.map(booking =>
                booking.id === bookingId
                    ? { ...booking, status: newStatus, updatedAt: new Date() }
                    : booking
            ));
            
            addNotification({
                type: 'success',
                title: 'Status Updated',
                message: `Booking status updated to ${newStatus}`
            });
        } catch {
            addNotification({
                type: 'error',
                title: 'Update Failed',
                message: 'Failed to update booking status'
            });
        }
    };

    const getStatusColor = (status: Booking['status']): string => {
        switch (status) {
            case 'confirmed': return '#22c55e';
            case 'pending': return '#f59e0b';
            case 'checked_in': return '#3b82f6';
            case 'checked_out': return '#8b5cf6';
            case 'cancelled': return '#ef4444';
            default: return '#6b7280';
        }
    };

    const getPaymentStatusColor = (status: Booking['paymentStatus']): string => {
        switch (status) {
            case 'paid': return '#22c55e';
            case 'pending': return '#f59e0b';
            case 'refunded': return '#3b82f6';
            default: return '#6b7280';
        }
    };

    // Statistics
    const stats = {
        total: bookings.length,
        confirmed: bookings.filter(b => b.status === 'confirmed').length,
        checkedIn: bookings.filter(b => b.status === 'checked_in').length,
        revenue: bookings
            .filter(b => b.paymentStatus === 'paid')
            .reduce((sum, b) => sum + b.totalAmount, 0)
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '400px',
                color: 'var(--admin-text-secondary)'
            }}>
                Loading bookings...
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <AdminPageHeader
                    title="Booking Management"
                    description="Manage hotel bookings, payments, and guest information"
                    breadcrumb="Dashboard / Bookings"
                />
                <div className="flex gap-3">
                    <AdminButton
                        onClick={handleAddBooking}
                        style={{
                            background: '#22c55e',
                            boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
                            borderRadius: '8px',
                            fontWeight: '600',
                            padding: '10px 20px',
                            transition: 'all 0.3s ease',
                        }}
                        className="hover:bg-green-600 hover:shadow-lg hover:-translate-y-0.5 transform transition-all duration-300"
                    >
                        Add New Booking
                    </AdminButton>
                    <AdminButton
                        style={{
                            background: '#3b82f6',
                            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                            borderRadius: '8px',
                            fontWeight: '600',
                            padding: '10px 20px',
                            transition: 'all 0.3s ease',
                        }}
                        className="hover:bg-blue-600 hover:shadow-lg hover:-translate-y-0.5 transform transition-all duration-300"
                        onClick={() => addNotification({
                            type: 'info',
                            title: 'Export Started',
                            message: 'Booking data export will be available soon'
                        })}
                    >
                        Export Data
                    </AdminButton>
                </div>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <AdminCard
                    title="Total Bookings"
                    value={stats.total.toString()}
                    description="All time bookings"
                    color="#3b82f6"
                />
                <AdminCard
                    title="Confirmed"
                    value={stats.confirmed.toString()}
                    description="Confirmed bookings"
                    color="#22c55e"
                />
                <AdminCard
                    title="Checked In"
                    value={stats.checkedIn.toString()}
                    description="Currently checked in"
                    color="#8b5cf6"
                />
                <AdminCard
                    title="Total Revenue"
                    value={formatCurrency(stats.revenue)}
                    description="From paid bookings"
                    color="#f59e0b"
                />
            </div>

            {/* Filters */}
            <div className="mb-6" style={{
                background: 'var(--admin-bg-secondary)',
                border: '1px solid var(--admin-border)',
                borderRadius: '12px',
                padding: '20px'
            }}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <AdminInput
                        type="text"
                        placeholder="Search bookings..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%' }}
                    />
                    
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{
                            background: 'var(--admin-bg-primary)',
                            border: '1px solid var(--admin-border)',
                            borderRadius: '6px',
                            padding: '8px 12px',
                            color: 'var(--admin-text-primary)',
                            fontSize: '14px'
                        }}
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="checked_in">Checked In</option>
                        <option value="checked_out">Checked Out</option>
                        <option value="cancelled">Cancelled</option>
                    </select>

                    <select
                        value={paymentFilter}
                        onChange={(e) => setPaymentFilter(e.target.value)}
                        style={{
                            background: 'var(--admin-bg-primary)',
                            border: '1px solid var(--admin-border)',
                            borderRadius: '6px',
                            padding: '8px 12px',
                            color: 'var(--admin-text-primary)',
                            fontSize: '14px'
                        }}
                    >
                        <option value="all">All Payments</option>
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="refunded">Refunded</option>
                    </select>

                    <div className="flex gap-2">
                        <AdminButton
                            onClick={() => setViewMode('table')}
                            style={{
                                background: viewMode === 'table' ? '#3b82f6' : 'var(--admin-bg-primary)',
                                color: viewMode === 'table' ? '#fff' : 'var(--admin-text-primary)',
                                border: '1px solid var(--admin-border)',
                                borderRadius: '6px',
                                padding: '8px 12px',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            📋 Table
                        </AdminButton>
                        <AdminButton
                            onClick={() => setViewMode('grid')}
                            style={{
                                background: viewMode === 'grid' ? '#3b82f6' : 'var(--admin-bg-primary)',
                                color: viewMode === 'grid' ? '#fff' : 'var(--admin-text-primary)',
                                border: '1px solid var(--admin-border)',
                                borderRadius: '6px',
                                padding: '8px 12px',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            🔲 Grid
                        </AdminButton>
                    </div>
                </div>
            </div>

            {/* Bookings List */}
            {viewMode === 'table' ? (
                <div style={{
                    background: 'var(--admin-bg-secondary)',
                    border: '1px solid var(--admin-border)',
                    borderRadius: '12px',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        overflowX: 'auto'
                    }}>
                        <table style={{
                            width: '100%',
                            borderCollapse: 'separate',
                            borderSpacing: '0 8px'
                        }}>
                            <thead>
                                <tr style={{
                                    background: 'var(--admin-bg-primary)',
                                    borderBottom: '1px solid var(--admin-border)'
                                }}>
                                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: 'var(--admin-text-primary)' }}>Booking</th>
                                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: 'var(--admin-text-primary)' }}>Guest</th>
                                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: 'var(--admin-text-primary)' }}>Room</th>
                                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: 'var(--admin-text-primary)' }}>Dates</th>
                                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: 'var(--admin-text-primary)' }}>Status</th>
                                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: 'var(--admin-text-primary)' }}>Payment</th>
                                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: 'var(--admin-text-primary)' }}>Total</th>
                                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: 'var(--admin-text-primary)' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.map((booking) => (
                                    <tr key={booking.id} style={{
                                        border: '2px solid var(--admin-border)',
                                        backgroundColor: 'var(--admin-bg-secondary)',
                                        borderRadius: '8px',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                    }}>
                                        <td style={{ padding: '12px' }}>
                                            <div>
                                                <div style={{ fontWeight: '600', color: 'var(--admin-text-primary)' }}>
                                                    {booking.bookingNumber}
                                                </div>
                                                <div style={{ fontSize: '12px', color: 'var(--admin-text-secondary)' }}>
                                                    {formatDate(booking.createdAt)}
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            <div>
                                                <div style={{ fontWeight: '500', color: 'var(--admin-text-primary)' }}>
                                                    {booking.guests.primary.firstName} {booking.guests.primary.lastName}
                                                </div>
                                                <div style={{ fontSize: '12px', color: 'var(--admin-text-secondary)' }}>
                                                    {booking.guests.primary.email}
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            <div>
                                                <div style={{ fontWeight: '500', color: 'var(--admin-text-primary)' }}>
                                                    Room {booking.room.number}
                                                </div>
                                                <div style={{ fontSize: '12px', color: 'var(--admin-text-secondary)' }}>
                                                    {booking.room.roomType.name}
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            <div>
                                                <div style={{ fontSize: '13px', color: 'var(--admin-text-primary)' }}>
                                                    {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                                                </div>
                                                <div style={{ fontSize: '12px', color: 'var(--admin-text-secondary)' }}>
                                                    {booking.nights} nights
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            <select
                                                value={booking.status}
                                                onChange={(e) => updateBookingStatus(booking.id, e.target.value as Booking['status'])}
                                                style={{
                                                    background: getStatusColor(booking.status),
                                                    color: '#fff',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    padding: '4px 8px',
                                                    fontSize: '12px',
                                                    fontWeight: '500'
                                                }}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="checked_in">Checked In</option>
                                                <option value="checked_out">Checked Out</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            <span style={{
                                                background: getPaymentStatusColor(booking.paymentStatus),
                                                color: '#fff',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                fontWeight: '500',
                                                textTransform: 'capitalize'
                                            }}>
                                                {booking.paymentStatus}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            <div style={{
                                                fontWeight: '700',
                                                color: '#22c55e',
                                                fontSize: '14px',
                                                background: 'rgba(34, 197, 94, 0.1)',
                                                padding: '6px 10px',
                                                borderRadius: '6px',
                                                border: '1px solid rgba(34, 197, 94, 0.2)',
                                                textAlign: 'center',
                                                minWidth: '120px'
                                            }}>
                                                {formatCurrency(booking.totalAmount)}
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            <div className="flex gap-2">
                                                <AdminButton
                                                    onClick={() => handleEditBooking(booking)}
                                                    style={{
                                                        background: '#f59e0b',
                                                        color: '#fff',
                                                        padding: '4px 8px',
                                                        borderRadius: '4px',
                                                        fontSize: '12px',
                                                        fontWeight: '500'
                                                    }}
                                                    className="hover:bg-yellow-600"
                                                >
                                                    Edit
                                                </AdminButton>
                                                <AdminButton
                                                    onClick={() => handleDeleteBooking(booking)}
                                                    style={{
                                                        background: '#ef4444',
                                                        color: '#fff',
                                                        padding: '4px 8px',
                                                        borderRadius: '4px',
                                                        fontSize: '12px',
                                                        fontWeight: '500'
                                                    }}
                                                    className="hover:bg-red-600"
                                                >
                                                    Delete
                                                </AdminButton>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 380px), 1fr))', 
                    gap: '1.5rem',
                    alignItems: 'stretch'
                }}>
                    {filteredBookings.map((booking) => (
                        <div key={booking.id} style={{
                            background: 'var(--admin-bg-secondary)',
                            border: '2px solid var(--admin-border)',
                            borderRadius: '10px',
                            padding: '16px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%'
                        }}>
                            {/* Header với Booking Number và Status */}
                            <div className="flex justify-between items-start mb-3">
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ 
                                        margin: 0, 
                                        fontSize: '15px', 
                                        fontWeight: '600', 
                                        color: 'var(--admin-text-primary)' 
                                    }}>
                                        {booking.bookingNumber}
                                    </h3>
                                    <p style={{ 
                                        margin: '2px 0 0 0', 
                                        fontSize: '11px', 
                                        color: 'var(--admin-text-secondary)' 
                                    }}>
                                        {formatDate(booking.createdAt)}
                                    </p>
                                </div>
                                <div className="flex gap-1">
                                    <span style={{
                                        background: getStatusColor(booking.status),
                                        color: '#fff',
                                        padding: '3px 6px',
                                        borderRadius: '4px',
                                        fontSize: '10px',
                                        fontWeight: '500',
                                        textTransform: 'capitalize'
                                    }}>
                                        {booking.status}
                                    </span>
                                    <span style={{
                                        background: getPaymentStatusColor(booking.paymentStatus),
                                        color: '#fff',
                                        padding: '3px 6px',
                                        borderRadius: '4px',
                                        fontSize: '10px',
                                        fontWeight: '500',
                                        textTransform: 'capitalize'
                                    }}>
                                        {booking.paymentStatus}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Guest Info */}
                            <div className="mb-3" style={{
                                background: 'var(--admin-bg-primary)',
                                padding: '8px 10px',
                                borderRadius: '6px',
                                border: '1px solid var(--admin-border)'
                            }}>
                                <p style={{ 
                                    margin: '0 0 2px 0', 
                                    fontSize: '13px', 
                                    fontWeight: '600', 
                                    color: 'var(--admin-text-primary)' 
                                }}>
                                    {booking.guests.primary.firstName} {booking.guests.primary.lastName}
                                </p>
                                <p style={{ 
                                    margin: 0, 
                                    fontSize: '11px', 
                                    color: 'var(--admin-text-secondary)' 
                                }}>
                                    {booking.guests.primary.email}
                                </p>
                            </div>
                            
                            {/* Room Info */}
                            <div className="mb-3" style={{
                                background: 'var(--admin-bg-primary)',
                                padding: '8px 10px',
                                borderRadius: '6px',
                                border: '1px solid var(--admin-border)'
                            }}>
                                <p style={{ 
                                    margin: '0 0 2px 0', 
                                    fontSize: '13px', 
                                    fontWeight: '600', 
                                    color: 'var(--admin-text-primary)' 
                                }}>
                                    Room {booking.room.number} - {booking.room.roomType.name}
                                </p>
                                <p style={{ 
                                    margin: '0 0 2px 0', 
                                    fontSize: '11px', 
                                    color: 'var(--admin-text-secondary)' 
                                }}>
                                    {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                                </p>
                                <p style={{ 
                                    margin: 0, 
                                    fontSize: '11px', 
                                    color: 'var(--admin-text-secondary)',
                                    fontWeight: '500'
                                }}>
                                    {booking.nights} nights
                                </p>
                            </div>
                            
                            {/* Spacer để đẩy phần price và actions xuống dưới */}
                            <div style={{ flex: 1 }}></div>
                            
                            {/* Price Section - Fixed position at bottom */}
                            <div className="mb-3" style={{
                                borderTop: '1px solid var(--admin-border)',
                                paddingTop: '12px',
                                marginTop: 'auto'
                            }}>
                                <div style={{ 
                                    fontSize: '18px', 
                                    fontWeight: '700', 
                                    color: '#22c55e',
                                    textAlign: 'center',
                                    padding: '10px 12px',
                                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)',
                                    borderRadius: '8px',
                                    border: '2px solid rgba(34, 197, 94, 0.3)',
                                    boxShadow: '0 2px 8px rgba(34, 197, 94, 0.1)'
                                }}>
                                    {formatCurrency(booking.totalAmount)}
                                </div>
                            </div>
                            
                            {/* Actions Section - Fixed at bottom */}
                            <div className="flex gap-2 justify-center">
                                <AdminButton
                                    onClick={() => handleEditBooking(booking)}
                                    style={{
                                        background: '#f59e0b',
                                        color: '#fff',
                                        padding: '8px 14px',
                                        borderRadius: '6px',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        flex: '1',
                                        maxWidth: '100px',
                                        boxShadow: '0 2px 4px rgba(245, 158, 11, 0.3)',
                                        transition: 'all 0.2s ease'
                                    }}
                                    className="hover:bg-yellow-600 hover:shadow-lg"
                                >
                                    Edit
                                </AdminButton>
                                <AdminButton
                                    onClick={() => handleDeleteBooking(booking)}
                                    style={{
                                        background: '#ef4444',
                                        color: '#fff',
                                        padding: '8px 14px',
                                        borderRadius: '6px',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        flex: '1',
                                        maxWidth: '100px',
                                        boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)',
                                        transition: 'all 0.2s ease'
                                    }}
                                    className="hover:bg-red-600 hover:shadow-lg"
                                >
                                    Delete
                                </AdminButton>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Booking Modal */}
            {showAddModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999
                }} onClick={() => {
                    setShowAddModal(false);
                    setSelectedHotel('');
                    setSelectedRoom('');
                }}>
                    <div style={{
                        background: 'var(--admin-bg-primary)',
                        borderRadius: '12px',
                        border: '1px solid var(--admin-border)',
                        width: '90%',
                        maxWidth: '600px',
                        maxHeight: '80vh',
                        overflow: 'auto'
                    }} onClick={(e) => e.stopPropagation()}>
                        <div style={{
                            padding: '20px',
                            borderBottom: '1px solid var(--admin-border)',
                            background: 'var(--admin-bg-secondary)'
                        }}>
                            <h2 style={{
                                margin: 0,
                                fontSize: '20px',
                                fontWeight: '600',
                                color: 'var(--admin-text-primary)'
                            }}>
                                Add New Booking
                            </h2>
                        </div>
                        
                        <div style={{ padding: '24px' }}>
                            <div className="space-y-4">
                                <AdminInput
                                    type="text"
                                    placeholder="Guest First Name"
                                    style={{ width: '100%' }}
                                />
                                <AdminInput
                                    type="text"
                                    placeholder="Guest Last Name"
                                    style={{ width: '100%' }}
                                />
                                <AdminInput
                                    type="email"
                                    placeholder="Guest Email"
                                    style={{ width: '100%' }}
                                />
                                <AdminInput
                                    type="text"
                                    placeholder="Guest Phone"
                                    style={{ width: '100%' }}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <AdminInput
                                        type="text"
                                        placeholder="Check-in Date (YYYY-MM-DD)"
                                        style={{ width: '100%' }}
                                    />
                                    <AdminInput
                                        type="text"
                                        placeholder="Check-out Date (YYYY-MM-DD)"
                                        style={{ width: '100%' }}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <select 
                                        value={selectedHotel}
                                        onChange={(e) => {
                                            setSelectedHotel(e.target.value);
                                            setSelectedRoom(''); // Reset room when hotel changes
                                        }}
                                        style={{
                                            background: 'var(--admin-bg-primary)',
                                            border: '1px solid var(--admin-border)',
                                            borderRadius: '6px',
                                            padding: '10px 12px',
                                            color: 'var(--admin-text-primary)',
                                            fontSize: '14px',
                                            width: '100%'
                                        }}
                                    >
                                        <option value="">Select Hotel</option>
                                        {bookings.slice(0, 8).map((booking, idx) => (
                                            <option key={idx} value={booking.room.id}>
                                                {booking.room.roomType.name}
                                            </option>
                                        ))}
                                    </select>
                                    
                                    <select 
                                        value={selectedRoom}
                                        onChange={(e) => setSelectedRoom(e.target.value)}
                                        disabled={!selectedHotel}
                                        style={{
                                            background: selectedHotel ? 'var(--admin-bg-primary)' : '#f5f5f5',
                                            border: '1px solid var(--admin-border)',
                                            borderRadius: '6px',
                                            padding: '10px 12px',
                                            color: selectedHotel ? 'var(--admin-text-primary)' : '#999',
                                            fontSize: '14px',
                                            width: '100%',
                                            cursor: selectedHotel ? 'pointer' : 'not-allowed'
                                        }}
                                    >
                                        <option value="">Select Room</option>
                                        {selectedHotel && (
                                            <>
                                                <option value="101">Room 101 - Standard</option>
                                                <option value="102">Room 102 - Deluxe</option>
                                                <option value="201">Room 201 - Suite</option>
                                                <option value="202">Room 202 - Premium Suite</option>
                                                <option value="301">Room 301 - Executive</option>
                                                <option value="302">Room 302 - Presidential</option>
                                            </>
                                        )}
                                    </select>
                                </div>
                            </div>
                            
                            <div className="flex gap-3 justify-end mt-6">
                                <AdminButton
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setSelectedHotel('');
                                        setSelectedRoom('');
                                    }}
                                    style={{
                                        background: '#6b7280',
                                        color: '#fff',
                                        padding: '10px 20px',
                                        borderRadius: '6px',
                                        fontWeight: '500'
                                    }}
                                    className="hover:bg-gray-600"
                                >
                                    Cancel
                                </AdminButton>
                                <AdminButton
                                    onClick={() => {
                                        if (!selectedHotel || !selectedRoom) {
                                            addNotification({
                                                type: 'error',
                                                title: 'Validation Error',
                                                message: 'Please select both hotel and room'
                                            });
                                            return;
                                        }
                                        
                                        addNotification({
                                            type: 'success',
                                            title: 'Booking Added',
                                            message: `New booking created for ${selectedRoom} at selected hotel`
                                        });
                                        setShowAddModal(false);
                                        setSelectedHotel('');
                                        setSelectedRoom('');
                                    }}
                                    style={{
                                        background: '#22c55e',
                                        color: '#fff',
                                        padding: '10px 20px',
                                        borderRadius: '6px',
                                        fontWeight: '500'
                                    }}
                                    className="hover:bg-green-600"
                                >
                                    Add Booking
                                </AdminButton>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Booking Modal */}
            {showEditModal && selectedBooking && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999
                }} onClick={() => setShowEditModal(false)}>
                    <div style={{
                        background: 'var(--admin-bg-primary)',
                        borderRadius: '12px',
                        border: '1px solid var(--admin-border)',
                        width: '90%',
                        maxWidth: '600px',
                        maxHeight: '80vh',
                        overflow: 'auto'
                    }} onClick={(e) => e.stopPropagation()}>
                        <div style={{
                            padding: '20px',
                            borderBottom: '1px solid var(--admin-border)',
                            background: 'var(--admin-bg-secondary)'
                        }}>
                            <h2 style={{
                                margin: 0,
                                fontSize: '20px',
                                fontWeight: '600',
                                color: 'var(--admin-text-primary)'
                            }}>
                                Edit Booking - {selectedBooking.bookingNumber}
                            </h2>
                        </div>
                        
                        <div style={{ padding: '24px' }}>
                            <div className="space-y-4">
                                <div style={{ marginBottom: '16px' }}>
                                    <AdminInput
                                        type="text"
                                        placeholder="Guest First Name"
                                        style={{ width: '100%' }}
                                    />
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <AdminInput
                                        type="text"
                                        placeholder="Guest Last Name"
                                        style={{ width: '100%' }}
                                    />
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <AdminInput
                                        type="email"
                                        placeholder="Guest Email"
                                        style={{ width: '100%' }}
                                    />
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <AdminInput
                                        type="text"
                                        placeholder="Guest Phone"
                                        style={{ width: '100%' }}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <AdminInput
                                        type="text"
                                        placeholder="Check-in Date (YYYY-MM-DD)"
                                        style={{ width: '100%' }}
                                    />
                                    <AdminInput
                                        type="text"
                                        placeholder="Check-out Date (YYYY-MM-DD)"
                                        style={{ width: '100%' }}
                                    />
                                </div>
                            </div>
                            
                            <div className="flex gap-3 justify-end mt-6">
                                <AdminButton
                                    onClick={() => setShowEditModal(false)}
                                    style={{
                                        background: '#6b7280',
                                        color: '#fff',
                                        padding: '10px 20px',
                                        borderRadius: '6px',
                                        fontWeight: '500'
                                    }}
                                    className="hover:bg-gray-600"
                                >
                                    Cancel
                                </AdminButton>
                                <AdminButton
                                    onClick={() => {
                                        addNotification({
                                            type: 'success',
                                            title: 'Booking Updated',
                                            message: `Booking ${selectedBooking.bookingNumber} has been updated successfully`
                                        });
                                        setShowEditModal(false);
                                        setSelectedBooking(null);
                                    }}
                                    style={{
                                        background: '#f59e0b',
                                        color: '#fff',
                                        padding: '10px 20px',
                                        borderRadius: '6px',
                                        fontWeight: '500'
                                    }}
                                    className="hover:bg-yellow-600"
                                >
                                    Update Booking
                                </AdminButton>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedBooking && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999
                }} onClick={() => setShowDeleteModal(false)}>
                    <div style={{
                        background: 'var(--admin-bg-primary)',
                        borderRadius: '12px',
                        border: '1px solid var(--admin-border)',
                        width: '90%',
                        maxWidth: '400px',
                        padding: '24px'
                    }} onClick={(e) => e.stopPropagation()}>
                        <h3 style={{
                            margin: '0 0 16px 0',
                            fontSize: '18px',
                            fontWeight: '600',
                            color: 'var(--admin-text-primary)'
                        }}>
                            Confirm Delete
                        </h3>
                        <p style={{
                            margin: '0 0 24px 0',
                            color: 'var(--admin-text-secondary)',
                            lineHeight: '1.5'
                        }}>
                            Are you sure you want to delete booking <strong>{selectedBooking.bookingNumber}</strong>? 
                            This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <AdminButton
                                onClick={() => setShowDeleteModal(false)}
                                style={{
                                    background: '#6b7280',
                                    color: '#fff',
                                    padding: '8px 16px',
                                    borderRadius: '6px',
                                    fontWeight: '500'
                                }}
                                className="hover:bg-gray-600"
                            >
                                Cancel
                            </AdminButton>
                            <AdminButton
                                onClick={confirmDelete}
                                style={{
                                    background: '#ef4444',
                                    color: '#fff',
                                    padding: '8px 16px',
                                    borderRadius: '6px',
                                    fontWeight: '500'
                                }}
                                className="hover:bg-red-600"
                            >
                                Delete
                            </AdminButton>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingsPage;
