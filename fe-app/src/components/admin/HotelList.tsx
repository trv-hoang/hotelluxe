import React from "react";
import authorsData from "../../data/jsons/__authors.json";
// import usersData from "../../data/jsons/__users.json";

// Utility function để format price an toàn
const formatPrice = (price: string | number | undefined): string => {
    if (!price) return '';
    
    if (typeof price === 'number') {
        return price.toLocaleString('vi-VN') + ' VND';
    }
    
    // Nếu là string, xóa các ký tự không phải số và format lại
    const numericPrice = Number(price.replace(/[^\d]/g, ''));
    return numericPrice.toLocaleString('vi-VN') + ' VND';
};

// Helper: Lấy thông tin tác giả theo authorId
type Author = {
  id: number;
  displayName: string;
  avatar: string;
};
type Hotel = {
  id: number;
  authorId: number;
  title: string;
  featuredImage: string;
  address: string;
  price: string;
  bedrooms: number;
  maxGuests: number;
  reviewStart: number;
  reviewCount: number;
  saleOff?: string;
};
const getAuthor = (authorId: number) => (authorsData as Author[]).find((a) => a.id === authorId);

// HotelList component

interface HotelListProps {
  hotels: Hotel[];
  onEdit?: (hotel: Hotel) => void;
  onDelete?: (hotelId: number) => void;
}

const HotelList: React.FC<HotelListProps> = ({ hotels, onEdit, onDelete }) => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Danh sách Hotel/Homestay</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel) => {
          const author = getAuthor(hotel.authorId);
          return (
            <div key={hotel.id} className="border rounded-lg shadow p-4 bg-white relative">
              <img src={hotel.featuredImage} alt={hotel.title} className="w-full h-40 object-cover rounded mb-2" />
              <h3 className="text-lg font-semibold mb-1">{hotel.title}</h3>
              <p className="text-sm text-gray-600 mb-1">Địa chỉ: {hotel.address}</p>
              <p className="text-sm text-gray-600 mb-1">Giá: {formatPrice(hotel.price)}</p>
              <p className="text-sm text-gray-600 mb-1">Số phòng: {hotel.bedrooms} | Số khách: {hotel.maxGuests}</p>
              <p className="text-sm text-gray-600 mb-1">Đánh giá: ⭐ {hotel.reviewStart} ({hotel.reviewCount} lượt)</p>
              {hotel.saleOff && <span className="text-red-500 font-bold">{hotel.saleOff}</span>}
              <div className="absolute top-2 right-2 flex gap-2">
                {onEdit && <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={() => onEdit(hotel)}>Sửa</button>}
                {onDelete && <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => onDelete(hotel.id)}>Xóa</button>}
              </div>
              {author && (
                <div className="flex items-center mt-2">
                  <img src={author.avatar} alt={author.displayName} className="w-8 h-8 rounded-full mr-2" />
                  <span className="text-sm">Tác giả: {author.displayName}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HotelList;
