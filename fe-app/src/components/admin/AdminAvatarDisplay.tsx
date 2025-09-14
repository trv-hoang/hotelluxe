import React from 'react';
import { User } from 'lucide-react';

interface AdminAvatarDisplayProps {
    src?: string;
    alt: string;
    fallbackSrc?: string;
    size?: 'small' | 'medium' | 'large';
    shape?: 'circle' | 'square';
    showFallbackIcon?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

const AdminAvatarDisplay: React.FC<AdminAvatarDisplayProps> = ({
    src,
    alt,
    fallbackSrc = '/avatar.png',
    size = 'medium',
    shape = 'circle',
    showFallbackIcon = true,
    className = '',
    style = {}
}) => {
    const getSizeStyles = () => {
        switch (size) {
            case 'small':
                return {
                    height: '32px',
                    width: '32px',
                    minHeight: '32px',
                    minWidth: '32px'
                };
            case 'large':
                return {
                    height: '64px',
                    width: '64px',
                    minHeight: '64px',
                    minWidth: '64px'
                };
            case 'medium':
            default:
                return {
                    height: '40px',
                    width: '40px',
                    minHeight: '40px',
                    minWidth: '40px'
                };
        }
    };

    const getShapeClass = () => {
        return shape === 'circle' ? 'rounded-full' : 'rounded-lg';
    };

    const [imageError, setImageError] = React.useState(false);
    const [fallbackError, setFallbackError] = React.useState(false);

    const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const target = e.target as HTMLImageElement;
        
        if (!imageError && target.src !== fallbackSrc) {
            // First error - try fallback
            setImageError(true);
            target.src = fallbackSrc;
        } else if (!fallbackError) {
            // Fallback also failed
            setFallbackError(true);
        }
    };

    const shouldShowIcon = (!src || imageError) && fallbackError && showFallbackIcon;

    if (shouldShowIcon) {
        return (
            <div 
                className={`flex-shrink-0 flex items-center justify-center bg-gray-200 border ${getShapeClass()} ${className}`}
                style={{ ...getSizeStyles(), ...style }}
            >
                <User 
                    size={size === 'small' ? 16 : size === 'large' ? 32 : 20} 
                    style={{ color: 'var(--admin-text-secondary)' }} 
                />
            </div>
        );
    }

    return (
        <div 
            className={`flex-shrink-0 ${className}`}
            style={{ ...getSizeStyles() }}
        >
            <img
                className={`w-full h-full ${getShapeClass()} object-cover border border-gray-200`}
                src={src || fallbackSrc}
                alt={alt}
                style={{ ...getSizeStyles(), ...style }}
                onError={handleError}
                loading="lazy"
            />
        </div>
    );
};

export default AdminAvatarDisplay;
