import React, { useState } from 'react';
import AdminButton from '../../components/admin/AdminButton';
import AdminModal from '../../components/admin/AdminModal';
import AdminInput from '../../components/admin/AdminInput';
import AdminSelect from '../../components/admin/AdminSelect';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import '../../styles/_custom_checkbox.css';
import usersData from '../../data/jsons/__users.json';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    profilePic: string;
    address?: string;
    phone?: string;
    gender?: string;
}

const initialUsers: User[] = usersData;

const pageSize = 10;
const roleOptions = [
    { value: 'Admin', label: 'Admin' },
    { value: 'User', label: 'User' },
    { value: 'Manager', label: 'Manager' }
];

const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [showForm, setShowForm] = useState(false);
    const [formType, setFormType] = useState<'add' | 'edit' | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({ name: '', email: '', role: 'User' });
    const [notification, setNotification] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [showConfirm, setShowConfirm] = useState<{ id: number | null, bulk?: boolean }>({ id: null });
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState<'name' | 'email' | 'role' | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    // Sort handler
    const handleSort = (key: 'name' | 'email' | 'role') => {
        if (sortBy === key) {
            setSortOrder(order => (order === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortBy(key);
            setSortOrder('asc');
        }
    };

    // Export CSV
    const handleExportCSV = () => {
        const csv = [
            ['Name', 'Email', 'Role'],
            ...users.map(u => [u.name, u.email, u.role])
        ].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'users.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    // Validation
    const validateForm = () => {
        if (!formData.name.trim()) return 'Name is required.';
        if (!formData.email.trim()) return 'Email is required.';
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) return 'Invalid email format.';
        if (formType === 'add' && users.some(u => u.email === formData.email)) return 'Email already exists.';
        return null;
    };

    // Search & filter
    let filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.role.toLowerCase().includes(search.toLowerCase())
    );
    
    // Sorting
    if (sortBy) {
        filteredUsers = [...filteredUsers].sort((a, b) => {
            if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1;
            if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
    }

    // Pagination
    const totalPages = Math.ceil(filteredUsers.length / pageSize);
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    // CRUD
    const handleAddUser = () => {
        setFormType('add');
        setFormData({ name: '', email: '', role: 'User' });
        setShowForm(true);
    };
    
    const handleEditUser = (user: User) => {
        setFormType('edit');
        setSelectedUser(user);
        setFormData({ name: user.name, email: user.email, role: user.role });
        setShowForm(true);
    };
    
    const handleDeleteUser = (id: number) => {
        setShowConfirm({ id });
    };
    
    const confirmDeleteUser = (id: number) => {
        setUsers(users.filter(u => u.id !== id));
        setShowConfirm({ id: null });
        setNotification('User deleted successfully');
        setTimeout(() => setNotification(null), 2000);
    };
    
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const error = validateForm();
        if (error) {
            setNotification(error);
            setTimeout(() => setNotification(null), 2000);
            return;
        }
        setLoading(true);
        setTimeout(() => {
            if (formType === 'add') {
                const newUser: User = {
                    id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
                    ...formData,
                    profilePic: '/src/assets/user.jpg',
                };
                setUsers([...users, newUser]);
                setNotification('User added successfully');
            } else if (formType === 'edit' && selectedUser) {
                setUsers(users.map(u => (
                    u.id === selectedUser.id
                        ? { ...selectedUser, ...formData, profilePic: selectedUser.profilePic }
                        : u
                )));
                setNotification('User updated successfully');
            }
            setShowForm(false);
            setLoading(false);
            setTimeout(() => setNotification(null), 2000);
        }, 800);
    };
    
    // Details modal
    const handleShowDetails = (user: User) => {
        setSelectedUser(user);
        setShowDetails(true);
    };

    return (
        <div className="flex flex-col min-h-[80vh]">
            <div className="flex justify-between items-start mb-6">
                <AdminPageHeader
                    title="Users Management"
                    description="Manage user accounts, roles and permissions"
                    breadcrumb="Users"
                />
                <div className="flex gap-4">
                    <AdminButton
                        onClick={handleAddUser}
                        variant="success"
                        style={{
                            background: '#22c55e',
                            boxShadow: '0 8px 15px rgba(34, 197, 94, 0.3)',
                            borderRadius: '8px',
                            fontWeight: '600',
                            fontSize: '16px',
                            padding: '10px 24px',
                            transition: 'all 0.3s ease',
                        }}
                        className="hover:bg-green-600 hover:shadow-xl hover:-translate-y-1 hover:scale-105 transform transition-all duration-300"
                    >Add User</AdminButton>
                    <AdminButton
                        onClick={handleExportCSV}
                        style={{
                            background: '#3b82f6',
                            boxShadow: '0 6px 12px rgba(59, 130, 246, 0.3)',
                            borderRadius: '8px',
                            fontWeight: '600',
                            fontSize: '16px',
                            padding: '10px 24px',
                            transition: 'all 0.3s ease',
                        }}
                        className="hover:bg-blue-600 hover:shadow-xl hover:-translate-y-1 hover:scale-105 transform transition-all duration-300"
                    >Export CSV</AdminButton>
                </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ position: 'relative', width: 320 }}>
                    <input
                        type='text'
                        placeholder='Search by name, email, role...'
                        value={search}
                        onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                        style={{
                            padding: '12px 16px 12px 40px',
                            borderRadius: '8px',
                            border: '1.5px solid #22c55e',
                            background: '#f9fafb',
                            color: '#222',
                            fontSize: 16,
                            boxShadow: '0 2px 8px rgba(34,197,94,0.08)',
                            width: '100%',
                            outline: 'none',
                            transition: 'border 0.2s',
                        }}
                    />
                    <span style={{ position: 'absolute', left: 12, top: 12, color: '#22c55e', fontSize: 18 }}>🔍</span>
                </div>
            </div>
            {notification && (
                <div style={{ marginBottom: '1rem', color: notification.includes('successfully') ? 'green' : 'red' }}>{notification}</div>
            )}
            <div style={{ overflowX: 'auto', flex: 1 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem', minWidth: '600px' }}>
                    <thead>
                        <tr>
                            <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: '8px' }}>Avatar</th>
                            <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: '8px', cursor: 'pointer' }} onClick={() => handleSort('name')}>
                                Name {sortBy === 'name' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                            </th>
                            <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: '8px', cursor: 'pointer' }} onClick={() => handleSort('email')}>
                                Email {sortBy === 'email' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                            </th>
                            <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: '8px', cursor: 'pointer' }} onClick={() => handleSort('role')}>
                                Role {sortBy === 'role' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                            </th>
                            <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: '8px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
                        ) : paginatedUsers.length === 0 ? (
                            <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>No users found.</td></tr>
                        ) : paginatedUsers.map(user => (
                            <tr key={user.id}>
                                <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>
                                    <img src={user.profilePic || '/src/assets/user.jpg'} alt='avatar' style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                                </td>
                                <td style={{ borderBottom: '1px solid #eee', padding: '8px', cursor: 'pointer', color: '#2563eb', textDecoration: 'underline' }} onClick={() => handleShowDetails(user)}>{user.name}</td>
                                <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>{user.email}</td>
                                <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>{user.role}</td>
                                <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>
                                    <AdminButton
                                        onClick={() => handleEditUser(user)}
                                        style={{
                                            background: '#f59e0b',
                                            boxShadow: '0 4px 8px rgba(245, 158, 11, 0.3)',
                                            borderRadius: '6px',
                                            fontWeight: '600',
                                            fontSize: '14px',
                                            padding: '6px 16px',
                                            marginRight: '8px',
                                            transition: 'all 0.3s ease',
                                        }}
                                        className="hover:bg-yellow-600 hover:shadow-lg hover:-translate-y-0.5 hover:scale-105 transform transition-all duration-300"
                                        size="small"
                                    >Edit</AdminButton>
                                    <AdminButton
                                        onClick={() => handleDeleteUser(user.id)}
                                        variant="danger"
                                        style={{
                                            background: '#ef4444',
                                            boxShadow: '0 4px 8px rgba(239, 68, 68, 0.3)',
                                            borderRadius: '6px',
                                            fontWeight: '600',
                                            fontSize: '14px',
                                            padding: '6px 16px',
                                            transition: 'all 0.3s ease',
                                        }}
                                        className="hover:bg-red-600 hover:shadow-xl hover:-translate-y-1 hover:scale-105 transform transition-all duration-300"
                                        size="small"
                                    >Delete</AdminButton>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Pagination luôn ở cuối trang */}
            <div className="mt-auto pt-4 pb-4 sticky bottom-0 bg-white border-t border-gray-200">
                <div className="flex justify-center items-center" style={{gap: '8px'}}>
                    <AdminButton
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                        className={`bg-gray-200 hover:bg-gray-400 text-gray-700 font-bold px-4 py-1 rounded shadow transition-all duration-200 border border-gray-400 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        size="small"
                    >Prev</AdminButton>
                    {[...Array(totalPages)].map((_, i) => (
                        <AdminButton
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={
                                currentPage === i + 1
                                    ? "bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-1 rounded shadow transition-all duration-200 border-2 border-blue-700 text-lg"
                                    : "bg-gray-100 hover:bg-gray-300 text-gray-700 font-bold px-4 py-1 rounded shadow transition-all duration-200 border border-gray-300 text-lg"
                            }
                            size="small"
                        >{i + 1}</AdminButton>
                    ))}
                    <AdminButton
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                        className={`bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-1 rounded shadow transition-all duration-200 border border-blue-600 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                        size="small"
                    >Next</AdminButton>
                </div>
            </div>
            
            {/* Add/Edit User Modal */}
            <AdminModal
                isOpen={showForm}
                onClose={() => setShowForm(false)}
                title={formType === 'add' ? 'Add User' : 'Edit User'}
                size="medium"
            >
                <form onSubmit={handleFormSubmit}>
                    <AdminInput
                        label="Name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        error={!formData.name.trim() ? 'Name is required' : undefined}
                    />
                    <AdminInput
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        error={!formData.email.trim() ? 'Email is required' : undefined}
                        style={{ marginTop: '1rem' }}
                    />
                    <AdminSelect
                        label="Role"
                        value={formData.role}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, role: e.target.value })}
                        options={roleOptions}
                        style={{ marginTop: '1rem' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '1.5rem' }}>
                        <AdminButton
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="bg-slate-500 hover:bg-slate-700 text-white font-bold px-6 py-2 rounded shadow-md transition-all duration-200"
                        >Cancel</AdminButton>
                        <AdminButton
                            type="submit"
                            className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-6 py-2 rounded shadow-md transition-all duration-200"
                        >{formType === 'add' ? 'Add' : 'Update'}</AdminButton>
                    </div>
                </form>
            </AdminModal>
            
            {/* User Details Modal */}
            <AdminModal
                isOpen={showDetails}
                onClose={() => setShowDetails(false)}
                title="User Details"
                size="small"
            >
                {selectedUser && (
                    <div style={{ textAlign: 'center' }}>
                        <img src={selectedUser.profilePic || '/src/assets/user.jpg'} alt='avatar' style={{ width: '64px', height: '64px', borderRadius: '50%', marginBottom: '1rem' }} />
                        <h2 style={{ margin: '0 0 1rem 0' }}>{selectedUser.name}</h2>
                        <p style={{ margin: '0.5rem 0' }}><b>Email:</b> {selectedUser.email}</p>
                        <p style={{ margin: '0.5rem 0' }}><b>Role:</b> {selectedUser.role}</p>
                        <div style={{ marginTop: '1.5rem' }}>
                            <AdminButton onClick={() => setShowDetails(false)} variant="primary">Close</AdminButton>
                        </div>
                    </div>
                )}
            </AdminModal>
            
            {/* Confirmation Dialog */}
            <AdminModal
                isOpen={showConfirm.id !== null}
                onClose={() => setShowConfirm({ id: null })}
                title="Confirm Delete"
                size="small"
            >
                <div style={{ textAlign: 'center' }}>
                    <p style={{ margin: '1rem 0' }}>Are you sure you want to delete this user?</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '1.5rem' }}>
                        <AdminButton onClick={() => setShowConfirm({ id: null })} variant="secondary">Cancel</AdminButton>
                        <AdminButton onClick={() => confirmDeleteUser(showConfirm.id!)} variant="danger">Delete</AdminButton>
                    </div>
                </div>
            </AdminModal>
        </div>
    );
};

export default UsersPage;
