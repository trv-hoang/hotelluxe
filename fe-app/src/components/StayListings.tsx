import StayCard from '@/components/StayCard';
import { DEMO_STAY_LISTINGS } from '@/data/listings';
import { Flame } from 'lucide-react';

export default function StayListing() {
    return (
        <div className='space-y-6 px-12 sm:space-y-8'>
            <div>
                <h2 className='text-3xl font-semibold'>
                    Nổi bậc <Flame className='inline-block text-red-500' />
                </h2>
            </div>
            {/* <div className='w-14 border-b border-neutral-200 dark:border-neutral-700'></div> */}

            <div className='grid grid-cols-1 gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {DEMO_STAY_LISTINGS.map((stay) => (
                    <StayCard key={stay.id} data={stay} />
                ))}
            </div>

            {/* <div className="flex mt-11 justify-center items-center">
        <ButtonSecondary>Show me more</ButtonSecondary>
      </div> */}
        </div>
    );
}
