import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { CartContext } from "../context/CartContext.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import { ThemeContext } from "../context/ThemeContext.jsx";

export default function ProductCard({ p, onDelete, onToggleFavProp }) {
   const navigate = useNavigate();
   const { cart, addToCart, removeFromCart } = useContext(CartContext);
   const { user } = useContext(AuthContext);
   const { theme } = useContext(ThemeContext);

  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    setLikesCount(p.likes?.length || 0);
    setLiked(user ? p.likes?.some((id) => id === user._id) : false);
  }, [p, user]);

  useEffect(() => {
    if (!user) return;
    const fetchFav = async () => {
      try {
        const res = await axios.get(
          "https://restyle-backend123.vercel.app/api/product-actions/my/favorites",
          { withCredentials: true }
        );
        setIsFav(res.data.favorites.includes(p._id));
      } catch (err) {
        console.error("Failed to fetch favorite status:", err);
      }
    };
    fetchFav();
  }, [user, p._id]);

  const isInCart = Array.isArray(cart) && cart.some((item) => item === p._id);

  const handleCartAction = (e) => {
    e.stopPropagation();
    if (isInCart) removeFromCart(p._id);
    else addToCart(p._id, 1);
  };

  const handleBuyNow = async (e) => {
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
    e.stopPropagation();
    if (!p?._id || !onDelete) return;
    try {
      await onDelete(p._id);
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert("Failed to delete product");
    }
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!user) return alert("Please log in to like");

    try {
      const res = await axios.post(
        `https://restyle-backend123.vercel.app/api/product-actions/${p._id}/like`,
        {},
        { withCredentials: true }
      );
      setLikesCount(res.data.likesCount);
      setLiked(res.data.liked);
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const handleToggleFav = async (e) => {
    e.stopPropagation();
    if (!user) return alert("Please log in to favorite");

    const optimistic = !isFav;
    setIsFav(optimistic);
    if (onToggleFavProp) onToggleFavProp(p._id, optimistic);

    try {
      const res = await axios.post(
        `https://restyle-backend123.vercel.app/api/product-actions/${p._id}/favorite`,
        {},
        { withCredentials: true }
      );
      setIsFav(res.data.favorited);
      if (onToggleFavProp) onToggleFavProp(p._id, res.data.favorited);
    } catch (err) {
      console.error("Favorite toggle error:", err);
      setIsFav(!optimistic);
      if (onToggleFavProp) onToggleFavProp(p._id, !optimistic);
    }
  };


  if (!p) return null;

  return (
    <div
      className={`border rounded overflow-hidden shadow-sm ${theme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'} hover:shadow-lg transition-shadow cursor-pointer`}
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
          <h3 className="font-semibold text-gray-900 dark:text-gray-200">{p.name}</h3>
          <button onClick={handleToggleFav} className="text-sm">
            {isFav ? "♥" : "♡"}
          </button>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400">{p.category}</p>

        {p.sizes?.length > 0 && (
          <p className="text-xs text-gray-600 dark:text-gray-400">Sizes: {p.sizes.join(", ")}</p>
        )}
        {p.colors?.length > 0 && (
          <p className="text-xs text-gray-600 dark:text-gray-400">Colors: {p.colors.join(", ")}</p>
        )}

        <div className="mt-2 flex items-center justify-between">
          <div className="text-lg font-bold text-gray-900 dark:text-gray-200">{p.price} GEL</div>
        </div>

        <button
          onClick={handleCartAction}
          className={`mt-3 w-full ${
            isInCart
              ? "bg-red-600 text-white"
              : "bg-blue-600 text-white"
          } py-2 rounded hover:bg-opacity-80 transition`}
        >
          {isInCart ? "Remove from Cart" : "Add to Cart"}
        </button>

        <button
          onClick={handleBuyNow}
          className="mt-2 bg-green-600 text-white hover:bg-green-700 py-2 rounded w-full"
        >
          Buy Now
        </button>

        {(user?.role === "admin" || user?.role === "seller") && (
          <button
            onClick={handleDelete}
            className={`mt-2 ${
              theme === 'dark'
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-white text-red-500 hover:bg-red-600"
            } py-2 rounded w-full`}
          >
            Delete
          </button>
        )}

        <div className="flex items-center gap-3 mt-3">
          <button
            onClick={handleLike}
            className={`px-3 py-1 rounded ${
              liked ? "bg-pink-500 text-white" : `${theme === 'dark' ? 'bg-gray-900 text-gray-300' : 'bg-gray-200 text-gray-700'}`
            } hover:bg-pink-600`}
          >
            👍 Like {likesCount}
          </button>
        </div>

      </div>
    </div>
  );
}
