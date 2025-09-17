import React, { useState, useEffect, useMemo } from 'react';
import { Edit, Eye, Plus, Building2, Star, Users, Trash2, CheckCircle, XCircle } from 'lucide-react';
import AdminButton from '../../components/admin/AdminButton';
import AdminModal from '../../components/admin/AdminModal';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminStatCard from '../../components/admin/AdminStatCard';
import { useNotifications } from '../../hooks/useNotifications';
import { adminApi, type AdminHotel } from '../../api/admin';

// Status Badge Component
const StatusBadge: React.FC<{ isActive: boolean }> = ({ isActive }) => {
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
        }`}>
            {isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
            {isActive ? 'Hoạt động' : 'Tạm dừng'}
        </span>
    );
};

const HotelPageFixed: React.FC = () => {
    const { addNotification } = useNotifications();
    const [hotels, setHotels] = useState<AdminHotel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentHotel, setCurrentHotel] = useState<AdminHotel | null>(null);
    const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // Fetch hotels from API
    useEffect(() => {
        const fetchHotels = async () => {
            try {
                setIsLoading(true);
                const paginatedResponse = await adminApi.getHotels();
                console.log('Hotels API response:', paginatedResponse);
                
                // Handle Laravel pagination response
                let hotelsData: AdminHotel[] = [];
                
                if (Array.isArray(paginatedResponse)) {
                    // Direct array response
                    hotelsData = paginatedResponse;
                } else if (paginatedResponse && Array.isArray(paginatedResponse.data)) {
                    // Laravel paginated response: { data: [...], current_page: 1, ... }
                    hotelsData = paginatedResponse.data;
                } else {
                    console.warn('Unexpected API response structure, using empty array:', paginatedResponse);
                    hotelsData = [];
                }
                
                console.log('Parsed hotels data:', hotelsData);
                setHotels(hotelsData);
            } catch (error) {
                console.error('Failed to fetch hotels:', error);
                addNotification({
                    type: 'error',
                    title: 'Lỗi tải dữ liệu',
                    message: 'Không thể tải danh sách khách sạn'
                });
                // Set empty array to prevent filter error
                setHotels([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHotels();
    }, [addNotification]);

    // Statistics calculation
    const statistics = useMemo(() => {
        // Ensure hotels is always an array
        const hotelsArray = Array.isArray(hotels) ? hotels : [];
        
        const totalHotels = hotelsArray.length;
        const activeHotels = hotelsArray.filter(hotel => hotel.is_active).length;
        const inactiveHotels = totalHotels - activeHotels;
        const totalReviews = hotelsArray.reduce((sum, hotel) => sum + (hotel.review_count || 0), 0);
        const averageRating = hotelsArray.length > 0 
            ? hotelsArray.reduce((sum, hotel) => sum + parseFloat(hotel.review_score || '0'), 0) / hotelsArray.length
            : 0;

        return {
            totalHotels,
            activeHotels,
            inactiveHotels,
            totalReviews,
            averageRating: Math.round(averageRating * 10) / 10
        };
    }, [hotels]);

    // Filter hotels based on search and status
    const filteredHotels = useMemo(() => {
        // Ensure hotels is always an array
        const hotelsArray = Array.isArray(hotels) ? hotels : [];
        
        return hotelsArray.filter(hotel => {
            const matchesSearch = hotel.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = filterStatus === 'all' || 
                (filterStatus === 'active' && hotel.is_active) ||
                (filterStatus === 'inactive' && !hotel.is_active);
            return matchesSearch && matchesStatus;
        });
    }, [hotels, searchTerm, filterStatus]);

    // Modal handlers
    const handleCreateHotel = () => {
        setCurrentHotel(null);
        setModalMode('create');
        setIsModalOpen(true);
    };

    const handleEditHotel = (hotel: AdminHotel) => {
        setCurrentHotel(hotel);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleViewHotel = (hotel: AdminHotel) => {
        setCurrentHotel(hotel);
        setModalMode('view');
        setIsModalOpen(true);
    };

    const handleDeleteHotel = async (hotel: AdminHotel) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa khách sạn "${hotel.title}"?`)) {
            return;
        }

        try {
            await adminApi.deleteHotel(hotel.id);
            // Ensure hotels is an array before filtering
            const hotelsArray = Array.isArray(hotels) ? hotels : [];
            setHotels(hotelsArray.filter(h => h.id !== hotel.id));
            addNotification({
                type: 'success',
                title: 'Xóa thành công',
                message: `Đã xóa khách sạn ${hotel.title}`
            });
        } catch (error) {
            console.error('Failed to delete hotel:', error);
            addNotification({
                type: 'error',
                title: 'Lỗi xóa khách sạn',
                message: 'Không thể xóa khách sạn. Vui lòng thử lại.'
            });
        }
    };

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
                        {[1,2,3,4,5].map(i => (
                            <div key={i} className="bg-gray-200 h-24 rounded"></div>
                        ))}
                    </div>
                    <div className="bg-gray-200 h-96 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Page Header */}
            <AdminPageHeader 
                title="Quản lý khách sạn"
                description="Quản lý danh sách khách sạn và trạng thái hoạt động"
            />

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <AdminStatCard
                    title="Tổng khách sạn"
                    value={statistics.totalHotels}
                    icon={Building2}
                    iconColor="text-blue-600"
                    iconBgColor="bg-blue-100"
                />
                <AdminStatCard
                    title="Đang hoạt động"
                    value={statistics.activeHotels}
                    icon={CheckCircle}
                    iconColor="text-green-600"
                    iconBgColor="bg-green-100"
                />
                <AdminStatCard
                    title="Tạm dừng"
                    value={statistics.inactiveHotels}
                    icon={XCircle}
                    iconColor="text-red-600"
                    iconBgColor="bg-red-100"
                />
                <AdminStatCard
                    title="Tổng đánh giá"
                    value={statistics.totalReviews}
                    icon={Users}
                    iconColor="text-purple-600"
                    iconBgColor="bg-purple-100"
                />
                <AdminStatCard
                    title="Điểm TB"
                    value={`${statistics.averageRating}/5`}
                    icon={Star}
                    iconColor="text-yellow-600"
                    iconBgColor="bg-yellow-100"
                />
            </div>

            {/* Hotels Table */}
            <div 
                className="rounded-lg shadow admin-card"
                style={{ 
                    background: 'var(--admin-bg-primary)',
                    border: '1px solid var(--admin-border-primary)'
                }}
            >
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 
                            className="text-lg font-medium"
                            style={{ color: 'var(--admin-text-primary)' }}
                        >
                            Danh sách khách sạn
                        </h3>
                        <AdminButton
                            variant="primary"
                            onClick={handleCreateHotel}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Thêm khách sạn
                        </AdminButton>
                    </div>

                    {/* Search and Filter */}
                    <div className="flex gap-4 mb-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Tìm kiếm khách sạn..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="admin-input"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '6px',
                                    border: '1px solid var(--admin-border-primary)',
                                    background: 'var(--admin-bg-primary)',
                                    color: 'var(--admin-text-primary)',
                                    fontSize: '14px',
                                    fontFamily: 'inherit',
                                    outline: 'none',
                                    transition: 'all 0.2s ease'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = 'var(--admin-sidebar-active)';
                                    e.target.style.boxShadow = '0 0 0 2px rgba(14, 165, 233, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'var(--admin-border-primary)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                        <div className="min-w-[200px]">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="admin-select"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '6px',
                                    border: '1px solid var(--admin-border-primary)',
                                    background: 'var(--admin-bg-primary)',
                                    color: 'var(--admin-text-primary)',
                                    fontSize: '14px',
                                    fontFamily: 'inherit',
                                    outline: 'none',
                                    transition: 'all 0.2s ease',
                                    cursor: 'pointer',
                                    appearance: 'none',
                                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 12px center',
                                    backgroundSize: '16px',
                                    paddingRight: '40px'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = 'var(--admin-sidebar-active)';
                                    e.target.style.boxShadow = '0 0 0 2px rgba(14, 165, 233, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'var(--admin-border-primary)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            >
                                <option value="all">Tất cả trạng thái</option>
                                <option value="active">Đang hoạt động</option>
                                <option value="inactive">Tạm dừng</option>
                            </select>
                        </div>
                    </div>
                    
                    {/* Custom Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full admin-table">
                            <thead style={{ background: 'var(--admin-bg-secondary)' }}>
                                <tr>
                                    <th 
                                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                                        style={{ 
                                            color: 'var(--admin-text-primary)',
                                            borderBottom: '1px solid var(--admin-border-primary)'
                                        }}
                                    >
                                        ID
                                    </th>
                                    <th 
                                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                                        style={{ 
                                            color: 'var(--admin-text-primary)',
                                            borderBottom: '1px solid var(--admin-border-primary)'
                                        }}
                                    >
                                        Khách sạn
                                    </th>
                                    <th 
                                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                                        style={{ 
                                            color: 'var(--admin-text-primary)',
                                            borderBottom: '1px solid var(--admin-border-primary)'
                                        }}
                                    >
                                        Giá/đêm
                                    </th>
                                    <th 
                                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                                        style={{ 
                                            color: 'var(--admin-text-primary)',
                                            borderBottom: '1px solid var(--admin-border-primary)'
                                        }}
                                    >
                                        Đánh giá
                                    </th>
                                    <th 
                                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                                        style={{ 
                                            color: 'var(--admin-text-primary)',
                                            borderBottom: '1px solid var(--admin-border-primary)'
                                        }}
                                    >
                                        Trạng thái
                                    </th>
                                    <th 
                                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                                        style={{ 
                                            color: 'var(--admin-text-primary)',
                                            borderBottom: '1px solid var(--admin-border-primary)'
                                        }}
                                    >
                                        Ngày tạo
                                    </th>
                                    <th 
                                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                                        style={{ 
                                            color: 'var(--admin-text-primary)',
                                            borderBottom: '1px solid var(--admin-border-primary)'
                                        }}
                                    >
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody style={{ background: 'var(--admin-bg-primary)' }}>
                                {filteredHotels.length === 0 ? (
                                    <tr>
                                        <td 
                                            colSpan={7} 
                                            className="px-6 py-12 text-center"
                                            style={{ 
                                                color: 'var(--admin-text-secondary)',
                                                borderBottom: '1px solid var(--admin-border-secondary)'
                                            }}
                                        >
                                            Không có dữ liệu khách sạn
                                        </td>
                                    </tr>
                                ) : (
                                    filteredHotels.map((hotel) => (
                                        <tr 
                                            key={hotel.id}
                                            style={{ 
                                                transition: 'background-color 0.2s ease',
                                                borderBottom: '1px solid var(--admin-border-secondary)'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = 'var(--admin-bg-hover)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = 'var(--admin-bg-primary)';
                                            }}
                                        >
                                            <td 
                                                className="px-6 py-4 whitespace-nowrap text-sm font-medium"
                                                style={{ color: 'var(--admin-text-primary)' }}
                                            >
                                                #{hotel.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div 
                                                    className="text-sm font-medium"
                                                    style={{ color: 'var(--admin-text-primary)' }}
                                                >
                                                    {hotel.title}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-green-600">
                                                    {new Intl.NumberFormat('vi-VN').format(parseFloat(hotel.price_per_night))} VND
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                                                    <span 
                                                        className="text-sm font-medium"
                                                        style={{ color: 'var(--admin-text-primary)' }}
                                                    >
                                                        {hotel.review_score}/5
                                                    </span>
                                                    <span 
                                                        className="text-sm ml-1"
                                                        style={{ color: 'var(--admin-text-secondary)' }}
                                                    >
                                                        ({hotel.review_count} đánh giá)
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <StatusBadge isActive={hotel.is_active} />
                                            </td>
                                            <td 
                                                className="px-6 py-4 whitespace-nowrap text-sm"
                                                style={{ color: 'var(--admin-text-secondary)' }}
                                            >
                                                {new Date(hotel.created_at).toLocaleDateString('vi-VN')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex space-x-2">
                                                    <AdminButton
                                                        variant="secondary"
                                                        size="small"
                                                        onClick={() => handleViewHotel(hotel)}
                                                        style={{ padding: '0.375rem' }}
                                                        title="Xem chi tiết khách sạn"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </AdminButton>
                                                    <AdminButton
                                                        variant="warning"
                                                        size="small"
                                                        onClick={() => handleEditHotel(hotel)}
                                                        style={{ padding: '0.375rem' }}
                                                        title="Chỉnh sửa thông tin khách sạn"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </AdminButton>
                                                    <AdminButton
                                                        variant="danger"
                                                        size="small"
                                                        onClick={() => handleDeleteHotel(hotel)}
                                                        style={{ padding: '0.375rem' }}
                                                        title="Xóa khách sạn vĩnh viễn"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </AdminButton>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Results count */}
                    {filteredHotels.length > 0 && (
                        <div 
                            className="px-6 py-3 text-sm mt-4"
                            style={{ 
                                background: 'var(--admin-bg-secondary)', 
                                borderTop: '1px solid var(--admin-border-primary)',
                                color: 'var(--admin-text-secondary)'
                            }}
                        >
                            Hiển thị {filteredHotels.length} / {Array.isArray(hotels) ? hotels.length : 0} kết quả
                        </div>
                    )}
                </div>
            </div>

            {/* Hotel Modal */}
            <AdminModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={
                    modalMode === 'create' ? 'Thêm khách sạn mới' :
                    modalMode === 'edit' ? 'Chỉnh sửa khách sạn' :
                    'Thông tin chi tiết khách sạn'
                }
            >
                <HotelForm 
                    hotel={currentHotel}
                    mode={modalMode}
                    onCancel={() => setIsModalOpen(false)}
                />
            </AdminModal>
        </div>
    );
};

// Hotel Form Component - Simple read-only for now
interface HotelFormProps {
    hotel: AdminHotel | null;
    mode: 'create' | 'edit' | 'view';
    onCancel: () => void;
    onSuccess?: (hotel: AdminHotel) => void;
}

const HotelForm: React.FC<HotelFormProps> = ({ hotel, mode, onCancel }) => {
    if (!hotel && mode !== 'create') {
        return (
            <div className="p-6 text-center text-gray-500">
                Không có thông tin khách sạn
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {hotel && (
                <>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            ID Khách sạn
                        </label>
                        <input
                            type="text"
                            value={`#${hotel.id}`}
                            readOnly
                            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên khách sạn
                        </label>
                        <input
                            type="text"
                            value={hotel.title}
                            readOnly
                            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Giá mỗi đêm
                            </label>
                            <input
                                type="text"
                                value={`${new Intl.NumberFormat('vi-VN').format(parseFloat(hotel.price_per_night))} VND`}
                                readOnly
                                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Trạng thái
                            </label>
                            <input
                                type="text"
                                value={hotel.is_active ? 'Đang hoạt động' : 'Tạm dừng'}
                                readOnly
                                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Điểm đánh giá
                            </label>
                            <input
                                type="text"
                                value={`${hotel.review_score}/5`}
                                readOnly
                                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Số lượt đánh giá
                            </label>
                            <input
                                type="text"
                                value={`${hotel.review_count} đánh giá`}
                                readOnly
                                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ngày tạo
                        </label>
                        <input
                            type="text"
                            value={new Date(hotel.created_at).toLocaleString('vi-VN')}
                            readOnly
                            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                        />
                    </div>
                </>
            )}

            {(mode === 'create' || mode === 'edit') && (
                <HotelEditForm 
                    hotel={hotel} 
                    mode={mode} 
                    onCancel={onCancel} 
                    onSuccess={() => {
                        onCancel(); // Close modal
                        // Refresh page to show updated data
                        window.location.reload();
                    }} 
                />
            )}

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <AdminButton
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                >
                    Đóng
                </AdminButton>
            </div>
        </div>
    );
};

// Hotel Edit Form Component for Create/Edit
interface HotelEditFormProps {
    hotel: AdminHotel | null;
    mode: 'create' | 'edit' | 'view';
    onCancel: () => void;
    onSuccess: () => void;
}

const HotelEditForm: React.FC<HotelEditFormProps> = ({ hotel, mode, onCancel, onSuccess }) => {
    const { addNotification } = useNotifications();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: hotel?.title || '',
        description: hotel?.description || '',
        address: hotel?.address || '',
        price_per_night: hotel?.price_per_night ? Number(hotel.price_per_night) : 0,
        category_id: hotel?.category_id || 1,
        latitude: hotel?.latitude || null,
        longitude: hotel?.longitude || null,
        max_guests: hotel?.max_guests || 2,
        bedrooms: hotel?.bedrooms || 1,
        bathrooms: hotel?.bathrooms || 1,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (mode === 'create') {
                await adminApi.createHotel(formData);
                addNotification({
                    type: 'success',
                    title: 'Thành công',
                    message: 'Tạo khách sạn mới thành công!'
                });
            } else if (mode === 'edit' && hotel) {
                // Convert formData to match AdminHotel interface
                const updateData: Partial<AdminHotel> = {
                    title: formData.title,
                    description: formData.description,
                    address: formData.address,
                    price_per_night: String(formData.price_per_night),
                    category_id: formData.category_id,
                    latitude: formData.latitude || undefined,
                    longitude: formData.longitude || undefined,
                    max_guests: formData.max_guests,
                    bedrooms: formData.bedrooms,
                    bathrooms: formData.bathrooms,
                };
                await adminApi.updateHotel(hotel.id, updateData);
                addNotification({
                    type: 'success',
                    title: 'Thành công',
                    message: 'Cập nhật khách sạn thành công!'
                });
            }
            onSuccess();
        } catch (error) {
            console.error('Hotel operation failed:', error);
            addNotification({
                type: 'error',
                title: 'Lỗi',
                message: mode === 'create' ? 'Không thể tạo khách sạn' : 'Không thể cập nhật khách sạn'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên khách sạn *
                    </label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="admin-input w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Giá mỗi đêm (VND) *
                    </label>
                    <input
                        type="number"
                        value={formData.price_per_night}
                        onChange={(e) => setFormData({...formData, price_per_night: Number(e.target.value)})}
                        className="admin-input w-full p-2 border border-gray-300 rounded-md"
                        min="0"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ *
                </label>
                <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="admin-input w-full p-2 border border-gray-300 rounded-md"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả *
                </label>
                <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={4}
                    className="admin-input w-full p-2 border border-gray-300 rounded-md"
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số khách tối đa
                    </label>
                    <input
                        type="number"
                        value={formData.max_guests}
                        onChange={(e) => setFormData({...formData, max_guests: Number(e.target.value)})}
                        className="admin-input w-full p-2 border border-gray-300 rounded-md"
                        min="1"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số phòng ngủ
                    </label>
                    <input
                        type="number"
                        value={formData.bedrooms}
                        onChange={(e) => setFormData({...formData, bedrooms: Number(e.target.value)})}
                        className="admin-input w-full p-2 border border-gray-300 rounded-md"
                        min="0"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số phòng tắm
                    </label>
                    <input
                        type="number"
                        value={formData.bathrooms}
                        onChange={(e) => setFormData({...formData, bathrooms: Number(e.target.value)})}
                        className="admin-input w-full p-2 border border-gray-300 rounded-md"
                        min="0"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Vĩ độ (Latitude)
                    </label>
                    <input
                        type="number"
                        step="any"
                        value={formData.latitude || ''}
                        onChange={(e) => setFormData({...formData, latitude: e.target.value ? Number(e.target.value) : null})}
                        className="admin-input w-full p-2 border border-gray-300 rounded-md"
                        placeholder="10.7769"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kinh độ (Longitude)
                    </label>
                    <input
                        type="number"
                        step="any"
                        value={formData.longitude || ''}
                        onChange={(e) => setFormData({...formData, longitude: e.target.value ? Number(e.target.value) : null})}
                        className="admin-input w-full p-2 border border-gray-300 rounded-md"
                        placeholder="106.7009"
                    />
                </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <AdminButton
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    Hủy
                </AdminButton>
                <AdminButton
                    type="submit"
                    variant="primary"
                    disabled={isLoading}
                >
                    {isLoading ? 'Đang xử lý...' : (mode === 'create' ? 'Tạo khách sạn' : 'Cập nhật')}
                </AdminButton>
            </div>
        </form>
    );
};

export default HotelPageFixed;