
import React, { useState, useMemo, useCallback } from 'react';
import homeStayData from '../../data/jsons/__homeStay.json';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import HotelCard from '../../components/admin/HotelCard';
import { TRAVEL_IMAGES, findHotelByRegion, type Hotel } from '../../constant/travelRegions';

const HotelPage: React.FC = () => {
    // ✅ Tối ưu việc tìm và mapping hotels với travel images
    const hotelsMatched = useMemo(() => {
        const allHotels = homeStayData as unknown as Hotel[];
        return TRAVEL_IMAGES.map(({ region, img }) => {
            const found = findHotelByRegion(allHotels, region);
            return found ? { ...found, featuredImage: img } : null;
        }).filter(Boolean) as Hotel[];
    }, []);

    // ✅ Memoized image options để tránh re-create
    const imageOptions = useMemo(() => TRAVEL_IMAGES.map(({ region, img }) => ({
        value: img,
        label: region
    })), []);
    const [hotels, setHotels] = useState<Hotel[]>(hotelsMatched);
    const [showForm, setShowForm] = useState(false);
    const [editHotel, setEditHotel] = useState<Hotel | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ✅ Memoized handlers với loading và error handling
    const handleCreateHotel = useCallback(async (hotel: Hotel) => {
        setLoading(true);
        setError(null);
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));
            setHotels(prev => [hotel, ...prev]);
            setShowForm(false);
        } catch {
            setError('Failed to create hotel');
        } finally {
            setLoading(false);
        }
    }, []);

    const handleEditHotel = useCallback((hotel: Hotel) => {
        setEditHotel(hotel);
        setShowForm(true);
    }, []);

    const handleUpdateHotel = useCallback(async (updatedHotel: Hotel) => {
        setLoading(true);
        setError(null);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            setHotels(prev => prev.map(h => h.id === updatedHotel.id ? updatedHotel : h));
            setEditHotel(null);
            setShowForm(false);
        } catch {
            setError('Failed to update hotel');
        } finally {
            setLoading(false);
        }
    }, []);

    const handleDeleteHotel = useCallback((hotelId: number) => {
        setHotels(prev => prev.filter(h => h.id !== hotelId));
    }, []);

    return (
        <div className="admin-container">
            <AdminPageHeader
                title="Hotel Management"
                description="Manage hotel list, add, edit, delete hotel information"    
                breadcrumb="Hotel"
            >
                <button
                    className="px-4 py-2 rounded font-bold text-white"
                    style={{
                        background: '#22c55e',
                        boxShadow: '0 2px 8px rgba(34,197,94,0.15)',
                        transition: 'all 0.2s',
                    }}
                    onClick={() => { setShowForm(true); setEditHotel(null); }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#16a34a'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#22c55e'; }}
                >
                    Add new hotel
                </button>
            </AdminPageHeader>
            
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 font-medium">{error}</p>
                    <button 
                        onClick={() => setError(null)}
                        className="text-red-600 underline text-sm mt-1"
                    >
                        Dismiss
                    </button>
                </div>
            )}
            
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative">
                        <button
                            className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded font-bold shadow hover:bg-red-600 text-lg transition"
                            onClick={() => { setShowForm(false); setEditHotel(null); }}
                            aria-label="Đóng"
                        >
                            ×
                        </button>
                        <form
                            className="flex flex-col gap-4"
                            onSubmit={async e => {
                                e.preventDefault();
                                const form = e.target as typeof e.target & {
                                    title: { value: string };
                                    address: { value: string };
                                    description: { value: string };
                                    city: { value: string };
                                    country: { value: string };
                                    phone: { value: string };
                                    email: { value: string };
                                    featuredImage: { value: string };
                                };
                                const newHotel: Hotel = {
                                    id: editHotel ? editHotel.id : Date.now(),
                                    title: form.title.value,
                                    address: form.address.value,
                                    description: form.description.value,
                                    city: form.city.value,
                                    country: form.country.value,
                                    phone: form.phone.value,
                                    email: form.email.value,
                                    featuredImage: form.featuredImage.value,
                                };
                                if (editHotel) {
                                    await handleUpdateHotel(newHotel);
                                } else {
                                    await handleCreateHotel(newHotel);
                                }
                            }}
                        >
                            <div>
                                <label className="block font-semibold mb-1" htmlFor="title">Hotel name</label>
                                <input name="title" id="title" type="text" placeholder="Hotel name" className="border rounded px-3 py-2 w-full bg-white text-black placeholder-gray-400" defaultValue={editHotel?.title || ''} required />
                            </div>
                            <div>
                                <label className="block font-semibold mb-1" htmlFor="address">Address</label>
                                <input name="address" id="address" type="text" placeholder="Address" className="border rounded px-3 py-2 w-full bg-white text-black placeholder-gray-400" defaultValue={editHotel?.address || ''} required />
                            </div>
                            <div>
                                <label className="block font-semibold mb-1" htmlFor="description">Description</label>
                                <textarea name="description" id="description" placeholder="Detail description" className="border rounded px-3 py-2 w-full min-h-[80px] bg-white text-black placeholder-gray-400" defaultValue={editHotel?.description || ''} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-semibold mb-1" htmlFor="city">City</label>
                                    <input name="city" id="city" type="text" placeholder="City" className="border rounded px-3 py-2 w-full bg-white text-black placeholder-gray-400" defaultValue={editHotel?.city || ''} />
                                </div>
                                <div>
                                    <label className="block font-semibold mb-1" htmlFor="country">Country</label>
                                    <input name="country" id="country" type="text" placeholder="Country" className="border rounded px-3 py-2 w-full bg-white text-black placeholder-gray-400" defaultValue={editHotel?.country || ''} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-semibold mb-1" htmlFor="phone">Phone</label>
                                    <input name="phone" id="phone" type="text" placeholder="Phone" className="border rounded px-3 py-2 w-full bg-white text-black placeholder-gray-400" defaultValue={editHotel?.phone || ''} />
                                </div>
                                <div>
                                    <label className="block font-semibold mb-1" htmlFor="email">Email</label>
                                    <input name="email" id="email" type="email" placeholder="Email" className="border rounded px-3 py-2 w-full bg-white text-black placeholder-gray-400" defaultValue={editHotel?.email || ''} />
                                </div>
                            </div>
                            <div>
                                <label className="block font-semibold mb-1" htmlFor="featuredImage">Avatar</label>
                                <select name="featuredImage" id="featuredImage" className="border rounded px-3 py-2 w-full bg-white text-black placeholder-gray-400" defaultValue={editHotel?.featuredImage || ''} required>
                                    <option value="">Select Image</option>
                                    {imageOptions.map(({ value, label }) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                            </div>
                            <button 
                                type="submit" 
                                disabled={loading}
                                className={`px-6 py-2 rounded-lg font-bold text-lg mt-2 shadow transition ${
                                    loading 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-green-600 hover:bg-green-700 text-white'
                                }`}
                            >
                                {loading ? 'Processing...' : (editHotel ? 'Cập nhật' : 'Thêm mới')}
                            </button>
                        </form>
                    </div>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {hotels.map(hotel => (
                    <HotelCard
                        key={hotel.id}
                        hotel={hotel}
                        onEdit={handleEditHotel}
                        onDelete={handleDeleteHotel}
                    />
                ))}
            </div>
        </div>
    );
};

export default HotelPage;
