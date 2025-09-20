import { useState } from 'react';
import {
    useNavigate,
    Link,
    useSearchParams,
    useParams,
} from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { resetPassword } from '@/api/auth';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { token: urlToken } = useParams<{ token: string }>();

    // Support both URL parameter and query parameter
    const token = searchParams.get('token') || urlToken;
    const email = searchParams.get('email');
    const [formData, setFormData] = useState({
        password: '',
        password_confirmation: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!token) {
            toast.error('Token không hợp lệ');
            setLoading(false);
            return;
        }

        if (formData.password !== formData.password_confirmation) {
            toast.error('Mật khẩu xác nhận không khớp');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Mật khẩu phải có ít nhất 6 ký tự');
            setLoading(false);
            return;
        }

        try {
            await resetPassword(
                token,
                formData.password,
                formData.password_confirmation,
            );
            toast.success('Mật khẩu đã được cập nhật thành công!');

            // Redirect to login page after 2 seconds
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err: unknown) {
            let errorMessage = 'Cập nhật mật khẩu thất bại';

            if (err && typeof err === 'object' && 'response' in err) {
                const apiError = err as {
                    response?: { data?: { message?: string } };
                };
                errorMessage =
                    apiError.response?.data?.message ||
                    'Cập nhật mật khẩu thất bại';
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }

            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className='min-h-[80vh] flex items-center justify-center px-6'>
                <div className='w-full max-w-sm p-6 border rounded-lg shadow-lg bg-white text-center'>
                    <h1 className='text-2xl font-bold mb-4 text-red-600'>
                        Token không hợp lệ
                    </h1>
                    <p className='text-gray-600 mb-6'>
                        Link reset password không đúng hoặc đã hết hạn.
                    </p>
                    <Link
                        to='/forgot-password'
                        className='text-green-600 underline underline-offset-4'
                    >
                        Yêu cầu reset password mới
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-[80vh] flex items-center justify-center px-6 relative'>
            <div className='absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-3xl opacity-30' />
            <div className='absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-tr from-pink-400 to-purple-500 rounded-full blur-3xl opacity-30' />

            <div className='w-full max-w-sm p-6 border rounded-lg shadow-lg bg-white'>
                <h1 className='text-2xl font-bold mb-6 text-center'>
                    Tạo mật khẩu mới
                </h1>

                <div className='mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
                    <p className='text-sm text-blue-700'>
                        ✅ Token hợp lệ. Vui lòng nhập mật khẩu mới
                        {email ? ` cho tài khoản: ${email}` : ''}.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div>
                        <Input
                            type='password'
                            name='password'
                            placeholder='Mật khẩu mới (tối thiểu 6 ký tự)'
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                        />
                    </div>

                    <div>
                        <Input
                            type='password'
                            name='password_confirmation'
                            placeholder='Xác nhận mật khẩu mới'
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            required
                            minLength={6}
                        />
                    </div>

                    {formData.password &&
                        formData.password_confirmation &&
                        formData.password !==
                            formData.password_confirmation && (
                            <p className='text-sm text-red-600'>
                                ⚠️ Mật khẩu xác nhận không khớp
                            </p>
                        )}

                    {formData.password &&
                        formData.password.length > 0 &&
                        formData.password.length < 6 && (
                            <p className='text-sm text-red-600'>
                                ⚠️ Mật khẩu phải có ít nhất 6 ký tự
                            </p>
                        )}

                    <Button
                        type='submit'
                        disabled={
                            loading ||
                            formData.password !==
                                formData.password_confirmation ||
                            formData.password.length < 6
                        }
                        className='w-full bg-green-700 text-white disabled:opacity-50'
                    >
                        {loading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
                    </Button>
                </form>

                <div className='mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg'>
                    <p className='text-xs text-yellow-700'>
                        🔒 <strong>Lưu ý:</strong> Sau khi cập nhật thành công,
                        bạn sẽ được chuyển đến trang đăng nhập.
                    </p>
                </div>

                <p className='text-sm text-center mt-6'>
                    Nhớ mật khẩu rồi?{' '}
                    <Link
                        to='/login'
                        className='text-green-600 underline underline-offset-4'
                    >
                        Đăng nhập ngay
                    </Link>
                </p>
            </div>
        </div>
    );
}
