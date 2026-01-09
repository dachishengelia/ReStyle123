import React, { useContext } from "react";
import { CartContext } from "../context/CartContext.jsx";
import CheckoutButton from "../components/CheckoutButton.jsx";

export default function CartPage() {
  const { cart, total, updateCart, removeFromCart, clearCart } = useContext(CartContext);

  const handleQuantityChange = (productId, quantity) => {
    if (quantity < 1) quantity = 1;
    updateCart(productId, quantity);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
      {cart.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-6">
          {cart.map((item) => (
            <div
              key={item.product._id}
              className="flex items-center justify-between border-b pb-4 hover:bg-hover-bg-color transition"
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
                    handleQuantityChange(item.product._id, parseInt(e.target.value))
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
                onClick={() => removeFromCart(item.product._id)}
                className="text-red-500 hover:underline ml-4"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="flex justify-between items-center mt-6">
            <h3 className="text-xl font-bold">Total: {total.toFixed(2)} GEL</h3>
            <div className="flex space-x-4">
              <CheckoutButton items={cart} />
              <button
                onClick={clearCart}
                className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
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
