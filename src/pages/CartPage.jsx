import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext.jsx";
import CheckoutButton from "../components/CheckoutButton.jsx";

export default function CartPage({ products, cart, updateCart, removeFromCart, clearCart }) {
   const { theme } = useContext(ThemeContext);

   const items = cart.map(item => ({
     product: products.find(p => p._id === item.id),
     quantity: item.quantity
   })).filter(item => item.product);

   const total = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

  const handleQuantityChange = (productId, quantity) => {
    if (quantity < 1) quantity = 1;
    updateCart(productId, quantity);
  };

  return (
    <div className={`p-6 max-w-4xl mx-auto ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md`}>
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-200">Your Cart</h2>
      {cart.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">Your cart is empty.</p>
      ) : (
        <div className="space-y-6">
          {items.map((item) => (
            <div
              key={item.product._id}
              className="flex items-center justify-between border-b pb-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <img
                src={item.product.imageUrl || "/placeholder.png"}
                alt={item.product.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1 mx-4">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-200">{item.product.name}</h3>
                <p className="text-gray-500 dark:text-gray-400">{item.product.price} GEL</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateCart(item.product._id, item.quantity - 1)}
                  className={`px-3 py-1 rounded ${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  -
                </button>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    updateCart(item.product._id, parseInt(e.target.value))
                  }
                  className={`w-12 text-center border rounded ${theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-900'}`}
                />
                <button
                  onClick={() => updateCart(item.product._id, item.quantity + 1)}
                  className={`px-3 py-1 rounded ${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  +
                </button>
              </div>
              <button
                onClick={() => removeFromCart(item.product._id)}
                className="text-red-500 dark:text-red-400 hover:underline ml-4"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="flex justify-between items-center mt-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-200">Total: {total.toFixed(2)} GEL</h3>
            <div className="flex space-x-4">
              <CheckoutButton items={items} />
              <button
                onClick={clearCart}
                className="bg-red-500 dark:bg-red-600 text-white px-6 py-2 rounded hover:bg-red-600 dark:hover:bg-red-700"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
