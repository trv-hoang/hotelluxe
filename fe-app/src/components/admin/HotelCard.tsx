import React from 'react';
import { type Hotel } from '../../constant/travelRegions';

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

interface HotelCardProps {
  hotel: Hotel;
  onEdit: (hotel: Hotel) => void;
  onDelete: (hotelId: number) => void;
}

const HotelCard: React.FC<HotelCardProps> = React.memo(({ hotel, onEdit, onDelete }) => {
  return (
    <div className="admin-card" style={{
      position: 'relative',
      padding: '20px',
      borderRadius: '12px',
      background: 'var(--admin-bg-primary)',
      border: '1px solid var(--admin-border-primary)',
      boxShadow: '0 2px 8px var(--admin-shadow)',
      transition: 'all 0.2s ease',
      cursor: 'default',
      minHeight: '370px',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Image */}
      <div className="w-full h-36 mb-3 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
        <img 
          src={hotel.featuredImage || '/src/assets/travels/default.jpg'} 
          alt={hotel.title} 
          className="w-full h-full object-cover" 
          onError={e => { (e.currentTarget as HTMLImageElement).src = '/src/assets/travels/default.jpg'; }}
        />
      </div>
      {/* Title & Address */}
      <div style={{ marginBottom: 8 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--admin-text-primary)', margin: 0 }}>{hotel.title}</h2>
        <p style={{ color: 'var(--admin-text-secondary)', fontSize: 14, margin: '2px 0 0 0', display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: 4 }}>📍</span>{hotel.address}
        </p>
      </div>
      {/* Description */}
      <p style={{ color: 'var(--admin-text-secondary)', fontSize: 13, margin: '8px 0', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', display: '-webkit-box' }}>{hotel.description}</p>
      {/* Info */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 13, color: 'var(--admin-text-secondary)', marginBottom: 8 }}>
  <div>Max: {hotel.maxGuests || '-'} guests</div>
  <div>{formatPrice(hotel.price)}</div>
      </div>
      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
        <button
          onClick={() => onEdit(hotel)}
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: 6,
            border: 'none',
            background: '#2563eb',
            color: '#fff',
            fontWeight: 700,
            fontSize: 13,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(37,99,235,0.15)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#1d4ed8'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#2563eb'; }}
        >
          Sửa
        </button>
        <button
          onClick={() => onDelete(hotel.id)}
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: 6,
            border: 'none',
            background: '#ef4444',
            color: '#fff',
            fontWeight: 700,
            fontSize: 13,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(239,68,68,0.15)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#b91c1c'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#ef4444'; }}
        >
          Xóa
        </button>
      </div>
    </div>
  );
});

HotelCard.displayName = 'HotelCard';

export default HotelCard;
