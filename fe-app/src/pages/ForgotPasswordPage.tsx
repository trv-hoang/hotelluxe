import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { forgotPassword } from '@/api/auth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Pre-fill email if coming from resend OTP
    useEffect(() => {
        if (location.state?.email) {
            setEmail(location.state.email);
        }
    }, [location.state]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await forgotPassword(email);
            toast.success('OTP đã được gửi đến email của bạn');
            // Chuyển hướng đến trang verify OTP và truyền email
            navigate('/verify-otp', { state: { email } });
        } catch (err: unknown) {
            let errorMessage = 'Request failed';

            if (err && typeof err === 'object' && 'response' in err) {
                const apiError = err as {
                    response?: { data?: { message?: string } };
                };
                errorMessage =
                    apiError.response?.data?.message || 'Request failed';
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }

            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-[80vh] flex items-center justify-center px-6 relative'>
            <div className='absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-3xl opacity-30' />
            <div className='absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-tr from-pink-400 to-purple-500 rounded-full blur-3xl opacity-30' />
            <div className='w-full max-w-sm p-6 border rounded-lg shadow-lg bg-white'>
                <h1 className='text-2xl font-bold mb-6'>Tạo mật khẩu mới</h1>

                <form onSubmit={handleSubmit} className='space-y-4'>
                    <Input
                        type='email'
                        placeholder='Nhập email của bạn'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <Button
                        type='submit'
                        disabled={loading}
                        className='w-full bg-green-700 text-white'
                    >
                        {loading ? 'Sending...' : 'Gửi lại code'}
                    </Button>
                </form>

                <p className='text-sm text-center mt-6'>
                    Đã có tài khoản?{' '}
                    <Link
                        to='/login'
                        className='text-green-600 underline underline-offset-4'
                    >
                        Đăng nhập
                    </Link>
                </p>
            </div>
        </div>
    );
}
