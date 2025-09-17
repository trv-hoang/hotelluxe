import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Undo2 } from 'lucide-react';
import StayCard from '@/components/StayCard';
// import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/store/useCartStore';
import { Link, useSearchParams } from 'react-router-dom';
import PaymentForm from '@/components/PaymentForm';
import BookingForm from '@/components/BookingForm';
import type { BookingFormInputs } from '@/types/cart';
import { formatPrice } from '@/lib/utils';

const steps = [
    { id: 1, title: 'Đặt phòng' },
    { id: 2, title: 'Thông tin khách hàng' },
    { id: 3, title: 'Phương thức thanh toán' },
];

const CartPage: React.FC = () => {
    const { items, removeItem } = useCartStore();
    const totalGuests = items.reduce((sum, item) => sum + item.totalGuests, 0);
    const totalAmount = items.reduce(
        (sum, item) => sum + item.price * item.nights,
        0,
    );
    // console.log('Cart items:', items);
    // const reviewImage =
    //     items.length > 0 ? items[0].galleryImgs[0] : '/avatar.png';
    const [searchParams] = useSearchParams();
    const activeStep = parseInt(searchParams.get('step') || '1');
    const [bookingForm, setBookingForm] =
        React.useState<BookingFormInputs | null>(null);
    return (
        <div className='flex flex-col gap-8 items-center justify-center py-20 max-w-5xl mx-auto '>
            <h1 className='text-2xl font-semibold'>
                Khách sạn đang thanh toán
            </h1>

            {/* Steps */}
            <div className='flex flex-col lg:flex-row items-center gap-8 lg:gap-16'>
                {steps.map((step) => (
                    <div
                        key={step.id}
                        className={`flex items-center gap-2 border-b-2 pb-4 ${
                            activeStep === step.id
                                ? 'border-gray-800'
                                : 'border-gray-200'
                        }`}
                    >
                        <div
                            className={`w-6 h-6 rounded-full text-white p-4 flex items-center justify-center ${
                                activeStep === step.id
                                    ? 'bg-gray-800'
                                    : 'bg-gray-400'
                            }`}
                        >
                            {step.id}
                        </div>
                        <p
                            className={`text-sm font-medium ${
                                activeStep === step.id
                                    ? 'text-gray-800'
                                    : 'text-gray-400'
                            }`}
                        >
                            {step.title}
                        </p>
                    </div>
                ))}
            </div>

            {/* Main content */}
            <div className='w-full flex flex-col lg:flex-row gap-8 lg:gap-16 '>
                <div className='w-full lg:w-7/12 shadow-lg border border-gray-100 p-5 rounded-xl flex flex-col gap-8'>
                    {items.length === 0 ? (
                        <p className='text-neutral-500 flex items-center gap-2 justify-between'>
                            Bạn chưa đặt phòng. Hãy đặt phòng để tiếp tục!{' '}
                            <Link
                                to='/stay'
                                className='hover:bg-red-100 p-2 rounded-md flex items-center gap-2 transition duration-300 '
                            >
                                {' '}
                                <Undo2 className='text-red-500 ' />
                            </Link>
                        </p>
                    ) : (
                        <div className=''>
                            {activeStep === 1 ? (
                                items.map((item) => (
                                    <div
                                        key={item.id}
                                        className='flex justify-between p-4 border rounded-xl shadow-sm mb-4  '
                                    >
                                        <StayCard data={item} size='default' />
                                        <Button
                                            variant='ghost'
                                            className='text-red-500 hover:text-red-700 '
                                            onClick={() => removeItem(item.id)}
                                        >
                                            <Trash2 />
                                        </Button>
                                    </div>
                                ))
                            ) : activeStep === 2 ? (
                                <BookingForm setBookingForm={setBookingForm} />
                            ) : activeStep === 3 && bookingForm ? (
                                <PaymentForm />
                            ) : (
                                <p className='text-red-500'>
                                    Vui lòng hoàn thành thông tin địa chỉ giao
                                    hàng trước khi thanh toán.
                                </p>
                            )}
                        </div>
                    )}
                </div>
                <div className='w-full lg:w-5/12 border shadow-lg border-gray-100 p-5 rounded-xl flex flex-col gap-8'>
                    <div className='space-y-6 col-span-2 sticky top-28 '>
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className='overflow-hidden space-y-4'
                            >
                                <div className='w-full h-40 overflow-hidden rounded-lg'>
                                    <img
                                        src={
                                            item.galleryImgs[0] ?? '/avatar.png'
                                        }
                                        alt={item.title}
                                        className='w-full h-full object-cover'
                                    />
                                </div>

                                <h2 className='text-2xl font-semibold'>
                                    {item.title}
                                </h2>

                                <Separator />

                                <div className='space-y-3 pb-4 shadow-lg w-full'>
                                    <div className='flex justify-between text-neutral-600 dark:text-neutral-300'>
                                        <span>Số đêm x {item.nights}</span>
                                        <span>
                                            {formatPrice(item.price)}đ x{' '}
                                            {item.nights}
                                        </span>
                                    </div>

                                    <div className='flex justify-between text-neutral-600 dark:text-neutral-300'>
                                        <span>Phí dịch vụ</span>
                                        <span>0đ</span>
                                    </div>

                                    <Separator />
                                </div>
                            </div>
                        ))}
                        {activeStep === 1 && (
                            <>
                                <div className='flex justify-between font-semibold !-mt-1'>
                                    <span>Tổng cộng</span>
                                    <span>{formatPrice(totalAmount)}đ</span>
                                </div>

                                <div className='text-sm text-neutral-500 pb-4 border-b border-gray-300 rounded-b-2xl'>
                                    Tổng khách: <b>{totalGuests}</b>
                                </div>
                                <Button className='w-full' asChild>
                                    <Link to={`/cart?step=${activeStep + 1}`}>
                                        Tiếp tục thanh toán
                                    </Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
