import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminInput from '@/components/admin/AdminInput';
import AdminButton from '@/components/admin/AdminButton';
import AdminFormCard from '@/components/admin/AdminFormCard';
import AdminAlert from '@/components/admin/AdminAlert';
import '../../styles/_admin_theme.css';

const AdminLoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { adminLogin, isLoading, isAdminAuthenticated } = useAdminAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const message = searchParams.get('message');
        if (message === 'password-reset-success') {
            setSuccessMessage(
                'Password has been reset successfully! You can now login with your new password.',
            );
        }
    }, [searchParams]);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAdminAuthenticated) {
            navigate('/admin/dashboard', { replace: true });
        }
    }, [isAdminAuthenticated, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            await adminLogin(email, password);
            // Navigate sẽ được xử lý bởi useEffect khi isAdminAuthenticated thay đổi
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error ? error.message : 'Login failed';
            setError(errorMessage);
        }
    };

    return (
        <AdminFormCard
            title="Admin Login"
            subtitle="Access the admin dashboard"
        >
            {successMessage && (
                <AdminAlert
                    type="success"
                    message={successMessage}
                />
            )}

            {error && (
                <AdminAlert
                    type="error"
                    message={error}
                />
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
                Email: admin@hotel.com<br />
                Password: admin123
            </div>
        </AdminFormCard>
    );
};

export default AdminLoginPage;
