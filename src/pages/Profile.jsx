import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext.jsx";

function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

export default function Profile() {
  const { user, logIn, signOut } = useContext(AuthContext);
  const [form, setForm] = useState({ username: user.username, currentPassword: "", newPassword: "", confirmPassword: "" });
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(user?.profilePic || "");
  const [message, setMessage] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // ----------- IMAGE UPLOAD ------------------
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_PROD}/api/products/upload`,
        formData,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      );

      setMessage(res.data.message);
      setImageUrl(res.data.imageUrl);
    } catch (err) {
      console.error("Image upload error:", err);
      setMessage(err.response?.data?.message || "Failed to upload image");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setMessage("New passwords do not match.");
      return;
    }

    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_BASE_PROD}/users/update`,
        { username: form.username, currentPassword: form.currentPassword, newPassword: form.newPassword, profilePic: imageUrl },
        { withCredentials: true }
      );
      logIn(res.data.user);
      if (res.data.token) setCookie("token", res.data.token, 1);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to update profile.");
    }
  };

  const handleSignOut = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      signOut();
    }
  };

  const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);


    const fetchSellerProducts = async () => {
      try {
        const baseURL = import.meta.env.VITE_API_BASE_PROD; 
        
        const res = await axios.get(`${baseURL}/api/products`, {
          withCredentials: true,
        });
    
        setProducts(res.data); 
    
      } catch (err) {
        console.error("Failed to fetch seller products:", err.response?.data || err.message);
        alert(err.response?.data?.message || "Failed to fetch seller products.");
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
    return <div className="text-center py-10">Loading your dashboard...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 w-[90%] bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-center">Seller Dashboard</h2>

        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          {/* PROFILE PICTURE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
            <input
              type="file"
              onChange={handleImageUpload}
              className="border p-2 w-full"
            />
          </div>

          {/* SHOW PREVIEW */}
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Profile Preview"
              className="w-32 h-32 object-cover mt-2 rounded-full"
            />
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="New Username"
              className="w-full border rounded-lg px-4 py-2 focus:ring-primary-color focus:border-primary-color"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              placeholder="Current Password"
              className="w-full border rounded-lg px-4 py-2 focus:ring-primary-color focus:border-primary-color"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="New Password"
              className="w-full border rounded-lg px-4 py-2 focus:ring-primary-color focus:border-primary-color"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm New Password"
              className="w-full border rounded-lg px-4 py-2 focus:ring-primary-color focus:border-primary-color"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Update Profile
          </button>
        </form>
        <button
          onClick={handleSignOut}
          className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 mb-8 transition"
        >
          Sign Out
        </button>
        {message && <p className="text-center mb-6 text-gray-700">{message}</p>}

        <h2 className="text-2xl font-bold mb-4">Your Products</h2>
        {products.length === 0 ? (
          <p>You have not added any products yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200 rounded-lg shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-200 px-4 py-2">Name</th>
                  <th className="border border-gray-200 px-4 py-2">Price</th>
                  <th className="border border-gray-200 px-4 py-2">Category</th>
                  <th className="border border-gray-200 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2">{product.name}</td>
                    <td className="border border-gray-200 px-4 py-2">{product.price} GEL</td>
                    <td className="border border-gray-200 px-4 py-2">{product.category}</td>
                    <td className="border border-gray-200 px-4 py-2 text-center">
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
