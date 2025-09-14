import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminInput from '@/components/admin/AdminInput';
import AdminButton from '@/components/admin/AdminButton';
import AdminFormCard from '@/components/admin/AdminFormCard';
import AdminAlert from '@/components/admin/AdminAlert';
import AdminSuccessCard from '@/components/admin/AdminSuccessCard';
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
            <AdminSuccessCard
                title="Email Sent Successfully"
                message={`We've sent a password reset link to ${email}. Please check your email and follow the instructions to reset your admin password.`}
                iconComponent="✓"
            >
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
            </AdminSuccessCard>
        );
    }

    return (
        <AdminFormCard
            title="Admin Password Reset"
            subtitle="Enter your admin email to receive a password reset link"
        >
            {error && (
                <AdminAlert
                    type="error"
                    message={error}
                />
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
                <strong>Security Note:</strong><br />
                Reset links are only sent to verified admin email addresses and expire after 1 hour.
            </div>
        </AdminFormCard>
    );
};

export default AdminForgotPasswordPage;
