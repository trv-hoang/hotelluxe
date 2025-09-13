import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { register } from '@/api/auth';
import { GoogleIcon } from '@/components/icons/GoogleIcon';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (form.password !== form.password_confirmation) {
            alert('Mật khẩu nhập lại không khớp');
            return;
        }

        try {
            const res = await register(
                form.name,
                form.email,
                form.password,
                form.password_confirmation,
            );
            localStorage.setItem('token', res.token);
            navigate('/profile');
        } catch (err: unknown) {
            let errorMessage = 'Đăng ký thất bại';
            if (err && typeof err === 'object' && 'response' in err) {
                const apiError = err as {
                    response?: { data?: { message?: string } };
                };
                errorMessage = apiError.response?.data?.message || errorMessage;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            alert(errorMessage);
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center px-6 relative'>
            <div className='absolute top-0 left-36 w-72 h-72 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-3xl opacity-30' />
            <div className='absolute bottom-0 right-40 w-72 h-72 bg-gradient-to-tr from-pink-400 to-purple-500 rounded-full blur-3xl opacity-30' />

            <Card className='w-full max-w-sm p-6'>
                <CardHeader className='text-center'>
                    <CardTitle className='text-xl'>Tạo tài khoản</CardTitle>
                    <CardDescription>Tạo bằng tài khoản Google</CardDescription>
                </CardHeader>

                <CardContent>
                    {/* Social Register */}
                    <div className='flex flex-col gap-4 mb-6'>
                        <Button variant='outline' className='w-full'>
                            <GoogleIcon className='w-5 h-5 mr-2' />
                            Google
                        </Button>
                    </div>

                    {/* Divider */}
                    <div className='relative text-center text-sm my-6'>
                        <span className='bg-white px-2 relative z-10'>
                            Hoặc đăng ký mới
                        </span>
                        <div className='absolute inset-0 top-1/2 border-t border-gray-300' />
                    </div>

                    {/* Register Form */}
                    <form onSubmit={handleSubmit} className='grid gap-4'>
                        <Input
                            name='name'
                            placeholder='Họ và tên'
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            name='email'
                            placeholder='Email'
                            type='email'
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            name='password'
                            placeholder='Mật khẩu'
                            type='password'
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            name='password_confirmation'
                            placeholder='Xác nhận mật khẩu'
                            type='password'
                            value={form.password_confirmation}
                            onChange={handleChange}
                            required
                        />

                        <Button
                            type='submit'
                            className='w-full bg-green-700 text-white'
                        >
                            Đăng ký
                        </Button>

                        <p className='text-sm text-center'>
                            Đã có tài khoản?{' '}
                            <Link
                                to='/login'
                                className='text-green-600 underline underline-offset-4'
                            >
                                Đăng nhập
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
