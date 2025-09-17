import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className='flex flex-col items-center justify-center h-screen text-center'>
            <h1 className='text-6xl font-bold text-red-600'>404</h1>
            <h2 className='text-2xl font-semibold mt-4'>Trang không tồn tại</h2>
            <p className='text-gray-500 mt-2'>
                Có vẻ bạn đã nhập sai đường dẫn hoặc trang này đã bị xóa.
            </p>
            <button
                onClick={() => navigate('/')}
                className='mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition'
            >
                Quay về trang chủ
            </button>
        </div>
    );
};

export default ErrorPage;
