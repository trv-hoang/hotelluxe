// src/components/StayFilter.tsx
import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { debounce } from 'lodash';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from '@/components/ui/popover';
import type { StayDataType } from '@/types/stay';

interface Props {
    data: StayDataType[];
    onFilter?: (data: StayDataType[]) => void;
}

const parsePrice = (priceStr: string): number => {
    return Number(priceStr.replace(/[^\d]/g, '')) || 0;
};

const parseSaleOff = (saleOff?: string | null): number => {
    if (!saleOff) return 0;
    const match = saleOff.match(/(\d+)%/);
    return match ? parseInt(match[1], 10) : 0;
};

export const StayFilter: React.FC<Props> = ({ data, onFilter }) => {
    // ✅ Tính maxPrice duy nhất 1 lần khi data vào
    const maxPrice = useMemo(
        () => Math.max(...data.map((stay) => parsePrice(stay.price))),
        [data],
    );

    const [category, setCategory] = useState<string | null>(null);
    const [priceRange, setPriceRange] = useState<[number, number]>([
        0,
        maxPrice,
    ]);
    const [searchTerm, setSearchTerm] = useState('');
    const [bedrooms, setBedrooms] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<
        'saleOff' | 'viewCount' | 'reviewCount' | null
    >(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // Debounce tìm kiếm
    const debouncedSearch = useMemo(() => debounce(setSearchTerm, 300), []);

    React.useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    // 🔒 Filter: chỉ phụ thuộc vào data + các state filter
    const filteredData = useMemo(() => {
        return data.filter((stay) => {
            const price = parsePrice(stay.price);
            const matchesCategory = category
                ? stay.category?.id.toString() === category
                : true;
            const matchesPrice =
                price >= priceRange[0] && price <= priceRange[1];
            const matchesSearch = searchTerm
                ? stay.title.toLowerCase().includes(searchTerm.toLowerCase())
                : true;

            let matchesBedrooms = true;
            if (bedrooms) {
                const bedCount = stay.bedrooms ?? 0;
                matchesBedrooms =
                    bedrooms === '4+'
                        ? bedCount >= 4
                        : bedCount === parseInt(bedrooms);
            }

            return (
                matchesCategory &&
                matchesPrice &&
                matchesSearch &&
                matchesBedrooms
            );
        });
    }, [data, category, priceRange, searchTerm, bedrooms]);

    // 🔒 Sort: tạo mảng mới, nhưng đảm bảo không thay đổi reference nếu không cần
    const sortedData = useMemo(() => {
        const list = [...filteredData];

        if (sortBy === 'saleOff') {
            list.sort((a, b) => {
                const aOff = parseSaleOff(a.saleOff);
                const bOff = parseSaleOff(b.saleOff);
                return sortOrder === 'asc' ? aOff - bOff : bOff - aOff;
            });
        } else if (sortBy === 'viewCount') {
            list.sort((a, b) =>
                sortOrder === 'asc'
                    ? a.viewCount - b.viewCount
                    : b.viewCount - a.viewCount,
            );
        } else if (sortBy === 'reviewCount') {
            list.sort((a, b) =>
                sortOrder === 'asc'
                    ? a.reviewCount - b.reviewCount
                    : b.reviewCount - a.reviewCount,
            );
        }

        return list;
    }, [filteredData, sortBy, sortOrder]);

    // 🚫 KHÔNG DÙNG useEffect nữa → tránh loop
    // Thay vào đó: GỌI onFilter TRỰC TIẾP trong các hàm xử lý
    // Nhưng nếu vẫn dùng, hãy đảm bảo nó chỉ chạy khi thực sự cần

    // ✅ Gọi onFilter trực tiếp từ các handler (không qua useEffect)
    // Nhưng ở đây ta vẫn cần thông báo mỗi khi sortedData thay đổi → dùng layout effect hoặc callback

    // 🔁 Fix loop: Dùng useRef để lưu giá trị trước, tránh gọi onFilter nếu dữ liệu không đổi
    const prevSortedDataRef = React.useRef<string | null>(null);

    const getIdentityKey = (data: StayDataType[]) => {
        return data.map((d) => d.id).join(',');
    };

    const identityKey = getIdentityKey(sortedData);

    React.useLayoutEffect(() => {
        const prevKey = prevSortedDataRef.current;
        if (prevKey !== identityKey) {
            prevSortedDataRef.current = identityKey;
            onFilter?.(sortedData);
        }
    }, [sortedData, identityKey, onFilter]);

    // Reset bộ lọc
    const handleReset = () => {
        setCategory(null);
        setPriceRange([0, maxPrice]);
        setSearchTerm('');
        setBedrooms(null);
        setSortBy(null);
        setSortOrder('desc');
        debouncedSearch.cancel();
        onFilter?.(data); // trả về data gốc
    };

    const handleSort = (field: 'saleOff' | 'viewCount' | 'reviewCount') => {
        if (sortBy === field) {
            setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
    };

    const renderSortIcon = (field: typeof sortBy) => {
        if (sortBy !== field) return null;
        return sortOrder === 'desc' ? (
            <ArrowDown className='w-4 h-4' />
        ) : (
            <ArrowUp className='w-4 h-4' />
        );
    };

    return (
        <div className='space-y-4'>
            <div className='flex items-center justify-between'>
                <h2 className='text-2xl font-semibold'>
                    Bộ lọc khách sạn ({sortedData.length})
                </h2>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant='outline'
                            size='sm'
                            className='flex items-center gap-1'
                        >
                            <SlidersHorizontal className='w-4 h-4' />
                            Bộ lọc
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-96 space-y-4'>
                        {/* Khoảng giá */}
                        <div>
                            <p className='mb-2 text-sm font-medium'>
                                Khoảng giá (VND):
                            </p>
                            <Slider
                                min={0}
                                max={maxPrice}
                                step={500000}
                                value={priceRange}
                                onValueChange={(val) =>
                                    setPriceRange(val as [number, number])
                                }
                            />
                            <div className='flex items-center justify-between mt-3'>
                                <div className='flex flex-col items-start gap-1'>
                                    <span className='text-sm text-gray-600'>
                                        Thấp nhất:
                                    </span>
                                    <Input
                                        type='number'
                                        className='w-40'
                                        step={500000}
                                        value={priceRange[0]}
                                        onChange={(e) => {
                                            const val = Math.max(
                                                0,
                                                Number(e.target.value) || 0,
                                            );
                                            setPriceRange([val, priceRange[1]]);
                                        }}
                                    />
                                </div>
                                <div className='flex flex-col items-start gap-1'>
                                    <span className='text-sm text-gray-600'>
                                        Cao nhất:
                                    </span>
                                    <Input
                                        type='number'
                                        className='w-40'
                                        step={500000}
                                        value={priceRange[1]}
                                        onChange={(e) => {
                                            const val = Math.min(
                                                maxPrice,
                                                Number(e.target.value) ||
                                                    maxPrice,
                                            );
                                            setPriceRange([priceRange[0], val]);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Loại hình */}
                        <Select
                            onValueChange={setCategory}
                            value={category ?? ''}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder='Chọn loại khách sạn' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='1'>Hotel</SelectItem>
                                <SelectItem value='2'>Resort</SelectItem>
                                <SelectItem value='3'>Villa</SelectItem>
                                <SelectItem value='4'>Homestay</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Phòng ngủ */}
                        <Select
                            onValueChange={setBedrooms}
                            value={bedrooms ?? ''}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder='Số phòng ngủ' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='1'>1</SelectItem>
                                <SelectItem value='2'>2</SelectItem>
                                <SelectItem value='3'>3</SelectItem>
                                <SelectItem value='4'>4+</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Tìm kiếm */}
                        <Input
                            placeholder='Tìm kiếm khách sạn...'
                            onChange={(e) => debouncedSearch(e.target.value)}
                        />

                        <Button
                            variant='outline'
                            size='sm'
                            onClick={handleReset}
                            className='flex items-center gap-1 w-full'
                        >
                            <RotateCcw className='w-4 h-4' />
                            Reset
                        </Button>
                    </PopoverContent>
                </Popover>
            </div>

            {/* Nút sắp xếp */}
            <div className='flex items-center gap-3'>
                <Button
                    variant={sortBy === 'saleOff' ? 'default' : 'outline'}
                    size='sm'
                    onClick={() => handleSort('saleOff')}
                    className='flex items-center gap-1'
                >
                    Giảm giá {renderSortIcon('saleOff')}
                </Button>
                <Button
                    variant={sortBy === 'viewCount' ? 'default' : 'outline'}
                    size='sm'
                    onClick={() => handleSort('viewCount')}
                    className='flex items-center gap-1'
                >
                    Lượt xem {renderSortIcon('viewCount')}
                </Button>
                <Button
                    variant={sortBy === 'reviewCount' ? 'default' : 'outline'}
                    size='sm'
                    onClick={() => handleSort('reviewCount')}
                    className='flex items-center gap-1'
                >
                    Đánh giá {renderSortIcon('reviewCount')}
                </Button>
            </div>
        </div>
    );
};
