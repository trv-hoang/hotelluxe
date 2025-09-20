import React, { useState, useEffect } from 'react';
import { Eye, Calendar, RefreshCw, Bug } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { bookingApi } from '@/api/booking';

interface UserBooking {
    id: number;
    booking_number: string;
    hotel_id: number;
    check_in_date: string;
    check_out_date: string;
    nights: number;
    status: string;
    total_amount: number;
    price_per_night: number;
    created_at: string;
    updated_at: string;
    hotel: {
        id: number;
        title: string;
        slug: string;
        featured_image: string;
        address: string;
        price_per_night: number;
    };
    payments?: Array<{
        id: number;
        status: string;
        amount: number;
        created_at: string;
    }>;
}

const PaymentStatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const getBadgeColor = (status: string) => {
        switch (status) {
            case 'completed':
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            case 'cancelled':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'completed':
            case 'paid':
                return 'Đã thanh toán';
            case 'pending':
                return 'Chờ thanh toán';
            case 'failed':
                return 'Thất bại';
            case 'cancelled':
                return 'Đã hủy';
            default:
                return status;
        }
    };

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(
                status,
            )}`}
        >
            {getStatusText(status)}
        </span>
    );
};

// const BookingStatusBadge: React.FC<{ status: string }> = ({ status }) => {
//     const getBadgeColor = (status: string) => {
//         switch (status) {
//             case 'confirmed':
//                 return 'bg-green-100 text-green-800';
//             case 'pending':
//                 return 'bg-yellow-100 text-yellow-800';
//             case 'cancelled':
//                 return 'bg-red-100 text-red-800';
//             case 'checked_in':
//                 return 'bg-blue-100 text-blue-800';
//             case 'checked_out':
//                 return 'bg-gray-100 text-gray-800';
//             default:
//                 return 'bg-gray-100 text-gray-800';
//         }
//     };

//     const getStatusText = (status: string) => {
//         switch (status) {
//             case 'confirmed':
//                 return 'Đã xác nhận';
//             case 'pending':
//                 return 'Chờ xác nhận';
//             case 'cancelled':
//                 return 'Đã hủy';
//             case 'checked_in':
//                 return 'Đã check-in';
//             case 'checked_out':
//                 return 'Đã check-out';
//             default:
//                 return status;
//         }
//     };

//     return (
//         <span
//             className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(
//                 status,
//             )}`}
//         >
//             {getStatusText(status)}
//         </span>
//     );
// };

const MyBooking: React.FC = () => {
    const navigate = useNavigate();
    const { authUser } = useAuthStore();
    const [bookings, setBookings] = useState<UserBooking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const getPaymentStatus = (booking: UserBooking) => {
        if (booking.payments && booking.payments.length > 0) {
            const latestPayment = booking.payments.sort(
                (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime(),
            )[0];
            return latestPayment.status === 'completed'
                ? 'paid'
                : latestPayment.status === 'failed'
                ? 'failed'
                : 'pending';
        }
        return 'pending';
    };

    useEffect(() => {
        const loadBookings = async () => {
            if (!authUser) {
                setError('Vui lòng đăng nhập để xem lịch sử đặt phòng');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                console.log('Loading bookings for user:', authUser.id);

                const response = await bookingApi.getUserBookings({
                    per_page: 50,
                    sort_by: 'created_at',
                    sort_order: 'desc',
                });

                console.log('Bookings API response:', response);
                console.log('Response data structure:', {
                    hasSuccess: 'success' in response,
                    success: response.success,
                    hasData: 'data' in response,
                    dataType: typeof response.data,
                    dataStructure: response.data
                        ? Object.keys(response.data)
                        : null,
                    isDataArray: Array.isArray(response.data),
                    hasDataProperty: response.data && 'data' in response.data,
                    paginationData:
                        response.data && 'data' in response.data
                            ? response.data.data
                            : null,
                    currentPage:
                        response.data && 'current_page' in response.data
                            ? response.data.current_page
                            : null,
                    total:
                        response.data && 'total' in response.data
                            ? response.data.total
                            : null,
                    actualData: response.data,
                });

                // More detailed logging
                console.log('=== DETAILED RESPONSE ANALYSIS ===');
                console.log(
                    'Full response object:',
                    JSON.stringify(response, null, 2),
                );
                console.log('response.success:', response.success);
                console.log('response.data:', response.data);
                console.log('response.data type:', typeof response.data);
                console.log(
                    'response.data is array:',
                    Array.isArray(response.data),
                );

                if (response.data && typeof response.data === 'object') {
                    console.log(
                        'response.data keys:',
                        Object.keys(response.data),
                    );
                    console.log('response.data.data:', response.data.data);
                    console.log('response.data.total:', response.data.total);

                    if (response.data.data) {
                        console.log(
                            'response.data.data type:',
                            typeof response.data.data,
                        );
                        console.log(
                            'response.data.data is array:',
                            Array.isArray(response.data.data),
                        );
                        console.log(
                            'response.data.data length:',
                            Array.isArray(response.data.data)
                                ? response.data.data.length
                                : 'Not array',
                        );
                        if (
                            Array.isArray(response.data.data) &&
                            response.data.data.length > 0
                        ) {
                            console.log(
                                'First booking sample:',
                                response.data.data[0],
                            );
                        }
                    }
                }
                console.log('=== END DETAILED ANALYSIS ===');

                console.log('🚨 CRITICAL DEBUG - Response Analysis:');
                console.log('🚨 response:', response);
                console.log('🚨 response.success:', response.success);
                console.log('🚨 response.data:', response.data);
                console.log('🚨 response.data type:', typeof response.data);
                console.log(
                    '🚨 response.data keys:',
                    response.data ? Object.keys(response.data) : 'null',
                );

                if (response.data) {
                    console.log('🚨 response.data.data:', response.data.data);
                    console.log(
                        '🚨 response.data.data type:',
                        typeof response.data.data,
                    );
                    console.log(
                        '🚨 response.data.data is array:',
                        Array.isArray(response.data.data),
                    );
                    if (Array.isArray(response.data.data)) {
                        console.log(
                            '🚨 response.data.data length:',
                            response.data.data.length,
                        );
                        console.log(
                            '🚨 response.data.data[0]:',
                            response.data.data[0],
                        );
                    }
                }

                if (response.success && response.data) {
                    // Handle different response structures
                    let bookingData;

                    if (Array.isArray(response.data)) {
                        // Direct array (like debug mode)
                        bookingData = response.data;
                        console.log(
                            '📊 Using direct array:',
                            bookingData.length,
                            'items',
                        );
                    } else if (
                        response.data.data &&
                        Array.isArray(response.data.data)
                    ) {
                        // Paginated structure
                        bookingData = response.data.data;
                        console.log(
                            '📊 Using paginated data:',
                            bookingData.length,
                            'items',
                        );
                    } else {
                        // Fallback
                        bookingData = [];
                        console.log(
                            '📊 No valid data structure found, using empty array',
                        );
                    }

                    console.log('📊 Final booking data:', {
                        type: typeof bookingData,
                        isArray: Array.isArray(bookingData),
                        length: Array.isArray(bookingData)
                            ? bookingData.length
                            : 'Not array',
                        firstItem:
                            Array.isArray(bookingData) && bookingData.length > 0
                                ? bookingData[0]
                                : null,
                    });

                    setBookings(bookingData);
                    setLastRefreshed(new Date());
                    console.log(
                        '📊 Bookings state updated with',
                        bookingData.length,
                        'items',
                    );
                } else {
                    throw new Error('Invalid API response');
                }
            } catch (err: unknown) {
                console.error('Failed to load bookings:', err);
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Không thể tải lịch sử đặt phòng',
                );
            } finally {
                setLoading(false);
            }
        };

        loadBookings();
    }, [authUser]);

    const handleViewHotel = (hotelId: number) => {
        navigate(`/hotels/${hotelId}`);
    };

    const handleDebug = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }

            console.log('=== DEBUG API CALL ===');
            console.log('Token:', token);
            console.log('User:', authUser);

            const response = await fetch(
                'http://localhost:8000/api/debug/bookings',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                },
            );

            const data = await response.json();
            console.log('Debug API response:', data);
            console.log('Response status:', response.status);
            console.log('=== END DEBUG ===');
        } catch (err) {
            console.error('Debug API error:', err);
        }
    };

    const handleRefresh = async () => {
        if (!authUser) return;

        try {
            setLoading(true);
            setError(null);

            const response = await bookingApi.getUserBookings({
                per_page: 50,
                sort_by: 'created_at',
                sort_order: 'desc',
            });

            console.log('🔄 REFRESH CRITICAL DEBUG:');
            console.log('🔄 response:', response);
            console.log('🔄 response.success:', response.success);
            console.log('🔄 response.data:', response.data);
            console.log('🔄 response.data type:', typeof response.data);
            console.log(
                '🔄 response.data keys:',
                response.data ? Object.keys(response.data) : 'null',
            );

            if (response.data) {
                console.log('🔄 response.data.data:', response.data.data);
                console.log(
                    '🔄 response.data.data type:',
                    typeof response.data.data,
                );
                console.log(
                    '🔄 response.data.data is array:',
                    Array.isArray(response.data.data),
                );
                if (Array.isArray(response.data.data)) {
                    console.log(
                        '🔄 response.data.data length:',
                        response.data.data.length,
                    );
                    console.log(
                        '🔄 response.data.data[0]:',
                        response.data.data[0],
                    );
                }
            }

            if (response.success && response.data) {
                // Handle different response structures (same logic as useEffect)
                let bookingData;

                if (Array.isArray(response.data)) {
                    // Direct array (like debug mode)
                    bookingData = response.data;
                    console.log(
                        '🔄 Refresh: Using direct array:',
                        bookingData.length,
                        'items',
                    );
                } else if (
                    response.data.data &&
                    Array.isArray(response.data.data)
                ) {
                    // Paginated structure
                    bookingData = response.data.data;
                    console.log(
                        '🔄 Refresh: Using paginated data:',
                        bookingData.length,
                        'items',
                    );
                } else {
                    // Fallback
                    bookingData = [];
                    console.log(
                        '🔄 Refresh: No valid data structure found, using empty array',
                    );
                }

                setBookings(bookingData);
                setLastRefreshed(new Date());
                console.log(
                    '🔄 Refresh: Bookings state updated with',
                    bookingData.length,
                    'items',
                );
            } else {
                throw new Error('Invalid API response');
            }
        } catch (err: unknown) {
            console.error('Failed to refresh bookings:', err);
            setError(
                err instanceof Error
                    ? err.message
                    : 'Không thể tải lại lịch sử đặt phòng',
            );
        } finally {
            setLoading(false);
        }
    };

    if (!authUser) {
        return (
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                <div className='text-center'>
                    <h1 className='text-2xl font-bold text-gray-900 mb-4'>
                        Lịch sử đặt phòng
                    </h1>
                    <p className='text-gray-600'>
                        Vui lòng đăng nhập để xem lịch sử đặt phòng của bạn.
                    </p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                <div className='animate-pulse'>
                    <div className='h-8 bg-gray-200 rounded w-1/4 mb-6'></div>
                    <div className='space-y-3'>
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className='h-16 bg-gray-200 rounded'
                            ></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                <div className='text-center'>
                    <h1 className='text-2xl font-bold text-gray-900 mb-4'>
                        Lịch sử đặt phòng
                    </h1>
                    <p className='text-red-600 mb-4'>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors'
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <div className='mb-8 flex justify-between items-center'>
                <div>
                    <h1 className='text-3xl font-bold text-gray-900'>
                        Lịch sử đặt phòng
                    </h1>
                    <p className='text-gray-600 mt-2'>
                        Quản lý và theo dõi tất cả các đặt phòng của bạn
                        {lastRefreshed && (
                            <span className='text-sm text-gray-400 ml-2'>
                                (Cập nhật lúc:{' '}
                                {lastRefreshed.toLocaleTimeString('vi-VN')})
                            </span>
                        )}
                    </p>
                </div>
                <div className='flex gap-2'>
                    <button
                        onClick={handleDebug}
                        className='bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center gap-2'
                    >
                        <Bug className='w-4 h-4' />
                        Debug API
                    </button>
                    <button
                        onClick={async () => {
                            console.log('=== TESTING getUserBookings ===');
                            console.log('Current authUser:', authUser);
                            console.log(
                                'localStorage token:',
                                localStorage.getItem('token'),
                            );
                            try {
                                const response =
                                    await bookingApi.getUserBookings({
                                        per_page: 50,
                                        sort_by: 'created_at',
                                        sort_order: 'desc',
                                    });
                                console.log(
                                    'getUserBookings response:',
                                    response,
                                );
                                console.log('Response structure:', {
                                    success: response.success,
                                    hasData: !!response.data,
                                    dataKeys: response.data
                                        ? Object.keys(response.data)
                                        : null,
                                    isDataArray: Array.isArray(response.data),
                                    hasDataProperty:
                                        response.data &&
                                        'data' in response.data,
                                    paginationKeys:
                                        response.data && 'data' in response.data
                                            ? Object.keys(response.data)
                                            : null,
                                    actualBookings:
                                        response.data && 'data' in response.data
                                            ? response.data.data
                                            : response.data,
                                });
                            } catch (err) {
                                console.error('getUserBookings error:', err);
                            }
                        }}
                        className='bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors flex items-center gap-2'
                    >
                        <Bug className='w-4 h-4' />
                        Test API
                    </button>
                    <button
                        onClick={async () => {
                            console.log('=== COMPARING BOTH APIs ===');
                            const token = localStorage.getItem('token');

                            try {
                                // Test debug API
                                const debugResponse = await fetch(
                                    'http://localhost:8000/api/debug/bookings',
                                    {
                                        headers: {
                                            Authorization: `Bearer ${token}`,
                                            Accept: 'application/json',
                                            'Content-Type': 'application/json',
                                        },
                                    },
                                );
                                const debugData = await debugResponse.json();
                                console.log('Debug API data:', debugData);

                                // Test getUserBookings API
                                const userBookingsResponse =
                                    await bookingApi.getUserBookings({
                                        per_page: 50,
                                        sort_by: 'created_at',
                                        sort_order: 'desc',
                                    });
                                console.log(
                                    'UserBookings API data:',
                                    userBookingsResponse,
                                );

                                // Compare
                                console.log('COMPARISON:');
                                console.log(
                                    'Debug bookings count:',
                                    debugData.total_bookings,
                                );
                                console.log(
                                    'UserBookings success:',
                                    userBookingsResponse.success,
                                );
                                console.log(
                                    'UserBookings has data:',
                                    !!userBookingsResponse.data,
                                );
                                console.log(
                                    'UserBookings data type:',
                                    typeof userBookingsResponse.data,
                                );
                                console.log(
                                    'UserBookings data keys:',
                                    userBookingsResponse.data
                                        ? Object.keys(userBookingsResponse.data)
                                        : null,
                                );
                            } catch (err) {
                                console.error('Comparison error:', err);
                            }
                        }}
                        className='bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center gap-2'
                    >
                        <Bug className='w-4 h-4' />
                        Compare
                    </button>
                    <button
                        onClick={async () => {
                            console.log('=== DIRECT USER COMPARISON ===');
                            const token = localStorage.getItem('token');

                            try {
                                // 1. Test debug endpoint for user info
                                const debugResponse = await fetch(
                                    'http://localhost:8000/api/debug/bookings',
                                    {
                                        headers: {
                                            Authorization: `Bearer ${token}`,
                                            Accept: 'application/json',
                                        },
                                    },
                                );
                                const debugData = await debugResponse.json();
                                console.log('🟢 Debug endpoint user:', {
                                    user_id: debugData.user_id,
                                    user_name: debugData.user_name,
                                    bookings_count: debugData.total_bookings,
                                });

                                // 2. Test getUserBookings for user info with debug param
                                const userBookingsResponse = await fetch(
                                    'http://localhost:8000/api/bookings?debug=true',
                                    {
                                        headers: {
                                            Authorization: `Bearer ${token}`,
                                            Accept: 'application/json',
                                        },
                                    },
                                );
                                const userBookingsData =
                                    await userBookingsResponse.json();
                                console.log('🔴 BookingController user:', {
                                    success: userBookingsData.success,
                                    total: userBookingsData.total,
                                    user_debug: userBookingsData.user_debug,
                                    bookings_count: userBookingsData.data
                                        ? userBookingsData.data.length
                                        : 0,
                                });

                                // 3. Compare both
                                console.log('🔍 COMPARISON:');
                                console.log(
                                    'Debug user ID:',
                                    debugData.user_id,
                                );
                                console.log(
                                    'BookingController user ID:',
                                    userBookingsData.user_debug?.user_id,
                                );
                                console.log(
                                    'Same user?',
                                    debugData.user_id ===
                                        userBookingsData.user_debug?.user_id,
                                );
                                console.log(
                                    'Debug bookings:',
                                    debugData.total_bookings,
                                );
                                console.log(
                                    'BookingController bookings:',
                                    userBookingsData.total,
                                );

                                // 4. Try to force set bookings from debug data
                                if (
                                    debugData.bookings &&
                                    Array.isArray(debugData.bookings)
                                ) {
                                    console.log(
                                        '🔧 FORCING SET BOOKINGS from debug data',
                                    );
                                    console.log(
                                        '🔧 Debug bookings array:',
                                        debugData.bookings,
                                    );
                                    setBookings(debugData.bookings);
                                    setLastRefreshed(new Date());
                                }
                            } catch (err) {
                                console.error('Direct comparison error:', err);
                            }
                        }}
                        className='bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2'
                    >
                        <Bug className='w-4 h-4' />
                        Direct Compare
                    </button>
                    <button
                        onClick={async () => {
                            console.log('=== FORCE LOAD FROM DEBUG ===');
                            try {
                                const token = localStorage.getItem('token');
                                const debugResponse = await fetch(
                                    'http://localhost:8000/api/debug/bookings',
                                    {
                                        headers: {
                                            Authorization: `Bearer ${token}`,
                                            Accept: 'application/json',
                                        },
                                    },
                                );
                                const debugData = await debugResponse.json();
                                console.log('🔧 Debug response:', debugData);

                                if (
                                    debugData.bookings &&
                                    Array.isArray(debugData.bookings)
                                ) {
                                    console.log(
                                        '🔧 Setting bookings from debug data:',
                                        debugData.bookings,
                                    );
                                    console.log(
                                        '🔧 Bookings count:',
                                        debugData.bookings.length,
                                    );
                                    console.log(
                                        '🔧 First booking:',
                                        debugData.bookings[0],
                                    );
                                    setBookings(debugData.bookings);
                                    setLastRefreshed(new Date());
                                    console.log('🔧 Bookings state updated!');
                                } else {
                                    console.log(
                                        '🔧 No valid bookings in debug response',
                                    );
                                }
                            } catch (err) {
                                console.error('Force load error:', err);
                            }
                        }}
                        className='bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors flex items-center gap-2'
                    >
                        <Bug className='w-4 h-4' />
                        Force Load
                    </button>
                    <button
                        onClick={async () => {
                            console.log('=== TOKEN INVESTIGATION ===');

                            // Check localStorage tokens
                            const token = localStorage.getItem('token');
                            const adminToken =
                                localStorage.getItem('admin-token');

                            console.log('� Regular token:', token);
                            console.log('🔑 Admin token:', adminToken);
                            console.log('🔑 Current authUser:', authUser);

                            // Decode JWT tokens to see user info
                            if (token) {
                                try {
                                    const tokenParts = token.split('.');
                                    const payload = JSON.parse(
                                        atob(tokenParts[1]),
                                    );
                                    console.log(
                                        '🔑 Regular token payload:',
                                        payload,
                                    );
                                } catch (e) {
                                    console.log(
                                        '🔑 Cannot decode regular token:',
                                        e,
                                    );
                                }
                            }

                            if (adminToken) {
                                try {
                                    const tokenParts = adminToken.split('.');
                                    const payload = JSON.parse(
                                        atob(tokenParts[1]),
                                    );
                                    console.log(
                                        '🔑 Admin token payload:',
                                        payload,
                                    );
                                } catch (e) {
                                    console.log(
                                        '🔑 Cannot decode admin token:',
                                        e,
                                    );
                                }
                            }

                            // Test which token is being sent
                            console.log('� Testing API with current setup...');
                            try {
                                const response = await fetch(
                                    'http://localhost:8000/api/bookings',
                                    {
                                        headers: {
                                            Authorization: `Bearer ${token}`,
                                            Accept: 'application/json',
                                        },
                                    },
                                );
                                const data = await response.json();
                                console.log(
                                    '� API response with regular token:',
                                    data,
                                );
                            } catch (err) {
                                console.error('🔑 API test error:', err);
                            }
                        }}
                        className='bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center gap-2'
                    >
                        <Bug className='w-4 h-4' />
                        Token Debug
                    </button>
                    <button
                        onClick={() => {
                            console.log('=== CLEARING ADMIN TOKEN ===');
                            localStorage.removeItem('admin-token');
                            console.log('🧹 Admin token cleared!');
                            console.log('🧹 Remaining tokens:', {
                                regular: localStorage.getItem('token'),
                                admin: localStorage.getItem('admin-token'),
                            });

                            // Reload the page to test
                            window.location.reload();
                        }}
                        className='bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2'
                    >
                        <Bug className='w-4 h-4' />
                        Clear Admin Token
                    </button>
                    <button
                        onClick={handleRefresh}
                        disabled={loading}
                        className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2'
                    >
                        <RefreshCw
                            className={`w-4 h-4 ${
                                loading ? 'animate-spin' : ''
                            }`}
                        />
                        {loading ? 'Đang tải...' : 'Tải lại'}
                    </button>
                </div>
            </div>

            {bookings.length === 0 ? (
                <div className='text-center py-12'>
                    <div className='text-gray-400 mb-4'>
                        <Calendar className='w-16 h-16 mx-auto' />
                    </div>
                    <h3 className='text-lg font-medium text-gray-900 mb-2'>
                        Chưa có đặt phòng nào
                    </h3>
                    <p className='text-gray-600 mb-6'>
                        Bạn chưa có lịch sử đặt phòng nào. Hãy khám phá các
                        khách sạn tuyệt vời của chúng tôi!
                    </p>
                    <div className='text-sm text-gray-500 mb-4'>
                        <p>User ID: {authUser?.id}</p>
                        <p>Email: {authUser?.email}</p>
                        <p>
                            Nếu bạn vừa đặt phòng thành công, hãy thử nhấn nút
                            "Debug API" để kiểm tra.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/hotels')}
                        className='bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors'
                    >
                        Khám phá khách sạn
                    </button>
                </div>
            ) : (
                <div className='bg-white rounded-lg shadow overflow-hidden'>
                    <div className='overflow-x-auto'>
                        <table className='min-w-full divide-y divide-gray-200'>
                            <thead className='bg-gray-50'>
                                <tr>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                        Mã đặt phòng
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                        Khách hàng
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                        Khách sạn
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                        Ngày check-in/out
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                        Số đêm
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                        Trạng thái
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                        Tổng tiền
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='bg-white divide-y divide-gray-200'>
                                {bookings.map((booking) => (
                                    <tr
                                        key={booking.id}
                                        className='hover:bg-gray-50'
                                    >
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <div className='text-sm font-medium text-gray-900'>
                                                {booking.booking_number ||
                                                    `#${booking.id}`}
                                            </div>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <div>
                                                <div className='text-sm font-medium text-gray-900'>
                                                    {authUser?.name || 'N/A'}
                                                </div>
                                                <div className='text-sm text-gray-500'>
                                                    {authUser?.email || 'N/A'}
                                                </div>
                                                {authUser?.phone && (
                                                    <div className='text-sm text-gray-500'>
                                                        {authUser.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <div>
                                                <div className='text-sm font-medium text-gray-900'>
                                                    {booking.hotel?.title ||
                                                        booking.hotel_id ||
                                                        'N/A'}
                                                </div>
                                                {booking.price_per_night && (
                                                    <div className='text-sm text-gray-500'>
                                                        {formatCurrency(
                                                            booking.price_per_night,
                                                        )}
                                                        /đêm
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <div className='flex items-center text-sm'>
                                                <Calendar className='w-4 h-4 mr-1 text-gray-400' />
                                                <div>
                                                    {booking.check_in_date && (
                                                        <div className='text-gray-900'>
                                                            {formatDate(
                                                                booking.check_in_date,
                                                            )}
                                                        </div>
                                                    )}
                                                    {booking.check_out_date && (
                                                        <div className='text-gray-500'>
                                                            {formatDate(
                                                                booking.check_out_date,
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <div className='text-sm text-gray-900'>
                                                {booking.nights || 'N/A'}{' '}
                                                {booking.nights ? 'đêm' : ''}
                                            </div>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <div className='space-y-1'>
                                                {booking.status && (
                                                    <PaymentStatusBadge
                                                        status={getPaymentStatus(
                                                            booking,
                                                        )}
                                                    />
                                                )}
                                            </div>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <div className='text-sm font-medium text-gray-900'>
                                                {booking.total_amount
                                                    ? formatCurrency(
                                                          booking.total_amount,
                                                      )
                                                    : 'Chưa có thông tin'}
                                            </div>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <button
                                                onClick={() =>
                                                    handleViewHotel(
                                                        booking.hotel_id,
                                                    )
                                                }
                                                className='text-blue-600 hover:text-blue-800 transition-colors'
                                                title='Xem chi tiết khách sạn'
                                            >
                                                <Eye className='w-5 h-5' />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyBooking;
