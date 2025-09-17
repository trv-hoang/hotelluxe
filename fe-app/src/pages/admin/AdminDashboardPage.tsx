import React, { useState, useEffect } from 'react';
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
import AdminStatCard from '../../components/admin/AdminStatCard';
import AdminChart from '../../components/admin/AdminChart';
import { adminApi, type AdminDashboardStats } from '../../api/admin';


const AdminDashboardPage: React.FC = () => {
    const { addNotification } = useNotifications();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [dashboardStats, setDashboardStats] = useState<AdminDashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Update time every minute
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    // Fetch dashboard data
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);
                const stats = await adminApi.getDashboardOverview();
                setDashboardStats(stats);
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
                addNotification({
                    type: 'error',
                    title: 'Lỗi tải dữ liệu',
                    message: 'Không thể tải thống kê dashboard. Đang hiển thị dữ liệu mặc định.'
                });
                // Set default data in case of API failure
                setDashboardStats({
                    users: { total: 0, new_this_month: 0, active_users: 0, verified_users: 0 },
                    hotels: { total: 0, active: 0, pending_approval: 0, average_rating: 0 },
                    bookings: { total: 0, today: 0, this_month: 0, confirmed: 0, pending: 0, cancelled: 0 },
                    payments: { total_revenue: 0, today_revenue: 0, this_month_revenue: 0, pending_payments: 0, failed_payments: 0 },
                    reviews: { total: 0, pending_approval: 0, approved: 0, average_rating: 0 }
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [addNotification]);

    // Welcome notification
    useEffect(() => {
        const welcomeShown = sessionStorage.getItem('admin-welcome-shown');
        
        if (!welcomeShown && !isLoading) {
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
    }, [addNotification, isLoading]);

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
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                                <div className="animate-pulse">
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : dashboardStats ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <AdminStatCard
                                title="Tổng người dùng"
                                value={dashboardStats.users.total}
                                change={`+${dashboardStats.users.new_this_month} mới tháng này`}
                                changeType="increase"
                                icon={Users}
                                iconColor="text-blue-600"
                                iconBgColor="bg-blue-100"
                            />
                            <AdminStatCard
                                title="Tổng khách sạn"
                                value={dashboardStats.hotels.total}
                                change={`${dashboardStats.hotels.active} đang hoạt động`}
                                changeType="increase"
                                icon={Building2}
                                iconColor="text-purple-600"
                                iconBgColor="bg-purple-100"
                            />
                            <AdminStatCard
                                title="Tổng đặt phòng"
                                value={dashboardStats.bookings.total}
                                change={`${dashboardStats.bookings.today} hôm nay`}
                                changeType="increase"
                                icon={Calendar}
                                iconColor="text-green-600"
                                iconBgColor="bg-green-100"
                            />
                            <AdminStatCard
                                title="Tổng doanh thu"
                                value={`${(dashboardStats.payments.total_revenue / 1000000).toFixed(1)}M`}
                                change={`${(dashboardStats.payments.today_revenue / 1000000).toFixed(1)}M hôm nay`}
                                changeType="increase"
                                icon={DollarSign}
                                iconColor="text-yellow-600"
                                iconBgColor="bg-yellow-100"
                            />
                        </div>

                        {/* Additional Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <AdminStatCard
                                title="Người dùng đã xác thực"
                                value={dashboardStats.users.verified_users}
                                icon={UserCheck}
                                iconColor="text-red-500"
                                iconBgColor="bg-red-100"
                            />
                            <AdminStatCard
                                title="Người dùng hoạt động"
                                value={dashboardStats.users.active_users}
                                icon={Activity}
                                iconColor="text-green-500"
                                iconBgColor="bg-green-100"
                            />
                            <AdminStatCard
                                title="Đánh giá trung bình"
                                value={`${dashboardStats.reviews.average_rating.toFixed(1)} ⭐`}
                                icon={TrendingUp}
                                iconColor="text-blue-500"
                                iconBgColor="bg-blue-100"
                            />
                        </div>
                    </>
                ) : (
                    <div className="bg-white rounded-lg p-6 text-center">
                        <p className="text-gray-500">Không thể tải dữ liệu dashboard</p>
                    </div>
                )}

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <AdminChart
                        title="Doanh thu (triệu VND)"
                        data={[
                            { label: 'T1', value: 125 },
                            { label: 'T2', value: 140 },
                            { label: 'T3', value: 135 },
                            { label: 'T4', value: 160 },
                            { label: 'T5', value: 185 },
                            { label: 'T6', value: 220 },
                        ]}
                        icon={BarChart3}
                        iconColor="text-blue-500"
                        barColor="bg-blue-500"
                        barHoverColor="bg-blue-600"
                        unit=" triệu VND"
                    />
                    <AdminChart
                        title="Đặt phòng theo tuần"
                        data={[
                            { label: 'T2', value: 12 },
                            { label: 'T3', value: 19 },
                            { label: 'T4', value: 15 },
                            { label: 'T5', value: 25 },
                            { label: 'T6', value: 30 },
                            { label: 'T7', value: 35 },
                            { label: 'CN', value: 28 },
                        ]}
                        icon={PieChart}
                        iconColor="text-green-500"
                        barColor="bg-green-500"
                        barHoverColor="bg-green-600"
                        unit=" đặt phòng"
                    />
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
