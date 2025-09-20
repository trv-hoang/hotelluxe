import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { verifyOTP } from '@/api/auth';
import toast from 'react-hot-toast';

export default function VerifyOTPPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        // Focus vào ô đầu tiên khi component mount
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = (index: number, value: string) => {
        // Chỉ cho phép số
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1); // Chỉ lấy ký tự cuối
        setOtp(newOtp);

        // Auto focus sang ô tiếp theo
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        // Backspace: focus về ô trước
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }

        // Arrow keys navigation
        if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        if (e.key === 'ArrowRight' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text');
        const digits = pastedData.replace(/\D/g, '').slice(0, 6);

        if (digits.length === 6) {
            setOtp(digits.split(''));
            inputRefs.current[5]?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast.error('Email không hợp lệ');
            navigate('/forgot-password');
            return;
        }

        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            toast.error('Vui lòng nhập đầy đủ 6 chữ số');
            return;
        }

        setLoading(true);

        try {
            const response = await verifyOTP(email, otpCode);
            toast.success('Xác thực thành công!');

            // Chuyển đến trang reset password với token
            navigate(
                `/reset-password?token=${response.data.data.reset_token}&email=${email}`,
            );
        } catch (err: unknown) {
            let errorMessage = 'Xác thực thất bại';

            if (err && typeof err === 'object' && 'response' in err) {
                const apiError = err as {
                    response?: { data?: { message?: string } };
                };
                errorMessage =
                    apiError.response?.data?.message || 'Xác thực thất bại';
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }

            toast.error(errorMessage);

            // Clear OTP if invalid
            if (
                errorMessage.includes('không hợp lệ') ||
                errorMessage.includes('hết hạn')
            ) {
                setOtp(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = () => {
        // Redirect về forgot password để gửi lại OTP
        navigate('/forgot-password', { state: { email } });
    };

    if (!email) {
        return (
            <div className='min-h-[80vh] flex items-center justify-center px-6'>
                <div className='w-full max-w-sm p-6 border rounded-lg shadow-lg bg-white text-center'>
                    <h1 className='text-2xl font-bold mb-4 text-red-600'>
                        Thông tin không hợp lệ
                    </h1>
                    <p className='text-gray-600 mb-6'>
                        Vui lòng bắt đầu lại từ trang quên mật khẩu.
                    </p>
                    <Link
                        to='/forgot-password'
                        className='text-green-600 underline underline-offset-4'
                    >
                        Quay lại trang quên mật khẩu
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-[80vh] flex items-center justify-center px-6 relative'>
            <div className='absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-3xl opacity-30' />
            <div className='absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-tr from-pink-400 to-purple-500 rounded-full blur-3xl opacity-30' />

            <div className='w-full max-w-md p-6 border rounded-lg shadow-lg bg-white'>
                <div className='text-center mb-6'>
                    <h1 className='text-2xl font-bold mb-2'>
                        Nhập mã xác thực
                    </h1>
                    <p className='text-gray-600 text-sm'>
                        Chúng tôi đã gửi mã 6 chữ số đến
                    </p>
                    <p className='text-green-600 font-medium'>{email}</p>
                </div>

                <form onSubmit={handleSubmit} className='space-y-6'>
                    <div className='flex justify-center space-x-3'>
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => {
                                    inputRefs.current[index] = el;
                                }}
                                type='text'
                                inputMode='numeric'
                                maxLength={1}
                                value={digit}
                                onChange={(e) =>
                                    handleChange(index, e.target.value)
                                }
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={handlePaste}
                                className='w-12 h-12 text-center text-xl bg-white font-bold border-2 rounded-lg focus:border-green-500 focus:outline-none transition-colors'
                                disabled={loading}
                            />
                        ))}
                    </div>

                    <Button
                        type='submit'
                        disabled={loading || otp.join('').length !== 6}
                        className='w-full bg-green-700 text-white disabled:opacity-50'
                    >
                        {loading ? 'Đang xác thực...' : 'Xác nhận'}
                    </Button>
                </form>

                <div className='mt-6 text-center'>
                    <p className='text-sm text-gray-600 mb-3'>
                        Không nhận được mã?
                    </p>
                    <button
                        onClick={handleResendOTP}
                        className='text-green-600 underline underline-offset-4 text-sm hover:text-green-700'
                        disabled={loading}
                    >
                        Gửi lại mã xác thực
                    </button>
                </div>

                <div className='mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
                    <p className='text-xs text-blue-700'>
                        <strong>Mẹo:</strong> Bạn có thể paste mã 6 chữ số trực
                        tiếp vào ô đầu tiên
                    </p>
                </div>

                <div className='mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg '>
                    <p className='text-xs text-yellow-700 '>
                        <strong>Lưu ý: </strong> Mã OTP có hiệu lực trong{' '}
                        <b>10 phút</b>
                    </p>
                </div>
            </div>
        </div>
    );
}
