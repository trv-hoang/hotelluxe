import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminInput from '@/components/admin/AdminInput';
import AdminButton from '@/components/admin/AdminButton';
import '../../styles/_admin_theme.css';

const AdminLoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { adminLogin, isLoading } = useAdminAuth();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const message = searchParams.get('message');
        if (message === 'password-reset-success') {
            setSuccessMessage('Password has been reset successfully! You can now login with your new password.');
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            await adminLogin(email, password);
            navigate('/admin/dashboard');
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Login failed';
            setError(errorMessage);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '1rem'
        }}>
            <div className="admin-card" style={{
                width: '100%',
                maxWidth: '400px',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{
                        fontSize: '28px',
                        fontWeight: '700',
                        color: 'var(--admin-text-primary)',
                        margin: '0 0 0.5rem 0'
                    }}>
                        Admin Login
                    </h1>
                    <p style={{
                        color: 'var(--admin-text-secondary)',
                        fontSize: '14px',
                        margin: 0
                    }}>
                        Access the admin dashboard
                    </p>
                </div>

                {successMessage && (
                    <div style={{
                        marginBottom: '1rem',
                        padding: '12px',
                        backgroundColor: '#f0fdf4',
                        border: '1px solid #bbf7d0',
                        borderRadius: '6px',
                        color: '#15803d',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <span>✅</span>
                        {successMessage}
                    </div>
                )}

                {error && (
                    <div style={{
                        marginBottom: '1rem',
                        padding: '12px',
                        backgroundColor: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: '6px',
                        color: '#dc2626',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <span>⚠️</span>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <AdminInput
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        required
                        style={{ marginBottom: '1rem' }}
                    />
                    
                    <AdminInput
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        required
                        style={{ marginBottom: '1.5rem' }}
                    />

                    <AdminButton
                        type="submit"
                        variant="primary"
                        disabled={isLoading}
                        style={{ width: '100%', marginBottom: '1rem' }}
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </AdminButton>
                </form>

                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <Link 
                        to="/admin/forgot-password" 
                        style={{
                            color: 'var(--admin-sidebar-active)',
                            textDecoration: 'none',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}
                    >
                        Forgot your password?
                    </Link>
                </div>

                <div style={{
                    marginTop: '1.5rem',
                    padding: '1rem',
                    backgroundColor: 'var(--admin-bg-secondary)',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: 'var(--admin-text-secondary)'
                }}>
                    <strong>Demo Credentials:</strong><br />
                    Email: admin@luxe.com<br />
                    Password: admin123
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;
