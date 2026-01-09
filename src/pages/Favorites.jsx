import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import { AuthContext } from "../context/AuthContext.jsx";
import { CartContext } from "../context/CartContext.jsx";
import { ThemeContext } from "../context/ThemeContext.jsx";

export default function Favorites() {
  const { user } = useContext(AuthContext);
  const { cart, addToCart, removeFromCart } = useContext(CartContext);
  const { theme } = useContext(ThemeContext);

  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "https://restyle-backend123.vercel.app/api/product-actions/my/favorites",
          { withCredentials: true }
        );
        setFavoriteProducts(res.data.favorites || []); // ensure it's always an array
      } catch (err) {
        console.error("Failed to fetch favorites:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  const handleToggleFav = (productId, favorited) => {
    if (!favorited) {
      setFavoriteProducts((prev) => prev.filter((p) => p._id !== productId));
    }
  };

  if (!user) return <p className="text-gray-700 dark:text-gray-300">Please log in to see your favorites.</p>;
  if (loading) return <p className="text-gray-700 dark:text-gray-300">Loading favorites...</p>;

  return (
    <div className={`p-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      <h1 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-200">Favorites</h1>

      {favoriteProducts.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-300">No favorites yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {favoriteProducts.map((p) => (
            <ProductCard
              key={p._id}
              p={p}
              onDelete={null} // no delete action in favorites
              onToggleFavProp={handleToggleFav}
              cart={cart}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
            />
          ))}
        </div>
      )}
    </div>
  );
}
