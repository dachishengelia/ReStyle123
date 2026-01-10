import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { CartContext } from "../context/CartContext.jsx";
import { ThemeContext } from "../context/ThemeContext.jsx";
import logo from "/logo.png";

export default function Navbar({ favoritesCount }) {
  const { user, loading, signOut } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  // Wait until auth is loaded
  if (loading) return null;

  // Normalize role
  const role = typeof user?.role === "string" ? user.role.toLowerCase() : "";

  // Role-based home path
  let homePath = "/";
  switch (role) {
    case "admin":
      homePath = "/admin";
      break;
    case "seller":
      homePath = "/your-products";
      break;
    case "buyer":
      homePath = "/";
      break;
    default:
      homePath = "/";
  }

  return (
    <header className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow sticky top-0 z-20`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src={logo} alt="logo" className="w-14 h-14 object-contain" />
          <span className={`font-bold text-2xl ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
            ReStyle
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-6 text-gray-600 dark:text-gray-300">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="text-sm font-medium hover:text-primary-color transition dark:text-gray-300"
          >
            {theme === "light" ? "☀️" : "🌙"}
          </button>

          {/* Home (role-based) */}
          <Link
            to={homePath}
            className="text-sm font-medium hover:text-primary-color transition dark:text-gray-300"
          >
            Home
          </Link>

          {/* Favorites & Cart */}
          <Link
            to="/favorites"
            className="text-sm font-medium hover:text-primary-color transition dark:text-gray-300"
          >
            Favorites {/*({favoritesCount})*/}
          </Link>
          <Link
            to="/cart"
            className="text-sm font-medium hover:text-primary-color transition dark:text-gray-300"
          >
            Cart {/*({cart.length})*/}
          </Link>

          {/* User buttons */}
          {user ? (
            <div className="flex items-center gap-4">
              {role === "seller" && (
                <button
                  onClick={() => navigate("/add-product")}
                  className="text-sm font-medium text-green-600 hover:underline"
                >
                  Add Product
                </button>
              )}

              {role === "admin" && (
                <button
                  onClick={() => navigate("/admin")}
                  className="text-sm font-medium text-purple-600 hover:underline"
                >
                  Control Panel
                </button>
              )}

              <button
                onClick={() => navigate("/profile")}
                className="text-sm font-medium text-gray-700 hover:underline dark:text-gray-200"
              >
                <img
                  src={user.profilePic || "https://via.placeholder.com/32x32/cccccc/000000?text=U"}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
              </button>

              <button
                onClick={signOut}
                className="text-sm font-medium text-red-600 hover:underline"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="text-sm font-medium text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 transition"
            >
              Log In / Sign Up
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
