import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Edit, Trash2, Eye, Plus, Calendar, DollarSign, Hotel, CheckCircle, Clock, XCircle } from 'lucide-react';
import AdminButton from '../../components/admin/AdminButton';
import AdminModal from '../../components/admin/AdminModal';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminStatCard from '../../components/admin/AdminStatCard';
import AdminLoadingSpinner from '../../components/admin/AdminLoadingSpinner';
import AdminDataTable from '../../components/admin/AdminDataTable';
import { formatCurrency, formatDate, generateBookingNumber, calculateNights } from '../../utils/calculatorPrice';
import homeStayData from '../../data/jsons/__homeStay.json';
import usersData from '../../data/jsons/__users.json';
import { useNotifications } from '../../hooks/useNotifications';

// Booking interface
interface BookingData {
    id: number;
    bookingNumber: string;
    hotelId: number;
    customerId: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    checkIn: string;
    checkOut: string;
    nights: number;
    paymentStatus: 'paid' | 'pending' | 'failed';
    totalAmount: number;
    pricePerNight: number;
    createdAt: string;
    updatedAt: string;
    [key: string]: unknown;
}

// Generate mock bookings từ JSON data
const generateMockBookings = (): BookingData[] => {
    const paymentStatuses: BookingData['paymentStatus'][] = ['paid', 'pending', 'failed'];
    
    return homeStayData.slice(0, 20).map((hotel, idx) => {
        const customer = usersData[idx % usersData.length];
        const checkInDate = new Date();
        checkInDate.setDate(checkInDate.getDate() + Math.floor(Math.random() * 30));
        const checkOutDate = new Date(checkInDate);
        const nights = Math.floor(Math.random() * 7) + 1;
        checkOutDate.setDate(checkOutDate.getDate() + nights);
        
        const pricePerNight = typeof hotel.price === 'string' 
            ? parseFloat((hotel.price as string).replace(/[^\d]/g, '')) || 500000
            : (hotel.price as number) || 500000;
        
        return {
            id: idx + 1,
            bookingNumber: generateBookingNumber(idx),
            hotelId: hotel.id,
            customerId: customer.id,
            customerName: customer.name,
            customerEmail: customer.email,
            customerPhone: customer.phone || '0912345678',
            checkIn: checkInDate.toISOString().split('T')[0],
            checkOut: checkOutDate.toISOString().split('T')[0],
            nights,
            paymentStatus: paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],
            totalAmount: pricePerNight * nights,
            pricePerNight,
            createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date().toISOString()
        };
    });
};

const BookingsPage: React.FC = () => {
    const [bookings, setBookings] = useState<BookingData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<'view' | 'edit' | 'create' | 'delete'>('view');
    const [formData, setFormData] = useState<Partial<BookingData>>({});
    const { addNotification } = useNotifications();

    // Load bookings data
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading
                const mockBookings = generateMockBookings();
                setBookings(mockBookings);
            } catch (error) {
                console.error('Error loading bookings:', error);
                addNotification({
                    type: 'error',
                    title: 'Lỗi',
                    message: 'Failed to load bookings data'
                });
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [addNotification]);

    // Statistics calculations
    const statistics = useMemo(() => {
        const totalBookings = bookings.length;
        const totalRevenue = bookings
            .filter(b => b.paymentStatus === 'paid')
            .reduce((sum, b) => sum + b.totalAmount, 0);
        const paidBookings = bookings.filter(b => b.paymentStatus === 'paid').length;
        const pendingBookings = bookings.filter(b => b.paymentStatus === 'pending').length;

        return {
            totalBookings,
            totalRevenue,
            paidBookings,
            pendingBookings
        };
    }, [bookings]);

    // AdminDataTable handles filtering internally

    // Get hotel info
    const getHotelInfo = useCallback((hotelId: number) => {
        return homeStayData.find(hotel => hotel.id === hotelId);
    }, []);

    // Handle create booking
    const handleCreate = useCallback(() => {
        setFormData({
            customerName: '',
            customerEmail: '',
            customerPhone: '',
            checkIn: '',
            checkOut: '',
            paymentStatus: 'pending',
            hotelId: homeStayData[0]?.id || 1
        });
        setModalType('create');
        setShowModal(true);
    }, []);

    // Handle edit booking
    const handleEdit = useCallback((booking: BookingData) => {
        setSelectedBooking(booking);
        setFormData(booking);
        setModalType('edit');
        setShowModal(true);
    }, []);

    // Handle view booking
    const handleView = useCallback((booking: BookingData) => {
        setSelectedBooking(booking);
        setModalType('view');
        setShowModal(true);
    }, []);

    // Handle delete booking
    const handleDelete = useCallback((booking: BookingData) => {
        setSelectedBooking(booking);
        setModalType('delete');
        setShowModal(true);
    }, []);

    // Handle form submit
    const handleSubmit = useCallback(async () => {
        try {
            if (modalType === 'create') {
                const newBooking: BookingData = {
                    id: Math.max(...bookings.map(b => b.id)) + 1,
                    bookingNumber: generateBookingNumber(bookings.length),
                    hotelId: formData.hotelId!,
                    customerId: 1, // Default customer
                    customerName: formData.customerName!,
                    customerEmail: formData.customerEmail!,
                    customerPhone: formData.customerPhone!,
                    checkIn: formData.checkIn!,
                    checkOut: formData.checkOut!,
                    nights: calculateNights(formData.checkIn!, formData.checkOut!),
                    paymentStatus: formData.paymentStatus!,
                    totalAmount: 0, // Will be calculated
                    pricePerNight: 500000, // Default price
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };

                // Calculate total amount
                const hotel = getHotelInfo(newBooking.hotelId);
                if (hotel) {
                    const pricePerNight = typeof hotel.price === 'string' 
                        ? parseFloat((hotel.price as string).replace(/[^\d]/g, '')) || 500000
                        : (hotel.price as number) || 500000;
                    newBooking.pricePerNight = pricePerNight;
                    newBooking.totalAmount = pricePerNight * newBooking.nights;
                }

                setBookings(prev => [...prev, newBooking]);
                addNotification({
                    type: 'success',
                    title: 'Thành công',
                    message: `Đặt phòng ${newBooking.bookingNumber} đã được tạo thành công`
                });
            } else if (modalType === 'edit' && selectedBooking) {
                const updatedBooking = {
                    ...selectedBooking,
                    ...formData,
                    nights: calculateNights(formData.checkIn!, formData.checkOut!),
                    updatedAt: new Date().toISOString()
                };

                // Recalculate total amount
                const hotel = getHotelInfo(updatedBooking.hotelId);
                if (hotel) {
                    const pricePerNight = typeof hotel.price === 'string' 
                        ? parseFloat((hotel.price as string).replace(/[^\d]/g, '')) || 500000
                        : (hotel.price as number) || 500000;
                    updatedBooking.pricePerNight = pricePerNight;
                    updatedBooking.totalAmount = pricePerNight * updatedBooking.nights;
                }

                setBookings(prev => prev.map(b => 
                    b.id === selectedBooking.id ? updatedBooking : b
                ));
                addNotification({
                    type: 'success',
                    title: 'Thành công',
                    message: `Đặt phòng ${selectedBooking.bookingNumber} đã được cập nhật`
                });
            } else if (modalType === 'delete' && selectedBooking) {
                setBookings(prev => prev.filter(b => b.id !== selectedBooking.id));
                addNotification({
                    type: 'success',
                    title: 'Thành công',
                    message: `Đặt phòng ${selectedBooking.bookingNumber} đã được xóa`
                });
            }

            setShowModal(false);
            setSelectedBooking(null);
            setFormData({});
        } catch (error) {
            console.error('Error handling booking operation:', error);
            addNotification({
                type: 'error',
                title: 'Lỗi',
                message: 'Có lỗi xảy ra khi xử lý đặt phòng'
            });
        }
    }, [modalType, formData, selectedBooking, bookings, addNotification, getHotelInfo]);

    // Payment status badge
    const PaymentStatusBadge = ({ status }: { status: BookingData['paymentStatus'] }) => {
        const styles = {
            paid: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
            failed: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle }
        };
        
        const style = styles[status];
        const Icon = style.icon;
        
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
                <Icon className="w-3 h-3 mr-1" />
                {status === 'paid' ? 'Đã thanh toán' : status === 'pending' ? 'Chờ thanh toán' : 'Thất bại'}
            </span>
        );
    };

    if (loading) {
        return <AdminLoadingSpinner text="Đang tải dữ liệu đặt phòng..." />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <AdminPageHeader
                title="Quản lý đặt phòng khách sạn"
                description="Quản lý tất cả đặt phòng khách sạn"
                actionButton={{
                    label: "Tạo đặt phòng mới",
                    onClick: handleCreate,
                    icon: Plus,
                    className: "bg-blue-600 hover:bg-blue-700"
                }}
            />

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <AdminStatCard
                    title="Tổng đặt phòng"
                    value={statistics.totalBookings}
                    icon={Hotel}
                    iconColor="text-blue-600"
                    iconBgColor="bg-blue-100"
                />
                <AdminStatCard
                    title="Tổng doanh thu"
                    value={formatCurrency(statistics.totalRevenue)}
                    icon={DollarSign}
                    iconColor="text-green-600"
                    iconBgColor="bg-green-100"
                />
                <AdminStatCard
                    title="Đã thanh toán"
                    value={statistics.paidBookings}
                    icon={CheckCircle}
                    iconColor="text-green-600"
                    iconBgColor="bg-green-100"
                />
                <AdminStatCard
                    title="Chờ thanh toán"
                    value={statistics.pendingBookings}
                    icon={Clock}
                    iconColor="text-yellow-600"
                    iconBgColor="bg-yellow-100"
                />
            </div>

            {/* Bookings Table */}
            <AdminDataTable
                data={bookings}
                columns={[
                    {
                        key: 'bookingNumber',
                        title: 'Mã đặt phòng',
                        width: '120px'
                    },
                    {
                        key: 'customerName',
                        title: 'Khách hàng',
                        render: (_, item: BookingData) => (
                            <div>
                                <div className="text-sm font-medium text-gray-900">{item.customerName}</div>
                                <div className="text-sm text-gray-500">{item.customerEmail}</div>
                            </div>
                        ),
                        width: '200px'
                    },
                    {
                        key: 'hotelId',
                        title: 'Khách sạn',
                        render: (_, item: BookingData) => {
                            const hotel = getHotelInfo(item.hotelId);
                            return (
                                <div>
                                    <div className="text-sm font-medium text-gray-900">
                                        {hotel?.title || 'Unknown Hotel'}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {formatCurrency(item.pricePerNight)}/đêm
                                    </div>
                                </div>
                            );
                        },
                        width: '200px'
                    },
                    {
                        key: 'checkIn',
                        title: 'Ngày check-in/out',
                        render: (_, item: BookingData) => (
                            <div className="flex items-center text-sm">
                                <Calendar className="w-4 h-4 mr-1" />
                                <div>
                                    <div>{formatDate(item.checkIn)}</div>
                                    <div className="text-gray-500">{formatDate(item.checkOut)}</div>
                                </div>
                            </div>
                        ),
                        width: '160px'
                    },
                    {
                        key: 'nights',
                        title: 'Số đêm',
                        width: '80px'
                    },
                    {
                        key: 'paymentStatus',
                        title: 'Trạng thái',
                        render: (value) => (
                            <PaymentStatusBadge status={value as BookingData['paymentStatus']} />
                        ),
                        width: '120px'
                    },
                    {
                        key: 'totalAmount',
                        title: 'Tổng tiền',
                        render: (value) => (
                            <div className="text-sm font-medium text-gray-900">
                                {formatCurrency(Number(value))}
                            </div>
                        ),
                        width: '120px'
                    },
                    {
                        key: 'actions',
                        title: 'Thao tác',
                        render: (_, item: BookingData) => (
                            <div className="flex space-x-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleView(item);
                                    }}
                                    className="text-blue-600 hover:text-blue-800"
                                    title="Xem chi tiết"
                                >
                                    <Eye className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEdit(item);
                                    }}
                                    className="text-green-600 hover:text-green-800"
                                    title="Chỉnh sửa"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(item);
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
                searchKey="customerName"
                searchPlaceholder="Tìm kiếm theo tên khách hàng, email, mã đặt phòng..."
                filterOptions={{
                    key: 'paymentStatus',
                    label: 'trạng thái',
                    options: [
                        { value: 'paid', label: 'Đã thanh toán' },
                        { value: 'pending', label: 'Chờ thanh toán' },
                        { value: 'failed', label: 'Thất bại' }
                    ]
                }}
                loading={loading}
                emptyMessage="Không có đặt phòng nào"
            />

            {/* Modal */}
            {showModal && (
                <AdminModal
                    isOpen={showModal}
                    onClose={() => {
                        setShowModal(false);
                        setSelectedBooking(null);
                        setFormData({});
                    }}
                    title={
                        modalType === 'create' ? 'Tạo đặt phòng mới' :
                        modalType === 'edit' ? 'Chỉnh sửa đặt phòng' :
                        modalType === 'view' ? 'Chi tiết đặt phòng' :
                        'Xác nhận xóa'
                    }
                >
                    {modalType === 'delete' ? (
                        <div className="space-y-4">
                            <p className="text-gray-600 dark:text-gray-300">
                                Bạn có chắc chắn muốn xóa đặt phòng này không? Hành động này không thể hoàn tác.
                            </p>
                            <div className="flex justify-end space-x-3">
                                <AdminButton
                                    variant="secondary"
                                    onClick={() => setShowModal(false)}
                                >
                                    Hủy
                                </AdminButton>
                                <AdminButton
                                    variant="danger"
                                    onClick={handleSubmit}
                                >
                                    Xóa
                                </AdminButton>
                            </div>
                        </div>
                    ) : modalType === 'view' && selectedBooking ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Mã đặt phòng
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                        {selectedBooking.bookingNumber}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Khách hàng
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                        {selectedBooking.customerName}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Email
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                        {selectedBooking.customerEmail}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Số điện thoại
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                        {selectedBooking.customerPhone}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Khách sạn
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                        {getHotelInfo(selectedBooking.hotelId)?.title || 'Unknown Hotel'}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Trạng thái thanh toán
                                    </label>
                                    <div className="mt-1">
                                        <PaymentStatusBadge status={selectedBooking.paymentStatus} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Check-in
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                        {formatDate(selectedBooking.checkIn)}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Check-out
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                        {formatDate(selectedBooking.checkOut)}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Số đêm
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                        {selectedBooking.nights} đêm
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Tổng tiền
                                    </label>
                                    <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                                        {formatCurrency(selectedBooking.totalAmount)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Tên khách hàng *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.customerName || ''}
                                        onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md 
                                                 bg-white text-gray-900 dark:text-white
                                                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.customerEmail || ''}
                                        onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md 
                                                 bg-white text-gray-900 dark:text-white
                                                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Số điện thoại
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.customerPhone || ''}
                                        onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md 
                                                 bg-white text-gray-900 dark:text-white
                                                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Khách sạn *
                                    </label>
                                    <select
                                        value={formData.hotelId || ''}
                                        onChange={(e) => setFormData(prev => ({ ...prev, hotelId: parseInt(e.target.value) }))}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md 
                                                 bg-white text-gray-900 dark:text-white
                                                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value="">Chọn khách sạn</option>
                                        {homeStayData.slice(0, 10).map(hotel => (
                                            <option key={hotel.id} value={hotel.id}>
                                                {hotel.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Ngày check-in *
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.checkIn || ''}
                                        onChange={(e) => setFormData(prev => ({ ...prev, checkIn: e.target.value }))}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md 
                                                 bg-white text-gray-900 dark:text-white
                                                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Ngày check-out *
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.checkOut || ''}
                                        onChange={(e) => setFormData(prev => ({ ...prev, checkOut: e.target.value }))}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md 
                                                 bg-white text-gray-900 dark:text-white
                                                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Trạng thái thanh toán
                                    </label>
                                    <select
                                        value={formData.paymentStatus || 'pending'}
                                        onChange={(e) => setFormData(prev => ({ ...prev, paymentStatus: e.target.value as BookingData['paymentStatus'] }))}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md 
                                                 bg-white text-gray-900 dark:text-white
                                                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="pending">Chờ thanh toán</option>
                                        <option value="paid">Đã thanh toán</option>
                                        <option value="failed">Thất bại</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <AdminButton
                                    variant="secondary"
                                    onClick={() => setShowModal(false)}
                                >
                                    Hủy
                                </AdminButton>
                                <AdminButton
                                    onClick={handleSubmit}
                                    disabled={!formData.customerName || !formData.customerEmail || !formData.checkIn || !formData.checkOut || !formData.hotelId}
                                >
                                    {modalType === 'create' ? 'Tạo đặt phòng' : 'Cập nhật'}
                                </AdminButton>
                            </div>
                        </div>
                    )}
                </AdminModal>
            )}
        </div>
    );
};

export default BookingsPage;
