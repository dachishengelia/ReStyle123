import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import axios from "axios";

export default function Seller() {
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState({ title: '', price: '', description: '', imageUrl: '' });
  const [message, setMessage] = useState('');

  const handleChange = e => setProduct({ ...product, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://restyle-backend123.vercel.app/admin/products"  /* "http://localhost:3000/admin/products" */ ,
        { ...product, image: product.imageUrl }, 
        { withCredentials: true }
      );
      setMessage(res.data.message);
      setProduct({ title: '', price: '', description: '', imageUrl: '' });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to add product');
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <form className="flex flex-col gap-4 w-80 md:w-96" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-center mb-4">Add Product</h2>
        <input name="title" placeholder="Product Title" value={product.title} onChange={handleChange} className="border px-3 py-2 rounded"/>
        <input name="price" placeholder="Price" type="number" value={product.price} onChange={handleChange} className="border px-3 py-2 rounded"/>
        <textarea name="description" placeholder="Description" value={product.description} onChange={handleChange} className="border px-3 py-2 rounded"/>
        <input name="imageUrl" placeholder="Image URL" value={product.imageUrl} onChange={handleChange} className="border px-3 py-2 rounded"/>
        <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Add Product</button>
        {message && <p className="text-green-500">{message}</p>}
      </form>
    </div>
  );
}
