import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AdminInput from '@/components/admin/AdminInput';
import AdminButton from '@/components/admin/AdminButton';
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
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    textAlign: 'center'
                }}>
                    <div style={{ 
                        fontSize: '48px', 
                        marginBottom: '1rem',
                        color: '#dc2626'
                    }}>
                        ❌
                    </div>
                    <h1 style={{
                        fontSize: '24px',
                        fontWeight: '600',
                        color: 'var(--admin-text-primary)',
                        margin: '0 0 1rem 0'
                    }}>
                        Invalid Reset Link
                    </h1>
                    <p style={{
                        color: 'var(--admin-text-secondary)',
                        fontSize: '14px',
                        marginBottom: '2rem'
                    }}>
                        The password reset link is invalid or has expired. Please request a new one.
                    </p>
                    <Link 
                        to="/admin/forgot-password" 
                        style={{ textDecoration: 'none', marginRight: '1rem' }}
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
            </div>
        );
    }

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
                        Reset Admin Password
                    </h1>
                    <p style={{
                        color: 'var(--admin-text-secondary)',
                        fontSize: '14px',
                        margin: 0
                    }}>
                        Enter your new admin password
                    </p>
                </div>

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

                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
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
            </div>
        </div>
    );
};

export default AdminResetPasswordPage;
