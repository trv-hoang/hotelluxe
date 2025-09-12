import React, { useState } from 'react';
import type { Hotel } from '@/types/hotel';
import AdminButton from './AdminButton';
import AdminInput from './AdminInput';

interface HotelInfoProps {
    hotel: Hotel;
    onSave: (hotel: Partial<Hotel>) => void;
    onCancel: () => void;
    loading?: boolean;
}

const HotelInfo: React.FC<HotelInfoProps> = ({
    hotel,
    onSave,
    onCancel,
    loading = false
}) => {
    const [formData, setFormData] = useState({
        name: hotel.name,
        description: hotel.description,
        address: hotel.address,
        city: hotel.city,
        country: hotel.country,
        phone: hotel.phone,
        email: hotel.email,
        website: hotel.website || '',
        checkInTime: hotel.checkInTime,
        checkOutTime: hotel.checkOutTime,
        starRating: hotel.starRating
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};
        
        if (!formData.name.trim()) newErrors.name = 'Hotel name is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.country.trim()) newErrors.country = 'Country is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!formData.checkInTime) newErrors.checkInTime = 'Check-in time is required';
        if (!formData.checkOutTime) newErrors.checkOutTime = 'Check-out time is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSave(formData);
        }
    };

    const handleChange = (field: string, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    return (
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
                    Hotel Information
                </h2>
                <p style={{
                    margin: '8px 0 0 0',
                    fontSize: '14px',
                    color: 'var(--admin-text-secondary)'
                }}>
                    Manage your hotel's basic information and settings
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '20px'
                }}>
                    {/* Basic Info */}
                    <div>
                        <h3 style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: 'var(--admin-text-primary)',
                            marginBottom: '16px'
                        }}>
                            Basic Information
                        </h3>
                        
                        <div style={{ marginBottom: '16px' }}>
                            <AdminInput
                                label="Hotel Name *"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                error={errors.name}
                                placeholder="Enter hotel name"
                            />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontSize: '14px',
                                fontWeight: '500',
                                color: 'var(--admin-text-primary)'
                            }}>
                                Description *
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                placeholder="Enter hotel description"
                                rows={4}
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    border: `1px solid ${errors.description ? '#ef4444' : 'var(--admin-border)'}`,
                                    background: 'var(--admin-bg-primary)',
                                    color: 'var(--admin-text-primary)',
                                    fontSize: '14px',
                                    resize: 'vertical',
                                    fontFamily: 'inherit'
                                }}
                            />
                            {errors.description && (
                                <span style={{
                                    display: 'block',
                                    marginTop: '4px',
                                    fontSize: '12px',
                                    color: '#ef4444'
                                }}>
                                    {errors.description}
                                </span>
                            )}
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontSize: '14px',
                                fontWeight: '500',
                                color: 'var(--admin-text-primary)'
                            }}>
                                Star Rating *
                            </label>
                            <select
                                value={formData.starRating}
                                onChange={(e) => handleChange('starRating', parseInt(e.target.value))}
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
                                <option value={1}>⭐ 1 Star</option>
                                <option value={2}>⭐⭐ 2 Stars</option>
                                <option value={3}>⭐⭐⭐ 3 Stars</option>
                                <option value={4}>⭐⭐⭐⭐ 4 Stars</option>
                                <option value={5}>⭐⭐⭐⭐⭐ 5 Stars</option>
                            </select>
                        </div>
                    </div>

                    {/* Location & Contact */}
                    <div>
                        <h3 style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: 'var(--admin-text-primary)',
                            marginBottom: '16px'
                        }}>
                            Location & Contact
                        </h3>

                        <div style={{ marginBottom: '16px' }}>
                            <AdminInput
                                label="Address *"
                                value={formData.address}
                                onChange={(e) => handleChange('address', e.target.value)}
                                error={errors.address}
                                placeholder="Enter hotel address"
                            />
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '12px',
                            marginBottom: '16px'
                        }}>
                            <AdminInput
                                label="City *"
                                value={formData.city}
                                onChange={(e) => handleChange('city', e.target.value)}
                                error={errors.city}
                                placeholder="City"
                            />
                            <AdminInput
                                label="Country *"
                                value={formData.country}
                                onChange={(e) => handleChange('country', e.target.value)}
                                error={errors.country}
                                placeholder="Country"
                            />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <AdminInput
                                label="Phone *"
                                value={formData.phone}
                                onChange={(e) => handleChange('phone', e.target.value)}
                                error={errors.phone}
                                placeholder="+1 (555) 123-4567"
                            />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <AdminInput
                                label="Email *"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                error={errors.email}
                                placeholder="hotel@example.com"
                            />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <AdminInput
                                label="Website"
                                value={formData.website}
                                onChange={(e) => handleChange('website', e.target.value)}
                                placeholder="https://www.example.com"
                            />
                        </div>
                    </div>

                    {/* Check-in/out Times */}
                    <div>
                        <h3 style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: 'var(--admin-text-primary)',
                            marginBottom: '16px'
                        }}>
                            Check-in/out Times
                        </h3>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '12px'
                        }}>
                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: 'var(--admin-text-primary)'
                                }}>
                                    Check-in Time *
                                </label>
                                <input
                                    type="time"
                                    value={formData.checkInTime}
                                    onChange={(e) => handleChange('checkInTime', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        borderRadius: '6px',
                                        border: `1px solid ${errors.checkInTime ? '#ef4444' : 'var(--admin-border)'}`,
                                        background: 'var(--admin-bg-primary)',
                                        color: 'var(--admin-text-primary)',
                                        fontSize: '14px'
                                    }}
                                />
                                {errors.checkInTime && (
                                    <span style={{
                                        display: 'block',
                                        marginTop: '4px',
                                        fontSize: '12px',
                                        color: '#ef4444'
                                    }}>
                                        {errors.checkInTime}
                                    </span>
                                )}
                            </div>
                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: 'var(--admin-text-primary)'
                                }}>
                                    Check-out Time *
                                </label>
                                <input
                                    type="time"
                                    value={formData.checkOutTime}
                                    onChange={(e) => handleChange('checkOutTime', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        borderRadius: '6px',
                                        border: `1px solid ${errors.checkOutTime ? '#ef4444' : 'var(--admin-border)'}`,
                                        background: 'var(--admin-bg-primary)',
                                        color: 'var(--admin-text-primary)',
                                        fontSize: '14px'
                                    }}
                                />
                                {errors.checkOutTime && (
                                    <span style={{
                                        display: 'block',
                                        marginTop: '4px',
                                        fontSize: '12px',
                                        color: '#ef4444'
                                    }}>
                                        {errors.checkOutTime}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    justifyContent: 'flex-end',
                    marginTop: '32px',
                    paddingTop: '20px',
                    borderTop: '1px solid var(--admin-border)'
                }}>
                    <AdminButton
                        variant="secondary"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancel
                    </AdminButton>
                    <AdminButton
                        type="submit"
                        variant="primary"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </AdminButton>
                </div>
            </form>
        </div>
    );
};

export default HotelInfo;
