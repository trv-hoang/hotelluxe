import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Edit, Trash2, Eye, Plus, Search, Calendar, DollarSign, Hotel, CheckCircle, Clock, XCircle } from 'lucide-react';
import AdminButton from '../../components/admin/AdminButton';
import AdminModal from '../../components/admin/AdminModal';
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
    const [searchTerm, setSearchTerm] = useState('');
    const [paymentFilter, setPaymentFilter] = useState<BookingData['paymentStatus'] | 'all'>('all');
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

    // Filtered bookings
    const filteredBookings = useMemo(() => {
        let filtered = [...bookings];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(booking =>
                booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Payment status filter
        if (paymentFilter !== 'all') {
            filtered = filtered.filter(booking => booking.paymentStatus === paymentFilter);
        }

        return filtered;
    }, [bookings, searchTerm, paymentFilter]);

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
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Quản lý đặt phòng khách sạn
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Quản lý tất cả đặt phòng khách sạn
                    </p>
                </div>
                <AdminButton onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Tạo đặt phòng mới
                </AdminButton>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow p-6 border">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100">
                            <Hotel className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">
                                Tổng đặt phòng
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {statistics.totalBookings}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 border">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100">
                            <DollarSign className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">
                                Tổng doanh thu
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {formatCurrency(statistics.totalRevenue)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 border">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">
                                Đã thanh toán
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {statistics.paidBookings}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 border">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-yellow-100">
                            <Clock className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">
                                Chờ thanh toán
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {statistics.pendingBookings}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow border dark:border-gray-700">
                <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm theo tên khách hàng, email, mã đặt phòng..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg 
                                             bg-white text-gray-900 dark:text-white
                                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <div className="md:w-48">
                            <select
                                value={paymentFilter}
                                onChange={(e) => setPaymentFilter(e.target.value as BookingData['paymentStatus'] | 'all')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                                         bg-white text-gray-900 dark:text-white
                                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">Tất cả trạng thái</option>
                                <option value="paid">Đã thanh toán</option>
                                <option value="pending">Chờ thanh toán</option>
                                <option value="failed">Thất bại</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white rounded-lg shadow border dark:border-gray-700">
                <div className="p-6">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Khách hàng
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Khách sạn
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ngày check-in/out
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Số đêm
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Trạng thái thanh toán
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Số tiền
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredBookings.map((booking) => {
                                    const hotel = getHotelInfo(booking.hotelId);
                                    return (
                                        <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {booking.customerName}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {booking.customerEmail}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {hotel?.title || 'Unknown Hotel'}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {formatCurrency(booking.pricePerNight)}/đêm
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm text-gray-900 dark:text-white">
                                                    <Calendar className="w-4 h-4 mr-1" />
                                                    <div>
                                                        <div>{formatDate(booking.checkIn)}</div>
                                                        <div className="text-gray-500 dark:text-gray-400">
                                                            {formatDate(booking.checkOut)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                {booking.nights} đêm
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <PaymentStatusBadge status={booking.paymentStatus} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                {formatCurrency(booking.totalAmount)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-2">
                                                    <button
                                                        onClick={() => handleView(booking)}
                                                        className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-300"
                                                        title="Xem chi tiết"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEdit(booking)}
                                                        className="text-indigo-600 hover:text-indigo-900 dark:hover:text-indigo-300"
                                                        title="Chỉnh sửa"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(booking)}
                                                        className="text-red-600 hover:text-red-900 dark:hover:text-red-300"
                                                        title="Xóa"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {filteredBookings.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-gray-500 dark:text-gray-400">
                                    {searchTerm || paymentFilter !== 'all' 
                                        ? 'Không tìm thấy đặt phòng nào phù hợp' 
                                        : 'Chưa có đặt phòng nào'
                                    }
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

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
