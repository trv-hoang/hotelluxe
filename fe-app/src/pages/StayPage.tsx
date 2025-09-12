import PaginationCus from '@/components/PaginationCus';
import StayCard from '@/components/StayCard';
import { StayFilter } from '@/components/StayFilter';
import { DEMO_STAY_LISTINGS } from '@/data/listings';
import { useState } from 'react';
const ITEMS_PER_PAGE = 8;
export default function StayPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredData, setFilteredData] = useState(DEMO_STAY_LISTINGS);

    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentItems = filteredData.slice(
        startIndex,
        startIndex + ITEMS_PER_PAGE,
    );

    return (
        <div className='space-y-6 px-4 sm:px-6 md:px-12 sm:space-y-8 mx-auto w-full'>
            <div className='flex items-center justify-between'>
                <h2 className='text-3xl font-semibold'>
                    Danh sách khách sạn ({filteredData.length})
                </h2>
            </div>

            {/* Bộ lọc */}
            <StayFilter
                data={DEMO_STAY_LISTINGS}
                onFilter={(data) => {
                    setFilteredData(data);
                    setCurrentPage(1);
                }}
            />

            {/* Danh sách sản phẩm */}
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
