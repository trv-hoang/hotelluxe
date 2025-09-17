import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import NotificationItem from './NotificationItem';
import { useAuthStore } from '@/store/useAuthStore';

const notifications = [
    {
        id: 1,
        title: 'Đã có đơn hàng mới!',
        description: 'Bạn có đơn hàng mới cần xử lý.',
        time: '2 phút trước',
        read: false,
    },
    {
        id: 2,
        title: 'Tài khoản đã được cập nhật',
        description: 'Thông tin tài khoản của bạn đã được thay đổi.',
        time: '10 phút trước',
        read: true,
    },
];

export default function NotificationDropdown({
    children,
}: {
    children: React.ReactNode;
}) {
    const { authUser } = useAuthStore();

    if (!authUser) {
        return (
            <Button variant='ghost' className='relative p-2'>
                {children}
            </Button>
        );
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='relative p-2'>
                    {children}
                    <span className='absolute top-1 right-1 bg-red-500 text-white rounded-full text-xs px-1'>
                        {authUser &&
                            notifications.filter((n) => !n.read).length}
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-80 max-h-96 overflow-auto mt-2'>
                <div className='p-2 font-semibold'>Thông báo</div>
                <div>
                    {authUser && notifications.length === 0 ? (
                        <div className='p-4 text-center text-gray-500'>
                            Không có thông báo nào
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <NotificationItem
                                key={notification.id}
                                {...notification}
                            />
                        ))
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
