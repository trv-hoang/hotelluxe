import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, Settings, User } from 'lucide-react';
import userImg from '@/assets/user2.avif';
export default function UserSetting() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className='focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded-full'>
                <Avatar className='w-10 h-10'>
                    <AvatarImage
                        src={userImg}
                        alt='user'
                        className='object-cover w-full h-full'
                    />
                    <AvatarFallback>User</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='mt-1'>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <User className='h-4 w-4' /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Settings className='h-4 w-4' /> Settings
                </DropdownMenuItem>
                <DropdownMenuItem className='text-destructive'>
                    <LogOut className='h-4 w-4' /> Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
