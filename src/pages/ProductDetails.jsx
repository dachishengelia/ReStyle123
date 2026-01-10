import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../axios.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { ThemeContext } from "../context/ThemeContext.jsx";

export default function ProductDetails() {
   const { productId } = useParams();
   const navigate = useNavigate();
   const [product, setProduct] = useState(null);
   const [error, setError] = useState(null);
   const { user } = useContext(AuthContext);
   const { theme } = useContext(ThemeContext);
   const [comments, setComments] = useState([]);
   const [commentInput, setCommentInput] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${productId}`);
        setProduct(data);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError("Product not found");
        } else {
          setError("Failed to fetch product details");
        }
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    setComments(product?.comments || []);
  }, [product]);

  const handleAddComment = async () => {
    if (!user) return alert("Please log in to comment");
    if (!commentInput.trim()) return;

    try {
      const res = await axios.post(
        `https://restyle-backend123.vercel.app/api/product-actions/${productId}/comment`,
        { text: commentInput.trim() },
        { withCredentials: true }
      );
      setComments(res.data.comments);
      setCommentInput("");
    } catch (err) {
      console.error("Comment error:", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!user) return;
    try {
      const res = await axios.delete(
        `https://restyle-backend123.vercel.app/api/product-actions/${productId}/comment/${commentId}`,
        { withCredentials: true }
      );
      setComments(res.data.comments);
    } catch (err) {
      console.error("Delete comment error:", err);
    }
  };

  if (error) {
    return (
      <div className="p-6 max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6 text-red-600">{error}</h2>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
        >
          Go Back to Home
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-xl animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
    {/* Product Card */}
    <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} shadow-lg rounded-xl overflow-hidden flex flex-col md:flex-row`}>
      
      {/* Image Section */}
      <div className={`md:w-1/2 flex items-center justify-center p-6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <img
          src={product.imageUrl || "https://via.placeholder.com/400x300?text=No+Image"}
          alt={product.name}
          className="w-full h-auto rounded-lg object-cover max-h-[400px]"
        />
      </div>
  
      {/* Details Section */}
      <div className="md:w-1/2 p-8 flex flex-col justify-between">
        <div>
          <h2 className={`text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
            {product.name}
          </h2>
          <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {product.description}
          </p>
          <p className="text-2xl font-semibold mb-4 text-green-600">
            {product.price} GEL
          </p>
  
          {product.sizes?.length > 0 && (
            <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Available Sizes: {product.sizes.join(", ")}
            </p>
          )}
          {product.colors?.length > 0 && (
            <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Available Colors: {product.colors.join(", ")}
            </p>
          )}
  
          <p className={`text-sm mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Seller: <span className="font-medium">{product.sellerId?.username || "Unknown"}</span>
          </p>
        </div>
  
        <div className="flex flex-col gap-4">
          <button
            disabled
            className={`w-full px-6 py-3 rounded-lg text-lg font-semibold text-white opacity-50 cursor-not-allowed ${
              theme === 'dark' ? 'bg-blue-700' : 'bg-blue-600'
            }`}
          >
            Add to Cart
          </button>
          <button
            disabled
            className={`w-full px-6 py-3 rounded-lg text-lg font-semibold text-white opacity-50 cursor-not-allowed ${
              theme === 'dark' ? 'bg-green-700' : 'bg-green-600'
            }`}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  
    {/* Comments Section */}
    <div className={`mt-8 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} shadow-lg rounded-xl p-6`}>
      <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
        Comments
      </h3>
  
      <div className="mb-4">
        {comments.length === 0 ? (
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>No comments yet.</p>
        ) : (
          comments.map((c) => (
            <div
              key={c._id || c.createdAt}
              className={`mb-2 border-b pb-1 ${
                theme === 'dark' ? 'border-gray-600 text-gray-200' : 'border-gray-200 text-gray-800'
              }`}
            >
              <span className="font-semibold">{c.username}:</span> <span>{c.text}</span>
              <div className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</div>
              {user && (user._id === c.userId || user.role === "admin") && (
                <button
                  onClick={() => handleDeleteComment(c._id)}
                  className="text-red-500 text-xs ml-2"
                >
                  Delete
                </button>
              )}
            </div>
          ))
        )}
      </div>
  
      {user && (
        <div>
          <input
            type="text"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Add a comment..."
            className={`w-full p-2 mb-2 rounded border ${
              theme === 'dark'
                ? 'bg-gray-900 text-gray-200 border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500'
                : 'bg-white text-gray-900 border-gray-300 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500'
            }`}
          />
          <button
            onClick={handleAddComment}
            className={`px-4 py-2 rounded text-white transition ${
              theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            Add Comment
          </button>
        </div>
      )}
    </div>
  </div>
  
    );
  }
