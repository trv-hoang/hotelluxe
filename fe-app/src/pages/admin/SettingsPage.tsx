import React, { useState } from 'react';
import { 
    Settings, 
    Shield, 
    Bell, 
    Server, 
    User, 
    Database,
    Palette,
    Save,
    RefreshCw,
    Trash2,
    AlertTriangle
} from 'lucide-react';
import AdminButton from '../../components/admin/AdminButton';
import AdminToggle from '../../components/admin/AdminToggle';
import AdminStatCard from '../../components/admin/AdminStatCard';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminTabs from '../../components/admin/AdminTabs';
import AdminConfirmDialog from '../../components/admin/AdminConfirmDialog';
import { useNotifications } from '../../hooks/useNotifications';

interface SettingsData {
    general: {
        siteName: string;
        siteDescription: string;
        adminEmail: string;
        supportEmail: string;
        currency: string;
        timezone: string;
        language: string;
    };
    security: {
        twoFactorAuth: boolean;
        sessionTimeout: string;
        passwordMinLength: number;
        loginAttempts: number;
        requirePasswordChange: boolean;
    };
    notifications: {
        emailNotifications: boolean;
        smsNotifications: boolean;
        pushNotifications: boolean;
        bookingAlerts: boolean;
        systemAlerts: boolean;
        marketingEmails: boolean;
    };
    system: {
        maintenanceMode: boolean;
        debugMode: boolean;
        cacheEnabled: boolean;
        backupInterval: string;
        logLevel: string;
    };
    appearance: {
        primaryColor: string;
        secondaryColor: string;
        fontSize: string;
    };
}

const SettingsPage: React.FC = () => {
    const { addNotification } = useNotifications();
    const [activeTab, setActiveTab] = useState('general');
    const [showResetDialog, setShowResetDialog] = useState(false);
    
    const [settings, setSettings] = useState<SettingsData>({
        general: {
            siteName: 'Luxe Hotel Management',
            siteDescription: 'Hệ thống quản lý khách sạn chuyên nghiệp',
            adminEmail: 'admin@luxehotel.com',
            supportEmail: 'support@luxehotel.com',
            currency: 'VND',
            timezone: 'Asia/Ho_Chi_Minh',
            language: 'vi'
        },
        security: {
            twoFactorAuth: true,
            sessionTimeout: '30',
            passwordMinLength: 8,
            loginAttempts: 5,
            requirePasswordChange: false
        },
        notifications: {
            emailNotifications: true,
            smsNotifications: false,
            pushNotifications: true,
            bookingAlerts: true,
            systemAlerts: true,
            marketingEmails: false
        },
        system: {
            maintenanceMode: false,
            debugMode: false,
            cacheEnabled: true,
            backupInterval: 'daily',
            logLevel: 'info'
        },
        appearance: {
            primaryColor: '#3b82f6',
            secondaryColor: '#10b981',
            fontSize: 'medium'
        }
    });

    const handleSave = () => {
        addNotification({
            type: 'success',
            title: 'Thành công',
            message: 'Cài đặt đã được lưu thành công!'
        });
    };

    const handleReset = () => {
        setShowResetDialog(true);
    };

    const confirmReset = () => {
        // Reset logic here
        addNotification({
            type: 'info',
            title: 'Khôi phục',
            message: 'Đã khôi phục về cài đặt mặc định!'
        });
        setShowResetDialog(false);
    };

    const handleClearCache = () => {
        addNotification({
            type: 'warning',
            title: 'Xóa cache',
            message: 'Đã xóa cache hệ thống thành công!'
        });
    };

    const tabs = [
        { id: 'general', name: 'Chung', icon: Settings },
        { id: 'security', name: 'Bảo mật', icon: Shield },
        { id: 'notifications', name: 'Thông báo', icon: Bell },
        { id: 'system', name: 'Hệ thống', icon: Server },
        { id: 'appearance', name: 'Giao diện', icon: Palette }
    ];

    const currencyOptions = [
        { value: 'VND', label: 'Vietnamese Dong (VND)' },
        { value: 'USD', label: 'US Dollar (USD)' },
        { value: 'EUR', label: 'Euro (EUR)' },
        { value: 'JPY', label: 'Japanese Yen (JPY)' }
    ];

    const timezoneOptions = [
        { value: 'Asia/Ho_Chi_Minh', label: 'Hồ Chí Minh' },
        { value: 'Asia/Bangkok', label: 'Bangkok' },
        { value: 'Asia/Singapore', label: 'Singapore' },
        { value: 'UTC', label: 'UTC' }
    ];

    const languageOptions = [
        { value: 'vi', label: 'Tiếng Việt' },
        { value: 'en', label: 'English' },
        { value: 'zh', label: '中文' },
        { value: 'ja', label: '日本語' }
    ];

    const updateSetting = (section: keyof SettingsData, key: string, value: string | number | boolean) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value
            }
        }));
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--admin-bg-secondary)' }}>
            <div className="p-6 space-y-6">
                {/* Header */}
                <AdminPageHeader
                    title="Cài đặt hệ thống"
                    description="Cấu hình và tùy chỉnh hệ thống theo nhu cầu của bạn"
                    extraContent={
                        <div className="flex space-x-3">
                            <AdminButton
                                onClick={handleSave}
                                variant="primary"
                                className="flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                Lưu thay đổi
                            </AdminButton>
                            <AdminButton
                                onClick={handleReset}
                                variant="secondary"
                                className="flex items-center gap-2"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Khôi phục
                            </AdminButton>
                            <AdminButton
                                onClick={handleClearCache}
                                variant="danger"
                                className="flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Xóa cache
                            </AdminButton>
                        </div>
                    }
                />

                {/* System Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <AdminStatCard
                        title="Trạng thái hệ thống"
                        value="Hoạt động"
                        icon={Server}
                        iconColor="text-green-600"
                        iconBgColor="bg-green-100"
                        changeType="increase"
                    />
                    <AdminStatCard
                        title="Dung lượng DB"
                        value="2.4 GB"
                        icon={Database}
                        iconColor="text-blue-600"
                        iconBgColor="bg-blue-100"
                        changeType="neutral"
                    />
                    <AdminStatCard
                        title="Phiên hoạt động"
                        value={42}
                        icon={User}
                        iconColor="text-yellow-600"
                        iconBgColor="bg-yellow-100"
                        changeType="increase"
                    />
                </div>

                {/* Tabs */}
                <div className="admin-card p-6">
                    <AdminTabs
                        tabs={tabs}
                        activeTab={activeTab}
                        onChange={setActiveTab}
                        variant="underline"
                        size="medium"
                    />
                </div>

                {/* Tab Content */}
                <div className="admin-card p-6">
                    {activeTab === 'general' && (
                        <div className="space-y-6">
                            <div className="flex items-center mb-4">
                                <Settings className="w-5 h-5 mr-2" style={{ color: 'var(--admin-text-secondary)' }} />
                                <h3 className="text-lg font-medium" style={{ color: 'var(--admin-text-primary)' }}>Cài đặt chung</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--admin-text-primary)' }}>
                                        Tên website
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.general.siteName}
                                        onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
                                        className="admin-input w-full px-3 py-2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--admin-text-primary)' }}>
                                        Email quản trị
                                    </label>
                                    <input
                                        type="email"
                                        value={settings.general.adminEmail}
                                        onChange={(e) => updateSetting('general', 'adminEmail', e.target.value)}
                                        className="admin-input w-full px-3 py-2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--admin-text-primary)' }}>
                                        Email hỗ trợ
                                    </label>
                                    <input
                                        type="email"
                                        value={settings.general.supportEmail}
                                        onChange={(e) => updateSetting('general', 'supportEmail', e.target.value)}
                                        className="admin-input w-full px-3 py-2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--admin-text-primary)' }}>
                                        Đơn vị tiền tệ
                                    </label>
                                    <select
                                        value={settings.general.currency}
                                        onChange={(e) => updateSetting('general', 'currency', e.target.value)}
                                        className="admin-input w-full px-3 py-2"
                                    >
                                        {currencyOptions.map(option => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--admin-text-primary)' }}>
                                        Múi giờ
                                    </label>
                                    <select
                                        value={settings.general.timezone}
                                        onChange={(e) => updateSetting('general', 'timezone', e.target.value)}
                                        className="admin-input w-full px-3 py-2"
                                    >
                                        {timezoneOptions.map(option => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--admin-text-primary)' }}>
                                        Ngôn ngữ
                                    </label>
                                    <select
                                        value={settings.general.language}
                                        onChange={(e) => updateSetting('general', 'language', e.target.value)}
                                        className="admin-input w-full px-3 py-2"
                                    >
                                        {languageOptions.map(option => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--admin-text-primary)' }}>
                                    Mô tả website
                                </label>
                                <textarea
                                    value={settings.general.siteDescription}
                                    onChange={(e) => updateSetting('general', 'siteDescription', e.target.value)}
                                    rows={3}
                                    className="admin-input w-full px-3 py-2"
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            <div className="flex items-center mb-4">
                                <Shield className="w-5 h-5 mr-2" style={{ color: 'var(--admin-text-secondary)' }} />
                                <h3 className="text-lg font-medium" style={{ color: 'var(--admin-text-primary)' }}>Cài đặt bảo mật</h3>
                            </div>
                            
                            <div className="space-y-4">
                                <AdminToggle
                                    checked={settings.security.twoFactorAuth}
                                    onChange={(checked) => updateSetting('security', 'twoFactorAuth', checked)}
                                    label="Xác thực 2 yếu tố"
                                    description="Bảo vệ tài khoản với lớp bảo mật bổ sung"
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--admin-text-primary)' }}>
                                            Thời gian hết hạn phiên (phút)
                                        </label>
                                        <input
                                            type="number"
                                            value={settings.security.sessionTimeout}
                                            onChange={(e) => updateSetting('security', 'sessionTimeout', e.target.value)}
                                            className="admin-input w-full px-3 py-2"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--admin-text-primary)' }}>
                                            Độ dài mật khẩu tối thiểu
                                        </label>
                                        <input
                                            type="number"
                                            value={settings.security.passwordMinLength}
                                            onChange={(e) => updateSetting('security', 'passwordMinLength', parseInt(e.target.value))}
                                            className="admin-input w-full px-3 py-2"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--admin-text-primary)' }}>
                                            Số lần đăng nhập sai tối đa
                                        </label>
                                        <input
                                            type="number"
                                            value={settings.security.loginAttempts}
                                            onChange={(e) => updateSetting('security', 'loginAttempts', parseInt(e.target.value))}
                                            className="admin-input w-full px-3 py-2"
                                        />
                                    </div>
                                </div>

                                <AdminToggle
                                    checked={settings.security.requirePasswordChange}
                                    onChange={(checked) => updateSetting('security', 'requirePasswordChange', checked)}
                                    label="Yêu cầu đổi mật khẩu định kỳ"
                                    description="Bắt buộc người dùng đổi mật khẩu sau 90 ngày"
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="space-y-6">
                            <div className="flex items-center mb-4">
                                <Bell className="w-5 h-5 mr-2" style={{ color: 'var(--admin-text-secondary)' }} />
                                <h3 className="text-lg font-medium" style={{ color: 'var(--admin-text-primary)' }}>Cài đặt thông báo</h3>
                            </div>
                            
                            <div className="space-y-4">
                                <AdminToggle
                                    checked={settings.notifications.emailNotifications}
                                    onChange={(checked) => updateSetting('notifications', 'emailNotifications', checked)}
                                    label="Thông báo email"
                                    description="Nhận thông báo qua email"
                                />
                                <AdminToggle
                                    checked={settings.notifications.smsNotifications}
                                    onChange={(checked) => updateSetting('notifications', 'smsNotifications', checked)}
                                    label="Thông báo SMS"
                                    description="Nhận thông báo qua tin nhắn"
                                />
                                <AdminToggle
                                    checked={settings.notifications.pushNotifications}
                                    onChange={(checked) => updateSetting('notifications', 'pushNotifications', checked)}
                                    label="Thông báo đẩy"
                                    description="Nhận thông báo đẩy trên trình duyệt"
                                />
                                <AdminToggle
                                    checked={settings.notifications.bookingAlerts}
                                    onChange={(checked) => updateSetting('notifications', 'bookingAlerts', checked)}
                                    label="Cảnh báo đặt phòng"
                                    description="Thông báo khi có đặt phòng mới"
                                />
                                <AdminToggle
                                    checked={settings.notifications.systemAlerts}
                                    onChange={(checked) => updateSetting('notifications', 'systemAlerts', checked)}
                                    label="Cảnh báo hệ thống"
                                    description="Thông báo về tình trạng hệ thống"
                                />
                                <AdminToggle
                                    checked={settings.notifications.marketingEmails}
                                    onChange={(checked) => updateSetting('notifications', 'marketingEmails', checked)}
                                    label="Email marketing"
                                    description="Nhận email khuyến mãi và tin tức"
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'system' && (
                        <div className="space-y-6">
                            <div className="flex items-center mb-4">
                                <Server className="w-5 h-5 mr-2" style={{ color: 'var(--admin-text-secondary)' }} />
                                <h3 className="text-lg font-medium" style={{ color: 'var(--admin-text-primary)' }}>Cài đặt hệ thống</h3>
                            </div>
                            
                            <div className="space-y-4">
                                <div style={{ 
                                    backgroundColor: 'var(--admin-error-light)', 
                                    border: '1px solid var(--admin-error)',
                                    borderRadius: '8px'
                                }}>
                                    <AdminToggle
                                        checked={settings.system.maintenanceMode}
                                        onChange={(checked) => updateSetting('system', 'maintenanceMode', checked)}
                                        label={
                                            <span className="flex items-center" style={{ color: 'var(--admin-error)' }}>
                                                <AlertTriangle className="w-4 h-4 mr-2" />
                                                Chế độ bảo trì
                                            </span>
                                        }
                                        description="Tạm ngừng truy cập website cho người dùng"
                                    />
                                </div>

                                {[
                                    { key: 'debugMode', label: 'Chế độ debug', desc: 'Hiển thị thông tin debug chi tiết' },
                                    { key: 'cacheEnabled', label: 'Bật cache', desc: 'Sử dụng cache để tăng tốc độ tải trang' }
                                ].map((item) => (
                                    <AdminToggle
                                        key={item.key}
                                        checked={settings.system[item.key as keyof typeof settings.system] as boolean}
                                        onChange={(checked) => updateSetting('system', item.key, checked)}
                                        label={item.label}
                                        description={item.desc}
                                    />
                                ))}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--admin-text-primary)' }}>
                                            Tần suất sao lưu
                                        </label>
                                        <select
                                            value={settings.system.backupInterval}
                                            onChange={(e) => updateSetting('system', 'backupInterval', e.target.value)}
                                            className="admin-input w-full px-3 py-2"
                                        >
                                            <option value="hourly">Hàng giờ</option>
                                            <option value="daily">Hàng ngày</option>
                                            <option value="weekly">Hàng tuần</option>
                                            <option value="monthly">Hàng tháng</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--admin-text-primary)' }}>
                                            Mức độ log
                                        </label>
                                        <select
                                            value={settings.system.logLevel}
                                            onChange={(e) => updateSetting('system', 'logLevel', e.target.value)}
                                            className="admin-input w-full px-3 py-2"
                                        >
                                            <option value="error">Error</option>
                                            <option value="warning">Warning</option>
                                            <option value="info">Info</option>
                                            <option value="debug">Debug</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'appearance' && (
                        <div className="space-y-6">
                            <div className="flex items-center mb-4">
                                <Palette className="w-5 h-5 mr-2" style={{ color: 'var(--admin-text-secondary)' }} />
                                <h3 className="text-lg font-medium" style={{ color: 'var(--admin-text-primary)' }}>Cài đặt giao diện</h3>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--admin-text-primary)' }}>
                                            Màu chủ đạo
                                        </label>
                                        <input
                                            type="color"
                                            value={settings.appearance.primaryColor}
                                            onChange={(e) => updateSetting('appearance', 'primaryColor', e.target.value)}
                                            className="w-full h-10 border border-gray-300 rounded-lg"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--admin-text-primary)' }}>
                                            Màu phụ
                                        </label>
                                        <input
                                            type="color"
                                            value={settings.appearance.secondaryColor}
                                            onChange={(e) => updateSetting('appearance', 'secondaryColor', e.target.value)}
                                            className="w-full h-10 border border-gray-300 rounded-lg"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--admin-text-primary)' }}>
                                            Kích thước chữ
                                        </label>
                                        <select
                                            value={settings.appearance.fontSize}
                                            onChange={(e) => updateSetting('appearance', 'fontSize', e.target.value)}
                                            className="admin-input w-full px-3 py-2"
                                        >
                                            <option value="small">Nhỏ</option>
                                            <option value="medium">Trung bình</option>
                                            <option value="large">Lớn</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Reset Confirmation Dialog */}
            <AdminConfirmDialog
                isOpen={showResetDialog}
                onClose={() => setShowResetDialog(false)}
                onConfirm={confirmReset}
                title="Khôi phục cài đặt mặc định"
                message="Bạn có chắc chắn muốn khôi phục về cài đặt mặc định? Tất cả các thay đổi hiện tại sẽ bị mất."
                type="warning"
                confirmLabel="Khôi phục"
                cancelLabel="Hủy"
            />
        </div>
    );
};

export default SettingsPage;
