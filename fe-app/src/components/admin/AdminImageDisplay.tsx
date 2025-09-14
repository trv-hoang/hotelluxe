import React from 'react';

interface AdminImageDisplayProps {
    src: string;
    alt: string;
    fallbackSrc?: string;
    className?: string;
    size?: 'small' | 'medium' | 'large';
    aspectRatio?: string;
    style?: React.CSSProperties;
}

const AdminImageDisplay: React.FC<AdminImageDisplayProps> = ({
    src,
    alt,
    fallbackSrc = '/src/assets/travels/default.jpg',
    className = '',
    size = 'medium',
    aspectRatio = '4/3',
    style = {}
}) => {
    const getSizeStyles = () => {
        switch (size) {
            case 'small':
                return {
                    height: '32px',
                    width: '48px',
                    minHeight: '32px',
                    minWidth: '48px'
                };
            case 'large':
                return {
                    height: '64px',
                    width: '96px',
                    minHeight: '64px',
                    minWidth: '96px'
                };
            case 'medium':
            default:
                return {
                    height: '48px',
                    width: '64px',
                    minHeight: '48px',
                    minWidth: '64px'
                };
        }
    };

    const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const target = e.target as HTMLImageElement;
        if (target.src !== fallbackSrc) {
            target.src = fallbackSrc;
        }
    };

    return (
        <div 
            className={`flex-shrink-0 ${className}`}
            style={{ ...getSizeStyles() }}
        >
            <img
                className="w-full h-full rounded-lg object-cover border border-gray-200"
                src={src}
                alt={alt}
                style={{
                    aspectRatio,
                    ...getSizeStyles(),
                    ...style
                }}
                onError={handleError}
                loading="lazy"
            />
        </div>
    );
};

export default AdminImageDisplay;
