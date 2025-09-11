import { useState } from 'react';
import { Heart } from 'lucide-react'; // 👈 Import icon Heart

export interface BtnLikeIconProps {
    className?: string;
    colorClass?: string;
    isLiked?: boolean;
}

function BtnLikeIcon({
    className = '',
    colorClass = 'text-white bg-black bg-opacity-30 hover:bg-opacity-50',
    isLiked = false,
}: BtnLikeIconProps) {
    const [likedState, setLikedState] = useState(isLiked);

    return (
        <div
            className={`nc-BtnLikeIcon w-8 h-8 flex items-center justify-center rounded-full cursor-pointer ${
                likedState ? 'nc-BtnLikeIcon--liked' : ''
            } ${colorClass} ${className}`}
            data-nc-id='BtnLikeIcon'
            title='Save'
            onClick={() => setLikedState(!likedState)}
        >
            <Heart
                className='h-5 w-5'
                fill={likedState ? 'red' : 'none'}
                color={likedState ? 'red' : 'currentColor'}
                strokeWidth={1.5}
            />
        </div>
    );
}

export default BtnLikeIcon;