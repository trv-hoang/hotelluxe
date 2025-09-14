
import React, { useState, useMemo } from 'react';
import { Edit, Trash2, Eye, Plus, Search, Building2, MapPin, Star, Phone, Mail, Users } from 'lucide-react';
import AdminButton from '../../components/admin/AdminButton';
import AdminModal from '../../components/admin/AdminModal';
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
    const [searchTerm, setSearchTerm] = useState('');
    const [cityFilter, setCityFilter] = useState('all');

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

    // Filtered hotels
    const filteredHotels = useMemo(() => {
        return hotels.filter(hotel => {
            const matchesSearch = hotel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                hotel.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                hotel.city.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCity = cityFilter === 'all' || hotel.city === cityFilter;
            return matchesSearch && matchesCity;
        });
    }, [hotels, searchTerm, cityFilter]);

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
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Quản lý khách sạn
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Quản lý danh sách khách sạn, thêm, sửa, xóa thông tin khách sạn
                            </p>
                        </div>
                        <AdminButton
                            onClick={handleCreateHotel}
                            variant="primary"
                            className="flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Thêm khách sạn
                        </AdminButton>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-600 text-sm font-medium">Tổng khách sạn</p>
                                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                                        {statistics.totalHotels}
                                    </p>
                                </div>
                                <Building2 className="w-8 h-8 text-blue-500" />
                            </div>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg border border-green-200 dark:border-green-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-600 text-sm font-medium">Tổng phòng</p>
                                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                                        {statistics.totalRooms}
                                    </p>
                                </div>
                                <Users className="w-8 h-8 text-green-500" />
                            </div>
                        </div>

                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-yellow-600 text-sm font-medium">Đánh giá TB</p>
                                    <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                                        {statistics.averageRating}/5
                                    </p>
                                </div>
                                <Star className="w-8 h-8 text-yellow-500" />
                            </div>
                        </div>

                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-600 text-sm font-medium">Thành phố</p>
                                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                                        {statistics.citiesCount}
                                    </p>
                                </div>
                                <MapPin className="w-8 h-8 text-purple-500" />
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tên hoặc địa chỉ..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 dark:text-white"
                            />
                        </div>
                        <select
                            value={cityFilter}
                            onChange={(e) => setCityFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 dark:text-white"
                        >
                            <option value="all">Tất cả thành phố</option>
                            {cityOptions.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Hotels Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Khách sạn
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Địa chỉ
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thành phố
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Đánh giá
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Số phòng
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Liên hệ
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredHotels.map((hotel) => (
                                    <tr key={hotel.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <img
                                                    className="h-12 w-16 rounded-lg object-cover"
                                                    src={hotel.featuredImage}
                                                    alt={hotel.title}
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = '/src/assets/travels/default.jpg';
                                                    }}
                                                />
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {hotel.title}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        ID: {hotel.id}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 max-w-xs truncate">
                                                {hotel.address}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-900 dark:text-white">
                                                <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                                                {hotel.city}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                                                <span className="text-sm text-gray-900 dark:text-white">
                                                    {hotel.rating}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 dark:text-white">
                                                {hotel.totalRooms} phòng
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 dark:text-white">
                                                <div className="flex items-center mb-1">
                                                    <Phone className="w-3 h-3 mr-1 text-gray-400" />
                                                    {hotel.phone}
                                                </div>
                                                <div className="flex items-center">
                                                    <Mail className="w-3 h-3 mr-1 text-gray-400" />
                                                    <span className="truncate max-w-32">{hotel.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => handleViewHotel(hotel)}
                                                    className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-300"
                                                    title="Xem chi tiết"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleEditHotel(hotel)}
                                                    className="text-yellow-600 hover:text-yellow-900 dark:hover:text-yellow-300"
                                                    title="Chỉnh sửa"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteHotel(hotel)}
                                                    className="text-red-600 hover:text-red-900 dark:hover:text-red-300"
                                                    title="Xóa"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredHotels.length === 0 && (
                        <div className="text-center py-12">
                            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                                Không tìm thấy khách sạn
                            </h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác.
                            </p>
                        </div>
                    )}
                </div>

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
