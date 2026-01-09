import React, { useEffect, useState } from "react";
import axios from "../axios.js";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await axios.get("/api/cart", { withCredentials: true });
        setCartItems(data.items || []);
      } catch (err) {
        setError("Failed to fetch cart items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleQuantityChange = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      const { data } = await axios.patch(
        `/api/cart/${productId}`,
        { quantity },
        { withCredentials: true }
      );
      setCartItems(data.items);
    } catch (err) {
      setError("Failed to update item quantity. Please try again.");
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const { data } = await axios.delete(`/api/cart/${productId}`, { withCredentials: true });
      setCartItems(data.items);
    } catch (err) {
      setError("Failed to remove item from cart. Please try again.");
    }
  };

  const handleClearCart = async () => {
    try {
      await axios.delete("/api/cart", { withCredentials: true });
      setCartItems([]);
    } catch (err) {
      setError("Failed to clear cart. Please try again.");
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty. Add items before proceeding to checkout.");
      return;
    }
    navigate("/checkout");
  };

  if (loading) {
    return <div className="text-center py-10">Loading your cart...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-center">Your Cart</h2>
      {cartItems.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-500">Your cart is empty.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {cartItems.map((item) => (
            <div
              key={item.product._id}
              className="flex items-center justify-between border-b pb-4"
            >
              <img
                src={item.product.imageUrl || "/placeholder.png"}
                alt={item.product.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1 mx-4">
                <h3 className="font-semibold text-lg">{item.product.name}</h3>
                <p className="text-gray-500">{item.product.price} GEL</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
                >
                  -
                </button>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(item.product._id, parseInt(e.target.value) || 1)
                  }
                  className="w-12 text-center border rounded"
                />
                <button
                  onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => handleRemoveItem(item.product._id)}
                className="text-red-500 hover:underline ml-4"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="flex justify-between items-center mt-6">
            <h3 className="text-xl font-bold">
              Total:{" "}
              {cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toFixed(
                2
              )}{" "}
              GEL
            </h3>
            <div className="flex space-x-4">
              <button
                onClick={handleClearCart}
                className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
              >
                Clear Cart
              </button>
              <button
                onClick={handleCheckout}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
