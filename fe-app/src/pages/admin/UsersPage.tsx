import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Edit, Trash2, Eye, Plus, Users, UserCheck, UserX, Crown } from 'lucide-react';
import AdminButton from '../../components/admin/AdminButton';
import AdminModal from '../../components/admin/AdminModal';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminStatCard from '../../components/admin/AdminStatCard';
import AdminAvatarDisplay from '../../components/admin/AdminAvatarDisplay';
import { useNotifications } from '../../hooks/useNotifications';
import { adminApi, type AdminUser } from '../../api/admin';

// Role Badge Component
const RoleBadge: React.FC<{ role: string }> = ({ role }) => {
    const getStatusColor = (role: string) => {
        switch (role) {
            case 'admin':
                return 'bg-red-100 text-red-800';
            case 'manager':
                return 'bg-blue-100 text-blue-800';
            case 'user':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (role: string) => {
        switch (role) {
            case 'admin':
                return <Crown className="w-3 h-3" />;
            case 'manager':
                return <UserCheck className="w-3 h-3" />;
            case 'user':
                return <UserX className="w-3 h-3" />;
            default:
                return null;
        }
    };

    return (
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(role)}`}>
            {getStatusIcon(role)}
            {role}
        </span>
    );
};

const UsersPageFixed: React.FC = () => {
    const { addNotification } = useNotifications();
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
    const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');

    // Fetch users from API
    const fetchUsers = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await adminApi.getUsers();
            console.log('Raw API response:', response);
            console.log('Raw users data:', response);
            
            // Backend should return only active users, but double-check by filtering deleted ones
            console.log('Raw response from API:', response);
            
            // Handle different response structures safely
            console.log('All users from API:', response);
            
            try {
                let allUsers: AdminUser[] = [];
                
                if (Array.isArray(response)) {
                    allUsers = response;
                } else if (response && Array.isArray(response.data)) {
                    allUsers = response.data;
                } else if (response && response.users && Array.isArray(response.users)) {
                    allUsers = response.users;
                } else {
                    console.warn('Unexpected API response structure, using empty array:', response);
                    setUsers([]);
                    return;
                }
                
                console.log('Parsed users array:', allUsers);
                
                // Filter out deleted users
                const activeUsers = allUsers.filter((user: AdminUser) => {
                    try {
                        const nameDeleted = user.name && user.name.toLowerCase().includes('deleted_');
                        const emailDeleted = user.email && user.email.toLowerCase().includes('deleted_');
                        const hasDeletedAt = user.deleted_at !== null && user.deleted_at !== undefined;
                        
                        const isDeleted = nameDeleted || emailDeleted || hasDeletedAt;
                        
                        if (isDeleted) {
                            console.log(`Filtered out deleted user: ${user.name} (${user.email})`);
                        }
                        return !isDeleted;
                    } catch (filterError) {
                        console.error('Error filtering user:', user, filterError);
                        return true; // Include user if filtering fails
                    }
                });
                
                console.log('Final active users:', activeUsers);
                setUsers(activeUsers);
            } catch (processingError) {
                console.error('Error processing users data:', processingError);
                setUsers([]); // Fallback to empty array
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
            addNotification({
                type: 'error',
                title: 'Lỗi tải dữ liệu',
                message: 'Không thể tải danh sách người dùng'
            });
        } finally {
            setIsLoading(false);
        }
    }, [addNotification]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);    // Statistics calculation
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

    // Filter users based on search and role
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                user.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRole = filterRole === 'all' || user.role === filterRole;
            return matchesSearch && matchesRole;
        });
    }, [users, searchTerm, filterRole]);

    // Modal handlers
    const handleCreateUser = () => {
        setCurrentUser(null);
        setModalMode('create');
        setIsModalOpen(true);
    };

    const handleEditUser = (user: AdminUser) => {
        setCurrentUser(user);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleViewUser = (user: AdminUser) => {
        setCurrentUser(user);
        setModalMode('view');
        setIsModalOpen(true);
    };

    const handleDeleteUser = async (user: AdminUser) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa người dùng "${user.name}"?`)) {
            return;
        }

        try {
            await adminApi.deleteUser(user.id);
            
            // Show success notification first
            addNotification({
                type: 'success',
                title: 'Xóa thành công',
                message: `Đã xóa người dùng ${user.name}`
            });
            
            // Force reload the page to ensure deleted user is completely removed
            window.location.reload();
        } catch (error) {
            console.error('Failed to delete user:', error);
            addNotification({
                type: 'error',
                title: 'Lỗi xóa người dùng',
                message: 'Không thể xóa người dùng. Vui lòng thử lại.'
            });
        }
    };

    // Create/Update user
    const handleSaveUser = async (userData: { name: string; email: string; role: string; phone?: string; address?: string; password?: string }) => {
        console.log('handleSaveUser called with:', { userData, modalMode, currentUser });
        
        try {
            if (modalMode === 'create') {
                console.log('Creating new user...');
                const newUser = await adminApi.createUser({
                    name: userData.name || '',
                    email: userData.email || '',
                    password: userData.password || 'password123',
                    role: userData.role || 'user'
                });
                console.log('New user created:', newUser);
                setUsers([...users, newUser]);
                addNotification({
                    type: 'success',
                    title: 'Tạo thành công',
                    message: `Đã tạo người dùng ${userData.name}`
                });
            } else if (modalMode === 'edit' && currentUser) {
                console.log('Updating user...', currentUser.id, userData);
                const updatedUser = await adminApi.updateUser(currentUser.id, userData);
                console.log('User updated:', updatedUser);
                setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
                addNotification({
                    type: 'success',
                    title: 'Cập nhật thành công',
                    message: `Đã cập nhật người dùng ${userData.name}`
                });
            }
            console.log('Closing modal...');
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to save user:', error);
            
            // More detailed error handling
            let errorMessage = 'Không thể lưu thông tin người dùng. Vui lòng thử lại.';
            
            if (error && typeof error === 'object' && 'response' in error) {
                const apiError = error as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
                
                console.log('API Error Response:', apiError.response);
                
                if (apiError.response?.data?.message) {
                    errorMessage = apiError.response.data.message;
                } else if (apiError.response?.data?.errors) {
                    errorMessage = `Validation errors: ${JSON.stringify(apiError.response.data.errors)}`;
                }
            } else if (error instanceof Error) {
                errorMessage = error.message;
                console.log('Error message:', error.message);
            }
            
            addNotification({
                type: 'error',
                title: 'Lỗi lưu dữ liệu',
                message: errorMessage
            });
        }
    };

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        {[1,2,3,4].map(i => (
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
                title="Quản lý người dùng"
                description="Quản lý thông tin người dùng và phân quyền"
            />

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                    iconColor="text-blue-600"
                    iconBgColor="bg-blue-100"
                />
                <AdminStatCard
                    title="Người dùng thường"
                    value={statistics.regularUsers}
                    icon={UserX}
                    iconColor="text-green-600"
                    iconBgColor="bg-green-100"
                />
            </div>

            {/* Users Table */}
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
                            Danh sách người dùng
                        </h3>
                        <AdminButton
                            variant="primary"
                            onClick={handleCreateUser}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Thêm người dùng
                        </AdminButton>
                    </div>

                    {/* Search and Filter */}
                    <div className="flex gap-4 mb-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tên hoặc email..."
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
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
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
                                <option value="all">Tất cả vai trò</option>
                                <option value="user">Người dùng</option>
                                <option value="manager">Quản lý</option>
                                <option value="admin">Quản trị viên</option>
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
                                        Người dùng
                                    </th>
                                    <th 
                                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                                        style={{ 
                                            color: 'var(--admin-text-primary)',
                                            borderBottom: '1px solid var(--admin-border-primary)'
                                        }}
                                    >
                                        Vai trò
                                    </th>
                                    <th 
                                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                                        style={{ 
                                            color: 'var(--admin-text-primary)',
                                            borderBottom: '1px solid var(--admin-border-primary)'
                                        }}
                                    >
                                        Thông tin
                                    </th>
                                    <th 
                                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                                        style={{ 
                                            color: 'var(--admin-text-primary)',
                                            borderBottom: '1px solid var(--admin-border-primary)'
                                        }}
                                    >
                                        Thống kê
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
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td 
                                            colSpan={6} 
                                            className="px-6 py-12 text-center"
                                            style={{ 
                                                color: 'var(--admin-text-secondary)',
                                                borderBottom: '1px solid var(--admin-border-secondary)'
                                            }}
                                        >
                                            Không có dữ liệu
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr 
                                            key={user.id}
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
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center space-x-3">
                                                    <AdminAvatarDisplay 
                                                        src={user.profile_pic || undefined} 
                                                        alt={user.name}
                                                        size="small"
                                                    />
                                                    <div>
                                                        <div 
                                                            className="font-medium"
                                                            style={{ color: 'var(--admin-text-primary)' }}
                                                        >
                                                            {user.name}
                                                        </div>
                                                        <div 
                                                            className="text-sm"
                                                            style={{ color: 'var(--admin-text-secondary)' }}
                                                        >
                                                            {user.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <RoleBadge role={user.role} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm">
                                                    <div style={{ color: 'var(--admin-text-primary)' }}>
                                                        📱 {user.phone || 'Chưa có'}
                                                    </div>
                                                    <div style={{ color: 'var(--admin-text-secondary)' }}>
                                                        🎂 {user.dob ? new Date(user.dob).toLocaleDateString('vi-VN') : 'Chưa có'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm">
                                                    <div style={{ color: 'var(--admin-text-primary)' }}>
                                                        📅 {user.bookings_count || 0} đặt phòng
                                                    </div>
                                                    <div style={{ color: 'var(--admin-text-primary)' }}>
                                                        ⭐ {user.reviews_count || 0} đánh giá
                                                    </div>
                                                    <div style={{ color: 'var(--admin-text-secondary)' }}>
                                                        💰 {user.total_spent ? new Intl.NumberFormat('vi-VN').format(parseFloat(user.total_spent)) + ' VND' : '0 VND'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td 
                                                className="px-6 py-4 whitespace-nowrap text-sm"
                                                style={{ color: 'var(--admin-text-secondary)' }}
                                            >
                                                {new Date(user.created_at).toLocaleDateString('vi-VN')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex space-x-2">
                                                    <AdminButton
                                                        variant="secondary"
                                                        size="small"
                                                        onClick={() => handleViewUser(user)}
                                                        title="Xem chi tiết người dùng"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </AdminButton>
                                                    <AdminButton
                                                        variant="warning"
                                                        size="small"
                                                        onClick={() => handleEditUser(user)}
                                                        title="Chỉnh sửa thông tin người dùng"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </AdminButton>
                                                    <AdminButton
                                                        variant="danger"
                                                        size="small"
                                                        onClick={() => handleDeleteUser(user)}
                                                        title="Xóa người dùng"
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
                    {filteredUsers.length > 0 && (
                        <div 
                            className="px-6 py-3 text-sm mt-4"
                            style={{ 
                                background: 'var(--admin-bg-secondary)', 
                                borderTop: '1px solid var(--admin-border-primary)',
                                color: 'var(--admin-text-secondary)'
                            }}
                        >
                            Hiển thị {filteredUsers.length} / {users.length} kết quả
                        </div>
                    )}
                </div>
            </div>

            {/* User Modal */}
            <AdminModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={
                    modalMode === 'create' ? 'Thêm người dùng mới' :
                    modalMode === 'edit' ? 'Chỉnh sửa người dùng' :
                    'Thông tin chi tiết'
                }
            >
                <UserForm 
                    user={currentUser}
                    mode={modalMode}
                    onSave={handleSaveUser}
                    onCancel={() => setIsModalOpen(false)}
                />
            </AdminModal>
        </div>
    );
};

// User Form Component
interface UserFormProps {
    user: AdminUser | null;
    mode: 'create' | 'edit' | 'view';
    onSave: (userData: { name: string; email: string; role: string; phone?: string; address?: string; password?: string }) => void;
    onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, mode, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        role: user?.role || 'user',
        phone: user?.phone || '',
        address: user?.address || '',
        password: ''
    });

    // Update form data when user changes
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                role: user.role || 'user',
                phone: user.phone || '',
                address: user.address || '',
                password: ''
            });
        }
    }, [user]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (mode === 'view') return;
        
        onSave(formData);
    };

    const isReadonly = mode === 'view';

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--admin-text-primary)' }}>
                    Họ tên *
                </label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full p-2 rounded-md admin-input"
                    required
                    readOnly={isReadonly}
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--admin-text-primary)' }}>
                    Email *
                </label>
                <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full p-2 rounded-md admin-input"
                    required
                    readOnly={isReadonly}
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--admin-text-primary)' }}>
                    Vai trò *
                </label>
                <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full p-2 rounded-md admin-select"
                    disabled={isReadonly}
                >
                    <option value="user">Người dùng</option>
                    <option value="manager">Quản lý</option>
                    <option value="admin">Quản trị viên</option>
                </select>
            </div>

            {mode === 'create' && (
                <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--admin-text-primary)' }}>
                        Mật khẩu *
                    </label>
                    <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full p-2 rounded-md admin-input"
                        required
                    />
                </div>
            )}

            <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--admin-text-primary)' }}>
                    Số điện thoại
                </label>
                <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full p-2 rounded-md admin-input"
                    readOnly={isReadonly}
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--admin-text-primary)' }}>
                    Địa chỉ
                </label>
                <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full p-2 rounded-md admin-input"
                    rows={3}
                    readOnly={isReadonly}
                />
            </div>

            {!isReadonly && (
                <div className="flex justify-end space-x-3 mt-6">
                    <AdminButton
                        type="button"
                        variant="secondary"
                        onClick={onCancel}
                    >
                        Hủy
                    </AdminButton>
                    <AdminButton
                        type="submit"
                        variant="primary"
                    >
                        {mode === 'create' ? 'Tạo mới' : 'Cập nhật'}
                    </AdminButton>
                </div>
            )}
        </form>
    );
};

export default UsersPageFixed;