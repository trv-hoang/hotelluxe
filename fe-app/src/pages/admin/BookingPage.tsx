import React, { useState, useEffect } from 'react';
import type { BookingEnhanced, BookingStatus } from '@/types/hotel';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminButton from '@/components/admin/AdminButton';
import AdminInput from '@/components/admin/AdminInput';
import AdminCard from '@/components/admin/AdminCard';
import { useNotifications } from '@/hooks/useNotifications';

// Mock booking data - replace with real API calls
const mockBookings: BookingEnhanced[] = [
    {
        id: 1,
        bookingNumber: 'BK-2024-001',
        userId: 1,
        roomId: 101,
        room: {
            id: 101,
            number: '101',
            floor: 1,
            roomType: {
                id: 1,
                name: 'Deluxe Suite',
                description: 'Luxury suite with ocean view',
                basePrice: 250,
                maxGuests: 4,
                bedConfiguration: [{ type: 'king', quantity: 1 }],
                size: 45,
                amenities: [],
                images: [],
                isActive: true
            },
            status: 'occupied',
            isActive: true,
            createdAt: new Date('2023-01-01'),
            updatedAt: new Date()
        },
        checkInDate: new Date('2024-02-15'),
        checkOutDate: new Date('2024-02-18'),
        nights: 3,
        guests: {
            primary: {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@email.com',
                phone: '+1-555-0123'
            },
            additional: [],
            totalAdults: 2,
            totalChildren: 0
        },
        totalAmount: 750.00,
        baseAmount: 750.00,
        taxes: 0,
        fees: 0,
        discounts: 0,
        paymentStatus: 'paid',
        status: 'confirmed',
        source: 'direct',
        specialRequests: 'Late check-in, ocean view preferred',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20')
    },
    {
        id: 2,
        bookingNumber: 'BK-2024-002',
        userId: 2,
        roomId: 205,
        room: {
            id: 205,
            number: '205',
            floor: 2,
            roomType: {
                id: 2,
                name: 'Standard Room',
                description: 'Comfortable standard accommodation',
                basePrice: 160,
                maxGuests: 2,
                bedConfiguration: [{ type: 'double', quantity: 1 }],
                size: 25,
                amenities: [],
                images: [],
                isActive: true
            },
            status: 'available',
            isActive: true,
            createdAt: new Date('2023-01-01'),
            updatedAt: new Date()
        },
        checkInDate: new Date('2024-02-10'),
        checkOutDate: new Date('2024-02-12'),
        nights: 2,
        guests: {
            primary: {
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jane.smith@email.com',
                phone: '+1-555-0456'
            },
            additional: [],
            totalAdults: 1,
            totalChildren: 0
        },
        totalAmount: 320.00,
        baseAmount: 320.00,
        taxes: 0,
        fees: 0,
        discounts: 0,
        paymentStatus: 'pending',
        status: 'pending',
        source: 'booking_com',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10')
    },
    {
        id: 3,
        bookingNumber: 'BK-2024-003',
        userId: 3,
        roomId: 301,
        room: {
            id: 301,
            number: '301',
            floor: 3,
            roomType: {
                id: 3,
                name: 'Presidential Suite',
                description: 'Ultimate luxury presidential suite',
                basePrice: 400,
                maxGuests: 6,
                bedConfiguration: [{ type: 'king', quantity: 1 }, { type: 'sofa_bed', quantity: 1 }],
                size: 80,
                amenities: [],
                images: [],
                isActive: true
            },
            status: 'occupied',
            isActive: true,
            createdAt: new Date('2023-01-01'),
            updatedAt: new Date()
        },
        checkInDate: new Date('2024-02-08'),
        checkOutDate: new Date('2024-02-11'),
        nights: 3,
        guests: {
            primary: {
                firstName: 'Michael',
                lastName: 'Johnson',
                email: 'michael.j@email.com',
                phone: '+1-555-0789'
            },
            additional: [
                {
                    firstName: 'Sarah',
                    lastName: 'Johnson'
                }
            ],
            totalAdults: 2,
            totalChildren: 2
        },
        totalAmount: 1200.00,
        baseAmount: 1200.00,
        taxes: 0,
        fees: 0,
        discounts: 0,
        paymentStatus: 'paid',
        status: 'checked_in',
        source: 'direct',
        specialRequests: 'Champagne on arrival, extra towels',
        createdAt: new Date('2024-01-08'),
        updatedAt: new Date('2024-02-08')
    },
    {
        id: 4,
        bookingNumber: 'BK-2024-004',
        userId: 4,
        roomId: 150,
        room: {
            id: 150,
            number: '150',
            floor: 1,
            roomType: {
                id: 2,
                name: 'Standard Room',
                description: 'Comfortable standard accommodation',
                basePrice: 160,
                maxGuests: 2,
                bedConfiguration: [{ type: 'double', quantity: 1 }],
                size: 25,
                amenities: [],
                images: [],
                isActive: true
            },
            status: 'available',
            isActive: true,
            createdAt: new Date('2023-01-01'),
            updatedAt: new Date()
        },
        checkInDate: new Date('2024-02-05'),
        checkOutDate: new Date('2024-02-07'),
        nights: 2,
        guests: {
            primary: {
                firstName: 'Sarah',
                lastName: 'Williams',
                email: 'sarah.w@email.com',
                phone: '+1-555-0321'
            },
            additional: [],
            totalAdults: 2,
            totalChildren: 0
        },
        totalAmount: 400.00,
        baseAmount: 400.00,
        taxes: 0,
        fees: 0,
        discounts: 0,
        paymentStatus: 'paid',
        status: 'checked_out',
        source: 'phone',
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-02-07')
    }
];

const BookingPage: React.FC = () => {
    const [bookings, setBookings] = useState<BookingEnhanced[]>([]);
    const [filteredBookings, setFilteredBookings] = useState<BookingEnhanced[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
    const [paymentFilter, setPaymentFilter] = useState<'all' | 'paid' | 'pending' | 'refunded'>('all');
    const [selectedBooking, setSelectedBooking] = useState<BookingEnhanced | null>(null);
    const [showDetails, setShowDetails] = useState(false);
    const { addNotification } = useNotifications();

    // Load bookings data
    useEffect(() => {
        setLoading(true);
        // TODO: Replace with real API call
        setTimeout(() => {
            setBookings(mockBookings);
            setFilteredBookings(mockBookings);
            setLoading(false);
        }, 1000);
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
            // TODO: Replace with real API call
            await new Promise(resolve => setTimeout(resolve, 500));

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
            // TODO: Replace with real API call
            await new Promise(resolve => setTimeout(resolve, 500));

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

export default BookingPage;
