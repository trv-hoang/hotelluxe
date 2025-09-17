import React, { useState, useEffect, useMemo } from 'react';
import { Eye, DollarSign, Hotel, CheckCircle, Clock, XCircle, Building2 } from 'lucide-react';
import AdminButton from '../../components/admin/AdminButton';
import AdminModal from '../../components/admin/AdminModal';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminStatCard from '../../components/admin/AdminStatCard';
import AdminAvatarDisplay from '../../components/admin/AdminAvatarDisplay';
import { useNotifications } from '../../hooks/useNotifications';
import { adminApi, type AdminBooking } from '../../api/admin';

// Status Badge Component
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const getStatusConfig = (status: string) => {
        switch (status.toLowerCase()) {
            case 'confirmed':
            case 'completed':
                return {
                    color: 'bg-green-100 text-green-800',
                    icon: CheckCircle,
                    label: 'Đã xác nhận'
                };
            case 'pending':
                return {
                    color: 'bg-yellow-100 text-yellow-800',
                    icon: Clock,
                    label: 'Chờ xử lý'
                };
            case 'cancelled':
                return {
                    color: 'bg-red-100 text-red-800',
                    icon: XCircle,
                    label: 'Đã hủy'
                };
            default:
                return {
                    color: 'bg-gray-100 text-gray-800',
                    icon: Clock,
                    label: status
                };
        }
    };

    const config = getStatusConfig(status);
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
            <Icon className="w-3 h-3" />
            {config.label}
        </span>
    );
};

const BookingsPageFixed: React.FC = () => {
    const { addNotification } = useNotifications();
    const [bookings, setBookings] = useState<AdminBooking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentBooking, setCurrentBooking] = useState<AdminBooking | null>(null);
    const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // Fetch bookings from API
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setIsLoading(true);
                const response = await adminApi.getBookings();
                setBookings(response.data || []);
            } catch (error) {
                console.error('Failed to fetch bookings:', error);
                addNotification({
                    type: 'error',
                    title: 'Lỗi tải dữ liệu',
                    message: 'Không thể tải danh sách đặt phòng'
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookings();
    }, [addNotification]);

    // Statistics calculation
    const statistics = useMemo(() => {
        const totalBookings = bookings.length;
        const confirmedBookings = bookings.filter(booking => 
            booking.status.toLowerCase() === 'confirmed' || booking.status.toLowerCase() === 'completed'
        ).length;
        const pendingBookings = bookings.filter(booking => 
            booking.status.toLowerCase() === 'pending'
        ).length;
        const cancelledBookings = bookings.filter(booking => 
            booking.status.toLowerCase() === 'cancelled'
        ).length;
        const totalRevenue = bookings
            .filter(booking => booking.status.toLowerCase() === 'confirmed' || booking.status.toLowerCase() === 'completed')
            .reduce((sum, booking) => sum + parseFloat(booking.total_amount || '0'), 0);

        return {
            totalBookings,
            confirmedBookings,
            pendingBookings,
            cancelledBookings,
            totalRevenue
        };
    }, [bookings]);

    // Filter bookings based on search and status
    const filteredBookings = useMemo(() => {
        return bookings.filter(booking => {
            const matchesSearch = 
                booking.booking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.hotel.title.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesStatus = filterStatus === 'all' || booking.status.toLowerCase() === filterStatus.toLowerCase();
            
            return matchesSearch && matchesStatus;
        });
    }, [bookings, searchTerm, filterStatus]);

    // Modal handlers
    const handleViewBooking = (booking: AdminBooking) => {
        setCurrentBooking(booking);
        setModalMode('view');
        setIsModalOpen(true);
    };



    const handleUpdateStatus = async (booking: AdminBooking, newStatus: string) => {
        try {
            await adminApi.updateBookingStatus(booking.id, newStatus);
            setBookings(bookings.map(b => 
                b.id === booking.id 
                    ? { ...b, status: newStatus }
                    : b
            ));
            addNotification({
                type: 'success',
                title: 'Cập nhật thành công',
                message: `Đã cập nhật trạng thái đặt phòng ${booking.booking_number}`
            });
        } catch (error) {
            console.error('Failed to update booking status:', error);
            addNotification({
                type: 'error',
                title: 'Lỗi cập nhật',
                message: 'Không thể cập nhật trạng thái đặt phòng'
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
                title="Quản lý đặt phòng"
                description="Quản lý tất cả đặt phòng và trạng thái thanh toán"
            />

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <AdminStatCard
                    title="Tổng đặt phòng"
                    value={statistics.totalBookings}
                    icon={Hotel}
                    iconColor="text-blue-600"
                    iconBgColor="bg-blue-100"
                />
                <AdminStatCard
                    title="Đã xác nhận"
                    value={statistics.confirmedBookings}
                    icon={CheckCircle}
                    iconColor="text-green-600"
                    iconBgColor="bg-green-100"
                />
                <AdminStatCard
                    title="Chờ xử lý"
                    value={statistics.pendingBookings}
                    icon={Clock}
                    iconColor="text-yellow-600"
                    iconBgColor="bg-yellow-100"
                />
                <AdminStatCard
                    title="Đã hủy"
                    value={statistics.cancelledBookings}
                    icon={XCircle}
                    iconColor="text-red-600"
                    iconBgColor="bg-red-100"
                />
                <AdminStatCard
                    title="Tổng doanh thu"
                    value={`${new Intl.NumberFormat('vi-VN').format(statistics.totalRevenue)} VND`}
                    icon={DollarSign}
                    iconColor="text-green-600"
                    iconBgColor="bg-green-100"
                />
            </div>

            {/* Bookings Table */}
            <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">
                            Danh sách đặt phòng
                        </h3>
                    </div>

                    {/* Search and Filter */}
                    <div className="flex gap-4 mb-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo mã đặt phòng, tên khách hàng, email hoặc khách sạn..."
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
                                <option value="confirmed">Đã xác nhận</option>
                                <option value="pending">Chờ xử lý</option>
                                <option value="cancelled">Đã hủy</option>
                                <option value="completed">Hoàn thành</option>
                            </select>
                        </div>
                    </div>
                    
                    {/* Custom Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Mã đặt phòng
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Khách hàng
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Khách sạn
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tổng tiền
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Trạng thái
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ngày tạo
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredBookings.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                            Không có dữ liệu đặt phòng
                                        </td>
                                    </tr>
                                ) : (
                                    filteredBookings.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-blue-600">
                                                    #{booking.booking_number}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <AdminAvatarDisplay 
                                                        src={booking.user.profile_pic || undefined} 
                                                        alt={booking.user.name}
                                                        size="small"
                                                    />
                                                    <div className="ml-3">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {booking.user.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {booking.user.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {booking.hotel.title}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {new Intl.NumberFormat('vi-VN').format(parseFloat(booking.hotel.price_per_night))} VND/đêm
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-green-600">
                                                    {new Intl.NumberFormat('vi-VN').format(parseFloat(booking.total_amount))} VND
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <StatusBadge status={booking.status} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(booking.created_at).toLocaleDateString('vi-VN')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex space-x-2">
                                                    <AdminButton
                                                        variant="secondary"
                                                        size="small"
                                                        onClick={() => handleViewBooking(booking)}
                                                        title="Xem chi tiết đặt phòng"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </AdminButton>
                                                    {booking.status.toLowerCase() === 'pending' && (
                                                        <>
                                                            <AdminButton
                                                                variant="success"
                                                                size="small"
                                                                onClick={() => handleUpdateStatus(booking, 'confirmed')}
                                                                title="Xác nhận đặt phòng"
                                                            >
                                                                <CheckCircle className="w-4 h-4" />
                                                            </AdminButton>
                                                            <AdminButton
                                                                variant="danger"
                                                                size="small"
                                                                onClick={() => handleUpdateStatus(booking, 'cancelled')}
                                                                title="Hủy đặt phòng"
                                                            >
                                                                <XCircle className="w-4 h-4" />
                                                            </AdminButton>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Results count */}
                    {filteredBookings.length > 0 && (
                        <div className="px-6 py-3 bg-gray-50 border-t text-sm text-gray-600 mt-4">
                            Hiển thị {filteredBookings.length} / {bookings.length} kết quả
                        </div>
                    )}
                </div>
            </div>

            {/* Booking Modal */}
            <AdminModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={
                    modalMode === 'view' ? 'Chi tiết đặt phòng' : 'Chỉnh sửa đặt phòng'
                }
            >
                <BookingForm 
                    booking={currentBooking}
                    onUpdateStatus={handleUpdateStatus}
                    onCancel={() => setIsModalOpen(false)}
                />
            </AdminModal>
        </div>
    );
};

// Booking Form Component
interface BookingFormProps {
    booking: AdminBooking | null;
    onUpdateStatus: (booking: AdminBooking, status: string) => Promise<void>;
    onCancel: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ booking, onUpdateStatus, onCancel }) => {
    const [isUpdating, setIsUpdating] = useState(false);

    if (!booking) {
        return (
            <div className="p-6 text-center text-gray-500">
                Không có thông tin đặt phòng
            </div>
        );
    }

    const handleStatusUpdate = async (status: string) => {
        setIsUpdating(true);
        try {
            await onUpdateStatus(booking, status);
            onCancel();
        } catch (error) {
            console.error('Failed to update status:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Booking Information */}
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mã đặt phòng
                    </label>
                    <p className="text-sm text-blue-600 font-medium">#{booking.booking_number}</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Trạng thái hiện tại
                    </label>
                    <StatusBadge status={booking.status} />
                </div>
            </div>

            {/* Customer Information */}
            <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Thông tin khách hàng</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên khách hàng
                        </label>
                        <div className="flex items-center">
                            <AdminAvatarDisplay 
                                src={booking.user.profile_pic || undefined} 
                                alt={booking.user.name}
                                size="small"
                            />
                            <span className="ml-2 text-sm">{booking.user.name}</span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <p className="text-sm text-gray-600">{booking.user.email}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Vai trò
                        </label>
                        <p className="text-sm text-gray-600 capitalize">{booking.user.role}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Số điện thoại
                        </label>
                        <p className="text-sm text-gray-600">{booking.user.phone || 'Chưa có'}</p>
                    </div>
                </div>
            </div>

            {/* Hotel Information */}
            <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Thông tin khách sạn</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên khách sạn
                        </label>
                        <p className="text-sm text-gray-600">{booking.hotel.title}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Giá phòng/đêm
                        </label>
                        <p className="text-sm text-green-600 font-medium">
                            {new Intl.NumberFormat('vi-VN').format(parseFloat(booking.hotel.price_per_night))} VND
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Đánh giá
                        </label>
                        <p className="text-sm text-gray-600">
                            {booking.hotel.review_score}/5 ⭐ ({booking.hotel.review_count} đánh giá)
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Trạng thái khách sạn
                        </label>
                        <p className="text-sm text-gray-600">
                            {booking.hotel.is_active ? 'Đang hoạt động' : 'Tạm dừng'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Payment Information */}
            <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Thông tin thanh toán</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tổng tiền
                        </label>
                        <p className="text-lg font-semibold text-green-600">
                            {new Intl.NumberFormat('vi-VN').format(parseFloat(booking.total_amount))} VND
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ngày đặt
                        </label>
                        <p className="text-sm text-gray-600">
                            {new Date(booking.created_at).toLocaleString('vi-VN')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-4 border-t border-gray-200">
                <AdminButton
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                >
                    Đóng
                </AdminButton>
                
                {booking.status.toLowerCase() === 'pending' && (
                    <div className="flex space-x-3">
                        <AdminButton
                            variant="success"
                            onClick={() => handleStatusUpdate('confirmed')}
                            disabled={isUpdating}
                        >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Xác nhận
                        </AdminButton>
                        <AdminButton
                            variant="danger"
                            onClick={() => handleStatusUpdate('cancelled')}
                            disabled={isUpdating}
                        >
                            <XCircle className="w-4 h-4 mr-2" />
                            Hủy bỏ
                        </AdminButton>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingsPageFixed;