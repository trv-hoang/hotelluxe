import { useEffect, useState } from 'react';
import {
    Camera,
    Mail,
    User,
    Edit,
    Phone,
    MapPin,
    Calendar,
    UserCircle,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import RandomEnvironmentImage from '@/components/RandomEnvironmentImage';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import type { User as IUser } from '@/types/type';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

const ProfileUserPage = () => {
    const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
    const [selectedImg, setSelectedImg] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [profile, setProfile] = useState<IUser | null>(null);

    // Đồng bộ authUser vào state local
    useEffect(() => {
        if (authUser) {
            setProfile(authUser);
        }
    }, [authUser]);

    const fullName = profile?.name || '';
    const email = profile?.email || '';

    // Upload avatar
    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            const base64Image = reader.result as string;
            setSelectedImg(base64Image);
            if (profile) {
                await updateProfile({ ...profile, profile_pic: base64Image });
            }
        };
    };

    // Handle thay đổi input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!profile) return;
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    // Submit update
    const handleSubmit = async () => {
        if (!profile) return;
        await updateProfile(profile);
        setOpen(false);
    };

    return (
        <RandomEnvironmentImage>
            <div className='max-w-2xl mx-auto p-4 min-h-screen mt-14'>
                <div className='bg-gray-900 rounded-xl shadow-md p-6 space-y-8'>
                    {/* Header */}
                    <div className='flex items-center justify-between'>
                        <div className='text-center flex-1'>
                            <h1 className='text-2xl font-semibold text-white'>
                                Thông tin cá nhân
                            </h1>
                            <p className='mt-2 text-sm text-gray-300'>
                                Tài khoản của bạn
                            </p>
                        </div>

                        {/* Nút edit góc phải */}
                        <Dialog open={open} onOpenChange={setOpen}>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <DialogTrigger asChild>
                                            <button className='p-2 rounded-full bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 transition'>
                                                <Edit className='w-5 h-5' />
                                            </button>
                                        </DialogTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent
                                        side='top'
                                        className='bg-green-600 text-white text-xs py-1 px-2 rounded'
                                    >
                                        Chỉnh sửa hồ sơ
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <DialogContent className='sm:max-w-md'>
                                <DialogHeader>
                                    <DialogTitle>Chỉnh sửa hồ sơ</DialogTitle>
                                </DialogHeader>

                                {profile && (
                                    <div className='space-y-4'>
                                        {/* Upload avatar */}
                                        <div className='flex flex-col items-center gap-3 relative'>
                                            <img
                                                src={
                                                    selectedImg ||
                                                    profile.profile_pic ||
                                                    'src/assets/user2.avif'
                                                }
                                                alt='Profile'
                                                className='w-24 h-24 rounded-full object-cover border-2 border-gray-300 '
                                            />

                                            <label
                                                htmlFor='avatar-upload-main'
                                                className={`absolute bottom-2 right-[35%] flex items-center justify-center w-8 h-8 rounded-full bg-green-600 text-white cursor-pointer transition hover:scale-105 ${
                                                    isUpdatingProfile
                                                        ? 'animate-pulse pointer-events-none'
                                                        : ''
                                                }`}
                                            >
                                                <Camera className='w-4 h-4' />
                                                <input
                                                    type='file'
                                                    id='avatar-upload-main'
                                                    className='hidden'
                                                    accept='image/*'
                                                    onChange={handleImageUpload}
                                                    disabled={isUpdatingProfile}
                                                />
                                            </label>
                                        </div>

                                        {/* Các input */}
                                        <div className='space-y-3'>
                                            <div>
                                                <Label htmlFor='name'>
                                                    Họ tên
                                                </Label>
                                                <Input
                                                    name='name'
                                                    value={profile.name || ''}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor='nickname'>
                                                    Nickname
                                                </Label>
                                                <Input
                                                    name='nickname'
                                                    value={
                                                        profile.nickname || ''
                                                    }
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor='dob'>
                                                    Ngày sinh
                                                </Label>
                                                <Input
                                                    name='dob'
                                                    value={profile.dob || ''}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor='email'>
                                                    Email
                                                </Label>
                                                <Input
                                                    name='email'
                                                    value={profile.email || ''}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor='phone'>
                                                    Số điện thoại
                                                </Label>
                                                <Input
                                                    name='phone'
                                                    value={profile.phone || ''}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor='gender'>
                                                    Giới tính
                                                </Label>
                                                <Input
                                                    name='gender'
                                                    value={profile.gender || ''}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor='address'>
                                                    Địa chỉ
                                                </Label>
                                                <Input
                                                    name='address'
                                                    value={
                                                        profile.address || ''
                                                    }
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <DialogFooter>
                                    <Button
                                        onClick={handleSubmit}
                                        className='w-full bg-green-700 text-white'
                                    >
                                        Lưu thay đổi
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Avatar */}
                    <div className='flex flex-col items-center gap-4'>
                        <div className='relative'>
                            <img
                                src={
                                    selectedImg ||
                                    authUser?.profile_pic ||
                                    'src/assets/user2.avif'
                                }
                                alt='Profile'
                                className='w-32 h-32 rounded-full object-cover border-4 border-white shadow-md'
                            />
                        </div>
                        <p className='text-sm text-gray-500'>
                            {isUpdatingProfile
                                ? 'Uploading...'
                                : 'Ảnh đại diện'}
                        </p>
                    </div>

                    {/* Account Information hiển thị trắng */}
                    <div className='space-y-4'>
                        {[
                            {
                                icon: <User className='w-4 h-4' />,
                                label: 'Họ tên',
                                value: fullName,
                            },
                            {
                                icon: <UserCircle className='w-4 h-4' />,
                                label: 'Nickname',
                                value: profile?.nickname,
                            },
                            {
                                icon: <Mail className='w-4 h-4' />,
                                label: 'Email',
                                value: email,
                            },
                            {
                                icon: <Phone className='w-4 h-4' />,
                                label: 'Số điện thoại',
                                value: profile?.phone,
                            },
                            {
                                icon: <MapPin className='w-4 h-4' />,
                                label: 'Địa chỉ',
                                value: profile?.address,
                            },
                            {
                                icon: <Calendar className='w-4 h-4' />,
                                label: 'Ngày sinh',
                                value: profile?.dob,
                            },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className='grid grid-cols-[auto_1fr] items-center gap-4 '
                            >
                                <span className='flex items-center gap-2 text-md text-gray-400'>
                                    {item.icon} {item.label}
                                </span>
                                <div className='p-3 rounded-lg text-lg text-white bg-gray-800'>
                                    <span className='ml-2'>
                                        {item.value || '—'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </RandomEnvironmentImage>
    );
};

export default ProfileUserPage;
