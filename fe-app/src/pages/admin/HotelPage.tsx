
import React, { useState, useMemo } from 'react';
import { Edit, Trash2, Eye, Plus, Building2, MapPin, Star, Phone, Mail, Users } from 'lucide-react';
import AdminButton from '../../components/admin/AdminButton';
import AdminModal from '../../components/admin/AdminModal';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminStatCard from '../../components/admin/AdminStatCard';
import AdminDataTable from '../../components/admin/AdminDataTable';
import AdminImageDisplay from '../../components/admin/AdminImageDisplay';
import { useNotifications } from '../../hooks/useNotifications';
import homeStayData from '../../data/jsons/__homeStay.json';

// Interface for JSON data
interface JsonHotelData {
    id: number;
    title: string;
    address?: string;
    description?: string;
    featuredImage: string;
    reviewStart?: number;
    bedrooms?: number;
    date?: string;
}

// Hotel interface
interface HotelData {
    id: number;
    title: string;
    address: string;
    description: string;
    city: string;
    country: string;
    phone?: string;
    email?: string;
    featuredImage: string;
    rating?: number;
    totalRooms?: number;
    createdAt: string;
    updatedAt: string;
    [key: string]: unknown;
}

// City options for hotels
const cityOptions = [
    'Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
    'Huế', 'Nha Trang', 'Đà Lạt', 'Sapa', 'Phú Quốc',
    'Hạ Long', 'Hội An', 'Vũng Tàu', 'Phan Thiết', 'Quy Nhon'
];

// Extract city from address or title
const extractCityFromHotel = (hotel: JsonHotelData): string => {
    const address = hotel.address || '';
    const title = hotel.title || '';
    
    // Check for city names in address or title
    for (const city of cityOptions) {
        if (address.includes(city) || title.includes(city)) {
            return city;
        }
    }
    
    // Special mappings for known locations
    if (address.includes('TP.HCM') || address.includes('Hồ Chí Minh') || title.includes('Sài Gòn')) {
        return 'Hồ Chí Minh';
    }
    if (title.includes('Nha Trang') || address.includes('Nha Trang')) {
        return 'Nha Trang';
    }
    if (title.includes('Đà Lạt') || address.includes('Đà Lạt')) {
        return 'Đà Lạt';
    }
    if (title.includes('Phú Quốc') || address.includes('Phú Quốc')) {
        return 'Phú Quốc';
    }
    if (title.includes('Sapa') || address.includes('Sapa')) {
        return 'Sapa';
    }
    if (title.includes('Hạ Long') || address.includes('Hạ Long')) {
        return 'Hạ Long';
    }
    if (title.includes('Hội An') || address.includes('Hội An')) {
        return 'Hội An';
    }
    if (title.includes('Huế') || address.includes('Huế')) {
        return 'Huế';
    }
    
    return 'Hà Nội'; // Default fallback
};

// Generate hotels from JSON data only
const generateHotelsFromJson = (): HotelData[] => {
    return (homeStayData as JsonHotelData[]).map((hotel) => ({
        id: hotel.id,
        title: hotel.title,
        address: hotel.address || 'Địa chỉ không có',
        description: hotel.description || 'Mô tả không có',
        city: extractCityFromHotel(hotel),
        country: 'Việt Nam',
        phone: `+84 ${Math.floor(Math.random() * 900000000) + 100000000}`,
        email: `${hotel.title.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')}@hotel.com`,
        featuredImage: hotel.featuredImage,
        rating: hotel.reviewStart || 4.0,
        totalRooms: hotel.bedrooms ? hotel.bedrooms * 5 : 50, // Estimate rooms from bedrooms
        createdAt: new Date(hotel.date || Date.now()).toISOString(),
        updatedAt: new Date().toISOString(),
    }));
};

const HotelPage: React.FC = () => {
    const { addNotification } = useNotifications();
    const [hotels, setHotels] = useState<HotelData[]>(() => generateHotelsFromJson());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentHotel, setCurrentHotel] = useState<HotelData | null>(null);
    const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');


    // Statistics calculation
    const statistics = useMemo(() => {
        const totalHotels = hotels.length;
        const totalRooms = hotels.reduce((sum, hotel) => sum + (hotel.totalRooms || 0), 0);
        const averageRating = hotels.reduce((sum, hotel) => sum + (hotel.rating || 0), 0) / hotels.length;
        const citiesCount = new Set(hotels.map(hotel => hotel.city)).size;

        return {
            totalHotels,
            totalRooms,
            averageRating: Math.round(averageRating * 10) / 10,
            citiesCount
        };
    }, [hotels]);

    // AdminDataTable handles filtering internally

    // Modal handlers
    const handleCreateHotel = () => {
        setCurrentHotel(null);
        setModalMode('create');
        setIsModalOpen(true);
    };

    const handleEditHotel = (hotel: HotelData) => {
        setCurrentHotel(hotel);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleViewHotel = (hotel: HotelData) => {
        setCurrentHotel(hotel);
        setModalMode('view');
        setIsModalOpen(true);
    };

    const handleDeleteHotel = (hotel: HotelData) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa khách sạn "${hotel.title}"?`)) {
            setHotels(prev => prev.filter(h => h.id !== hotel.id));
            addNotification({
                type: 'success',
                title: 'Thành công',
                message: `Đã xóa khách sạn "${hotel.title}" thành công!`
            });
        }
    };

    const handleSaveHotel = (hotelData: Partial<HotelData>) => {
        if (modalMode === 'create') {
            const newHotel: HotelData = {
                id: Math.max(...hotels.map(h => h.id)) + 1,
                title: hotelData.title || '',
                address: hotelData.address || '',
                description: hotelData.description || '',
                city: hotelData.city || '',
                country: hotelData.country || 'Việt Nam',
                phone: hotelData.phone,
                email: hotelData.email,
                featuredImage: hotelData.featuredImage || '/src/assets/travels/default.jpg',
                rating: hotelData.rating || 4.0,
                totalRooms: hotelData.totalRooms || 50,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            setHotels(prev => [...prev, newHotel]);
            addNotification({
                type: 'success',
                title: 'Thành công',
                message: `Đã tạo khách sạn "${newHotel.title}" thành công!`
            });
        } else if (modalMode === 'edit' && currentHotel) {
            const updatedHotel: HotelData = {
                ...currentHotel,
                ...hotelData,
                updatedAt: new Date().toISOString(),
            };
            setHotels(prev => prev.map(hotel => hotel.id === currentHotel.id ? updatedHotel : hotel));
            addNotification({
                type: 'success',
                title: 'Thành công',
                message: `Đã cập nhật khách sạn "${updatedHotel.title}" thành công!`
            });
        }
        setIsModalOpen(false);
    };



    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="p-6 space-y-6">
                {/* Header */}
                <AdminPageHeader
                    title="Quản lý khách sạn"
                    description="Quản lý danh sách khách sạn, thêm, sửa, xóa thông tin khách sạn"
                    extraContent={
                        <AdminButton
                            onClick={handleCreateHotel}
                            variant="primary"
                            className="flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Thêm khách sạn
                        </AdminButton>
                    }
                />

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <AdminStatCard
                        title="Tổng khách sạn"
                        value={statistics.totalHotels}
                        icon={Building2}
                        iconColor="text-blue-600"
                        iconBgColor="bg-blue-100"
                    />
                    <AdminStatCard
                        title="Tổng phòng"
                        value={statistics.totalRooms}
                        icon={Users}
                        iconColor="text-green-600"
                        iconBgColor="bg-green-100"
                    />
                    <AdminStatCard
                        title="Đánh giá TB"
                        value={`${statistics.averageRating}/5`}
                        icon={Star}
                        iconColor="text-yellow-600"
                        iconBgColor="bg-yellow-100"
                    />
                    <AdminStatCard
                        title="Thành phố"
                        value={statistics.citiesCount}
                        icon={MapPin}
                        iconColor="text-purple-600"
                        iconBgColor="bg-purple-100"
                    />
                </div>

                {/* Hotels Table */}
                <AdminDataTable
                    data={hotels}
                    columns={[
                        {
                            key: 'title',
                            title: 'Khách sạn',
                            render: (_, hotel: HotelData) => (
                                <div className="flex items-center">
                                    <AdminImageDisplay
                                        src={hotel.featuredImage}
                                        alt={hotel.title}
                                        size="medium"
                                        aspectRatio="4/3"
                                    />
                                    <div className="ml-4 flex-1 min-w-0">
                                        <div className="text-sm font-medium" style={{ color: 'var(--admin-text-primary)' }}>
                                            <span className="truncate block" title={hotel.title}>
                                                {hotel.title}
                                            </span>
                                        </div>
                                        <div className="text-xs" style={{ color: 'var(--admin-text-secondary)' }}>
                                            ID: {hotel.id}
                                        </div>
                                    </div>
                                </div>
                            ),
                            width: '250px'
                        },
                        {
                            key: 'address',
                            title: 'Địa chỉ',
                            width: '200px'
                        },
                        {
                            key: 'city',
                            title: 'Thành phố',
                            width: '120px'
                        },
                        {
                            key: 'rating',
                            title: 'Đánh giá',
                            render: (value) => (
                                <div className="flex items-center">
                                    <Star className="w-4 h-4 text-yellow-500" />
                                    <span className="ml-1 text-sm">
                                        {value ? `${value}/5` : 'Chưa có'}
                                    </span>
                                </div>
                            ),
                            width: '100px'
                        },
                        {
                            key: 'totalRooms',
                            title: 'Số phòng',
                            render: (value) => (value as number) || 'Chưa có',
                            width: '100px'
                        },
                        {
                            key: 'phone',
                            title: 'Liên hệ',
                            render: (_, hotel: HotelData) => (
                                <div className="text-sm">
                                    {hotel.phone && (
                                        <div className="flex items-center">
                                            <Phone className="w-3 h-3 mr-1" />
                                            {hotel.phone}
                                        </div>
                                    )}
                                    {hotel.email && (
                                        <div className="flex items-center mt-1">
                                            <Mail className="w-3 h-3 mr-1" />
                                            {hotel.email}
                                        </div>
                                    )}
                                    {!hotel.phone && !hotel.email && (
                                        <span className="text-gray-500">Không có</span>
                                    )}
                                </div>
                            ),
                            width: '180px'
                        },
                        {
                            key: 'actions',
                            title: 'Thao tác',
                            render: (_, hotel: HotelData) => (
                                <div className="flex space-x-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleViewHotel(hotel);
                                        }}
                                        className="text-blue-600 hover:text-blue-800"
                                        title="Xem chi tiết"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditHotel(hotel);
                                        }}
                                        className="text-green-600 hover:text-green-800"
                                        title="Chỉnh sửa"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteHotel(hotel);
                                        }}
                                        className="text-red-600 hover:text-red-800"
                                        title="Xóa"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ),
                            width: '100px'
                        }
                    ]}
                    searchKey="title"
                    searchPlaceholder="Tìm kiếm theo tên hoặc địa chỉ..."
                    filterOptions={{
                        key: 'city',
                        label: 'thành phố',
                        options: cityOptions.map(city => ({ value: city, label: city }))
                    }}
                    loading={false}
                    emptyMessage="Không có khách sạn nào"
                />




                {/* Modal */}
                <AdminModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title={
                        modalMode === 'create' ? 'Thêm khách sạn mới' :
                        modalMode === 'edit' ? 'Chỉnh sửa khách sạn' :
                        'Chi tiết khách sạn'
                    }
                    size="large"
                >
                    <HotelForm
                        hotel={currentHotel}
                        mode={modalMode}
                        onSave={handleSaveHotel}
                        onCancel={() => setIsModalOpen(false)}
                        cityOptions={cityOptions}
                    />
                </AdminModal>
            </div>
        </div>
    );
};

// Hotel Form Component
interface HotelFormProps {
    hotel: HotelData | null;
    mode: 'create' | 'edit' | 'view';
    onSave: (hotelData: Partial<HotelData>) => void;
    onCancel: () => void;
    cityOptions: string[];
}

const HotelForm: React.FC<HotelFormProps> = ({ hotel, mode, onSave, onCancel, cityOptions }) => {
    const [formData, setFormData] = useState<Partial<HotelData>>({
        title: hotel?.title || '',
        address: hotel?.address || '',
        description: hotel?.description || '',
        city: hotel?.city || '',
        country: hotel?.country || 'Việt Nam',
        phone: hotel?.phone || '',
        email: hotel?.email || '',
        featuredImage: hotel?.featuredImage || '',
        rating: hotel?.rating || 4.0,
        totalRooms: hotel?.totalRooms || 50,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (mode !== 'view') {
            onSave(formData);
        }
    };

    const handleChange = (field: keyof HotelData, value: string | number) => {
        if (mode !== 'view') {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên khách sạn <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        disabled={mode === 'view'}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Địa chỉ <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                        disabled={mode === 'view'}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Thành phố <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={formData.city}
                        onChange={(e) => handleChange('city', e.target.value)}
                        disabled={mode === 'view'}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                    >
                        <option value="">Chọn thành phố</option>
                        {cityOptions.map(city => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quốc gia
                    </label>
                    <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => handleChange('country', e.target.value)}
                        disabled={mode === 'view'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số điện thoại
                    </label>
                    <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        disabled={mode === 'view'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        disabled={mode === 'view'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Đánh giá (1-5)
                    </label>
                    <input
                        type="number"
                        min="1"
                        max="5"
                        step="0.1"
                        value={formData.rating}
                        onChange={(e) => handleChange('rating', parseFloat(e.target.value))}
                        disabled={mode === 'view'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số phòng
                    </label>
                    <input
                        type="number"
                        min="1"
                        value={formData.totalRooms}
                        onChange={(e) => handleChange('totalRooms', parseInt(e.target.value))}
                        disabled={mode === 'view'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả
                </label>
                <textarea
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    disabled={mode === 'view'}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hình ảnh (URL)
                </label>
                <input
                    type="url"
                    value={formData.featuredImage}
                    onChange={(e) => handleChange('featuredImage', e.target.value)}
                    disabled={mode === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <AdminButton
                    type="button"
                    onClick={onCancel}
                    variant="secondary"
                >
                    {mode === 'view' ? 'Đóng' : 'Hủy'}
                </AdminButton>
                {mode !== 'view' && (
                    <AdminButton
                        type="submit"
                        variant="primary"
                    >
                        {mode === 'create' ? 'Tạo mới' : 'Cập nhật'}
                    </AdminButton>
                )}
            </div>
        </form>
    );
};

export default HotelPage;
