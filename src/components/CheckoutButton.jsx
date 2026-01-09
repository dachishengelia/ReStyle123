import React from "react";
import axios from "../axios.js"; // your axios instance

const CheckoutButton = ({ items }) => {
  const handleCheckout = async () => {
    try {
      // Transform cart items for backend
      const transformedItems = items.map(item => ({
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity
      }));

      // Send to backend checkout route
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_PROD}/api/checkout/create-checkout-session`,
        { items: transformedItems },
        { withCredentials: true }
      );

      // Redirect user to Stripe checkout page
      window.location.href = res.data.url;
    } catch (err) {
      console.error("Payment failed:", err);
      alert(err.response?.data?.message || "Payment failed");
    }
  };

  return (
    <button
      onClick={handleCheckout}
      className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
    >
      Checkout
    </button>
  );
};

export default CheckoutButton;
