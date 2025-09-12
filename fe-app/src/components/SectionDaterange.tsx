import * as React from 'react';
import { Calendar } from '@/components/ui/calendar';
import type { DateRange } from 'react-day-picker';

const SectionDateRange = () => {
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: new Date('2023-02-06'),
        to: new Date('2023-02-23'),
    });

    return (
        <div className='listingSection__wrap overflow-hidden'>
            {/* HEADING */}
            <div>
                <h2 className='text-2xl font-semibold'>Tình trạng phòng</h2>
                <span className='block mt-2 text-neutral-500 dark:text-neutral-400'>
                    Giá có thể tăng vào cuối tuần hoặc ngày lễ
                </span>
            </div>
            <div className='w-14 border-b border-neutral-200 dark:border-neutral-700'></div>

            {/* CONTENT */}
            <div className='mt-4'>
                <Calendar
                    mode='range'
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                    captionLayout='dropdown'
                    startMonth={new Date(2025, 0)}
                    endMonth={new Date(2030, 11)}
                    className='rounded-md border shadow-sm'
                />
            </div>
        </div>
    );
};

export default SectionDateRange;
