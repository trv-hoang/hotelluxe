// src/app/stay/page.tsx (hoặc nơi bạn đặt StayPage)
import { useState, useMemo, useCallback } from 'react';
import StayCard from '@/components/StayCard';
import { StayFilter } from '@/components/StayFilter';
import PaginationCus from '@/components/PaginationCus';
import { DEMO_STAY_LISTINGS } from '@/data/listings';
import type { StayDataType } from '@/types/stay';

const ITEMS_PER_PAGE = 8;

export default function StayPage() {
    const [filteredData, setFilteredData] =
        useState<StayDataType[]>(DEMO_STAY_LISTINGS);
    const [currentPage, setCurrentPage] = useState(1);

    // Tổng số trang
    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

    // Lấy dữ liệu của trang hiện tại
    const currentItems = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        return filteredData.slice(start, end);
    }, [filteredData, currentPage]);

    // Chèn quảng cáo (ADS)
    const injectAds = useCallback((items: StayDataType[]): StayDataType[] => {
        const ads = items.filter((item) => item.isAds);
        const normal = items.filter((item) => !item.isAds);
        const result: StayDataType[] = [];
        let adIndex = 0;

        // Thêm 1 ADS đầu tiên (nếu có)
        if (adIndex < ads.length) {
            result.push(ads[adIndex]);
            adIndex++;
        }

        // Thêm item bình thường, mỗi 5 item thì chèn 1 ADS
        normal.forEach((item, idx) => {
            result.push(item);
            if ((idx + 1) % 5 === 0 && adIndex < ads.length) {
                result.push(ads[adIndex]);
                adIndex++;
            }
        });

        // Thêm nốt các ADS còn dư
        while (adIndex < ads.length) {
            result.push(ads[adIndex]);
            adIndex++;
        }

        return result;
    }, []);

    // Danh sách cuối cùng để render
    const displayedItems = useMemo(
        () => injectAds(currentItems),
        [currentItems, injectAds],
    );

    // ✅ Dùng useCallback để đảm bảo onFilter không đổi qua các lần render
    const handleFilterChange = useCallback((data: StayDataType[]) => {
        setFilteredData(data);
        setCurrentPage(1); // Reset về trang 1 khi filter
    }, []);

    return (
        <div className='space-y-6 px-4 sm:px-6 md:px-12 sm:space-y-8 mx-auto w-full'>
            {/* Tiêu đề */}
            <div className='flex items-center justify-between'>
                <h2 className='text-3xl font-semibold'>
                    Danh sách khách sạn ({filteredData.length})
                </h2>
            </div>

            {/* Bộ lọc */}
            <StayFilter
                data={DEMO_STAY_LISTINGS}
                onFilter={handleFilterChange}
            />

            {/* Danh sách khách sạn */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 justify-center'>
                {displayedItems.map((stay) => (
                    <StayCard key={stay.id} data={stay} />
                ))}
            </div>

            {/* Phân trang */}
            {totalPages > 1 && (
                <div className='flex justify-center mt-8'>
                    <PaginationCus
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => setCurrentPage(page)}
                    />
                </div>
            )}
        </div>
    );
}
