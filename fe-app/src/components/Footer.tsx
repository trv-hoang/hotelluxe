import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <div className='mt-16 flex flex-col items-center gap-8 md:gap-0 md:flex-row md:items-start bg-gray-800 p-8 rounded-lg md:justify-between'>
            {/* Logo + Text */}
            <div className='flex flex-col items-center md:items-start text-white gap-4'>
                <Link to='/' className='flex items-center mb-4'>
                    <img
                        src='/src/assets/logo.png'
                        alt='logo'
                        className='w-8 h-8 md:w-10 md:h-10 bg-white rounded-xl object-cover'
                    />
                    <p className='hidden md:block text-md font-medium tracking-wider text-white ml-2'>
                        Luxe.
                    </p>
                </Link>
                <p className='text-sm text-gray-400'>
                    &copy; 2025 The Luxe Booking
                </p>
            </div>

            {/* Links column 1 */}
            <div className='flex flex-col gap-4 text-sm text-gray-400 items-center md:items-start'>
                <p className='text-sm text-amber-50'>Links</p>
                <Link to='/'>Homepage</Link>
                <Link to='/contact'>Contact</Link>
                <Link to='/terms'>Terms of Service</Link>
                <Link to='/privacy'>Privacy Policy</Link>
            </div>

            {/* Links column 2 */}
            <div className='flex flex-col gap-4 text-sm text-gray-400 items-center md:items-start'>
                <p className='text-sm text-amber-50'>Stays</p>
                <Link to='/stay'>All Stays</Link>
                <Link to='/stay'>New Stays</Link>
                <Link to='/stay'>Trend Stays</Link>
                <Link to='/stay'>Popular Stays</Link>
            </div>

            {/* Links column 3 */}
            <div className='flex flex-col gap-4 text-sm text-gray-400 items-center md:items-start'>
                <p className='text-sm text-amber-50'>Info</p>
                <Link to='/'>About</Link>
                <Link to='/'>Contact</Link>
                <Link to='/'>Blog</Link>
                <Link to='/'>Hosts</Link>
            </div>
        </div>
    );
};

export default Footer;
