import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { ThemeContext } from "../context/ThemeContext.jsx";

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
  const { theme } = useContext(ThemeContext);
  const [form, setForm] = useState({ username: "", currentPassword: "", newPassword: "", confirmPassword: "" });
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(user?.profilePic || "");
  const [message, setMessage] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getTitle = () => {
    switch (user?.role) {
      case "seller":
        return "Seller Dashboard";
      case "admin":
        return "Admin Profile";
      default:
        return "User Profile";
    }
  };

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

    const payload = {};

    // Check if profile picture changed
    if (imageUrl && imageUrl !== user?.profilePic) {
      payload.profilePic = imageUrl;
    }

    // Check if username changed
    if (form.username && form.username !== user.username) {
      payload.username = form.username;
      if (!form.currentPassword) {
        setMessage("Current password is required to change username.");
        return;
      }
    }

    // Check if password is being changed
    if (form.newPassword) {
      if (form.newPassword !== form.confirmPassword) {
        setMessage("New passwords do not match.");
        return;
      }
      if (!form.currentPassword) {
        setMessage("Current password is required to change password.");
        return;
      }
      payload.newPassword = form.newPassword;
    }

    // If changing username or password, currentPassword is needed
    if ((payload.username || payload.newPassword) && !form.currentPassword) {
      setMessage("Current password is required for account changes.");
      return;
    }

    if (form.currentPassword) {
      payload.currentPassword = form.currentPassword;
    }

    if (Object.keys(payload).length === 0) {
      setMessage("No changes to update.");
      return;
    }

    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_BASE_PROD}/users/update`,
        payload,
        { withCredentials: true }
      );
      logIn(res.data.user);
      if (res.data.token) setCookie("token", res.data.token, 1);
      setMessage("Profile updated successfully.");
      // Reset form
      setForm({ username: "", currentPassword: "", newPassword: "", confirmPassword: "" });
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
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <div className="text-center py-10">Loading your dashboard...</div>;
  }

  return (
    <div className={`flex items-center justify-center min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
    <div className={`p-6 w-[90%] ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md`}>
      <h2 className={`text-3xl font-bold mb-6 text-center ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
        {getTitle()}
      </h2>
  
      <form onSubmit={handleSubmit} className="space-y-6 mb-8">
        {/* Profile Picture Section */}
        <div className="border-b pb-4">
          <h3 className={`text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>Profile Picture</h3>
          <div>
            <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Upload New Picture
            </label>
            <input
              type="file"
              onChange={handleImageUpload}
              className={`border p-2 w-full ${theme === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
            />
          </div>

          {/* Show Preview */}
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Profile Preview"
              className="w-32 h-32 object-cover mt-2 rounded-full"
            />
          )}
        </div>

        {/* Account Information Section */}
        <div className="border-b pb-4">
          <h3 className={`text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>Account Information</h3>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Username</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder={`Current: ${user.username}`}
                className={`w-full border rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 ${theme === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={form.currentPassword}
                onChange={handleChange}
                placeholder="Required for account changes"
                className={`w-full border rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 ${theme === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                placeholder="Leave blank to keep current"
                className={`w-full border rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 ${theme === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                className={`w-full border rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 ${theme === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className={`w-full py-2 rounded-lg text-white ${theme === 'dark' ? 'bg-blue-700 hover:bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'} transition`}
        >
          Update Profile
        </button>
      </form>
  
      <button
        onClick={handleSignOut}
        className={`w-full py-2 rounded-lg text-white mb-8 ${theme === 'dark' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} transition`}
      >
        Sign Out
      </button>
  
      {user?.role === "admin" && (
        <Link
          to="/admin"
          className={`w-full py-2 rounded-lg text-white mb-8 block text-center ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} transition`}
        >
          Go to Admin Panel
        </Link>
      )}
  
      {message && (
        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} text-center mb-6`}>
          {message}
        </p>
      )}
  
      {/* Seller Products Table */}
      {user?.role === "seller" && (
        <>
          <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>Your Products</h2>
          {products.length === 0 ? (
            <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>You have not added any products yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className={`w-full border-collapse border rounded-lg shadow`}>
                <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}>
                  <tr>
                    {["Name", "Price", "Category", "Actions"].map((col) => (
                      <th
                        key={col}
                        className={`border px-4 py-2 ${theme === 'dark' ? 'border-gray-600 text-gray-200' : 'border-gray-200 text-gray-900'}`}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className={theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-50'}>
                      <td className={`border px-4 py-2 ${theme === 'dark' ? 'border-gray-600 text-gray-200' : 'border-gray-200 text-gray-900'}`}>{product.name}</td>
                      <td className={`border px-4 py-2 ${theme === 'dark' ? 'border-gray-600 text-gray-200' : 'border-gray-200 text-gray-900'}`}>{product.price} GEL</td>
                      <td className={`border px-4 py-2 ${theme === 'dark' ? 'border-gray-600 text-gray-200' : 'border-gray-200 text-gray-900'}`}>{product.category}</td>
                      <td className="border px-4 py-2 text-center">
                        <button
                          onClick={() => handleDelete(product._id)}
                          className={`px-4 py-2 rounded text-white ${theme === 'dark' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} transition`}
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
        </>
      )}
    </div>
  </div>
  );
}  