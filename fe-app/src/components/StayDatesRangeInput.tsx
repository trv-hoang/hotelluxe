import * as React from 'react';
import { CalendarIcon } from 'lucide-react';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import type { DateRange } from 'react-day-picker';
import ClearDataButton from './ClearDataButton';
import { cn } from '@/lib/utils';

export interface StayDatesRangeInputProps {
    className?: string;
    fieldClassName?: string;
}

export default function StayDatesRangeInput({
    className = 'lg:flex-[2]',
    fieldClassName = 'px-4 py-2',
}: StayDatesRangeInputProps) {
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: new Date('2023-02-06'),
        to: new Date('2023-02-23'),
    });

    const [open, setOpen] = React.useState(false); // track trạng thái mở Popover

    const renderInput = () => (
        <>
            <div className='text-neutral-300 dark:text-neutral-400'>
                <CalendarIcon className='w-5 h-5 lg:w-7 lg:h-7' />
            </div>
            <div className='flex-grow text-left'>
                <span className='block xl:text-lg font-semibold'>
                    {date?.from
                        ? `${date.from.toLocaleDateString('en-US', {
                              month: 'short',
                              day: '2-digit',
                          })}`
                        : 'Thêm ngày'}
                    {date?.to
                        ? ' - ' +
                          date.to.toLocaleDateString('en-US', {
                              month: 'short',
                              day: '2-digit',
                          })
                        : ''}
                </span>
                <span className='block mt-1 text-sm text-neutral-400 leading-none font-light'>
                    Đặt phòng - Trả phòng
                </span>
            </div>
        </>
    );

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
                className={cn(
                    'flex-1 z-10 flex relative items-center space-x-3 focus:outline-none',
                    fieldClassName,
                    className,
                    open && 'nc-hero-field-focused', // chỉ add class khi mở
                )}
            >
                {renderInput()}
                {date?.from && (
                    <ClearDataButton onClick={() => setDate(undefined)} />
                )}
            </PopoverTrigger>

            <PopoverContent className='w-auto p-0 bg-white dark:bg-neutral-800 rounded-3xl shadow-lg overflow-hidden'>
                <Calendar
                    mode='range'
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                />
            </PopoverContent>
            {open && (
                <div className='h-8 absolute self-center top-1/2 -translate-y-1/2 z-0 -left-0.5 right-0.5 bg-white dark:bg-neutral-800 rounded-full'></div>
            )}
        </Popover>
    );
}
