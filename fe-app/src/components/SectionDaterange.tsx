import * as React from 'react';
import { Calendar } from '@/components/ui/calendar';
import type { DateRange } from 'react-day-picker';

const SectionDateRange = () => {
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: new Date(),
        to: new Date(),
    });

    // Helper format YYYY-MM-DD
    const formatDate = (d: Date) => d.toISOString().split('T')[0];

    // 🟢 Tạo tình trạng khả dụng trong 7 ngày tới (từ hôm nay)
    const generateAvailability = () => {
        const today = new Date();
        const map: Record<string, 'full' | 'nearly' | 'available'> = {};

        for (let i = 0; i < 7; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);

            const dayOfWeek = d.getDay(); // 0=Chủ Nhật, 1=T2, ..., 6=Thứ Bảy

            if (dayOfWeek === 6) {
                // Chủ Nhật và Thứ Bảy → Hết phòng
                map[formatDate(d)] = 'full';
            } else if (dayOfWeek === 4 || dayOfWeek === 5) {
                // Thứ Sáu → Gần hết
                map[formatDate(d)] = 'nearly';
            } else {
                // Thứ Hai đến Thứ Năm → Còn phòng
                map[formatDate(d)] = 'available';
            }
        }

        return map;
    };

    const availability = React.useMemo(() => generateAvailability(), []);

    return (
        <div className='listingSection__wrap overflow-hidden'>
            {/* HEADING */}
            <div>
                <h2 className='text-2xl font-semibold'>
                    Tình trạng phòng 7 ngày tới
                </h2>
                <span className='block mt-2 text-neutral-500 dark:text-neutral-400'>
                    Giá có thể tăng vào cuối tuần hoặc ngày lễ
                </span>
            </div>
            <div className='w-14 border-b border-neutral-200 dark:border-neutral-700'></div>

            {/* CALENDAR */}
            <div className='mt-4'>
                <Calendar
                    mode='range'
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                    fromDate={new Date()}
                    toDate={
                        new Date(new Date().setDate(new Date().getDate() + 6))
                    }
                    className='rounded-md border shadow-sm'
                    weekStartsOn={0} // Tuần bắt đầu từ Chủ Nhật
                    modifiers={{
                        full: (day) => availability[formatDate(day)] === 'full',
                        nearly: (day) =>
                            availability[formatDate(day)] === 'nearly',
                        available: (day) =>
                            availability[formatDate(day)] === 'available',
                    }}
                    modifiersClassNames={{
                        full: 'bg-red-500 text-white hover:bg-red-600',
                        nearly: 'bg-orange-400 text-white hover:bg-orange-500',
                        available: 'bg-green-500 text-white hover:bg-green-600',
                    }}
                />
            </div>

            {/* CHÚ THÍCH DƯỚI LỊCH - ĐÃ FIX RÕ RÀNG */}
            <p className='text-xs text-neutral-500 dark:text-neutral-400 mt-2'>
                Lịch hiển thị theo tuần bắt đầu từ Chủ Nhật (Sun).
            </p>

            {/* LEGEND - ĐÃ CẬP NHẬT LOGIC & NGÔN NGỮ RÕ RÀNG */}
            <div className='flex gap-4 mt-3 text-sm'>
                <div className='flex items-center gap-1'>
                    <span className='w-3 h-3 bg-red-500 rounded'></span> Hết
                    phòng (T7, CN)
                </div>
                <div className='flex items-center gap-1'>
                    <span className='w-3 h-3 bg-orange-400 rounded'></span> Gần
                    hết (T6)
                </div>
                <div className='flex items-center gap-1'>
                    <span className='w-3 h-3 bg-green-500 rounded'></span> Còn
                    phòng (T2–T5)
                </div>
            </div>
        </div>
    );
};

export default SectionDateRange;