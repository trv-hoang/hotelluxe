import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AvatarFallback, AvatarImage, Avatar } from '@/components/ui/avatar';
// import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    ArrowRight,
    MapPin,
    User,
    Bed,
    Bath,
    DoorOpen,
    Clock,
    CheckCircle2,
    Calendar,
    GalleryVerticalEnd,
} from 'lucide-react';

import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Amenities_demos } from '@/constant/amenities'; // Chỉ cần amenities, không cần PHOTOS
import FiveStar from '@/shared/FiveStar';
import CommentListing from '@/components/Comments';
import StartRating from '@/components/StarRating';
import LikeSaveBtns from '@/shared/LikeSaveBtn';
import StayDatesRangeInput from '@/components/StayDatesRangeInput';
import SectionDateRange from '@/components/SectionDaterange';

// import { mapStay } from '@/data/listings';
import GuestsInput from '@/components/GuestsInput';
import type { AuthorType, StayDataType } from '@/types/stay';
import LocationMap from '@/components/LocationMap';
import { useBookingStore } from '@/store/useBookingStore';
import { calculatorPrice } from '@/utils/calculatorPrice';
import { getRandomDescription } from '@/data/stayDes';
import ModalDetail from '@/components/ModelDetail';
import CategoryBadge from '@/shared/CategoryBadge';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/api/axios';
import { motion } from 'framer-motion';
const StayDetailPage = () => {
    const { id } = useParams();
    console.log('🏨 StayDetailPage rendered with ID:', id);
    console.log('📍 Current location:', window.location.href);

    const [isOpenModalAmenities, setIsOpenModalAmenities] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { date, guests, checkInDate, checkOutDate } = useBookingStore();
    console.log('Check-in:', checkInDate, 'Check-out :', checkOutDate);
    const isDisabled = !checkInDate || !checkOutDate;
    const query = new URLSearchParams(location.search);
    const modal = query.get('modal');
    const { authUser } = useAuthStore();

    // store
    const addItem = useCartStore((state) => state.addItem);

    type ExtendedStayDataType = StayDataType & {
        displayName?: string;
        avatar?: string;
        joinDate?: string;
        responseRate?: string;
        checkInTime?: string;
        checkOutTime?: string;
        cancellationPolicy?: string;
        specialNotes?: string[];
        amenities?: string;
    };

    const [stayData, setStayData] = useState<ExtendedStayDataType | null>(null);
    const [loading, setLoading] = useState(true);
    const [author, setAuthor] = useState<AuthorType>();
    console.log('stayData', stayData);
    console.log('author', author);
    useEffect(() => {
        const fetchStay = async () => {
            console.log('🏨 Fetching stay with ID:', id);

            try {
                const res = await api.get(`/hotels/${id}`);
                console.log('✅ Stay API Response:', res.data);
                setStayData(res.data.data);
                if (res.data.data.authorId) {
                    const authorRes = await api.get(
                        `/authors/${res.data.data.authorId}`,
                    );
                    console.log('✅ Author API Response:', authorRes.data);
                    setAuthor(authorRes.data.data);
                }
            } catch (error) {
                console.error('❌ Lỗi khi fetch stay:', error);
                console.log('🔄 Using fallback stay data for ID:', id);

                // Fallback to static data
                import('@/data/__homeStay.json').then((module) => {
                    const homeStayData = module.default;
                    const fallbackStay = homeStayData.find(
                        (hotel) => hotel.id.toString() === id?.toString(),
                    );

                    if (fallbackStay) {
                        const mappedStay: ExtendedStayDataType = {
                            id: fallbackStay.id,
                            authorId: fallbackStay.authorId || 1,
                            date: fallbackStay.date || new Date().toISOString(),
                            href: `/hotels/${fallbackStay.id}`,
                            title: fallbackStay.title,
                            featuredImage: fallbackStay.featuredImage,
                            galleryImgs: fallbackStay.galleryImgs || [
                                fallbackStay.featuredImage,
                            ],
                            description:
                                fallbackStay.description ||
                                getRandomDescription(),
                            price: fallbackStay.price || 500000,
                            address:
                                fallbackStay.address ||
                                'Địa chỉ không xác định',
                            category: {
                                id: 1,
                                name: 'Khách sạn',
                                href: '/categories/hotel',
                                color: 'blue',
                            },
                            reviewStart: fallbackStay.reviewStart || 4.5,
                            reviewCount: fallbackStay.reviewCount || 10,
                            commentCount: fallbackStay.commentCount || 5,
                            viewCount: fallbackStay.viewCount || 100,
                            like: false,
                            maxGuests: fallbackStay.maxGuests || 4,
                            bedrooms: fallbackStay.bedrooms || 2,
                            bathrooms: fallbackStay.bathrooms || 1,
                            saleOff: fallbackStay.saleOff || null,
                            isAds: fallbackStay.isAds || false,
                            map: fallbackStay.map || {
                                lat: 21.0285,
                                lng: 105.8542,
                            },
                            // Extended fields
                            displayName: `Host ${fallbackStay.id}`,
                            avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg',
                            joinDate: 'May 2020',
                            responseRate: '95%',
                            checkInTime: '15:00',
                            checkOutTime: '11:00',
                            cancellationPolicy:
                                'Free cancellation before 24 hours',
                            specialNotes: [
                                'Không hút thuốc',
                                'Không nuôi thú cưng',
                            ],
                            amenities: 'Wifi, TV, Điều hòa',
                        };
                        setStayData(mappedStay);

                        // Set fallback author
                        setAuthor({
                            id: fallbackStay.authorId || 1,
                            firstName: `Host`,
                            lastName: `${fallbackStay.id}`,
                            displayName: `Host ${fallbackStay.id}`,
                            email: `host${fallbackStay.id}@hotel.com`,
                            avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg',
                            bgImage: '',
                            count: 10,
                            href: '#',
                            jobName: 'Hotel Manager',
                            desc: 'Experienced hospitality professional',
                        });
                        console.log('✅ Fallback stay data set:', mappedStay);
                    }
                });
            } finally {
                setLoading(false);
            }
        };
        if (id) {
            fetchStay();
        }
    }, [id]);

    if (loading) {
        return (
            <div className='flex items-center justify-center h-screen text-lg'>
                <div className='text-center flex flex-col items-center'>
                    <p>Đang tải dữ liệu...</p>
                    <motion.div
                        className='w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full'
                        animate={{ rotate: 360 }}
                        transition={{
                            repeat: Infinity,
                            duration: 1,
                            ease: 'linear',
                        }}
                    />
                </div>
            </div>
        );
    }

    if (!stayData) {
        return (
            <div className='flex items-center justify-center h-screen text-lg text-red-500'>
                <div className='text-center'>
                    <p>Không tìm thấy chỗ ở!</p>
                    <p className='text-sm text-gray-500 mt-2'>
                        ID được tìm: {id}
                    </p>
                    <p className='text-xs text-gray-400 mt-1'>
                        URL: {window.location.href}
                    </p>
                </div>
            </div>
        );
    }

    const {
        featuredImage,
        galleryImgs,
        title,
        category,
        address,
        reviewStart,
        reviewCount,
        maxGuests,
        bedrooms,
        bathrooms,
        price,
        saleOff,
        map,
        // author,

        // displayName = 'Chủ nhà',
        // avatar = '/host-avatar.jpg',
        joinDate = 'Chưa biết',
        responseRate = '100%',
        checkInTime = '14:00 - 23:00',
        checkOutTime = '08:00 - 12:00',
        cancellationPolicy = 'Bạn có thể hủy miễn phí trong vòng 48 giờ sau khi đặt phòng. Nếu hủy trước 14 ngày so với ngày nhận phòng, bạn sẽ được hoàn lại 50% tổng số tiền. Sau thời hạn này, không được hoàn tiền.',
        specialNotes = ['Vui lòng giữ yên tĩnh sau 23h'],
        description = getRandomDescription(),
    } = stayData;

    // function closeModalAmenities() {
    //     setIsOpenModalAmenities(false);
    // }
    // console.log(author);

    // price
    const pricePerNight = price || 0;
    const { nights, total } = calculatorPrice({ pricePerNight, date });
    const totalGuests = guests.adults + guests.children + guests.infants;
    function openModalAmenities() {
        setIsOpenModalAmenities(true);
    }

    const handleOpenModalImageGallery = (startIndex: number) => {
        navigate(`${location.pathname}?modal=open`, {
            state: {
                images: [featuredImage, ...(galleryImgs || [])],
                startIndex, //  truyền index ảnh được click
            },
        });
    };

    const { displayName, avatar } = author || {};
    //  RENDER HEADER IMAGE LAYOUT MỚI
    const renderHeaderImages = () => {
        const mainImage = featuredImage || '/src/assets/travels/dalat.jpg';
        const thumbs = galleryImgs?.slice(0, 4) || [];

        return (
            /* JSX */
            <header className='rounded-md sm:rounded-xl overflow-hidden relative mt-4'>
                {/* Outer grid: 1 column on mobile, 2 columns on sm+ (left 2fr, right 1fr) */}
                <div className='grid grid-cols-1 sm:grid-cols-[1fr_1fr] gap-2 h-[636px]'>
                    {/* Left big image (fills full height) */}
                    <div
                        className='relative rounded-md overflow-hidden cursor-pointer h-full'
                        onClick={() => handleOpenModalImageGallery(0)}
                    >
                        <img
                            src={mainImage}
                            alt={title}
                            className='w-full h-full object-cover rounded-md sm:rounded-xl'
                            loading='lazy'
                        />
                        <div className='absolute inset-0 bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity' />
                    </div>

                    {/* Right side: inner 2x2 grid of thumbnails, fills the same height as left */}
                    <div className='grid grid-cols-2 grid-rows-2 gap-2 h-full'>
                        {thumbs.slice(0, 4).map((img, index) => (
                            <div
                                key={index}
                                className={`relative rounded-md overflow-hidden ${
                                    !img ? 'bg-neutral-100' : ''
                                }`}
                                onClick={() =>
                                    handleOpenModalImageGallery(index + 1)
                                }
                            >
                                <img
                                    src={img || '/placeholder-image.jpg'}
                                    alt={`Hình ảnh ${index + 1}`}
                                    className='w-full h-full object-cover rounded-md sm:rounded-xl'
                                    loading='lazy'
                                />
                                <div className='absolute inset-0 bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity' />
                            </div>
                        ))}
                    </div>

                    {/* Show all photos button - đặt ở trên left image (absolute) */}
                    <button
                        className='absolute left-3 bottom-3 z-10 hidden md:flex items-center px-4 py-2 rounded-xl bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                        onClick={() => handleOpenModalImageGallery(0)}
                    >
                        <GalleryVerticalEnd className='w-5 h-5' />
                        <span className='ml-2 text-neutral-800 text-sm font-medium'>
                            Xem tất cả ảnh
                        </span>
                    </button>
                </div>
            </header>
        );
    };

    const renderSection1 = () => {
        return (
            <div className='listingSection__wrap !space-y-6'>
                {/* 1. Danh mục */}
                <div className='flex justify-between items-center'>
                    <CategoryBadge category={category} />
                    <LikeSaveBtns />
                </div>

                {/* 2. Tiêu đề */}
                <h2 className='text-2xl sm:text-3xl lg:text-4xl font-semibold'>
                    {title}
                </h2>

                {/* 3. Đánh giá & Địa điểm */}
                <div className='flex items-center space-x-4'>
                    <StartRating
                        point={reviewStart}
                        reviewCount={reviewCount}
                    />
                    <span>·</span>
                    <div className='flex items-center text-sm text-neutral-600 dark:text-neutral-400'>
                        <MapPin className='w-4 h-4 mr-1' />
                        {address}
                    </div>
                </div>

                {/* 4. Người cho thuê */}
                <div className='flex items-center'>
                    <Avatar className='h-10 w-10 '>
                        <AvatarImage
                            src={avatar || '/avatar.jpg'}
                            alt={displayName || 'Chủ nhà'}
                            className='object-cover '
                        />
                        <AvatarFallback>
                            {displayName?.charAt(0) || 'C'}
                        </AvatarFallback>
                    </Avatar>
                    <span className='ml-2.5 text-neutral-500 dark:text-neutral-400'>
                        Được chủ nhà{' '}
                        <span className='text-neutral-900 dark:text-neutral-200 font-medium'>
                            {displayName || 'Không rõ'}
                        </span>{' '}
                        cung cấp
                    </span>
                </div>

                {/* 5. Phân cách */}
                <Separator className='my-4' />

                {/* 6. Thông tin căn hộ */}
                <div className='flex items-center justify-between xl:justify-start space-x-8 xl:space-x-12 text-sm text-neutral-700 dark:text-neutral-300'>
                    <div className='flex items-center space-x-2'>
                        <User className='w-5 h-5' />
                        <span>
                            {maxGuests || 0}{' '}
                            <span className='hidden sm:inline-block'>
                                khách
                            </span>
                        </span>
                    </div>
                    <div className='flex items-center space-x-2'>
                        <Bed className='w-5 h-5' />
                        <span>
                            {bedrooms || 0}{' '}
                            <span className='hidden sm:inline-block'>
                                giường
                            </span>
                        </span>
                    </div>
                    <div className='flex items-center space-x-2'>
                        <Bath className='w-5 h-5' />
                        <span>
                            {bathrooms || 0}{' '}
                            <span className='hidden sm:inline-block'>
                                phòng tắm
                            </span>
                        </span>
                    </div>
                    <div className='flex items-center space-x-2'>
                        <DoorOpen className='w-5 h-5' />
                        <span>
                            {bedrooms || 0}{' '}
                            <span className='hidden sm:inline-block'>
                                phòng ngủ
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    const renderSection2 = () => {
        return (
            <div className='listingSection__wrap'>
                <h2 className='text-2xl font-semibold'>Thông tin chỗ ở</h2>
                <Separator className='my-4' />
                <div className='text-neutral-600 dark:text-neutral-300 space-y-4'>
                    <p>{description || 'Chưa có mô tả.'}</p>
                </div>
            </div>
        );
    };

    const renderSection3 = () => {
        return (
            <div className='listingSection__wrap'>
                <div>
                    <h2 className='text-2xl font-semibold'>Tiện nghi</h2>
                    <p className='mt-2 text-neutral-500 dark:text-neutral-400'>
                        Các tiện ích và dịch vụ được cung cấp
                    </p>
                </div>
                <Separator className='my-4' />
                <div className='grid grid-cols-1 xl:grid-cols-3 gap-6 text-sm text-neutral-700 dark:text-neutral-300'>
                    {Amenities_demos.filter((_, i) => i < 12).map((item) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={item.name}
                                className='flex items-center space-x-3'
                            >
                                <Icon className='w-6 h-6 text-neutral-700' />{' '}
                                <span>{item.name}</span>
                            </div>
                        );
                    })}
                </div>

                <Separator className='my-6' />
                <Button variant='outline' onClick={openModalAmenities}>
                    Xem thêm 20 tiện nghi
                </Button>
                {renderModalAmenities()}
            </div>
        );
    };

    const renderModalAmenities = () => {
        return (
            <Dialog
                open={isOpenModalAmenities}
                onOpenChange={setIsOpenModalAmenities}
            >
                <DialogContent className='max-h-[90vh] overflow-y-auto max-w-4xl'>
                    <DialogHeader>
                        <DialogTitle>Tiện nghi</DialogTitle>
                        <DialogDescription>
                            Tất cả các tiện nghi có sẵn tại nơi lưu trú này.
                        </DialogDescription>
                    </DialogHeader>
                    <div className='py-4 space-y-3 max-h-[70vh] overflow-y-auto'>
                        {Amenities_demos.slice(0, 12).map((item) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={item.name}
                                    className='flex items-center py-2.5 space-x-5'
                                >
                                    <Icon className='w-8 h-8 text-neutral-600' />
                                    <span className='text-base'>
                                        {item.name}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </DialogContent>
            </Dialog>
        );
    };

    const renderSection4 = () => {
        return (
            <div className='listingSection__wrap'>
                <div>
                    <h2 className='text-2xl font-semibold'>Bảng giá</h2>
                    <p className='mt-2 text-neutral-500 dark:text-neutral-400'>
                        Giá có thể tăng vào cuối tuần hoặc dịp lễ
                    </p>
                </div>
                <Separator className='my-4' />
                <div className='flow-root'>
                    <div className='text-sm sm:text-base text-neutral-600 dark:text-neutral-300 -mb-4'>
                        {[
                            {
                                label: 'Giá mỗi đêm',
                                price: price || '1.200.000đ',
                            },
                            { label: 'Số đêm tối thiểu', price: '1 đêm' },
                            { label: 'Số đêm tối đa', price: '90 đêm' },
                            {
                                label: 'Giảm giá ',
                                price: saleOff ? saleOff.split(' ')[0] : '0%',
                            },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className={`p-4 flex justify-between items-center space-x-4 rounded-lg mb-2 ${
                                    index % 2 === 0
                                        ? 'bg-neutral-100 dark:bg-neutral-800'
                                        : ''
                                }`}
                            >
                                <span>{item.label}</span>
                                <span className='font-medium'>
                                    {item.price}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const renderSection5 = () => {
        return (
            <div className='listingSection__wrap'>
                <h2 className='text-2xl font-semibold'>Thông tin chủ nhà</h2>
                <Separator className='my-4' />

                <div className='flex items-center space-x-4'>
                    <Avatar className='h-14 w-14'>
                        <AvatarImage
                            src={avatar || '/host-avatar.jpg'}
                            alt={displayName || 'Chủ nhà'}
                            className='object-cover '
                        />
                        <AvatarFallback>
                            {displayName?.charAt(0) || 'C'}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <a className='block text-xl font-medium' href='#'>
                            {displayName || 'Chủ nhà chưa đặt tên'}
                        </a>
                        <div className='mt-1.5 flex items-center text-sm text-neutral-500 dark:text-neutral-400'>
                            <StartRating
                                point={reviewStart}
                                reviewCount={reviewCount}
                            />
                            <span className='mx-2'>·</span>
                            <span>{reviewCount} đánh giá</span>
                        </div>
                    </div>
                </div>

                <p className='mt-4 text-neutral-600 dark:text-neutral-300'>
                    {description || 'Chưa có thông tin thêm về chủ nhà.'}
                </p>

                <div className='mt-6 space-y-3 text-neutral-500 dark:text-neutral-400'>
                    <div className='flex items-center space-x-2'>
                        <Calendar className='w-5 h-5' />
                        <span>Tham gia từ {joinDate || 'Chưa biết'}</span>
                    </div>
                    <div className='flex items-center space-x-2'>
                        <CheckCircle2 className='w-5 h-5' />
                        <span>Tỷ lệ phản hồi - {responseRate || '100%'}</span>
                    </div>
                    <div className='flex items-center space-x-2'>
                        <Clock className='w-5 h-5' />
                        <span>Phản hồi nhanh - trong vài giờ</span>
                    </div>
                </div>

                <Separator className='my-6' />
                <Button variant='outline' asChild>
                    <Link to='#'>Xem hồ sơ chủ nhà</Link>
                </Button>
            </div>
        );
    };

    const renderSection6 = () => {
        return (
            <div className='listingSection__wrap'>
                <h2 className='text-2xl font-semibold'>
                    Đánh giá ({reviewCount} đánh giá)
                </h2>
                <Separator className='my-4' />

                <div className='space-y-5'>
                    <FiveStar iconClass='w-6 h-6' className='space-x-0.5' />
                    <div className='relative'>
                        <Input
                            placeholder='Chia sẻ cảm nhận của bạn...'
                            className='h-16 rounded-3xl'
                        />
                        <Button
                            variant='ghost'
                            size='icon'
                            className='absolute right-2 top-1/2 transform -translate-y-1/2 h-12 w-12'
                            onClick={() => {}}
                        >
                            <ArrowRight className='w-5 h-5' />
                        </Button>
                    </div>
                </div>

                <div className='divide-y divide-neutral-200 dark:divide-neutral-800 mt-6'>
                    <CommentListing />

                    <div className='pt-8'>
                        <Button variant='outline' asChild>
                            <Link to='#'>Xem thêm đánh giá</Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

    const renderSection7 = () => {
        return (
            <div className='listingSection__wrap h-'>
                <div>
                    <h2 className='text-2xl font-semibold'>Vị trí</h2>
                    <p className='mt-2 text-neutral-500 dark:text-neutral-400'>
                        {address}
                    </p>
                </div>
                <Separator className='my-4' />
                <LocationMap address={address} lat={map?.lat} lng={map?.lng} />
                {/* <div className='aspect-w-5 aspect-h-5 sm:aspect-h-3 rounded-xl overflow-hidden shadow'>
                    <iframe
                        width='100%'
                        height='100%'
                        loading='lazy'
                        allowFullScreen
                        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAGVJfZMAKYfZ71nzL_v5i3LjTTWnCYwTY&q=${encodeURIComponent(
                            address,
                        )}`}
                        className='rounded-xl'
                    ></iframe>
                </div> */}
            </div>
        );
    };

    const renderSection8 = () => {
        return (
            <div className='listingSection__wrap'>
                <h2 className='text-2xl font-semibold'>Thông tin cần biết</h2>
                <Separator className='my-4' />

                <div className='space-y-6'>
                    <div>
                        <h4 className='text-lg font-semibold'>
                            Chính sách hủy
                        </h4>
                        <p className='mt-3 text-neutral-500 dark:text-neutral-400'>
                            {cancellationPolicy ||
                                'Bạn có thể hủy miễn phí trong vòng 48 giờ sau khi đặt phòng. Nếu hủy trước 14 ngày so với ngày nhận phòng, bạn sẽ được hoàn lại 50% tổng số tiền. Sau thời hạn này, không được hoàn tiền.'}
                        </p>
                    </div>

                    <Separator />

                    <div>
                        <h4 className='text-lg font-semibold'>
                            Giờ nhận phòng
                        </h4>
                        <div className='mt-3 space-y-2'>
                            <div className='flex justify-between p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg'>
                                <span>Nhận phòng</span>
                                <span>{checkInTime || '14:00 - 23:00'}</span>
                            </div>
                            <div className='flex justify-between p-3 rounded-lg'>
                                <span>Trả phòng</span>
                                <span>{checkOutTime || '08:00 - 12:00'}</span>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <h4 className='text-lg font-semibold'>
                            Lưu ý đặc biệt
                        </h4>
                        <ul className='mt-3 text-neutral-500 dark:text-neutral-400 space-y-2 list-disc pl-5'>
                            {specialNotes?.map((note, idx) => (
                                <li key={idx}>{note}</li>
                            )) || <li>Không gây ồn sau 23h.</li>}
                        </ul>
                    </div>
                </div>
            </div>
        );
    };

    const renderSidebar = () => {
        const handleAddToCart = () => {
            if (!authUser) {
                alert('Vui lòng đăng nhập để đặt phòng.');
                navigate('/login');
                return;
            }
            if (!stayData || isDisabled) return;
            if (!stayData) return;

            addItem({
                ...stayData, // toàn bộ thông tin từ StayDataType
                nights, // số đêm chọn
                totalGuests, // tổng khách
            });
            navigate('/cart');
        };

        return (
            <Card className='shadow-xl sticky top-28'>
                <CardHeader className='pb-4'>
                    <div className='flex justify-between items-start '>
                        <div>
                            <span className='text-3xl font-semibold'>
                                {formatPrice(stayData.price)}
                            </span>
                            <span className='ml-1 text-base font-normal text-neutral-500 dark:text-neutral-400'>
                                /đêm
                            </span>
                        </div>
                        <div className='mt-2'>
                            <StartRating
                                point={stayData.reviewStart}
                                reviewCount={stayData.reviewCount}
                            />
                        </div>
                    </div>
                </CardHeader>

                <CardContent className='space-y-4'>
                    <form className='flex flex-col border border-neutral-200 dark:border-neutral-700 rounded-3xl'>
                        <StayDatesRangeInput className='flex-1 z-[11]' />
                        <div className='w-full border-b border-neutral-200 dark:border-neutral-700'></div>
                        <GuestsInput className='flex-1' />
                    </form>

                    <div className='space-y-3'>
                        <div className='flex justify-between text-neutral-600 dark:text-neutral-300'>
                            <span>
                                {pricePerNight.toLocaleString('vi-VN')}đ x{' '}
                                {nights} đêm
                            </span>
                            <span>{total.toLocaleString('vi-VN')}đ</span>
                        </div>
                        <div className='flex justify-between text-neutral-600 dark:text-neutral-300'>
                            <span>Phí dịch vụ</span>
                            <span>0đ</span>
                        </div>
                        <Separator />
                        <div className='flex justify-between font-semibold'>
                            <span>Tổng cộng</span>
                            <span>{total.toLocaleString('vi-VN')} đ</span>
                        </div>
                        <div className='text-sm text-neutral-500'>
                            Tổng khách: <b>{totalGuests}</b>
                        </div>
                    </div>

                    {/* Lưu vào store + chuyển sang trang giỏ hàng */}
                    <Button
                        className='w-full'
                        onClick={handleAddToCart}
                        disabled={isDisabled}
                    >
                        Đặt phòng ngay
                    </Button>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className='container py-11 lg:py-16 px-8'>
            {/* HEADER IMAGES */}
            {renderHeaderImages()}

            {/* modal */}
            {modal === 'open' && (
                <ModalDetail
                    images={
                        (location.state as { images: string[] })?.images || []
                    }
                    startIndex={
                        (location.state as { startIndex?: number })
                            ?.startIndex || 0
                    }
                    onClose={() => navigate(location.pathname)} // đóng modal
                />
            )}

            {/* MAIN CONTENT */}
            <main className='relative z-10 mt-11 flex flex-col lg:flex-row'>
                {/* CONTENT */}
                <div className='w-full lg:w-3/5 xl:w-2/3 space-y-8 lg:space-y-10 lg:pr-10'>
                    {renderSection1()}
                    {renderSection2()}
                    {renderSection3()}
                    {renderSection4()}
                    <SectionDateRange />
                    {renderSection5()}
                    {renderSection6()}
                    {renderSection7()}
                    {renderSection8()}
                </div>

                {/* SIDEBAR */}
                <div className='hidden lg:block flex-grow mt-14 lg:mt-0'>
                    {renderSidebar()}
                </div>
            </main>
        </div>
    );
};

export default StayDetailPage;
