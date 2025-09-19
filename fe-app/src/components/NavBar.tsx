import SearchBar from '@/components/SearchBar';
import logo from '@/assets/logo.png';
import { Button } from '@/components/ui/button';
import { BadgeInfo, Bell, Plane } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import UserSetting from '@/components/UserSetting';
import { useAuthStore } from '@/store/useAuthStore';
import NotificationDropdown from '@/components/NotificationDropdown';

// TEMP
const Navbar = () => {
    const { authUser } = useAuthStore();
    return (
        <div className='w-full flex items-center justify-between border-b border-gray-300 py-2 px-10 fixed top-0 z-50 bg-white/80 backdrop-blur-md'>
            {/* left */}
            <Link to='/' className='flex items-center'>
                <img
                    src={logo}
                    alt='logo'
                    className='w-6 h-6 md:w-8 md:h-8'
                    loading='lazy'
                />
                <p className='hidden md:block text-2xl font-semibold tracking-wider ml-2 '>
                    Luxe.
                </p>
            </Link>

            {/* right */}
            <TooltipProvider>
                <div className='flex items-center gap-4'>
                    <SearchBar />
                    {/* Location */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                to='/locations'
                                className='hover:bg-accent rounded-md p-2 transition-colors'
                            >
                                <BadgeInfo className='w-5 h-5 text-gray-600' />
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side='bottom'>
                            <p>Giới thiệu</p>
                        </TooltipContent>
                    </Tooltip>

                    {/* Notifications */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <NotificationDropdown>
                                <Bell className='!w-5 !h-5 text-gray-600' />
                            </NotificationDropdown>
                        </TooltipTrigger>
                        {/* <TooltipContent side='bottom'>
                            <p>Thông báo</p>
                        </TooltipContent> */}
                    </Tooltip>

                    {/* plane */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                to='/hotels'
                                className='hover:bg-accent rounded-md p-2 transition-colors'
                            >
                                {/* Icon */}
                                <Plane className='w-5 h-5 text-gray-600' />
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side='bottom'>
                            <p>Khám phá</p>
                        </TooltipContent>
                    </Tooltip>

                    {/* Login */}
                    {authUser ? (
                        <UserSetting />
                    ) : (
                        <Link to='/login'>
                            <Button
                                variant='outline'
                                className='hidden md:inline-flex'
                            >
                                Đăng nhập
                            </Button>
                        </Link>
                    )}
                </div>
            </TooltipProvider>
        </div>
    );
};

export default Navbar;
