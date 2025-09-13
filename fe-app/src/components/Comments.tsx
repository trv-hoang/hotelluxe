// CommentList.tsx
import AvatarCus from '@/shared/AvartarCus';
import { Star } from 'lucide-react';
import { DEMO_AUTHORS } from '@/data/authors'; // đường dẫn tới file export DEMO_AUTHORS

interface CommentListingDataType {
    name: string;
    avatar?: string;
    date: string;
    comment: string;
    starPoint: number;
}

export interface CommentListingProps {
    className?: string;
    data: CommentListingDataType;
    hasListingTitle?: boolean;
}

const CommentListing = ({
    className = '',
    data,
    hasListingTitle,
}: CommentListingProps) => {
    return (
        <div className={`cus-CommentListing flex space-x-4 ${className}`}>
            <div className='pt-0.5'>
                <AvatarCus
                    sizeClass='h-10 w-10 text-lg'
                    radius='rounded-full'
                    userName={data.name}
                    imgUrl={data.avatar} // 👈 truyền avatar từ data
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
                                        {` đánh giá trong `}
                                    </span>
                                    <a href='/'>Phòng chờ</a>
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

// 🔹 Gán avatar từ DEMO_AUTHORS cho 4 comment
const DEMO_COMMENTS: CommentListingDataType[] = [
    {
        name: 'Nguyễn Văn A',
        avatar: DEMO_AUTHORS[0].avatar, // 👈 lấy ảnh từ authors
        date: 'May 20, 2021',
        comment:
            'Vị trí tuyệt vời và nhân viên rất thân thiện. Giường rất thoải mái và phòng rất sạch sẽ. Tôi chắc chắn sẽ quay lại đây.',
        starPoint: 5,
    },
    {
        name: 'Trần Thị B',
        avatar: DEMO_AUTHORS[1].avatar,
        date: 'June 10, 2021',
        comment:
            'Khách sạn nằm ngay trung tâm, tiện đi lại. Tuy nhiên phòng hơi nhỏ hơn so với hình ảnh.',
        starPoint: 4,
    },
    {
        name: 'Lê Văn C',
        avatar: DEMO_AUTHORS[2].avatar,
        date: 'July 5, 2021',
        comment:
            'Giá cả hợp lý, dịch vụ ổn. Mình đi công tác ở đây khá thoải mái. Nhân viên lễ tân hỗ trợ nhanh.',
        starPoint: 4,
    },
    {
        name: 'Phạm Thị D',
        avatar: DEMO_AUTHORS[3].avatar,
        date: 'August 15, 2021',
        comment:
            'View đẹp, bữa sáng ngon miệng. Chỉ có điều wifi hơi chập chờn vào buổi tối.',
        starPoint: 3,
    },
];

const CommentList = () => {
    return (
        <div className='space-y-6'>
            {DEMO_COMMENTS.map((item, idx) => (
                <CommentListing key={idx} data={item} />
            ))}
        </div>
    );
};

export default CommentList;
