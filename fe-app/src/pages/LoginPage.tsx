import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { login } from '@/api/auth';

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/profile');
        } catch (error) {
            console.error('Đăng nhập thất bại', error);
        }
    };

    return (
        <div className='min-h-[100vh] flex items-center justify-center px-6 relative'>
            <div className='absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-3xl opacity-30' />
            <div className='absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-tr from-pink-400 to-purple-500 rounded-full blur-3xl opacity-30' />
            <Card className='w-full max-w-sm p-6 '>
                <CardHeader className='text-center'>
                    <CardTitle className='text-xl'>
                        Chào mừng bạn trở lại
                    </CardTitle>
                    <CardDescription>
                        Đăng nhập bằng tài khoản Google
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {/* Social Login */}
                    <div className='flex flex-col gap-4 mb-6'>
                        <Button variant='outline' className='w-full'>
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                viewBox='0 0 48 48'
                                className='w-5 h-5 mr-2'
                            >
                                <path
                                    fill='#EA4335'
                                    d='M24 9.5c3.54 0 6.71 1.22 9.2 3.61l6.85-6.85C35.63 2.38 30.19 0 24 0 14.62 0 6.4 5.48 2.53 13.44l7.98 6.19C12.3 13.07 17.74 9.5 24 9.5z'
                                />
                                <path
                                    fill='#4285F4'
                                    d='M46.5 24.5c0-1.6-.14-3.13-.41-4.62H24v9.05h12.7c-.55 2.87-2.19 5.3-4.64 6.92l7.26 5.64C43.84 37.24 46.5 31.35 46.5 24.5z'
                                />
                                <path
                                    fill='#FBBC05'
                                    d='M10.51 28.63a14.47 14.47 0 0 1 0-9.26l-7.98-6.19A23.92 23.92 0 0 0 0 24c0 3.89.93 7.56 2.53 10.82l7.98-6.19z'
                                />
                                <path
                                    fill='#34A853'
                                    d='M24 48c6.48 0 11.91-2.13 15.88-5.81l-7.26-5.64c-2.01 1.35-4.59 2.15-8.62 2.15-6.26 0-11.7-3.57-14.49-8.84l-7.98 6.19C6.4 42.52 14.62 48 24 48z'
                                />
                            </svg>
                            Đăng nhập với Google
                        </Button>
                    </div>

                    {/* Divider */}
                    <div className='relative text-center text-sm my-6'>
                        <span className='bg-white px-2 relative z-10'>
                            Hoặc tiếp tục với
                        </span>
                        <div className='absolute inset-0 top-1/2 border-t border-gray-300' />
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className='grid gap-4'>
                        <div className='grid gap-2'>
                            <Label htmlFor='email'>Email</Label>
                            <Input
                                id='email'
                                type='email'
                                placeholder='user@example.com'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className='grid gap-2'>
                            <div className='flex items-center'>
                                <Label htmlFor='password'>Mật khẩu</Label>
                                <Link
                                    to='/forgot-password'
                                    className='ml-auto text-sm underline-offset-4 hover:underline'
                                >
                                    Quên mật khẩu?
                                </Link>
                            </div>
                            <Input
                                id='password'
                                type='password'
                                placeholder='••••••••'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <Button
                            type='submit'
                            className='w-full bg-green-700 text-white'
                        >
                            Đăng nhập
                        </Button>
                    </form>

                    {/* Signup Link */}
                    <div className='text-center text-sm mt-4'>
                        Chưa có tài khoản?{' '}
                        <Link
                            to='/register'
                            className='text-green-600 underline underline-offset-4'
                        >
                            Đăng ký
                        </Link>
                    </div>
                    {/* Signup Link */}
                    <div className='text-center text-sm mt-4'>
                        Tài khoản?{' '}
                        <Link
                            to='/forgot-password'
                            className='text-green-600 underline underline-offset-4'
                        >
                            Quên mật khẩu
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
