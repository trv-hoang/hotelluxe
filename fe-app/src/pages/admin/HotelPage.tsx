import React, { useState, useEffect } from 'react';
import type { Hotel } from '@/types/hotel';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminButton from '@/components/admin/AdminButton';
import AdminCard from '@/components/admin/AdminCard';
import HotelInfo from '@/components/admin/HotelInfo';
import { useNotifications } from '@/hooks/useNotifications';

// Mock hotel data - replace with real API calls
const mockHotel: Hotel = {
    id: 1,
    name: 'Luxe Hotel & Resort',
    description: 'A premium 5-star hotel offering exceptional service and luxury accommodations in the heart of the city.',
    address: '123 Ocean Drive',
    city: 'Miami Beach',
    country: 'United States',
    phone: '+1 (305) 555-0123',
    email: 'info@luxehotel.com',
    website: 'https://www.luxehotel.com',
    checkInTime: '15:00',
    checkOutTime: '11:00',
    starRating: 5,
    amenities: [],
    images: [],
    policies: [],
    coordinates: {
        lat: 25.7617,
        lng: -80.1918
    },
    status: 'active',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date()
};

const HotelPage: React.FC = () => {
    const [hotel, setHotel] = useState<Hotel | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const { addNotification } = useNotifications();

    // Load hotel data - optimized for faster loading
    useEffect(() => {
        setLoading(true);
        // TODO: Replace with real API call
        setTimeout(() => {
            setHotel(mockHotel);
            setLoading(false);
        }, 200); // Reduced from 1000 to 200ms
    }, []);

    const handleSaveHotel = async (updatedData: Partial<Hotel>) => {
        setSaving(true);
        try {
            // TODO: Replace with real API call
            await new Promise(resolve => setTimeout(resolve, 300)); // Reduced from 1500 to 300ms
            
            if (hotel) {
                setHotel({ ...hotel, ...updatedData });
                setEditMode(false);
                addNotification({
                    type: 'success',
                    title: 'Hotel Updated',
                    message: 'Hotel information has been updated successfully'
                });
            }
        } catch {
            addNotification({
                type: 'error',
                title: 'Update Failed',
                message: 'Failed to update hotel information. Please try again.'
            });
        } finally {
            setSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setEditMode(false);
    };

    const handleManageAmenities = () => {
        addNotification({
            type: 'info',
            title: 'Manage Amenities',
            message: 'Amenity management functionality will be implemented'
        });
    };

    const handleManagePolicies = () => {
        addNotification({
            type: 'info',
            title: 'Manage Policies',
            message: 'Policy management functionality will be implemented'
        });
    };

    const handleUploadImages = () => {
        addNotification({
            type: 'info',
            title: 'Upload Images',
            message: 'Image upload functionality will be implemented'
        });
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
                Loading hotel information...
            </div>
        );
    }

    if (!hotel) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: 'var(--admin-text-secondary)'
            }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏨</div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>No Hotel Information</h3>
                <p style={{ margin: '0 0 20px 0' }}>Hotel data could not be loaded</p>
                <AdminButton variant="primary" onClick={() => window.location.reload()}>
                    Retry
                </AdminButton>
            </div>
        );
    }

    return (
        <div>
            <AdminPageHeader
                title="Hotel Management"
                description="Manage your hotel information, amenities, and policies"
            >
                {!editMode && (
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <AdminButton 
                            variant="secondary" 
                            onClick={handleUploadImages}
                        >
                            Manage Images
                        </AdminButton>
                        <AdminButton 
                            variant="secondary" 
                            onClick={handleManageAmenities}
                        >
                            Manage Amenities
                        </AdminButton>
                        <AdminButton 
                            variant="secondary" 
                            onClick={handleManagePolicies}
                        >
                            Manage Policies
                        </AdminButton>
                        <AdminButton 
                            variant="primary" 
                            onClick={() => setEditMode(true)}
                        >
                            Edit Hotel Info
                        </AdminButton>
                    </div>
                )}
            </AdminPageHeader>

            {/* Hotel Overview Cards */}
            {!editMode && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '20px',
                    marginBottom: '32px'
                }}>
                    <AdminCard
                        title="Star Rating"
                        value={'⭐'.repeat(hotel.starRating)}
                        description={`${hotel.starRating} Star Hotel`}
                        color="#ffd700"
                        icon="⭐"
                    />
                    <AdminCard
                        title="Status"
                        value={hotel.status.charAt(0).toUpperCase() + hotel.status.slice(1)}
                        description="Hotel operational status"
                        color={hotel.status === 'active' ? '#4caf50' : '#f44336'}
                        icon={hotel.status === 'active' ? '✅' : '❌'}
                    />
                    <AdminCard
                        title="Check-in"
                        value={hotel.checkInTime}
                        description="Standard check-in time"
                        color="#2196f3"
                        icon="🕐"
                    />
                    <AdminCard
                        title="Check-out"
                        value={hotel.checkOutTime}
                        description="Standard check-out time"
                        color="#ff9800"
                        icon="🕐"
                    />
                </div>
            )}

            {/* Hotel Information */}
            {editMode ? (
                <HotelInfo
                    hotel={hotel}
                    onSave={handleSaveHotel}
                    onCancel={handleCancelEdit}
                    loading={saving}
                />
            ) : (
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
                            fontSize: '20px',
                            fontWeight: '600',
                            color: 'var(--admin-text-primary)'
                        }}>
                            {hotel.name}
                        </h2>
                        <p style={{
                            margin: '8px 0 0 0',
                            fontSize: '14px',
                            color: 'var(--admin-text-secondary)'
                        }}>
                            {hotel.description}
                        </p>
                    </div>

                    {/* Hotel Details */}
                    <div style={{
                        padding: '24px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '32px'
                    }}>
                        {/* Location */}
                        <div>
                            <h3 style={{
                                fontSize: '16px',
                                fontWeight: '600',
                                color: 'var(--admin-text-primary)',
                                marginBottom: '16px'
                            }}>
                                📍 Location
                            </h3>
                            <div style={{ fontSize: '14px', color: 'var(--admin-text-secondary)', lineHeight: '1.6' }}>
                                <div style={{ marginBottom: '8px' }}>
                                    <strong>Address:</strong> {hotel.address}
                                </div>
                                <div style={{ marginBottom: '8px' }}>
                                    <strong>City:</strong> {hotel.city}
                                </div>
                                <div>
                                    <strong>Country:</strong> {hotel.country}
                                </div>
                            </div>
                        </div>

                        {/* Contact */}
                        <div>
                            <h3 style={{
                                fontSize: '16px',
                                fontWeight: '600',
                                color: 'var(--admin-text-primary)',
                                marginBottom: '16px'
                            }}>
                                📞 Contact Information
                            </h3>
                            <div style={{ fontSize: '14px', color: 'var(--admin-text-secondary)', lineHeight: '1.6' }}>
                                <div style={{ marginBottom: '8px' }}>
                                    <strong>Phone:</strong> {hotel.phone}
                                </div>
                                <div style={{ marginBottom: '8px' }}>
                                    <strong>Email:</strong> {hotel.email}
                                </div>
                                {hotel.website && (
                                    <div>
                                        <strong>Website:</strong>{' '}
                                        <a 
                                            href={hotel.website} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            style={{ color: 'var(--admin-primary)' }}
                                        >
                                            {hotel.website}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Amenities Preview */}
                        <div>
                            <h3 style={{
                                fontSize: '16px',
                                fontWeight: '600',
                                color: 'var(--admin-text-primary)',
                                marginBottom: '16px'
                            }}>
                                🛎️ Amenities
                            </h3>
                            <div style={{ fontSize: '14px', color: 'var(--admin-text-secondary)' }}>
                                {hotel.amenities.length > 0 ? (
                                    <div>
                                        {hotel.amenities.slice(0, 5).map(amenity => (
                                            <div key={amenity.id} style={{ marginBottom: '4px' }}>
                                                • {amenity.name}
                                            </div>
                                        ))}
                                        {hotel.amenities.length > 5 && (
                                            <div style={{ fontStyle: 'italic', marginTop: '8px' }}>
                                                ... and {hotel.amenities.length - 5} more
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div style={{ fontStyle: 'italic' }}>
                                        No amenities configured yet
                                    </div>
                                )}
                                <AdminButton
                                    variant="secondary"
                                    onClick={handleManageAmenities}
                                    style={{ marginTop: '12px' }}
                                >
                                    Manage Amenities
                                </AdminButton>
                            </div>
                        </div>

                        {/* Policies Preview */}
                        <div>
                            <h3 style={{
                                fontSize: '16px',
                                fontWeight: '600',
                                color: 'var(--admin-text-primary)',
                                marginBottom: '16px'
                            }}>
                                📋 Policies
                            </h3>
                            <div style={{ fontSize: '14px', color: 'var(--admin-text-secondary)' }}>
                                {hotel.policies.length > 0 ? (
                                    <div>
                                        {hotel.policies.slice(0, 3).map(policy => (
                                            <div key={policy.id} style={{ marginBottom: '4px' }}>
                                                • {policy.title}
                                            </div>
                                        ))}
                                        {hotel.policies.length > 3 && (
                                            <div style={{ fontStyle: 'italic', marginTop: '8px' }}>
                                                ... and {hotel.policies.length - 3} more
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div style={{ fontStyle: 'italic' }}>
                                        No policies configured yet
                                    </div>
                                )}
                                <AdminButton
                                    variant="secondary"
                                    onClick={handleManagePolicies}
                                    style={{ marginTop: '12px' }}
                                >
                                    Manage Policies
                                </AdminButton>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HotelPage;
