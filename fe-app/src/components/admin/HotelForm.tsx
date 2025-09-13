import React, { useState } from "react";
import authorsData from "../../data/jsons/__authors.json";

type Author = {
  id: number;
  displayName: string;
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
interface HotelFormProps {
  onCreate: (hotel: Hotel) => void;
}

const HotelForm: React.FC<HotelFormProps> = ({ onCreate }) => {
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [maxGuests, setMaxGuests] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [authorId, setAuthorId] = useState(authorsData[0]?.id || 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !address || !price) return;
    onCreate({
      id: Date.now(),
      title,
      address,
      price,
      bedrooms: Number(bedrooms),
      maxGuests: Number(maxGuests),
      featuredImage,
      authorId,
      reviewStart: 0,
      reviewCount: 0,
      saleOff: "",
    });
    setTitle("");
    setAddress("");
    setPrice("");
    setBedrooms("");
    setMaxGuests("");
    setFeaturedImage("");
    setAuthorId(authorsData[0]?.id || 1);
  };

  return (
    <form className="flex flex-col gap-2 p-4" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Tên hotel"
        className="border rounded px-2 py-1"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Địa chỉ"
        className="border rounded px-2 py-1"
        value={address}
        onChange={e => setAddress(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Giá"
        className="border rounded px-2 py-1"
        value={price}
        onChange={e => setPrice(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Số phòng"
        className="border rounded px-2 py-1"
        value={bedrooms}
        onChange={e => setBedrooms(e.target.value)}
      />
      <input
        type="number"
        placeholder="Số khách tối đa"
        className="border rounded px-2 py-1"
        value={maxGuests}
        onChange={e => setMaxGuests(e.target.value)}
      />
      <input
        type="text"
        placeholder="Link hình ảnh nổi bật"
        className="border rounded px-2 py-1"
        value={featuredImage}
        onChange={e => setFeaturedImage(e.target.value)}
      />
      <select
        className="border rounded px-2 py-1"
        value={authorId}
        onChange={e => setAuthorId(Number(e.target.value))}
      >
        {(authorsData as Author[]).map((author) => (
          <option key={author.id} value={author.id}>{author.displayName}</option>
        ))}
      </select>
      <button type="submit" className="bg-green-500 text-white px-4 py-1 rounded mt-2">Tạo mới</button>
    </form>
  );
};

export default HotelForm;
