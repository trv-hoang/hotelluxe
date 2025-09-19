import { Card, CardContent } from '@/components/ui/card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';

// Import ảnh local
import halongbay from '@/assets/travels/halongbay.jpeg';
import hoian from '@/assets/travels/hoian.jpeg';
import sapa from '@/assets/travels/sapa.jpeg';
import danang from '@/assets/travels/danang.jpeg';
import hue from '@/assets/travels/hue.jpeg';
import phuquoc from '@/assets/travels/phuquoc.jpeg';
import ninhbinh from '@/assets/travels/ninhbinh.jpeg';
import muine from '@/assets/travels/muine.jpeg';
import vungtau from '@/assets/travels/vungtau.jpeg';
import dalat from '@/assets/travels/dalat.jpeg';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

// Mock 10 địa điểm VN
const places = [
    { id: 1, name: 'Hạ Long Bay', count: 3000, thumbnail: halongbay },
    { id: 2, name: 'Hội An', count: 2500, thumbnail: hoian },
    { id: 3, name: 'Sapa', count: 1800, thumbnail: sapa },
    { id: 4, name: 'Đà Nẵng', count: 4200, thumbnail: danang },
    { id: 5, name: 'Huế', count: 2900, thumbnail: hue },
    { id: 6, name: 'Phú Quốc', count: 3500, thumbnail: phuquoc },
    { id: 7, name: 'Ninh Bình', count: 2100, thumbnail: ninhbinh },
    { id: 8, name: 'Mũi Né', count: 1700, thumbnail: muine },
    { id: 9, name: 'Vũng Tàu', count: 4000, thumbnail: vungtau },
    { id: 10, name: 'Đà Lạt', count: 4000, thumbnail: dalat },
];

export function ExplorePlace() {
    return (
        <div className='relative w-full px-14 mx-auto'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-3 mb-8'>
                    <h2 className='text-3xl font-semibold'>
                        Khám phá địa điểm
                    </h2>
                    <TrendingUp className='inline-block text-red-500 h-8 w-8' />
                </div>
                <Link to='/hotels'>
                    <Button variant={'link'} className=''>
                        Xem tất cả
                    </Button>
                </Link>
            </div>
            <Carousel opts={{ align: 'start' }}>
                <CarouselContent>
                    {places.map((place) => (
                        <CarouselItem
                            key={place.id}
                            className='md:basis-1/2 lg:basis-1/3 xl:basis-1/5'
                        >
                            <Card className='overflow-hidden rounded-2xl shadow-sm'>
                                <div className='overflow-hidden rounded-2xl'>
                                    <img
                                        src={place.thumbnail}
                                        alt={place.name}
                                        className='h-56 w-full object-cover transition-transform duration-300 hover:scale-105 '
                                    />
                                </div>
                                <CardContent className='p-3'>
                                    <h3 className='text-base font-semibold'>
                                        {place.name}
                                    </h3>
                                    <p className='text-sm text-muted-foreground'>
                                        {place.count.toLocaleString()}+ phòng
                                    </p>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* Nút trái */}
                <CarouselPrevious
                    className='absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 
                               bg-white rounded-full shadow-lg p-3 hover:bg-gray-100'
                >
                    <ChevronLeft className='w-6 h-6' />
                </CarouselPrevious>

                {/* Nút phải */}
                <CarouselNext
                    className='absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 
                               bg-white rounded-full shadow-lg p-3 hover:bg-gray-100'
                >
                    <ChevronRight className='w-6 h-6' />
                </CarouselNext>
            </Carousel>
        </div>
    );
}
