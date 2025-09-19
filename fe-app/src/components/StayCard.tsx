import type { StayDataType } from '@/types/stay';
import GallerySlider from './GallerySlider';
import { Link } from 'react-router-dom';
import StartRating from '@/components/StarRating';
import BtnLikeIcon from '@/components/BtnLikeIcon';
import SaleOffBadge from '@/components/SaleOffBadge';
import Badge from '@/components/ui/BadgeCus';
import { formatPrice } from '@/lib/utils';

export interface StayCardProps {
    className?: string;
    data?: StayDataType;
    size?: 'default' | 'small';
}

function StayCard({ size = 'default', className = '', data }: StayCardProps) {
    const {
        galleryImgs,
        category,
        address,
        title,
        bedrooms,
        href,
        like,
        saleOff,
        isAds,
        price,
        reviewStart,
        reviewCount,
        id,
    } = data || {};
    // console.log('galleryImgs', galleryImgs);

    const renderSliderGallery = () => (
        <div className='relative w-full'>
            <GallerySlider
                uniqueID={`StayCard_${id}`}
                ratioClass='aspect-[4/3]'
                galleryImgs={galleryImgs || []}
                href={href}
                galleryClass={size === 'default' ? undefined : ''}
                id={id}
            />
            <BtnLikeIcon
                isLiked={like}
                className='absolute right-3 top-3 z-[1]'
            />
            {saleOff && (
                <SaleOffBadge
                    className='absolute left-3 top-3'
                    desc={saleOff}
                />
            )}
        </div>
    );

    const renderContent = () => (
        <div className={size === 'default' ? 'p-4 space-y-4' : 'p-3 space-y-1'}>
            <div className={size === 'default' ? 'space-y-2' : 'space-y-1'}>
                <span className='text-sm text-neutral-500 dark:text-neutral-400'>
                    {category?.name} · {bedrooms} beds
                </span>
                <div className='flex items-center space-x-2'>
                    {isAds && <Badge name='ADS' color='green' />}
                    <h2
                        className={`font-semibold capitalize text-neutral-900 dark:text-white ${
                            size === 'default' ? 'text-base' : 'text-base'
                        }`}
                    >
                        <span className='line-clamp-1'>{title}</span>
                    </h2>
                </div>
                <div className='flex items-center text-neutral-500 dark:text-neutral-400 text-sm space-x-1.5'>
                    {size === 'default' && (
                        <svg
                            className='h-4 w-4'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={1.5}
                                d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                            />
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={1.5}
                                d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                            />
                        </svg>
                    )}
                    <span>{address}</span>
                </div>
            </div>
            <div className='w-14 border-b border-neutral-100 dark:border-neutral-800'></div>
            <div className='flex justify-between items-center'>
                <span className='text-base font-semibold'>
                    {formatPrice(price || 0)}đ{' '}
                    {size === 'default' && (
                        <span className='text-sm text-neutral-500 dark:text-neutral-400 font-normal'>
                            /đêm
                        </span>
                    )}
                </span>
                {!!reviewStart && (
                    <StartRating
                        reviewCount={reviewCount}
                        point={reviewStart}
                    />
                )}
            </div>
        </div>
    );

    return (
        <div
            className={`nc-StayCard group relative bg-white dark:bg-neutral-900 ${
                size === 'default'
                    ? 'border border-neutral-100 dark:border-neutral-800 '
                    : ''
            } rounded-2xl overflow-hidden hover:shadow-xl transition-shadow ${className}`}
            data-nc-id='StayCard'
        >
            {renderSliderGallery()}
            <Link to={`/stay-detail/${id}`}>{renderContent()}</Link>
        </div>
    );
}

export default StayCard;
