import React, { useState, useMemo } from 'react';
import { Edit, Trash2, Eye, Plus, Users, UserCheck, UserX, Crown } from 'lucide-react';
import AdminButton from '../../components/admin/AdminButton';
import AdminModal from '../../components/admin/AdminModal';

import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminStatCard from '../../components/admin/AdminStatCard';
import AdminDataTable from '../../components/admin/AdminDataTable';
import { useNotifications } from '../../hooks/useNotifications';
import usersData from '../../data/jsons/__users.json';

// User interface
interface UserData {
    id: number;
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'user' | 'manager';
    profilePic: string;
    createdAt: string;
    updatedAt: string;
    nickname?: string;
    dob?: string;
    phone?: string;
    gender?: 'male' | 'female' | 'other';
    address?: string;
    [key: string]: unknown;
}

// Role Badge Component
const RoleBadge: React.FC<{ role: string }> = ({ role }) => {
    const getStatusColor = (role: string) => {
        switch (role) {
            case 'admin':
                return 'bg-red-100 text-red-800 dark:text-red-300';
            case 'manager':
                return 'bg-blue-100 text-blue-800 dark:text-blue-300';
            case 'user':
                return 'bg-green-100 text-green-800 dark:text-green-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:text-gray-300';
        }
    };

    const getStatusIcon = (role: string) => {
        switch (role) {
            case 'admin':
                return <Crown className="w-3 h-3" />;
            case 'manager':
                return <UserCheck className="w-3 h-3" />;
            case 'user':
                return <Users className="w-3 h-3" />;
            default:
                return <UserX className="w-3 h-3" />;
        }
    };

    return (
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(role)}`}>
            {getStatusIcon(role)}
            {role.charAt(0).toUpperCase() + role.slice(1)}
        </span>
    );
};

// Generate mock users from JSON data
const generateMockUsers = (): UserData[] => {
    return usersData.map((user, index) => ({
        id: user.id || index + 1,
        name: user.name || `User ${index + 1}`,
        email: user.email || `user${index + 1}@example.com`,
        password: user.password || 'password123',
        role: (user.role as 'admin' | 'user' | 'manager') || 'user',
        profilePic: user.profilePic || '/avatar.png',
        createdAt: user.createdAt || new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: user.updatedAt || new Date().toISOString(),
        nickname: user.nickname || undefined,
        dob: user.dob || undefined,
        phone: user.phone || undefined,
        gender: (user.gender as 'male' | 'female' | 'other') || undefined,
        address: user.address || undefined,
    }));
};

const UsersPage: React.FC = () => {
    const { addNotification } = useNotifications();
    const [users, setUsers] = useState<UserData[]>(() => generateMockUsers());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<UserData | null>(null);
    const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');


    // Statistics calculation
    const statistics = useMemo(() => {
        const totalUsers = users.length;
        const adminUsers = users.filter(user => user.role === 'admin').length;
        const managerUsers = users.filter(user => user.role === 'manager').length;
        const regularUsers = users.filter(user => user.role === 'user').length;

        return {
            totalUsers,
            adminUsers,
            managerUsers,
            regularUsers
        };
    }, [users]);

    // AdminDataTable handles filtering internally

    // Modal handlers
    const handleCreateUser = () => {
        setCurrentUser(null);
        setModalMode('create');
        setIsModalOpen(true);
    };

    const handleEditUser = (user: UserData) => {
        setCurrentUser(user);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleViewUser = (user: UserData) => {
        setCurrentUser(user);
        setModalMode('view');
        setIsModalOpen(true);
    };

    const handleDeleteUser = (user: UserData) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa người dùng "${user.name}"?`)) {
            setUsers(prev => prev.filter(u => u.id !== user.id));
            addNotification({
                type: 'success',
                title: 'Thành công',
                message: `Đã xóa người dùng "${user.name}" thành công!`
            });
        }
    };

    const handleSaveUser = (userData: Partial<UserData>) => {
        if (modalMode === 'create') {
            const newUser: UserData = {
                id: Math.max(...users.map(u => u.id)) + 1,
                name: userData.name || '',
                email: userData.email || '',
                password: userData.password || 'password123',
                role: userData.role || 'user',
                profilePic: userData.profilePic || '/avatar.png',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                nickname: userData.nickname,
                dob: userData.dob,
                phone: userData.phone,
                gender: userData.gender,
                address: userData.address,
            };
            setUsers(prev => [...prev, newUser]);
            addNotification({
                type: 'success',
                title: 'Thành công',
                message: `Đã tạo người dùng "${newUser.name}" thành công!`
            });
        } else if (modalMode === 'edit' && currentUser) {
            const updatedUser: UserData = {
                ...currentUser,
                ...userData,
                updatedAt: new Date().toISOString(),
            };
            setUsers(prev => prev.map(user => user.id === currentUser.id ? updatedUser : user));
            addNotification({
                type: 'success',
                title: 'Thành công',
                message: `Đã cập nhật người dùng "${updatedUser.name}" thành công!`
            });
        }
        setIsModalOpen(false);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="p-6 space-y-6">
                {/* Header */}
                <AdminPageHeader
                    title="Quản lý người dùng"
                    description="Quản lý thông tin và quyền hạn người dùng"
                    extraContent={
                        <AdminButton
                            onClick={handleCreateUser}
                            variant="primary"
                            className="flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Thêm người dùng
                        </AdminButton>
                    }
                />

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <AdminStatCard
                        title="Tổng người dùng"
                        value={statistics.totalUsers}
                        icon={Users}
                        iconColor="text-blue-600"
                        iconBgColor="bg-blue-100"
                    />
                    <AdminStatCard
                        title="Quản trị viên"
                        value={statistics.adminUsers}
                        icon={Crown}
                        iconColor="text-red-600"
                        iconBgColor="bg-red-100"
                    />
                    <AdminStatCard
                        title="Quản lý"
                        value={statistics.managerUsers}
                        icon={UserCheck}
                        iconColor="text-purple-600"
                        iconBgColor="bg-purple-100"
                    />
                    <AdminStatCard
                        title="Người dùng"
                        value={statistics.regularUsers}
                        icon={UserX}
                        iconColor="text-green-600"
                        iconBgColor="bg-green-100"
                    />
                </div>

                {/* Users Table */}
                <AdminDataTable
                    data={users}
                    columns={[
                        {
                            key: 'name',
                            title: 'Người dùng',
                            render: (_, user: UserData) => (
                                <div className="flex items-center">
                                    <img
                                        className="h-10 w-10 rounded-full object-cover"
                                        src={user.profilePic}
                                        alt={user.name}
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = '/avatar.png';
                                        }}
                                    />
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {user.name}
                                        </div>
                                        {user.nickname && (
                                            <div className="text-sm text-gray-500">
                                                @{user.nickname}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ),
                            width: '200px'
                        },
                        {
                            key: 'email',
                            title: 'Email',
                            width: '200px'
                        },
                        {
                            key: 'role',
                            title: 'Vai trò',
                            render: (value) => <RoleBadge role={value as string} />,
                            width: '120px'
                        },
                        {
                            key: 'phone',
                            title: 'Số điện thoại',
                            render: (value) => (value as string) || 'Chưa có',
                            width: '150px'
                        },
                        {
                            key: 'createdAt',
                            title: 'Ngày tạo',
                            render: (value) => formatDate(value as string),
                            width: '120px'
                        },
                        {
                            key: 'actions',
                            title: 'Thao tác',
                            render: (_, user: UserData) => (
                                <div className="flex space-x-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleViewUser(user);
                                        }}
                                        className="text-blue-600 hover:text-blue-800"
                                        title="Xem chi tiết"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditUser(user);
                                        }}
                                        className="text-green-600 hover:text-green-800"
                                        title="Chỉnh sửa"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteUser(user);
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
                    searchKey="name"
                    searchPlaceholder="Tìm kiếm theo tên hoặc email..."
                    filterOptions={{
                        key: 'role',
                        label: 'vai trò',
                        options: [
                            { value: 'admin', label: 'Quản trị viên' },
                            { value: 'manager', label: 'Quản lý' },
                            { value: 'user', label: 'Người dùng' }
                        ]
                    }}
                    loading={false}
                    emptyMessage="Không có người dùng nào"
                />



                {/* Modal */}
                <AdminModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title={
                        modalMode === 'create' ? 'Thêm người dùng mới' :
                        modalMode === 'edit' ? 'Chỉnh sửa người dùng' :
                        'Chi tiết người dùng'
                    }
                    size="large"
                >
                    <UserForm
                        user={currentUser}
                        mode={modalMode}
                        onSave={handleSaveUser}
                        onCancel={() => setIsModalOpen(false)}
                    />
                </AdminModal>
            </div>
        </div>
    );
};

// User Form Component
interface UserFormProps {
    user: UserData | null;
    mode: 'create' | 'edit' | 'view';
    onSave: (userData: Partial<UserData>) => void;
    onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, mode, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<UserData>>({
        name: user?.name || '',
        email: user?.email || '',
        password: user?.password || '',
        role: user?.role || 'user',
        profilePic: user?.profilePic || '',
        nickname: user?.nickname || '',
        dob: user?.dob || '',
        phone: user?.phone || '',
        gender: user?.gender || undefined,
        address: user?.address || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (mode !== 'view') {
            onSave(formData);
        }
    };

    const handleChange = (field: keyof UserData, value: string | undefined) => {
        if (mode !== 'view') {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        disabled={mode === 'view'}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        disabled={mode === 'view'}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                    />
                </div>

                {mode === 'create' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mật khẩu <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => handleChange('password', e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 dark:text-white"
                        />
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Vai trò <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={formData.role}
                        onChange={(e) => handleChange('role', e.target.value)}
                        disabled={mode === 'view'}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                    >
                        <option value="user">Người dùng</option>
                        <option value="manager">Quản lý</option>
                        <option value="admin">Quản trị viên</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nickname
                    </label>
                    <input
                        type="text"
                        value={formData.nickname}
                        onChange={(e) => handleChange('nickname', e.target.value)}
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
                        Giới tính
                    </label>
                    <select
                        value={formData.gender || ''}
                        onChange={(e) => handleChange('gender', e.target.value || undefined)}
                        disabled={mode === 'view'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                    >
                        <option value="">Chọn giới tính</option>
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                        <option value="other">Khác</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ngày sinh
                    </label>
                    <input
                        type="date"
                        value={formData.dob}
                        onChange={(e) => handleChange('dob', e.target.value)}
                        disabled={mode === 'view'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ
                </label>
                <textarea
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    disabled={mode === 'view'}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ảnh đại diện (URL)
                </label>
                <input
                    type="url"
                    value={formData.profilePic}
                    onChange={(e) => handleChange('profilePic', e.target.value)}
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

export default UsersPage;
