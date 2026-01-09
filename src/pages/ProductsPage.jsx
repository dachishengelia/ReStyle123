import React, { useEffect, useState } from "react";
import axios from "../axiosInstance";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await (`${import.meta.env.VITE_API_BASE_PROD}/api/products`);
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err.message);
      }
    };

    const fetchUserDetails = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_PROD}/auth/me`);
        setUserRole(data.user.role);
        setUserId(data.user._id);
      } catch (err) {
        console.error("Failed to fetch user details:", err.message);
      }
    };

    fetchProducts();
    fetchUserDetails();
  }, []);

  const handleDelete = async (productId, isAdmin) => {
    try {
      const url = isAdmin ? `/api/products/admin/${productId}` : `/api/products/${productId}`;
      await axios.delete(url);
      setProducts(products.filter((product) => product._id !== productId));
      alert("Product deleted successfully");
    } catch (err) {
      console.error("Failed to delete product:", err.message);
      alert("Failed to delete product");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Products</h2>
      {products.length === 0 ? (
        <p className="text-center text-gray-500">No products available.</p>
      ) : (
        <div className="space-y-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="flex items-center justify-between border-b pb-4"
            >
              <div>
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-gray-500">{product.price} GEL</p>
              </div>
              <div className="flex items-center space-x-4">
                {userRole === "seller" && product.sellerId === userId && (
                  <button
                    onClick={() => handleDelete(product._id, false)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                )}
                {userRole === "admin" && (
                  <button
                    onClick={() => handleDelete(product._id, true)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete (Admin)
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
