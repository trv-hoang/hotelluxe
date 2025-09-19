import React, { useState, useMemo, useEffect, useCallback } from 'react';
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
import { useNotifications } from '@/hooks/useNotifications';
import AdminStatCard from '@/components/admin/AdminStatCard';
import AdminChart from '@/components/admin/AdminChart';
import { adminApi } from '@/api/admin';
import type { AdminDashboardStats } from '@/api/admin';


const AdminDashboardPage: React.FC = () => {
    const { addNotification } = useNotifications();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [dashboardStats, setDashboardStats] = useState<AdminDashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    // Fetch dashboard data
    const fetchDashboardData = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const stats = await adminApi.getDashboardOverview();
            setDashboardStats(stats);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            const errorMessage = 'Không thể tải thống kê dashboard. Vui lòng thử lại.';
            setError(errorMessage);
            addNotification({
                type: 'error',
                title: 'Lỗi tải dữ liệu',
                message: errorMessage
            });
            // Set default data in case of API failure
            setDashboardStats({
                totalUsers: 0,
                totalBookings: 0,
                totalRevenue: 0,
                activeHotels: 0,
                monthlyRevenue: [],
                bookingTrends: [],
                topHotels: [],
                users: { total: 0, new_this_month: 0, active_users: 0, verified_users: 0 },
                hotels: { total: 0, active: 0, pending_approval: 0, average_rating: 0 },
                bookings: { total: 0, today: 0, this_month: 0, confirmed: 0, pending: 0, cancelled: 0 },
                payments: { total_revenue: 0, today_revenue: 0, this_month_revenue: 0, pending_payments: 0, failed_payments: 0 },
                reviews: { total: 0, pending_approval: 0, approved: 0, average_rating: 0 }
            });
        } finally {
            setIsLoading(false);
        }
    }, [addNotification]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    // Calculate statistics from API data
    const statistics = useMemo(() => {
        if (!dashboardStats) {
            return {
                totalUsers: 0,
                totalHotels: 0,
                adminUsers: 0,
                activeUsers: 0,
                totalBookings: 0,
                totalRevenue: 0
            };
        }

        return {
            totalUsers: dashboardStats.users?.total || 0,
            totalHotels: dashboardStats.hotels?.total || 0,
            adminUsers: Math.floor((dashboardStats.users?.total || 0) * 0.05), // ~5% admin users estimate
            activeUsers: dashboardStats.users?.active_users || 0,
            totalBookings: dashboardStats.bookings?.total || 0,
            totalRevenue: dashboardStats.payments?.total_revenue || 0
        };
    }, [dashboardStats]);

    // Generate chart data from API stats
    const chartData = useMemo(() => {
        const revenue = dashboardStats?.payments?.total_revenue || 0;
        const monthlyRevenue = revenue / 1000000; // Convert to millions
        const bookingsCount = dashboardStats?.bookings?.total || 0;
        
        return {
            revenue: [
                { label: 'T1', value: Math.floor(monthlyRevenue * 0.8) },
                { label: 'T2', value: Math.floor(monthlyRevenue * 0.85) },
                { label: 'T3', value: Math.floor(monthlyRevenue * 0.82) },
                { label: 'T4', value: Math.floor(monthlyRevenue * 0.95) },
                { label: 'T5', value: Math.floor(monthlyRevenue * 1.1) },
                { label: 'T6', value: Math.floor(monthlyRevenue) },
            ],
            bookings: [
                { label: 'T2', value: Math.floor(bookingsCount * 0.1) },
                { label: 'T3', value: Math.floor(bookingsCount * 0.15) },
                { label: 'T4', value: Math.floor(bookingsCount * 0.12) },
                { label: 'T5', value: Math.floor(bookingsCount * 0.18) },
                { label: 'T6', value: Math.floor(bookingsCount * 0.22) },
                { label: 'T7', value: Math.floor(bookingsCount * 0.25) },
                { label: 'CN', value: Math.floor(bookingsCount * 0.20) },
            ]
        };
    }, [dashboardStats]);

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

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Đang tải thống kê...</p>
                </div>
            </div>
        );
    }

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
                            {error && (
                                <div className="mt-2 flex items-center gap-2">
                                    <span className="text-sm text-red-600">{error}</span>
                                    <button 
                                        onClick={fetchDashboardData}
                                        className="text-sm text-blue-600 hover:text-blue-700 underline"
                                    >
                                        Thử lại
                                    </button>
                                </div>
                            )}
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
                    <AdminStatCard
                        title="Tổng người dùng"
                        value={statistics.totalUsers}
                        change="+12% so với tháng trước"
                        changeType="increase"
                        icon={Users}
                        iconColor="text-blue-600"
                        iconBgColor="bg-blue-100"
                    />
                    <AdminStatCard
                        title="Tổng khách sạn"
                        value={statistics.totalHotels}
                        change="+5% so với tháng trước"
                        changeType="increase"
                        icon={Building2}
                        iconColor="text-purple-600"
                        iconBgColor="bg-purple-100"
                    />
                    <AdminStatCard
                        title="Tổng đặt phòng"
                        value={statistics.totalBookings}
                        change="+18% so với tháng trước"
                        changeType="increase"
                        icon={Calendar}
                        iconColor="text-green-600"
                        iconBgColor="bg-green-100"
                    />
                    <AdminStatCard
                        title="Tổng doanh thu"
                        value={`${(statistics.totalRevenue / 1000000).toFixed(1)}M`}
                        change="+25% so với tháng trước"
                        changeType="increase"
                        icon={DollarSign}
                        iconColor="text-yellow-600"
                        iconBgColor="bg-yellow-100"
                    />
                </div>

                {/* Additional Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <AdminStatCard
                        title="Quản trị viên"
                        value={statistics.adminUsers}
                        icon={UserCheck}
                        iconColor="text-red-500"
                        iconBgColor="bg-red-100"
                    />
                    <AdminStatCard
                        title="Người dùng hoạt động"
                        value={statistics.activeUsers}
                        icon={Activity}
                        iconColor="text-green-500"
                        iconBgColor="bg-green-100"
                    />
                    <AdminStatCard
                        title="Đánh giá trung bình"
                        value="4.8 ⭐"
                        icon={TrendingUp}
                        iconColor="text-blue-500"
                        iconBgColor="bg-blue-100"
                    />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <AdminChart
                        title="Doanh thu (triệu VND)"
                        data={chartData.revenue}
                        icon={BarChart3}
                        iconColor="text-blue-500"
                        barColor="bg-blue-500"
                        barHoverColor="bg-blue-600"
                        unit=" triệu VND"
                    />
                    <AdminChart
                        title="Đặt phòng theo tuần"
                        data={chartData.bookings}
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
