import React, { useState, useMemo, useEffect } from 'react';
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

const parsePrice = (priceStr: string) => Number(priceStr.replace(/[^\d]/g, ''));

const parseSaleOff = (saleOff?: string | null): number => {
    if (!saleOff) return 0;
    const match = saleOff.match(/-?(\d+)%/);
    return match ? Number(match[1]) : 0;
};

export const StayFilter: React.FC<Props> = ({ data, onFilter }) => {
    // lấy max giá từ data
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

    // Sort state
    const [sortBy, setSortBy] = useState<
        'saleOff' | 'viewCount' | 'reviewCount' | null
    >(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // debounce search
    const handleSearch = useMemo(
        () => debounce((val: string) => setSearchTerm(val), 300),
        [],
    );

    useEffect(() => {
        return () => {
            handleSearch.cancel();
        };
    }, [handleSearch]);

    // Filter logic
    const filteredData = useMemo(() => {
        return data.filter((stay) => {
            const price = parsePrice(stay.price);

            const matchCategory = category
                ? stay.category?.id.toString() === category
                : true;

            const matchPrice = price >= priceRange[0] && price <= priceRange[1];

            const matchSearch = stay.title
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

            const matchBedrooms = bedrooms
                ? stay.bedrooms?.toString() === bedrooms
                : true;

            return matchCategory && matchPrice && matchSearch && matchBedrooms;
        });
    }, [data, category, priceRange, searchTerm, bedrooms]);

    // Sort logic
    const sortedData = useMemo(() => {
        const sorted = [...filteredData];

        if (sortBy === 'saleOff') {
            sorted.sort((a, b) => {
                const sa = parseSaleOff(a.saleOff);
                const sb = parseSaleOff(b.saleOff);
                return sortOrder === 'asc' ? sa - sb : sb - sa;
            });
        } else if (sortBy === 'viewCount') {
            sorted.sort((a, b) =>
                sortOrder === 'asc'
                    ? a.viewCount - b.viewCount
                    : b.viewCount - a.viewCount,
            );
        } else if (sortBy === 'reviewCount') {
            sorted.sort((a, b) =>
                sortOrder === 'asc'
                    ? a.reviewCount - b.reviewCount
                    : b.reviewCount - a.reviewCount,
            );
        }
        return sorted;
    }, [filteredData, sortBy, sortOrder]);

    useEffect(() => {
        onFilter?.(sortedData);
    }, [sortedData, onFilter]);

    // Reset filters
    const handleReset = () => {
        setCategory(null);
        setPriceRange([0, maxPrice]);
        setSearchTerm('');
        setBedrooms(null);
        setSortBy(null);
        setSortOrder('desc');
        onFilter?.(data);
    };

    // Sort buttons
    const handleSort = (field: 'saleOff' | 'viewCount' | 'reviewCount') => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
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

                {/* Popover filter */}
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
                        {/* Price range */}
                        {/* <div>
                            <p className='mb-2 text-sm font-medium'>
                                Khoảng giá:{' '}
                                <span className='font-semibold'>
                                    {priceRange[0].toLocaleString()}đ -{' '}
                                    {priceRange[1].toLocaleString()}đ
                                </span>
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
                        </div> */}
                        {/* Price range */}
                        <div>
                            <p className='mb-2 text-sm font-medium'>
                                Khoảng giá (VND):{' '}
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
                                {/* Min price input */}
                                <div className='flex items-center gap-1'>
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
                                                const newMin =
                                                    Number(e.target.value) || 0;
                                                setPriceRange([
                                                    newMin,
                                                    priceRange[1],
                                                ]);
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Max price input */}
                                <div className='flex items-center gap-1'>
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
                                                const newMax =
                                                    Number(e.target.value) ||
                                                    maxPrice;
                                                setPriceRange([
                                                    priceRange[0],
                                                    newMax,
                                                ]);
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Category */}
                        <Select
                            onValueChange={(val) => setCategory(val)}
                            value={category ?? ''}
                        >
                            <SelectTrigger className='w-full'>
                                <SelectValue placeholder='Chọn loại khách sạn' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='1'>Hotel</SelectItem>
                                <SelectItem value='2'>Resort</SelectItem>
                                <SelectItem value='3'>Villa</SelectItem>
                                <SelectItem value='4'>Homestay</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Bedrooms */}
                        <Select
                            onValueChange={(val) => setBedrooms(val)}
                            value={bedrooms ?? ''}
                        >
                            <SelectTrigger className='w-full'>
                                <SelectValue placeholder='Số phòng ngủ' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='1'>1</SelectItem>
                                <SelectItem value='2'>2</SelectItem>
                                <SelectItem value='3'>3</SelectItem>
                                <SelectItem value='4'>4+</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Search */}
                        <Input
                            placeholder='Tìm kiếm khách sạn...'
                            onChange={(e) => handleSearch(e.target.value)}
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

            {/* Sort buttons */}
            <div className='flex items-center gap-3'>
                <Button
                    variant={sortBy === 'saleOff' ? 'default' : 'outline'}
                    size='sm'
                    onClick={() => handleSort('saleOff')}
                    className='flex items-center gap-1'
                >
                    Giảm giá
                    {renderSortIcon('saleOff')}
                </Button>

                <Button
                    variant={sortBy === 'viewCount' ? 'default' : 'outline'}
                    size='sm'
                    onClick={() => handleSort('viewCount')}
                    className='flex items-center gap-1'
                >
                    Lượt xem
                    {renderSortIcon('viewCount')}
                </Button>

                <Button
                    variant={sortBy === 'reviewCount' ? 'default' : 'outline'}
                    size='sm'
                    onClick={() => handleSort('reviewCount')}
                    className='flex items-center gap-1'
                >
                    Đánh giá
                    {renderSortIcon('reviewCount')}
                </Button>
            </div>
        </div>
    );
};
