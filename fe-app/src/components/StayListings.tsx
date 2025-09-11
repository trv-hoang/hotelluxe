import { useState } from 'react';
import StayCard from '@/components/StayCard';
import { DEMO_STAY_LISTINGS } from '@/data/listings';
import { Flame } from 'lucide-react';
import Pagination from '@/components/Pagination';

const ITEMS_PER_PAGE = 4;

export default function StayListing() {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(DEMO_STAY_LISTINGS.length / ITEMS_PER_PAGE);

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentItems = DEMO_STAY_LISTINGS.slice(
        startIndex,
        startIndex + ITEMS_PER_PAGE,
    );

    return (
        <div className='space-y-6 px-4 sm:px-6 md:px-12 sm:space-y-8'>
            <div className='flex items-center space-x-3'>
                <h2 className='text-3xl font-semibold'>Nổi bật </h2>
                <Flame className='inline-block text-red-500 h-8 w-8' />
            </div>

            <div className='grid grid-cols-1 gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {currentItems.map((stay) => (
                    <StayCard key={stay.id} data={stay} />
                ))}
            </div>

            {totalPages > 1 && (
                <div className='flex justify-center mt-8'>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}
        </div>
    );
}
