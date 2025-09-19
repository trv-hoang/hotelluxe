import { useState, useEffect } from 'react';
import StayCard from '@/components/StayCard';
import { Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import PaginationCus from '@/components/PaginationCus';
import api from '@/api/axios';
import type { StayDataType } from '@/types/stay';
import { mapStay } from '@/data/listings';
import type { StayApiResponse } from '@/data/listings';
import homeStayDataJson from '@/data/__homeStay.json';

const ITEMS_PER_PAGE = 4;

export default function StayListing() {
    const [stays, setStays] = useState<StayDataType[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    
    console.log('🏠 StayListing render - stays length:', stays.length, 'loading:', loading);
    console.log('📊 stays data:', stays);

    useEffect(() => {
        const fetchStays = async () => {
            console.log('🚀 Starting fetchStays...');
            
            // Force fallback for now to test UI
            console.log('🔄 Using fallback data for debugging...');
            const staticStays: StayDataType[] = homeStayDataJson.slice(0, 8).map((hotel) => ({
                id: hotel.id,
                authorId: hotel.authorId || 1,
                date: hotel.date || new Date().toISOString(),
                href: `/hotels`,
                title: hotel.title,
                featuredImage: hotel.featuredImage,
                galleryImgs: hotel.galleryImgs || [hotel.featuredImage],
                description: hotel.description || 'Chưa có mô tả',
                price: hotel.price || 500000,
                address: hotel.address || 'Địa chỉ không xác định',
                category: {
                    id: 1,
                    name: 'Khách sạn',
                    href: '/categories/hotel',
                    color: 'blue'
                },
                reviewStart: hotel.reviewStart || 4.5,
                reviewCount: hotel.reviewCount || 10,
                commentCount: hotel.commentCount || 5,
                viewCount: hotel.viewCount || 100,
                like: false,
                maxGuests: hotel.maxGuests || 4,
                bedrooms: hotel.bedrooms || 2,
                bathrooms: hotel.bathrooms || 1,
                saleOff: hotel.saleOff || null,
                isAds: hotel.isAds || false,
                map: hotel.map || { lat: 21.0285, lng: 105.8542 }
            }));
            console.log('🏨 Fallback stays created:', staticStays.length, 'items');
            setStays(staticStays);
            setLoading(false);
            return;
            
            try {
                console.log('📡 Calling API /hotels...');
                const res = await api.get('/hotels');
                console.log('✅ API Response:', res.data);
                const staysWithCategory: StayDataType[] = res.data.data.map(
                    (post: StayApiResponse) => mapStay(post),
                );
                console.log('🏨 Mapped stays:', staysWithCategory);
                setStays(staysWithCategory);
            } catch (error) {
                console.error('❌ Lỗi khi fetch /hotels:', error);
                console.log('🔄 Sử dụng dữ liệu mẫu thay thế...');
                console.log('📄 homeStayDataJson sample:', homeStayDataJson.slice(0, 2));
                
                // Fallback to static data
                const staticStays: StayDataType[] = homeStayDataJson.slice(0, 8).map((hotel) => ({
                    id: hotel.id,
                    authorId: hotel.authorId || 1,
                    date: hotel.date || new Date().toISOString(),
                    href: `/hotels`,
                    title: hotel.title,
                    featuredImage: hotel.featuredImage,
                    galleryImgs: hotel.galleryImgs || [hotel.featuredImage],
                    description: hotel.description || 'Chưa có mô tả',
                    price: hotel.price || 500000,
                    address: hotel.address || 'Địa chỉ không xác định',
                    category: {
                        id: 1,
                        name: 'Khách sạn',
                        href: '/categories/hotel',
                        color: 'blue'
                    },
                    reviewStart: hotel.reviewStart || 4.5,
                    reviewCount: hotel.reviewCount || 10,
                    commentCount: hotel.commentCount || 5,
                    viewCount: hotel.viewCount || 100,
                    like: false,
                    maxGuests: hotel.maxGuests || 4,
                    bedrooms: hotel.bedrooms || 2,
                    bathrooms: hotel.bathrooms || 1,
                    saleOff: hotel.saleOff || null,
                    isAds: hotel.isAds || false,
                    map: hotel.map || { lat: 21.0285, lng: 105.8542 }
                }));
                console.log('🏨 Fallback stays created:', staticStays.length, 'items');
                setStays(staticStays);
            } finally {
                console.log('🔚 Setting loading to false');
                setLoading(false);
            }
        };

        fetchStays();
    }, []);

    const totalPages = Math.ceil(stays.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentItems = stays.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    
    console.log('📄 Pagination - totalPages:', totalPages, 'currentPage:', currentPage, 'currentItems:', currentItems.length);

    if (loading) {
        return <p className='text-center py-10'>Đang tải dữ liệu...</p>;
    }

    return (
        <div className='space-y-6 px-4 sm:px-6 md:px-12 sm:space-y-8 mx-auto w-full'>
            <div className='flex items-center justify-between space-x-3'>
                <div className='flex items-center space-x-3'>
                    <h2 className='text-3xl font-semibold'>Nổi bật</h2>
                    <Flame className='inline-block text-red-500 h-8 w-8' />
                </div>
                <Link to='/hotels'>
                    <Button variant='link'>Xem tất cả</Button>
                </Link>
            </div>

            {currentItems.length === 0 ? (
                <div className='text-center py-8'>
                    <p className='text-gray-500'>Không có khách sạn nào để hiển thị.</p>
                    <p className='text-sm text-gray-400 mt-2'>
                        Total stays: {stays.length}, Current items: {currentItems.length}
                    </p>
                </div>
            ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 justify-center'>
                    {currentItems.map((stay) => (
                        <StayCard key={stay.id} data={stay} />
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className='flex justify-center mt-8'>
                    <PaginationCus
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}
        </div>
    );
}
