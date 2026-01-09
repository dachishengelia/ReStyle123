import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext.jsx";
import { ThemeContext } from "../context/ThemeContext.jsx";
import ProductCard from "../components/ProductCard";
import { useNavigate } from "react-router-dom";

export default function YourProducts({ toggleFav, cart, addToCart, removeFromCart }) {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchSellerProducts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_PROD}/api/products`, {
        withCredentials: true,
      });
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch seller products:", err.message);
      alert("Failed to fetch seller products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_PROD}/api/products/${productId}`, {
        withCredentials: true,
      });
      setProducts(products.filter((product) => product._id !== productId));
      alert("Product deleted successfully");
    } catch (err) {
      console.error("Failed to delete product:", err.message);
      alert("Failed to delete product");
    }
  };

  useEffect(() => {
    if (user?.role === "seller") {
      fetchSellerProducts();
    }
  }, [user]);

  if (loading) {
    return <div className="p-4">Loading your products...</div>;
  }

  return (
    <div className={`p-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-200">Your Products</h1>
        <button
          onClick={() => navigate("/add-product")}
          className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-700 dark:hover:bg-blue-800"
        >
          Add Product
        </button>
      </div>
      {products.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-300">You have not added any products yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard
              key={p._id}
              p={p}
              onToggleFavProp={toggleFav} // updated prop name
              isFav={false}
              cart={cart}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              onDelete={handleDelete} // delete button handled inside ProductCard
            />
          ))}
        </div>
      )}
    </div>
  );
}
