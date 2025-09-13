import React, { useState, useEffect } from 'react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminButton from '@/components/admin/AdminButton';
import AdminInput from '@/components/admin/AdminInput';
import AdminCard from '@/components/admin/AdminCard';
import { useNotifications } from '@/hooks/useNotifications';

import usersData from '../../data/jsons/__users.json';
import homeStayData from '../../data/jsons/__homeStay.json';
import type { BookingEnhanced, BookingStatus, RoomStatus, PaymentStatus, BookingSource } from '../../types/hotel';

// Tạo mockBookings từ dữ liệu usersData và homeStayData
const mockBookings = usersData.slice(0, 4).map((user, idx) => ({
    id: idx + 1,
    bookingNumber: `BK-2025-00${idx + 1}`,
    userId: user.id,
    roomId: homeStayData[idx]?.id || 1,
    room: {
        id: (homeStayData[idx] as { id?: number }).id ?? 1,
        number: String((homeStayData[idx] as { id?: number }).id ?? 1),
        floor: 1,
        roomType: {
            id: (homeStayData[idx] as { id?: number }).id ?? 1,
            name: (homeStayData[idx] as { title?: string }).title ?? '',
            description: (homeStayData[idx] as { description?: string }).description ?? '',
            basePrice: Number((homeStayData[idx] as { price?: string }).price?.replace(/[^\d]/g, '')) || 0,
            maxGuests: (homeStayData[idx] as { maxGuests?: number }).maxGuests ?? 2,
            bedConfiguration: [{ type: 'king' as const, quantity: (homeStayData[idx] as { bedrooms?: number }).bedrooms ?? 1 }],
            size: 25,
            amenities: [],
            images: (() => {
                const galleryImgs = (homeStayData[idx] as { galleryImgs?: string[] }).galleryImgs;
                return Array.isArray(galleryImgs) && galleryImgs.length > 0 ? galleryImgs : ['/src/assets/logo.png'];
            })(),
            isActive: true
        },
        status: idx % 3 === 0 ? 'available' as RoomStatus : (idx % 3 === 1 ? 'occupied' as RoomStatus : 'maintenance' as RoomStatus),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    checkInDate: new Date('2025-09-13'),
    checkOutDate: new Date('2025-09-15'),
    nights: 2,
    guests: {
        primary: {
            firstName: user.name.split(' ')[0],
            lastName: user.name.split(' ').slice(1).join(' '),
            email: user.email,
            phone: user.phone || ''
        },
        additional: [],
        totalAdults: 2,
        totalChildren: 0
    },
    totalAmount: 1000000,
    baseAmount: 1000000,
    taxes: 0,
    fees: 0,
    discounts: 0,
    paymentStatus: idx % 2 === 0 ? 'paid' as PaymentStatus : 'pending' as PaymentStatus,
    status: idx % 2 === 0 ? 'confirmed' as BookingStatus : 'pending' as BookingStatus,
    source: 'website' as BookingSource,
    specialRequests: '',
    createdAt: new Date('2025-09-13'),
    updatedAt: new Date('2025-09-13')
}));

const BookingsPage: React.FC = () => {
    const [bookings, setBookings] = useState<BookingEnhanced[]>([]);
    const [filteredBookings, setFilteredBookings] = useState<BookingEnhanced[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
    const [paymentFilter, setPaymentFilter] = useState<'all' | 'paid' | 'pending' | 'refunded'>('all');
    const [selectedBooking, setSelectedBooking] = useState<BookingEnhanced | null>(null);
    const [showDetails, setShowDetails] = useState(false);
    const { addNotification } = useNotifications();

    // Load bookings data - optimized for faster loading
    useEffect(() => {
        setLoading(true);
        // Reduced delay for better UX
        setTimeout(() => {
            setBookings(mockBookings);
            setFilteredBookings(mockBookings);
            setLoading(false);
        }, 300); // Reduced from 1000 to 300ms
    }, []);

    // Filter bookings based on search and filters
    useEffect(() => {
        let filtered = bookings;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(booking =>
                booking.guests.primary.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.guests.primary.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (booking.guests.primary.email && booking.guests.primary.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                booking.room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

        setFilteredBookings(filtered);
    }, [bookings, searchTerm, statusFilter, paymentFilter]);

    const handleStatusChange = async (bookingId: number, newStatus: BookingStatus) => {
        try {
            // Reduced delay for better UX
            await new Promise(resolve => setTimeout(resolve, 200));

            setBookings(prevBookings =>
                prevBookings.map(booking =>
                    booking.id === bookingId
                        ? { ...booking, status: newStatus, updatedAt: new Date() }
                        : booking
                )
            );

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

    const handlePaymentStatusChange = async (bookingId: number, newPaymentStatus: 'paid' | 'pending' | 'refunded') => {
        try {
            // Reduced delay for better UX
            await new Promise(resolve => setTimeout(resolve, 200));

            setBookings(prevBookings =>
                prevBookings.map(booking =>
                    booking.id === bookingId
                        ? { ...booking, paymentStatus: newPaymentStatus, updatedAt: new Date() }
                        : booking
                )
            );

            addNotification({
                type: 'success',
                title: 'Payment Status Updated',
                message: `Payment status updated to ${newPaymentStatus}`
            });
        } catch {
            addNotification({
                type: 'error',
                title: 'Update Failed',
                message: 'Failed to update payment status'
            });
        }
    };

    const getStatusColor = (status: BookingStatus): string => {
        switch (status) {
            case 'confirmed': return '#2196f3';
            case 'pending': return '#ff9800';
            case 'checked_in': return '#4caf50';
            case 'checked_out': return '#9c27b0';
            case 'cancelled': return '#f44336';
            default: return '#757575';
        }
    };

    const getPaymentStatusColor = (status: string): string => {
        switch (status) {
            case 'paid': return '#4caf50';
            case 'pending': return '#ff9800';
            case 'refunded': return '#2196f3';
            default: return '#757575';
        }
    };

    const formatDate = (date: Date): string => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    // Calculate statistics
    const stats = {
        total: bookings.length,
        confirmed: bookings.filter(b => b.status === 'confirmed').length,
        checkedIn: bookings.filter(b => b.status === 'checked_in').length,
        pending: bookings.filter(b => b.status === 'pending').length,
        totalRevenue: bookings
            .filter(b => b.paymentStatus === 'paid')
            .reduce((sum, b) => sum + b.totalAmount, 0),
        pendingPayments: bookings
            .filter(b => b.paymentStatus === 'pending')
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
            <AdminPageHeader
                title="Booking Management"
                description="Manage hotel bookings, payments, and guest information"
            >
                <AdminButton variant="primary" onClick={() => addNotification({
                    type: 'info',
                    title: 'New Booking',
                    message: 'Manual booking creation will be implemented'
                })}>
                    Add New Booking
                </AdminButton>
            </AdminPageHeader>

            {/* Statistics Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                marginBottom: '32px'
            }}>
                <AdminCard
                    title="Total Bookings"
                    value={stats.total.toString()}
                    description="All bookings"
                    color="#2196f3"
                    icon="📋"
                />
                <AdminCard
                    title="Confirmed"
                    value={stats.confirmed.toString()}
                    description="Confirmed bookings"
                    color="#4caf50"
                    icon="✅"
                />
                <AdminCard
                    title="Checked In"
                    value={stats.checkedIn.toString()}
                    description="Currently checked in"
                    color="#ff9800"
                    icon="🏨"
                />
                <AdminCard
                    title="Pending"
                    value={stats.pending.toString()}
                    description="Awaiting confirmation"
                    color="#f44336"
                    icon="⏳"
                />
                <AdminCard
                    title="Total Revenue"
                    value={formatCurrency(stats.totalRevenue)}
                    description="Paid bookings"
                    color="#4caf50"
                    icon="💰"
                />
                <AdminCard
                    title="Pending Payments"
                    value={formatCurrency(stats.pendingPayments)}
                    description="Awaiting payment"
                    color="#ff9800"
                    icon="💳"
                />
            </div>

            {/* Filters */}
            <div style={{
                background: 'var(--admin-bg-primary)',
                borderRadius: '12px',
                border: '1px solid var(--admin-border)',
                padding: '20px',
                marginBottom: '24px'
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px',
                    alignItems: 'end'
                }}>
                    <AdminInput
                        label="Search Bookings"
                        placeholder="Guest name, email, room..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    
                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: 'var(--admin-text-primary)',
                            marginBottom: '8px'
                        }}>
                            Status Filter
                        </label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as BookingStatus | 'all')}
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                borderRadius: '8px',
                                border: '1px solid var(--admin-border)',
                                background: 'var(--admin-bg-secondary)',
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
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: 'var(--admin-text-primary)',
                            marginBottom: '8px'
                        }}>
                            Payment Filter
                        </label>
                        <select
                            value={paymentFilter}
                            onChange={(e) => setPaymentFilter(e.target.value as 'all' | 'paid' | 'pending' | 'refunded')}
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                borderRadius: '8px',
                                border: '1px solid var(--admin-border)',
                                background: 'var(--admin-bg-secondary)',
                                color: 'var(--admin-text-primary)',
                                fontSize: '14px'
                            }}
                        >
                            <option value="all">All Payments</option>
                            <option value="paid">Paid</option>
                            <option value="pending">Pending</option>
                            <option value="refunded">Refunded</option>
                        </select>
                    </div>

                    <AdminButton
                        variant="secondary"
                        onClick={() => {
                            setSearchTerm('');
                            setStatusFilter('all');
                            setPaymentFilter('all');
                        }}
                    >
                        Clear Filters
                    </AdminButton>
                </div>
            </div>

            {/* Bookings List */}
            <div style={{
                background: 'var(--admin-bg-primary)',
                borderRadius: '12px',
                border: '1px solid var(--admin-border)',
                overflow: 'hidden'
            }}>
                {/* Header */}
                <div style={{
                    padding: '20px',
                    borderBottom: '1px solid var(--admin-border)',
                    background: 'var(--admin-bg-secondary)'
                }}>
                    <h2 style={{
                        margin: 0,
                        fontSize: '18px',
                        fontWeight: '600',
                        color: 'var(--admin-text-primary)'
                    }}>
                        Bookings ({filteredBookings.length})
                    </h2>
                </div>

                {/* Bookings */}
                <div style={{ padding: '20px' }}>
                    {filteredBookings.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '40px 20px',
                            color: 'var(--admin-text-secondary)'
                        }}>
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
                            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>No Bookings Found</h3>
                            <p style={{ margin: 0 }}>No bookings match your current filters</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {filteredBookings.map((booking) => (
                                <div
                                    key={booking.id}
                                    style={{
                                        border: '1px solid var(--admin-border)',
                                        borderRadius: '8px',
                                        padding: '20px',
                                        background: 'var(--admin-bg-secondary)',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                        gap: '16px',
                                        marginBottom: '16px'
                                    }}>
                                        {/* Guest Info */}
                                        <div>
                                            <h4 style={{
                                                margin: '0 0 8px 0',
                                                fontSize: '16px',
                                                fontWeight: '600',
                                                color: 'var(--admin-text-primary)'
                                            }}>
                                                {booking.guests.primary.firstName} {booking.guests.primary.lastName}
                                            </h4>
                                            <div style={{
                                                fontSize: '14px',
                                                color: 'var(--admin-text-secondary)',
                                                lineHeight: '1.4'
                                            }}>
                                                <div>{booking.guests.primary.email}</div>
                                                <div>{booking.guests.primary.phone}</div>
                                            </div>
                                        </div>

                                        {/* Room Info */}
                                        <div>
                                            <h4 style={{
                                                margin: '0 0 8px 0',
                                                fontSize: '16px',
                                                fontWeight: '600',
                                                color: 'var(--admin-text-primary)'
                                            }}>
                                                Room {booking.room.number}
                                            </h4>
                                            <div style={{
                                                fontSize: '14px',
                                                color: 'var(--admin-text-secondary)',
                                                lineHeight: '1.4'
                                            }}>
                                                <div>{booking.room.roomType.name}</div>
                                                <div>{booking.guests.totalAdults + booking.guests.totalChildren} guests</div>
                                            </div>
                                        </div>

                                        {/* Dates */}
                                        <div>
                                            <h4 style={{
                                                margin: '0 0 8px 0',
                                                fontSize: '16px',
                                                fontWeight: '600',
                                                color: 'var(--admin-text-primary)'
                                            }}>
                                                Stay Dates
                                            </h4>
                                            <div style={{
                                                fontSize: '14px',
                                                color: 'var(--admin-text-secondary)',
                                                lineHeight: '1.4'
                                            }}>
                                                <div>Check-in: {formatDate(booking.checkInDate)}</div>
                                                <div>Check-out: {formatDate(booking.checkOutDate)}</div>
                                            </div>
                                        </div>

                                        {/* Amount */}
                                        <div>
                                            <h4 style={{
                                                margin: '0 0 8px 0',
                                                fontSize: '16px',
                                                fontWeight: '600',
                                                color: 'var(--admin-text-primary)'
                                            }}>
                                                {formatCurrency(booking.totalAmount)}
                                            </h4>
                                            <div style={{
                                                fontSize: '14px',
                                                color: 'var(--admin-text-secondary)'
                                            }}>
                                                Total amount
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status and Actions */}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingTop: '16px',
                                        borderTop: '1px solid var(--admin-border)'
                                    }}>
                                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                            {/* Booking Status */}
                                            <span
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    padding: '4px 12px',
                                                    borderRadius: '16px',
                                                    fontSize: '12px',
                                                    fontWeight: '500',
                                                    background: getStatusColor(booking.status) + '20',
                                                    color: getStatusColor(booking.status),
                                                    border: `1px solid ${getStatusColor(booking.status)}40`
                                                }}
                                            >
                                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                            </span>

                                            {/* Payment Status */}
                                            <span
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    padding: '4px 12px',
                                                    borderRadius: '16px',
                                                    fontSize: '12px',
                                                    fontWeight: '500',
                                                    background: getPaymentStatusColor(booking.paymentStatus) + '20',
                                                    color: getPaymentStatusColor(booking.paymentStatus),
                                                    border: `1px solid ${getPaymentStatusColor(booking.paymentStatus)}40`
                                                }}
                                            >
                                                {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                                            </span>
                                        </div>

                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <AdminButton
                                                variant="secondary"
                                                onClick={() => {
                                                    setSelectedBooking(booking);
                                                    setShowDetails(true);
                                                }}
                                            >
                                                View Details
                                            </AdminButton>

                                            {/* Status Actions */}
                                            {booking.status === 'pending' && (
                                                <AdminButton
                                                    variant="primary"
                                                    onClick={() => handleStatusChange(booking.id, 'confirmed')}
                                                >
                                                    Confirm
                                                </AdminButton>
                                            )}

                                            {booking.status === 'confirmed' && (
                                                <AdminButton
                                                    variant="primary"
                                                    onClick={() => handleStatusChange(booking.id, 'checked_in')}
                                                >
                                                    Check In
                                                </AdminButton>
                                            )}

                                            {booking.status === 'checked_in' && (
                                                <AdminButton
                                                    variant="primary"
                                                    onClick={() => handleStatusChange(booking.id, 'checked_out')}
                                                >
                                                    Check Out
                                                </AdminButton>
                                            )}

                                            {/* Payment Actions */}
                                            {booking.paymentStatus === 'pending' && (
                                                <AdminButton
                                                    variant="primary"
                                                    onClick={() => handlePaymentStatusChange(booking.id, 'paid')}
                                                >
                                                    Mark Paid
                                                </AdminButton>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Booking Details Modal - placeholder for future implementation */}
            {showDetails && selectedBooking && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                    }}
                    onClick={() => setShowDetails(false)}
                >
                    <div
                        style={{
                            background: 'var(--admin-bg-primary)',
                            borderRadius: '12px',
                            border: '1px solid var(--admin-border)',
                            width: '90%',
                            maxWidth: '600px',
                            maxHeight: '80vh',
                            overflow: 'auto'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
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
                                Booking Details - #{selectedBooking.id}
                            </h2>
                        </div>
                        
                        <div style={{ padding: '24px' }}>
                            <p style={{ color: 'var(--admin-text-secondary)', margin: '0 0 20px 0' }}>
                                Detailed booking information and management will be implemented here.
                            </p>
                            
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                <AdminButton variant="secondary" onClick={() => setShowDetails(false)}>
                                    Close
                                </AdminButton>
                                <AdminButton variant="primary" onClick={() => {
                                    addNotification({
                                        type: 'info',
                                        title: 'Edit Booking',
                                        message: 'Booking editing functionality will be implemented'
                                    });
                                    setShowDetails(false);
                                }}>
                                    Edit Booking
                                </AdminButton>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingsPage;
