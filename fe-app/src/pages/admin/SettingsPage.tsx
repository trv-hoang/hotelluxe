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
    AlertTriangle,
    Check
} from 'lucide-react';
import AdminButton from '../../components/admin/AdminButton';
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
        if (window.confirm('Bạn có chắc chắn muốn khôi phục về cài đặt mặc định?')) {
            // Reset logic here
            addNotification({
                type: 'info',
                title: 'Khôi phục',
                message: 'Đã khôi phục về cài đặt mặc định!'
            });
        }
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
                <div className="admin-card p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold" style={{ color: 'var(--admin-text-primary)' }}>
                                Cài đặt hệ thống
                            </h1>
                            <p className="mt-1" style={{ color: 'var(--admin-text-secondary)' }}>
                                Cấu hình và tùy chỉnh hệ thống theo nhu cầu của bạn
                            </p>
                        </div>
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
                    </div>

                    {/* System Status Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="admin-card p-4" style={{ 
                            backgroundColor: 'var(--admin-success-light)', 
                            borderColor: 'var(--admin-success)' 
                        }}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium" style={{ color: 'var(--admin-success)' }}>
                                        Trạng thái hệ thống
                                    </p>
                                    <p className="text-lg font-bold flex items-center" style={{ color: 'var(--admin-success)' }}>
                                        <Check className="w-4 h-4 mr-2" />
                                        Hoạt động
                                    </p>
                                </div>
                                <Server className="w-8 h-8" style={{ color: 'var(--admin-success)' }} />
                            </div>
                        </div>

                        <div className="admin-card p-4" style={{ 
                            backgroundColor: 'var(--admin-info-light)', 
                            borderColor: 'var(--admin-info)' 
                        }}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium" style={{ color: 'var(--admin-info)' }}>
                                        Dung lượng DB
                                    </p>
                                    <p className="text-lg font-bold" style={{ color: 'var(--admin-info)' }}>2.4 GB</p>
                                </div>
                                <Database className="w-8 h-8" style={{ color: 'var(--admin-info)' }} />
                            </div>
                        </div>

                        <div className="admin-card p-4" style={{ 
                            backgroundColor: 'var(--admin-warning-light)', 
                            borderColor: 'var(--admin-warning)' 
                        }}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium" style={{ color: 'var(--admin-warning)' }}>
                                        Phiên hoạt động
                                    </p>
                                    <p className="text-lg font-bold" style={{ color: 'var(--admin-warning)' }}>42</p>
                                </div>
                                <User className="w-8 h-8" style={{ color: 'var(--admin-warning)' }} />
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div style={{ borderBottom: '1px solid var(--admin-border-primary)' }}>
                        <nav className="-mb-px flex space-x-8">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                                        activeTab === tab.id
                                            ? 'border-blue-500'
                                            : 'border-transparent hover:border-gray-300'
                                    }`}
                                    style={{
                                        color: activeTab === tab.id 
                                            ? 'var(--admin-text-accent)' 
                                            : 'var(--admin-text-secondary)',
                                        borderBottomColor: activeTab === tab.id 
                                            ? 'var(--admin-text-accent)' 
                                            : 'transparent'
                                    }}
                                >
                                    <tab.icon className="w-4 h-4 mr-2" />
                                    {tab.name}
                                </button>
                            ))}
                        </nav>
                    </div>
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
                                <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--admin-bg-secondary)' }}>
                                    <div>
                                        <h4 className="font-medium" style={{ color: 'var(--admin-text-primary)' }}>Xác thực 2 yếu tố</h4>
                                        <p className="text-sm" style={{ color: 'var(--admin-text-secondary)' }}>Bảo vệ tài khoản với lớp bảo mật bổ sung</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.security.twoFactorAuth}
                                            onChange={(e) => updateSetting('security', 'twoFactorAuth', e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>

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

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <h4 className="font-medium text-gray-900">Yêu cầu đổi mật khẩu định kỳ</h4>
                                        <p className="text-sm text-gray-500">Bắt buộc người dùng đổi mật khẩu sau 90 ngày</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.security.requirePasswordChange}
                                            onChange={(e) => updateSetting('security', 'requirePasswordChange', e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
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
                                {[
                                    { key: 'emailNotifications', label: 'Thông báo email', desc: 'Nhận thông báo qua email' },
                                    { key: 'smsNotifications', label: 'Thông báo SMS', desc: 'Nhận thông báo qua tin nhắn' },
                                    { key: 'pushNotifications', label: 'Thông báo đẩy', desc: 'Nhận thông báo đẩy trên trình duyệt' },
                                    { key: 'bookingAlerts', label: 'Cảnh báo đặt phòng', desc: 'Thông báo khi có đặt phòng mới' },
                                    { key: 'systemAlerts', label: 'Cảnh báo hệ thống', desc: 'Thông báo về tình trạng hệ thống' },
                                    { key: 'marketingEmails', label: 'Email marketing', desc: 'Nhận email khuyến mãi và tin tức' }
                                ].map((item) => (
                                    <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-white">{item.label}</h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={settings.notifications[item.key as keyof typeof settings.notifications]}
                                                onChange={(e) => updateSetting('notifications', item.key, e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                ))}
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
                                <div className="flex items-center justify-between p-4 rounded-lg" style={{ 
                                    backgroundColor: 'var(--admin-error-light)', 
                                    border: '1px solid var(--admin-error)' 
                                }}>
                                    <div>
                                        <h4 className="font-medium flex items-center" style={{ color: 'var(--admin-error)' }}>
                                            <AlertTriangle className="w-4 h-4 mr-2" />
                                            Chế độ bảo trì
                                        </h4>
                                        <p className="text-sm" style={{ color: 'var(--admin-error)' }}>Tạm ngừng truy cập website cho người dùng</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.system.maintenanceMode}
                                            onChange={(e) => updateSetting('system', 'maintenanceMode', e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                                    </label>
                                </div>

                                {[
                                    { key: 'debugMode', label: 'Chế độ debug', desc: 'Hiển thị thông tin debug chi tiết' },
                                    { key: 'cacheEnabled', label: 'Bật cache', desc: 'Sử dụng cache để tăng tốc độ tải trang' }
                                ].map((item) => (
                                    <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-white">{item.label}</h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={settings.system[item.key as keyof typeof settings.system] as boolean}
                                                onChange={(e) => updateSetting('system', item.key, e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
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
        </div>
    );
};

export default SettingsPage;
