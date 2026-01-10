import React, { useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext.jsx";
import { ThemeContext } from "../context/ThemeContext.jsx";

export default function ProductCard({ p, onDelete, onToggleFavProp, isFav, cart, addToCart, removeFromCart }) {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);

   const isInCart = Array.isArray(cart) && cart.some(item => item.id === p._id);

  const handleCartAction = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInCart) removeFromCart(p._id);
    else addToCart(p._id);
  };

  const handleBuyNow = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await axios.post(
        "https://restyle-backend123.vercel.app/api/checkout/create-checkout-session",
        {},
        { withCredentials: true }
      );
      window.location.href = res.data.url;
    } catch (err) {
      console.error("Payment failed:", err);
      alert("Payment failed");
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!p?._id || !onDelete) return;
    try {
      await onDelete(p._id);
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert("Failed to delete product");
    }
  };

  const handleToggleFav = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavProp) onToggleFavProp(p._id);
  };


  if (!p) return null;

  return (
    <div
    className={`border rounded overflow-hidden shadow-sm transition-shadow cursor-pointer 
                ${theme === 'dark' ? 'bg-gray-800 border-gray-600 hover:shadow-lg' : 'bg-white border-gray-200 hover:shadow-lg'}`}
    onClick={() => navigate(`/product/${p._id}`)}
  >
    <div className="relative">
      <img
        src={
          p.imageUrl
            ? p.imageUrl.replace("/upload/", "/upload/w_400,h_192,c_fill/")
            : "/placeholder.png"
        }
        alt={p.name}
        className="w-full h-48 object-cover"
      />
      {p.discount > 0 && (
        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
          {p.discount}% OFF
        </span>
      )}
      {p.secondhand && (
        <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
          2nd Hand
        </span>
      )}
    </div>
  
    <div className="p-3">
      <div className="flex justify-between items-start">
        <h3 className={`${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'} font-semibold`}>
          {p.name}
        </h3>
        <button
          type="button"
          onClick={handleToggleFav}
          className={`${theme === 'dark' ? 'text-red-400' : 'text-red-600'} text-sm hover:scale-110 transition`}
        >
          {isFav ? "♥" : "♡"}
        </button>
      </div>
  
      <p className={`text-sm mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
        {p.category}
      </p>
  
      {p.sizes?.length > 0 && (
        <p className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          Sizes: {p.sizes.join(", ")}
        </p>
      )}
      {p.colors?.length > 0 && (
        <p className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          Colors: {p.colors.join(", ")}
        </p>
      )}
  
      <div className="mt-2 flex items-center justify-between">
        <div className={`${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'} text-lg font-bold`}>
          {p.price} GEL
        </div>
      </div>
  
      {/* Add/Remove Cart */}
      <button
        type="button"
        onClick={handleCartAction}
        className={`mt-3 w-full py-2 rounded text-white transition ${
          isInCart
            ? theme === 'dark'
              ? "bg-red-600 hover:bg-red-700"
              : "bg-red-500 hover:bg-red-600"
            : theme === 'dark'
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isInCart ? "Remove from Cart" : "Add to Cart"}
      </button>
  
      {/* Buy Now */}
      <button
        type="button"
        onClick={handleBuyNow}
        className={`mt-2 w-full py-2 rounded text-white transition ${
          theme === 'dark' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        Buy Now
      </button>
  
      {/* Delete (admin/seller) */}
      {(user?.role === "admin" || user?.role === "seller") && (
        <button
          type="button"
          onClick={handleDelete}
          className={`mt-2 w-full py-2 rounded text-white transition ${
            theme === 'dark' ? 'bg-red-500 hover:bg-red-600' : 'bg-white text-red-500 border border-red-500 hover:bg-red-600 hover:text-white'
          }`}
        >
          Delete
        </button>
      )}
    </div>
  </div>
  );
}  