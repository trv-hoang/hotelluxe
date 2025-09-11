import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminInput from '@/components/admin/AdminInput';
import AdminButton from '@/components/admin/AdminButton';
import { adminForgotPassword } from '@/api/auth';
import '../../styles/_admin_theme.css';

const AdminForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!email) {
            setError('Please enter your email address');
            setIsLoading(false);
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            setIsLoading(false);
            return;
        }

        try {
            await adminForgotPassword(email);
            setIsSuccess(true);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Request failed';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
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
                        color: '#10b981'
                    }}>
                        ✓
                    </div>
                    <h1 style={{
                        fontSize: '24px',
                        fontWeight: '600',
                        color: 'var(--admin-text-primary)',
                        margin: '0 0 1rem 0'
                    }}>
                        Email Sent Successfully
                    </h1>
                    <p style={{
                        color: 'var(--admin-text-secondary)',
                        fontSize: '14px',
                        marginBottom: '2rem'
                    }}>
                        We've sent a password reset link to <strong>{email}</strong>. 
                        Please check your email and follow the instructions to reset your admin password.
                    </p>
                    <Link 
                        to="/admin/login" 
                        style={{ textDecoration: 'none' }}
                    >
                        <AdminButton 
                            variant="primary" 
                            style={{ width: '100%' }}
                        >
                            Back to Admin Login
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
                        Admin Password Reset
                    </h1>
                    <p style={{
                        color: 'var(--admin-text-secondary)',
                        fontSize: '14px',
                        margin: 0
                    }}>
                        Enter your admin email to receive a password reset link
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
                        label="Admin Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        placeholder="Enter your admin email address"
                        required
                        style={{ marginBottom: '1.5rem' }}
                    />

                    <AdminButton
                        type="submit"
                        variant="primary"
                        disabled={isLoading}
                        style={{ width: '100%', marginBottom: '1rem' }}
                    >
                        {isLoading ? 'Sending Reset Link...' : 'Send Reset Link'}
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
                    <strong>Security Note:</strong><br />
                    Reset links are only sent to verified admin email addresses and expire after 1 hour.
                </div>
            </div>
        </div>
    );
};

export default AdminForgotPasswordPage;
