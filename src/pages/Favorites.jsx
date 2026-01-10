import React, { useContext } from "react";
import ProductCard from "../components/ProductCard";
import { ThemeContext } from "../context/ThemeContext.jsx";

export default function Favorites({ products, favorites, toggleFav, cart, addToCart, removeFromCart }) {
   const { theme } = useContext(ThemeContext);

   const favoriteProducts = products.filter(p => favorites.includes(p._id));

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
              onToggleFavProp={toggleFav}
              isFav={favorites.includes(p._id)}
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
