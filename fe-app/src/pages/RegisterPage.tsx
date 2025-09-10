import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { register } from '@/api/auth';

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
            let errorMessage = 'Register failed';
            
            if (err && typeof err === 'object' && 'response' in err) {
                const apiError = err as { response?: { data?: { message?: string } } };
                errorMessage = apiError.response?.data?.message || 'Register failed';
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            
            alert(errorMessage);
        }
    };

    return (
        <div className='min-h-[80vh] flex items-center justify-center px-6'>
            <div className='w-full max-w-sm p-6 border rounded-lg shadow-lg bg-white'>
                <h1 className='text-2xl font-bold mb-6'>Create your Account</h1>

                <form
                    onSubmit={handleSubmit}
                    className='w-full max-w-sm space-y-4'
                >
                    <Input
                        name='name'
                        placeholder='Full Name'
                        value={form.name}
                        onChange={handleChange}
                    />
                    <Input
                        name='email'
                        placeholder='Email'
                        type='email'
                        value={form.email}
                        onChange={handleChange}
                    />
                    <Input
                        name='password'
                        placeholder='Password'
                        type='password'
                        value={form.password}
                        onChange={handleChange}
                    />
                    <Input
                        name='password_confirmation'
                        placeholder='Confirm Password'
                        type='password'
                        value={form.password_confirmation}
                        onChange={handleChange}
                    />

                    <Button
                        type='submit'
                        className='w-full bg-green-700 text-white'
                    >
                        Sign up
                    </Button>

                    <p className='text-sm text-center'>
                        Already have an account?{' '}
                        <Link to='/login' className='text-green-600'>
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
