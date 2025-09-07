import SearchBar from '@/components/SearchBar';
import { ShoppingCartIcon } from '@/components/ShoppingCartIcon';
import { Button } from '@/components/ui/button';
import { Bell, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <div className='w-full flex items-center justify-between border-b border-gray-300 py-2 px-10'>
            {/* left */}
            <Link to='/' className='flex items-center'>
                <img
                    src='src/assets/logo.png'
                    alt='logo'
                    className='w-6 h-6 md:w-8 md:h-8'
                    loading='lazy'
                />
                <p className='hidden md:block text-2xl font-semibold tracking-wider ml-2 '>
                    Luxe.
                </p>
            </Link>

            {/* right */}
            <div className='flex items-center gap-4'>
                <SearchBar />
                <Link
                    to='/locations'
                    className='hover:bg-accent rounded-md p-2 transition-colors'
                >
                    <MapPin className='w-5 h-5 text-gray-600' />
                </Link>
                <Link
                    to='/notifications'
                    className='hover:bg-accent rounded-md p-2 transition-colors'
                >
                    <Bell className='w-5 h-5 text-gray-600' />
                </Link>
                <ShoppingCartIcon />
                <Link to='/login'>
                    <Button variant='outline' className='hidden md:inline-flex'>
                        Đăng nhập
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default Navbar;
