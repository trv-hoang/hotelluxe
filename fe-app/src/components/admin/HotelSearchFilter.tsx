import React, { useState } from "react";

interface HotelSearchFilterProps {
  onSearch: (keyword: string) => void;
  onFilter: (filters: {
    minPrice?: number;
    maxPrice?: number;
    location?: string;
    bedrooms?: number;
    maxGuests?: number;
    saleOff?: boolean;
  }) => void;
}

const HotelSearchFilter: React.FC<HotelSearchFilterProps> = ({ onSearch, onFilter }) => {
  const [keyword, setKeyword] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [location, setLocation] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [maxGuests, setMaxGuests] = useState("");
  const [saleOff, setSaleOff] = useState(false);
    const [jsonData, setJsonData] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(keyword);
    onFilter({
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      location: location || undefined,
      bedrooms: bedrooms ? Number(bedrooms) : undefined,
      maxGuests: maxGuests ? Number(maxGuests) : undefined,
      saleOff,
    });
  };

  return (
    <form className="flex flex-wrap gap-2 mb-4 items-end" onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="Tìm kiếm theo tên, địa chỉ..."
        className="border rounded px-2 py-1"
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
      />
      <input
        type="number"
        placeholder="Giá tối thiểu"
        className="border rounded px-2 py-1 w-28"
        value={minPrice}
        onChange={e => setMinPrice(e.target.value)}
      />
      <input
        type="number"
        placeholder="Giá tối đa"
        className="border rounded px-2 py-1 w-28"
        value={maxPrice}
        onChange={e => setMaxPrice(e.target.value)}
      />
      <input
        type="text"
        placeholder="Địa điểm"
        className="border rounded px-2 py-1"
        value={location}
        onChange={e => setLocation(e.target.value)}
      />
      <input
        type="number"
        placeholder="Số phòng"
        className="border rounded px-2 py-1 w-20"
        value={bedrooms}
        onChange={e => setBedrooms(e.target.value)}
      />
      <input
        type="number"
        placeholder="Số khách tối đa"
        className="border rounded px-2 py-1 w-24"
        value={maxGuests}
        onChange={e => setMaxGuests(e.target.value)}
      />
      <label className="flex items-center gap-1">
        <input
          type="checkbox"
          checked={saleOff}
          onChange={e => setSaleOff(e.target.checked)}
        />
        Khuyến mãi
      </label>
        <input
          type="text"
          placeholder="Dữ liệu JSON"
          className="border rounded px-2 py-1"
          value={jsonData}
          onChange={e => setJsonData(e.target.value)}
        />
      <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded">Tìm kiếm/Lọc</button>
    </form>
  );
};

export default HotelSearchFilter;
