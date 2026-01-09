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
        `https://re-style-backend.vercel.app/api/product-actions/${productId}/comment`,
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
        `https://re-style-backend.vercel.app/api/product-actions/${productId}/comment/${commentId}`,
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
    <div>
      <div className="p-6 max-w-5xl mx-auto">
      <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} shadow-lg rounded-xl overflow-hidden flex flex-col md:flex-row`}>
        {/* Image Section */}
        <div className="md:w-1/2 flex items-center justify-center bg-gray-50 dark:bg-gray-700 p-6">
          <img
            src={product.imageUrl || "https://via.placeholder.com/400x300?text=No+Image"}
            alt={product.name}
            className="w-full h-auto rounded-lg object-cover max-h-[400px]"
          />
        </div>

        {/* Details Section */}
        <div className="md:w-1/2 p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200">{product.name}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{product.description}</p>
            <p className="text-2xl font-semibold mb-4 text-green-600">{product.price} GEL</p>

            {product.sizes && product.sizes.length > 0 && (
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Available Sizes: {product.sizes.join(", ")}</p>
            )}
            {product.colors && product.colors.length > 0 && (
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">Available Colors: {product.colors.join(", ")}</p>
            )}


            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Seller: <span className="font-medium">{product.sellerId?.username || "Unknown"}</span>
            </p>
          </div>


          <div className="flex flex-col gap-4">
            <button disabled className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold opacity-50 cursor-not-allowed">
              Add to Cart
            </button>
            <button disabled className="w-full bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-semibold opacity-50 cursor-not-allowed">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  
    <div className={`mt-8 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} shadow-lg rounded-xl p-6`}>
      <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">Comments</h3>
      <div className="mb-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No comments yet.</p>
        ) : (
          comments.map((c) => (
            <div key={c._id || c.createdAt} className="mb-2 text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600 pb-1">
              <span className="font-semibold">{c.username}:</span> <span>{c.text}</span>
              <div className="text-xs text-gray-400">
                {new Date(c.createdAt).toLocaleString()}
              </div>
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
            className={`border border-gray-300 dark:border-gray-600 ${theme === 'dark' ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-900'} p-2 rounded w-full mb-2`}
          />
          <button
            onClick={handleAddComment}
            className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-600 dark:hover:bg-blue-700"
          >
            Add Comment
          </button>
        </div>
      )}
    </div>
      </div>
    );
  }
