import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAdminAuthStore } from '@/store/useAdminAuthStore';
import AdminInput from '@/components/admin/AdminInput';
import AdminPasswordInput from '@/components/admin/AdminPasswordInput';
import AdminButton from '@/components/admin/AdminButton';
import AdminFormCard from '@/components/admin/AdminFormCard';
import AdminAlert from '@/components/admin/AdminAlert';
import '../../styles/_admin_theme.css';

const AdminLoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { adminLogin, isLoading, isAdminAuthenticated } = useAdminAuthStore();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isRedirecting, setIsRedirecting] = useState(false);

    // Debug logging
    React.useEffect(() => {
        console.log('AdminLoginPage: Component mounted');
        console.log('AdminLoginPage: Auth state:', {
            isAdminAuthenticated,
            isLoading,
            adminToken: localStorage.getItem('admin-token') ? 'present' : 'missing'
        });
    }, [isAdminAuthenticated, isLoading]);

    // Debug auth state changes - KHÔNG REDIRECT
    React.useEffect(() => {
        console.log('AdminLoginPage: Auth state changed:', {
            isAdminAuthenticated,
            isLoading
        });
        
        // TEMPORARILY DISABLE REDIRECT để debug
        if (isAdminAuthenticated && !isLoading) {
            console.log('AdminLoginPage: LOGIN THÀNH CÔNG! (không redirect)');
            setIsRedirecting(false);
            setSuccessMessage('Login successful! Debug mode - no redirect');
        }
    }, [isAdminAuthenticated, isLoading, navigate]);

    useEffect(() => {
        const message = searchParams.get('message');
        if (message === 'password-reset-success') {
            setSuccessMessage(
                'Password has been reset successfully! You can now login with your new password.',
            );
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        console.log('AdminLogin: Attempting login with email:', email);
        
        try {
            await adminLogin(email, password);
            console.log('AdminLogin: Login successful, navigating to dashboard');
            navigate('/admin/dashboard');
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Login failed';
            console.error('AdminLogin: Login failed:', errorMessage);
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
                    disabled={isLoading || isRedirecting}
                    required
                    style={{ marginBottom: '1rem' }}
                />
                
                <AdminPasswordInput
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading || isRedirecting}
                    required
                    style={{ marginBottom: '1.5rem' }}
                />

                <AdminButton
                    type="submit"
                    variant="primary"
                    disabled={isLoading || isRedirecting || isAdminAuthenticated}
                    style={{ width: '100%', marginBottom: '1rem' }}
                >
                    {isAdminAuthenticated ? 'Logged In' : isRedirecting ? 'Redirecting...' : isLoading ? 'Signing in...' : 'Sign In'}
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
