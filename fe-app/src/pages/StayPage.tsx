import { useState, useMemo, useCallback, useEffect } from 'react';
import StayCard from '@/components/StayCard';
import { StayFilter } from '@/components/StayFilter';
import PaginationCus from '@/components/PaginationCus';
import { mapStay, type StayApiResponse } from '@/data/listings';
import type { StayDataType } from '@/types/stay';
import api from '@/api/axios';

const ITEMS_PER_PAGE = 8;

export default function StayPage() {
    const [allStays, setAllStays] = useState<StayDataType[]>([]);
    const [filteredData, setFilteredData] = useState<StayDataType[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    // ✅ Fetch dữ liệu 1 lần, lưu cả gốc và filtered
    useEffect(() => {
        const fetchStays = async () => {
            try {
                const res = await api.get('/hotels');
                const stays: StayDataType[] = res.data.data.map(
                    (item: StayApiResponse) => mapStay(item),
                );
                setAllStays(stays);
                setFilteredData(stays);
            } catch (error) {
                console.error('Lỗi khi fetch /hotels:', error);
            }
        };

        fetchStays();
    }, []);

    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

    const currentItems = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        return filteredData.slice(start, end);
    }, [filteredData, currentPage]);

    // ✅ Logic chèn quảng cáo
    const injectAds = useCallback((items: StayDataType[]): StayDataType[] => {
        const ads = items.filter((item) => item.isAds);
        const normal = items.filter((item) => !item.isAds);
        const result: StayDataType[] = [];
        let adIndex = 0;

        if (adIndex < ads.length) {
            result.push(ads[adIndex]);
            adIndex++;
        }

        normal.forEach((item, idx) => {
            result.push(item);
            if ((idx + 1) % 5 === 0 && adIndex < ads.length) {
                result.push(ads[adIndex]);
                adIndex++;
            }
        });

        while (adIndex < ads.length) {
            result.push(ads[adIndex]);
            adIndex++;
        }

        return result;
    }, []);

    const displayedItems = useMemo(
        () => injectAds(currentItems),
        [currentItems, injectAds],
    );

    // ✅ Nhận dữ liệu lọc từ StayFilter
    const handleFilterChange = useCallback((data: StayDataType[]) => {
        setFilteredData(data);
        setCurrentPage(1);
    }, []);

    return (
        <div className='space-y-6 px-4 sm:px-6 md:px-12 sm:space-y-8 mx-auto w-full'>
            <div className='flex items-center justify-between'>
                <h2 className='text-3xl font-semibold'>
                    Danh sách khách sạn ({filteredData.length})
                </h2>
            </div>

            {/* ✅ Truyền allStays làm data gốc cho filter */}
            <StayFilter data={allStays} onFilter={handleFilterChange} />

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 justify-center'>
                {displayedItems.map((stay) => (
                    <StayCard key={stay.id} data={stay} />
                ))}
            </div>

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
