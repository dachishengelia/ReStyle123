import React, { createContext, useState, useEffect } from "react";
import axios from "../axios.js";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  const fetchCart = async () => {
    try {
      const { data } = await axios.get("/api/cart", { withCredentials: true });
      setCart(data.items || []);
      calculateTotal(data.items || []);
    } catch (err) {
      console.error("Failed to fetch cart:", err.message);
    }
  };

  const calculateTotal = (items) => {
    const totalPrice = items.reduce(
      (sum, item) => sum + (item.product?.price || 0) * (item.quantity || 1),
      0
    );
    setTotal(totalPrice);
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const { data } = await axios.post(
        "/api/cart",
        { productId, quantity },
        { withCredentials: true }
      );
      setCart(data.items || []);
      calculateTotal(data.items || []);
    } catch (err) {
      console.error("Failed to add product to cart:", err.message);
    }
  };

  const updateCart = async (productId, quantity) => {
    try {
      const { data } = await axios.patch(
        `/api/cart/${productId}`,
        { quantity },
        { withCredentials: true }
      );
      setCart(data.items || []);
      calculateTotal(data.items || []);
    } catch (err) {
      console.error("Failed to update cart:", err.message);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const { data } = await axios.delete(`/api/cart/${productId}`, {
        withCredentials: true,
      });
      setCart(data.items || []);
      calculateTotal(data.items || []);
    } catch (err) {
      console.error("Failed to remove product from cart:", err.message);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete("/api/cart", { withCredentials: true });
      setCart([]);
      setTotal(0);
    } catch (err) {
      console.error("Failed to clear cart:", err.message);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{ cart, total, addToCart, updateCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
