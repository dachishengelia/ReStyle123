import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Filters from "../components/Filters";
import axios from "axios";
import { AuthContext } from "../context/AuthContext.jsx";
import { ThemeContext } from "../context/ThemeContext.jsx";

export default function Home({ favorites, toggleFav, cart, addToCart, removeFromCart }) {
   const { user } = useContext(AuthContext);
   const { theme } = useContext(ThemeContext);
   const [query, setQuery] = useState("");
   const [filters, setFilters] = useState({});
   const [filterOpen, setFilterOpen] = useState(false);
   const [sortOption, setSortOption] = useState("");
   const [sortOrder, setSortOrder] = useState("asc");
   const [highlightedProductId, setHighlightedProductId] = useState(null);
   const [products, setProducts] = useState([]);
   const location = useLocation();

  useEffect(() => {
    if (location.state?.highlightedProductId) {
      setHighlightedProductId(location.state.highlightedProductId);
      const timer = setTimeout(() => setHighlightedProductId(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "https://re-style-backend.vercel.app/api/products"
        );
        if (!Array.isArray(res.data)) throw new Error("Invalid products data format");
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products:", err.message);
      }
    };
    fetchProducts();
  }, []);

  const toggleSortOrder = () => setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_PROD}/api/products/admin/${productId}`);
      setProducts(products.filter((product) => product._id !== productId));
      alert("Product deleted successfully");
    } catch (err) {
      console.error("Failed to delete product:", err.message);
      alert("Failed to delete product");
    }
  };

  const filtered = products.filter((p) => {
    const matchesQuery = query ? p.name?.toLowerCase().includes(query.toLowerCase()) : true;
    const matchesCategory = !filters.category || p.category === filters.category;
    const matchesColor = !filters.color || (p.colors && p.colors.includes(filters.color));
    const matchesSize = !filters.size || (p.sizes && p.sizes.includes(filters.size));
    const matchesPrice = !filters.maxPrice || p.price <= parseInt(filters.maxPrice);
    return matchesQuery && matchesCategory && matchesColor && matchesSize && matchesPrice;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sortOption) return 0;
    return sortOrder === "asc" ? a[sortOption] - b[sortOption] : b[sortOption] - a[sortOption];
  });

  const brands = ["Zara", "H&M", "New Yorker", "Waikiki", "Mango", "Nike", "Adidas", "Uniqlo", "Puma", "Levis", "Gucci", "Prada", "Versace", "Armani"];

  return (
    <div className="w-full">
      {/* Splash Section */}
      <div className="flex flex-col md:flex-row items-center justify-between
                      bg-gray-900 text-white h-[500px] md:h-[600px] px-6 md:px-20
                      relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/splash.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.8,
          }}
        ></div>
        <div className="absolute inset-0 bg-gray-900/70"></div>
        <div className="relative z-10 md:w-1/2 mt-6 md:mt-0 md:ml-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">ReStyle</h1>
          <p className="text-xl md:text-2xl font-medium">
            "Where fashion meets savings."
          </p>
        </div>
      </div>

      {/* Brands Marquee */}
      <div className={`overflow-hidden py-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} relative`}>
        <div className="flex gap-8 whitespace-nowrap animate-marquee-fast">
          {brands.concat(brands).map((b, i) => (
            <div
              key={i}
              className={`px-6 py-3 ${theme === 'dark' ? 'bg-gray-900 text-white border border-gray-700' : 'bg-white text-gray-900'} shadow rounded-full font-bold flex-shrink-0
                          transform transition-transform duration-300 hover:scale-140`}
            >
              {b}
            </div>
          ))}
        </div>
      </div>

      {/* Search & Sort */}
      <div className="flex flex-wrap justify-center items-center gap-3 my-6 px-4 md:px-20">
        <input
          type="text"
          placeholder="Search items..."
          className={`border border-gray-300 dark:border-gray-600 p-2 rounded w-full md:w-1/2 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className={`px-4 py-2 ${
            theme === 'dark'
              ? "bg-gray-900 text-white hover:bg-gray-700"
              : "bg-white text-gray-900 hover:bg-gray-700"
          } rounded`}
          onClick={() => setFilterOpen(true)}
        >
          Filters
        </button>
        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className={`border-none p-2 rounded-l outline-none ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
          >
            <option value="">Sort by</option>
            <option value="price">Price</option>
          </select>
          <button
            onClick={toggleSortOrder}
            className={`px-3 py-2 ${theme === 'dark' ? 'bg-gray-900 text-white hover:bg-gray-700' : 'bg-white text-gray-900 hover:bg-gray-200'} rounded-r transition`}
            title={sortOrder === "asc" ? "Ascending" : "Descending"}
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </button>
        </div>
      </div>

      {/* Filters Modal */}
      {filterOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-11/12 md:w-1/3 relative">
            <button
              onClick={() => setFilterOpen(false)}
              className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 font-bold"
            >
              ×
            </button>
            <Filters
              filters={filters}
              setFilters={setFilters}
              close={() => setFilterOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-200">Products</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {sorted.map((p) => (
            <ProductCard
              key={p._id}
              p={p}
              onToggleFavProp={toggleFav}
              isFav={favorites.includes(p._id)}
              cart={cart}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
