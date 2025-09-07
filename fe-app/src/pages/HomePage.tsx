import bg from '@/assets/bg.jpg';

export default function HomePage() {
    return (
        <div className='container mb-24 md:px-0 2xl:px-10 relative overflow-hidden'>
            <div className='relative'>
                {/* Background image */}
                <div className='aspect-[16/9] relative w-full'>
                    <img
                        src={bg}
                        alt='hero'
                        className='rounded-xl object-cover object-center w-full h-full'
                    />
                </div>

                {/* Overlay content */}
                <div className='absolute inset-x-0 top-[15%] mx-auto flex max-w-2xl flex-col items-center text-center'>
                    <div className='flex flex-col gap-y-5 xl:gap-y-8'>
                        <span className='font-semibold text-neutral-900 sm:text-lg md:text-xl'>
                            Trải nghiệm kỳ nghỉ tuyệt vời cùng Luxe
                        </span>
                        <h2 className='text-4xl leading-[1.15] font-bold text-black md:text-5xl lg:text-6xl xl:text-7xl'>
                            Vi vu mê say
                            <br />
                            Chạm là đặt ngay
                        </h2>
                    </div>

                    <button
                        type='button'
                        className='mt-10 sm:mt-20 sm:text-lg relative inline-flex items-center justify-center px-6 py-3 font-medium rounded-full bg-black text-white hover:bg-gray-800'
                    >
                        Bắt đầu khám phá
                    </button>
                </div>
            </div>
        </div>
    );
}
