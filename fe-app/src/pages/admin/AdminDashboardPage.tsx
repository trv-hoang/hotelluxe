import React, { useState, useMemo, useEffect } from 'react';
import { 
    Users, 
    Building2, 
    Calendar, 
    DollarSign, 
    TrendingUp, 
    Activity,
    UserCheck,
    Clock,
    Star,
    MapPin,
    BarChart3,
    PieChart
} from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import usersData from '../../data/jsons/__users.json';
import homeStayData from '../../data/jsons/__homeStay.json';

// Chart Component for Revenue
const RevenueChart: React.FC = () => {
    const revenueData = [
        { month: 'T1', value: 125 },
        { month: 'T2', value: 140 },
        { month: 'T3', value: 135 },
        { month: 'T4', value: 160 },
        { month: 'T5', value: 185 },
        { month: 'T6', value: 220 },
    ];

    const maxValue = Math.max(...revenueData.map(d => d.value));

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Doanh thu (triệu VND)</h3>
                <BarChart3 className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex items-end justify-between h-48">
                {revenueData.map((item, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                        <div
                            className="bg-blue-500 rounded-t-md w-8 transition-all duration-300 hover:bg-blue-600"
                            style={{
                                height: `${(item.value / maxValue) * 100}%`,
                                minHeight: '20px'
                            }}
                            title={`${item.value} triệu VND`}
                        />
                        <span className="text-sm text-gray-600 mt-2">{item.month}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Chart Component for Bookings
const BookingsChart: React.FC = () => {
    const bookingData = [
        { day: 'T2', bookings: 12 },
        { day: 'T3', bookings: 19 },
        { day: 'T4', bookings: 15 },
        { day: 'T5', bookings: 25 },
        { day: 'T6', bookings: 30 },
        { day: 'T7', bookings: 35 },
        { day: 'CN', bookings: 28 },
    ];

    const maxBookings = Math.max(...bookingData.map(d => d.bookings));

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Đặt phòng theo tuần</h3>
                <PieChart className="w-5 h-5 text-green-500" />
            </div>
            <div className="flex items-end justify-between h-48">
                {bookingData.map((item, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                        <div
                            className="bg-green-500 rounded-t-md w-8 transition-all duration-300 hover:bg-green-600"
                            style={{
                                height: `${(item.bookings / maxBookings) * 100}%`,
                                minHeight: '20px'
                            }}
                            title={`${item.bookings} đặt phòng`}
                        />
                        <span className="text-sm text-gray-600 mt-2">{item.day}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AdminDashboardPage: React.FC = () => {
    const { addNotification } = useNotifications();
    const [currentTime, setCurrentTime] = useState(new Date());

    // Update time every minute
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    // Welcome notification
    useEffect(() => {
        const welcomeShown = sessionStorage.getItem('admin-welcome-shown');
        
        if (!welcomeShown) {
            sessionStorage.setItem('admin-welcome-shown', 'true');
            
            const timer = setTimeout(() => {
                addNotification({
                    type: 'info',
                    title: 'Chào mừng đến Dashboard',
                    message: 'Tất cả hệ thống đang hoạt động bình thường. Kiểm tra thống kê bên dưới.'
                });
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [addNotification]);

    // Calculate statistics
    const statistics = useMemo(() => {
        const totalUsers = usersData.length;
        const totalHotels = homeStayData.length;
        const adminUsers = usersData.filter(user => user.role === 'admin').length;
        const activeUsers = Math.floor(totalUsers * 0.7); // Mock 70% active users
        const totalBookings = Math.floor(totalHotels * 2.5); // Mock bookings
        const totalRevenue = totalBookings * 2500000; // Mock revenue

        return {
            totalUsers,
            totalHotels,
            adminUsers,
            activeUsers,
            totalBookings,
            totalRevenue
        };
    }, []);

    // Quick actions
    const handleSystemCheck = () => {
        addNotification({
            type: 'success',
            title: 'Kiểm tra hệ thống hoàn tất',
            message: 'Tất cả hệ thống đang hoạt động bình thường và ổn định.'
        });
    };

    const handleBackupDatabase = () => {
        addNotification({
            type: 'warning',
            title: 'Sao lưu dữ liệu',
            message: 'Quá trình sao lưu cơ sở dữ liệu đã bắt đầu. Có thể mất vài phút.'
        });
    };

    const handleGenerateReport = () => {
        addNotification({
            type: 'info',
            title: 'Tạo báo cáo',
            message: 'Báo cáo tháng đang được tạo. Bạn sẽ nhận được thông báo khi hoàn thành.'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Trang quản trị
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Chào mừng đến với trang quản trị. Theo dõi hiệu suất và quản lý tài nguyên.
                            </p>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <Clock className="w-4 h-4 mr-2" />
                            <span className="text-sm">
                                {currentTime.toLocaleString('vi-VN')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Tổng người dùng</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {statistics.totalUsers}
                                </p>
                                <p className="text-xs text-green-600 mt-1">
                                    +12% so với tháng trước
                                </p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Tổng khách sạn</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {statistics.totalHotels}
                                </p>
                                <p className="text-xs text-green-600 mt-1">
                                    +5% so với tháng trước
                                </p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-lg">
                                <Building2 className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Tổng đặt phòng</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {statistics.totalBookings}
                                </p>
                                <p className="text-xs text-green-600 mt-1">
                                    +18% so với tháng trước
                                </p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-lg">
                                <Calendar className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Tổng doanh thu</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {(statistics.totalRevenue / 1000000).toFixed(1)}M
                                </p>
                                <p className="text-xs text-green-600 mt-1">
                                    +25% so với tháng trước
                                </p>
                            </div>
                            <div className="bg-yellow-100 p-3 rounded-lg">
                                <DollarSign className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Quản trị viên</p>
                                <p className="text-xl font-bold text-gray-900">
                                    {statistics.adminUsers}
                                </p>
                            </div>
                            <UserCheck className="w-5 h-5 text-red-500" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Người dùng hoạt động</p>
                                <p className="text-xl font-bold text-gray-900">
                                    {statistics.activeUsers}
                                </p>
                            </div>
                            <Activity className="w-5 h-5 text-green-500" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Đánh giá trung bình</p>
                                <p className="text-xl font-bold text-gray-900 flex items-center">
                                    4.8 <Star className="w-4 h-4 text-yellow-500 ml-1" />
                                </p>
                            </div>
                            <TrendingUp className="w-5 h-5 text-blue-500" />
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <RevenueChart />
                    <BookingsChart />
                </div>

                {/* Recent Activities */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Hoạt động gần đây
                    </h3>
                    <div className="space-y-4">
                        {[
                            { icon: Users, text: 'Người dùng mới đăng ký: nguyenvan@email.com', time: '5 phút trước', color: 'text-blue-500' },
                            { icon: Calendar, text: 'Đặt phòng mới tại Khách sạn Sapa', time: '10 phút trước', color: 'text-green-500' },
                            { icon: Star, text: 'Đánh giá 5 sao cho Homestay Đà Lạt', time: '15 phút trước', color: 'text-yellow-500' },
                            { icon: MapPin, text: 'Thêm khách sạn mới tại Phú Quốc', time: '30 phút trước', color: 'text-purple-500' }
                        ].map((activity, index) => (
                            <div key={index} className="flex items-center space-x-3">
                                <activity.icon className={`w-5 h-5 ${activity.color}`} />
                                <div className="flex-1">
                                    <p className="text-sm text-gray-900 dark:text-white">{activity.text}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Thao tác nhanh
                    </h3>
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={handleSystemCheck}
                            className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
                        >
                            <Activity className="w-4 h-4 mr-2" />
                            Kiểm tra hệ thống
                        </button>
                        
                        <button
                            onClick={handleBackupDatabase}
                            className="flex items-center px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors duration-200"
                        >
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Sao lưu dữ liệu
                        </button>
                        
                        <button
                            onClick={handleGenerateReport}
                            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                        >
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Tạo báo cáo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default AdminDashboardPage;
