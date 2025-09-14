import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AdminInput from '@/components/admin/AdminInput';
import AdminButton from '@/components/admin/AdminButton';
import AdminFormCard from '@/components/admin/AdminFormCard';
import AdminAlert from '@/components/admin/AdminAlert';
import AdminErrorCard from '@/components/admin/AdminErrorCard';
import { adminResetPassword } from '@/api/auth';
import '../../styles/_admin_theme.css';

const AdminResetPasswordPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [token, setToken] = useState('');

    useEffect(() => {
        const tokenFromUrl = searchParams.get('token');
        if (!tokenFromUrl) {
            setError('Invalid or missing reset token');
            return;
        }
        setToken(tokenFromUrl);
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!password || !passwordConfirmation) {
            setError('Please fill in all fields');
            setIsLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            setIsLoading(false);
            return;
        }

        if (password !== passwordConfirmation) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        try {
            await adminResetPassword(token, password, passwordConfirmation);
            // Redirect to login with success message
            navigate('/admin/login?message=password-reset-success');
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Password reset failed';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <AdminErrorCard
                title="Invalid Reset Link"
                message="The password reset link is invalid or has expired. Please request a new one."
                iconComponent="❌"
            >
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link 
                        to="/admin/forgot-password" 
                        style={{ textDecoration: 'none' }}
                    >
                        <AdminButton variant="primary">
                            Request New Reset Link
                        </AdminButton>
                    </Link>
                    <Link 
                        to="/admin/login" 
                        style={{ textDecoration: 'none' }}
                    >
                        <AdminButton variant="secondary">
                            Back to Login
                        </AdminButton>
                    </Link>
                </div>
            </AdminErrorCard>
        );
    }

    return (
        <AdminFormCard
            title="Reset Admin Password"
            subtitle="Enter your new admin password"
        >
            {error && (
                <AdminAlert
                    type="error"
                    message={error}
                />
            )}

                            <form onSubmit={handleSubmit}>
                <AdminInput
                    label="New Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    placeholder="Enter new password"
                    required
                    style={{ marginBottom: '1rem' }}
                />

                <AdminInput
                    label="Confirm New Password"
                    type="password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    disabled={isLoading}
                    placeholder="Confirm new password"
                    required
                    style={{ marginBottom: '1.5rem' }}
                />

                <AdminButton
                    type="submit"
                    variant="primary"
                    disabled={isLoading}
                    style={{ width: '100%', marginBottom: '1rem' }}
                >
                    {isLoading ? 'Resetting Password...' : 'Reset Password'}
                </AdminButton>
            </form>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <Link 
                    to="/admin/login" 
                    style={{
                        color: 'var(--admin-sidebar-active)',
                        textDecoration: 'none',
                        fontSize: '14px',
                        fontWeight: '500'
                    }}
                >
                    ← Back to Admin Login
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
                <strong>Password Requirements:</strong><br />
                • At least 6 characters long<br />
                • Should contain letters and numbers<br />
                • Avoid using personal information
            </div>
        </AdminFormCard>
    );
};

export default AdminResetPasswordPage;
