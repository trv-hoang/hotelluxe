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

const ITEMS_PER_PAGE = 4;

export default function StayListing() {
    const [stays, setStays] = useState<StayDataType[]>([]);
    console.log('stays', stays);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStays = async () => {
            try {
                const res = await api.get('/hotels');
                const staysWithCategory: StayDataType[] = res.data.data.map(
                    (post: StayApiResponse) => mapStay(post),
                );
                setStays(staysWithCategory);
            } catch (error) {
                console.error('Lỗi khi fetch /hotels:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStays();
    }, []);

    const totalPages = Math.ceil(stays.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentItems = stays.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 justify-center'>
                {currentItems.map((stay) => (
                    <StayCard key={stay.id} data={stay} />
                ))}
            </div>

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
