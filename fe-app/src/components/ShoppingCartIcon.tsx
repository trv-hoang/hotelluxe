import { Plane } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ShoppingCartIcon() {
    return (
        <Link to='/cart' className='relative inline-block'>
            {/* Icon */}
            <div className='hover:bg-accent rounded-md p-2 transition-colors'>
                <Plane className='h-5 w-5' />
            </div>
        </Link>
    );
}
