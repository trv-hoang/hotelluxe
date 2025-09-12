import AvatarCus from '@/shared/AvartarCus';
import { Star } from 'lucide-react';

interface CommentListingDataType {
    name: string;
    avatar?: string;
    date: string;
    comment: string;
    starPoint: number;
}

export interface CommentListingProps {
    className?: string;
    data?: CommentListingDataType;
    hasListingTitle?: boolean;
}

const DEMO_DATA: CommentListingDataType = {
    name: 'Cody Fisher',
    date: 'May 20, 2021',
    comment:
        'Vị trí tuyệt vời và nhân viên rất thân thiện. Giường rất thoải mái và phòng rất sạch sẽ. Tôi chắc chắn sẽ quay lại đây.',
    starPoint: 5,
};

const CommentListing = ({
    className = '',
    data = DEMO_DATA,
    hasListingTitle,
}: CommentListingProps) => {
    return (
        <div
            className={`nc-CommentListing flex space-x-4 ${className}`}
            data-nc-id='CommentListing'
        >
            <div className='pt-0.5'>
                <AvatarCus
                    sizeClass='h-10 w-10 text-lg'
                    radius='rounded-full'
                    userName={data.name}
                    imgUrl={data.avatar}
                />
            </div>
            <div className='flex-grow'>
                <div className='flex justify-between space-x-3'>
                    <div className='flex flex-col'>
                        <div className='text-sm font-semibold'>
                            <span>{data.name}</span>
                            {hasListingTitle && (
                                <>
                                    <span className='text-neutral-500 dark:text-neutral-400 font-normal'>
                                        {` review in `}
                                    </span>
                                    <a href='/'>The Lounge & Bar</a>
                                </>
                            )}
                        </div>
                        <span className='text-sm text-neutral-500 dark:text-neutral-400 mt-0.5'>
                            {data.date}
                        </span>
                    </div>
                    <div className='flex text-yellow-500'>
                        {Array.from({ length: data.starPoint }).map((_, i) => (
                            <Star key={i} className='w-4 h-4 fill-current' />
                        ))}
                    </div>
                </div>
                <span className='block mt-3 text-neutral-6000 dark:text-neutral-300'>
                    {data.comment}
                </span>
            </div>
        </div>
    );
};

export default CommentListing;
