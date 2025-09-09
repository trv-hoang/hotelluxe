import React, { useState } from 'react';
import AdminButton from '../../components/admin/AdminButton';
import AdminModal from '../../components/admin/AdminModal';
import AdminInput from '../../components/admin/AdminInput';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import '../../styles/_custom_checkbox.css';
import avatar from '@/assets/user.jpg';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

const initialUsers: User[] = [
    { id: 1, name: 'Hoang', email: '24210127@ms.uit.edu.vn', role: 'Admin' },
    { id: 2, name: 'Johnson Baby', email: 'bob@example.com', role: 'User' },
    { id: 3, name: 'John Wick', email: 'charlie@example.com', role: 'User' },
];

const pageSize = 5;
const roles = ['Admin', 'User', 'Manager'];

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
                const newUser = {
                    id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
                    ...formData,
                };
                setUsers([...users, newUser]);
                setNotification('User added successfully');
            } else if (formType === 'edit' && selectedUser) {
                setUsers(users.map(u => (u.id === selectedUser.id ? { ...selectedUser, ...formData } : u)));
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
        <div>
            <AdminPageHeader
                title="Users Management"
                description="Manage user accounts, roles and permissions"
                breadcrumb="Users"
            >
                <AdminButton onClick={handleAddUser} variant="primary">
                    Add User
                </AdminButton>
                <AdminButton onClick={() => handleExportCSV()} variant="success">
                    Export CSV
                </AdminButton>
            </AdminPageHeader>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                <input
                    type='text'
                    placeholder='Search by name, email, role...'
                    value={search}
                    onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd', minWidth: '220px', background: '#fff', color: '#222' }}
                />
            </div>
            
            {notification && (
                <div style={{ marginBottom: '1rem', color: notification.includes('successfully') ? 'green' : 'red' }}>{notification}</div>
            )}
            
            <div style={{ overflowX: 'auto' }}>
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
                                    <img src={avatar} alt='avatar' style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                                </td>
                                <td style={{ borderBottom: '1px solid #eee', padding: '8px', cursor: 'pointer', color: '#2563eb', textDecoration: 'underline' }} onClick={() => handleShowDetails(user)}>{user.name}</td>
                                <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>{user.email}</td>
                                <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>{user.role}</td>
                                <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>
                                    <AdminButton onClick={() => handleEditUser(user)} variant="warning" size="small" style={{ marginRight: '8px' }}>Edit</AdminButton>
                                    <AdminButton onClick={() => handleDeleteUser(user.id)} variant="danger" size="small">Delete</AdminButton>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '1rem', justifyContent: 'center' }}>
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #ddd', background: currentPage === 1 ? '#eee' : '#fff', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}>Prev</button>
                    {[...Array(totalPages)].map((_, i) => (
                        <button key={i} onClick={() => setCurrentPage(i + 1)} style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #ddd', background: currentPage === i + 1 ? '#2563eb' : '#fff', color: currentPage === i + 1 ? '#fff' : '#222', cursor: 'pointer' }}>{i + 1}</button>
                    ))}
                    <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #ddd', background: currentPage === totalPages ? '#eee' : '#fff', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}>Next</button>
                </div>
            )}
            
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
                    <div style={{ marginTop: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151' }}>Role:</label>
                        <select 
                            value={formData.role} 
                            onChange={e => setFormData({ ...formData, role: e.target.value })} 
                            style={{ 
                                width: '100%', 
                                padding: '0.75rem', 
                                borderRadius: '6px', 
                                border: '1px solid #d1d5db', 
                                background: '#fff', 
                                color: '#374151',
                                fontSize: '14px',
                                transition: 'border-color 0.2s'
                            }}
                        >
                            {roles.map(role => <option key={role} value={role}>{role}</option>)}
                        </select>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '1.5rem' }}>
                        <AdminButton type="button" onClick={() => setShowForm(false)} variant="secondary">Cancel</AdminButton>
                        <AdminButton type="submit" variant="primary">{formType === 'add' ? 'Add' : 'Update'}</AdminButton>
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
                        <img src={avatar} alt='avatar' style={{ width: '64px', height: '64px', borderRadius: '50%', marginBottom: '1rem' }} />
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
