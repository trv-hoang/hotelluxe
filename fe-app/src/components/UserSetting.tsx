import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';
import { LogOut, Settings, User } from 'lucide-react';
import userImg from '@/assets/user2.avif';
import { useAuthStore } from '@/store/useAuthStore';

export default function UserSetting() {
    const { authUser, logout } = useAuthStore();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className='focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded-full'>
                <Avatar className='w-10 h-10'>
                    <AvatarImage
                        src={authUser?.profilePic || userImg}
                        alt={authUser?.name || 'user'}
                        className='object-cover w-full h-full'
                    />
                    <AvatarFallback>
                        {authUser?.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='mt-1'>
                <DropdownMenuLabel>
                    {authUser?.name || 'My Account'}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link to='/profile' className='flex items-center gap-2'>
                        <User className='h-4 w-4' /> Profile
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Settings className='h-4 w-4' /> Settings
                </DropdownMenuItem>
                <DropdownMenuItem className='text-destructive' onClick={logout}>
                    <LogOut className='h-4 w-4' /> Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
