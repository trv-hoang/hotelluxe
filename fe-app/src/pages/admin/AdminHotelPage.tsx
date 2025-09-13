import React, { useState } from "react";
import HotelList from "../../components/admin/HotelList";
import HotelSearchFilter from "../../components/admin/HotelSearchFilter";
import HotelForm from "../../components/admin/HotelForm";
import homeStayData from "../../data/jsons/__homeStay.json";


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

type HotelFilter = {
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  bedrooms?: number;
  maxGuests?: number;
  saleOff?: boolean;
};

const AdminHotelPage: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>(
    (homeStayData as Hotel[]).filter((h) => h.title)
  );
  const [showForm, setShowForm] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filters, setFilters] = useState<HotelFilter>({});

  // Search & filter logic
  const filteredHotels = hotels.filter((hotel) => {
    let match = true;
    if (searchKeyword) {
      match = hotel.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        hotel.address.toLowerCase().includes(searchKeyword.toLowerCase());
    }
    if (filters.location) {
      match = match && hotel.address.toLowerCase().includes(filters.location.toLowerCase());
    }
    if (filters.minPrice) {
      const priceNum = Number(hotel.price.replace(/[^\d]/g, ""));
      match = match && priceNum >= filters.minPrice;
    }
    if (filters.maxPrice) {
      const priceNum = Number(hotel.price.replace(/[^\d]/g, ""));
      match = match && priceNum <= filters.maxPrice;
    }
    if (filters.bedrooms) {
      match = match && hotel.bedrooms >= filters.bedrooms;
    }
    if (filters.maxGuests) {
      match = match && hotel.maxGuests >= filters.maxGuests;
    }
    if (filters.saleOff) {
      match = match && !!hotel.saleOff;
    }
    return match;
  });

  // Add new hotel
  const handleCreateHotel = (hotel: Hotel) => {
    setHotels([hotel, ...hotels]);
    setShowForm(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Quản lý Hotel/Homestay</h1>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => setShowForm(true)}
        >
          Thêm hotel mới
        </button>
      </div>
      <HotelSearchFilter
        onSearch={setSearchKeyword}
        onFilter={setFilters}
      />
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => setShowForm(false)}
            >
              ×
            </button>
            <HotelForm onCreate={handleCreateHotel} />
          </div>
        </div>
      )}
      <HotelList hotels={filteredHotels} />
    </div>
  );
};

export default AdminHotelPage;
