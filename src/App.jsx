import React, { useState, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Favorites from "./pages/Favorites.jsx";
import LogIn from "./pages/LogIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import AdminPanel from "./admin/AdminPanel.jsx";
import AddProduct from "./components/AddProduct.jsx";
import CartPage from "./pages/CartPage.jsx";
import YourProducts from "./pages/YourProducts.jsx";
import { AuthProvider, AuthContext } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { ThemeProvider, ThemeContext } from "./context/ThemeContext.jsx";
import Success from "./pages/Success.jsx";
import Cancel from "./pages/Cancel.jsx";
import Profile from "./pages/Profile.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return JSON.parse(decodeURIComponent(parts.pop().split(";").shift()));
  return [];
}

function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + encodeURIComponent(JSON.stringify(value)) + expires + "; path=/";
}

export default function App() {
   // 🔥 ADDED: products state
   const [products, setProducts] = React.useState([]);

  // 🔥 ADDED: fetch products from backend
  React.useEffect(() => {
    fetch("https://re-style-backend.vercel.app/api/products" /*"http://localhost:3000/api/products" */)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Failed to load products:", err));
  }, []);

  const [favorites, setFavorites] = useState(() => getCookie("ecom_favs"));
  React.useEffect(() => {
    setCookie("ecom_favs", favorites, 7);
  }, [favorites]);

  const toggleFav = (id) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };

  const [cart, setCart] = useState(() => getCookie("ecom_cart"));
  React.useEffect(() => {
    setCookie("ecom_cart", cart, 7);
  }, [cart]);

  const addToCart = (id) => {
    setCart((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item !== id));
  };

  const AppContent = () => {
    const { theme } = useContext(ThemeContext);
    return (
      <AuthProvider>
        <CartProvider>
          <div className={`flex flex-col min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
          <Navbar favoritesCount={favorites.length} />
          <main className="flex-1 w-full">
            <Routes>
              <Route
                path="/"
                element={
                  <ErrorBoundary>
                    <Home
                      products={products} // 🔥 ADDED
                      favorites={favorites}
                      toggleFav={toggleFav}
                      cart={cart}
                      addToCart={addToCart}
                      removeFromCart={removeFromCart}
                    />
                  </ErrorBoundary>
                }
              />

              <Route
                path="/favorites"
                element={
                  <Favorites
                    products={products} // 🔥 ADDED
                    favorites={favorites}
                    toggleFav={toggleFav}
                    cart={cart}
                    addToCart={addToCart}
                    removeFromCart={removeFromCart}
                  />
                }
              />

              <Route path="/auth" element={<LogIn />} />
              <Route path="/log-in" element={<LogIn />} />
              <Route path="/sign-up" element={<SignUp />} />

              {/* <Route
                path="/discounts"
                element={
                  <DiscountFeed
                    products={products} // 🔥 ADDED
                    favorites={favorites}
                    toggleFav={toggleFav}
                    cart={cart}
                    addToCart={addToCart}
                    removeFromCart={removeFromCart}
                  />
                }
              /> */}

              <Route path="/cart" element={<CartPage />} />
              <Route path="/admin" element={<RequireAdmin><AdminPanel /></RequireAdmin>} />
              <Route path="/add-product" element={<RequireSeller><AddProduct /></RequireSeller>} />

              <Route
                path="/your-products"
                element={
                  <RequireSeller>
                    <YourProducts
                      toggleFav={toggleFav}
                      cart={cart}
                      addToCart={addToCart}
                      removeFromCart={removeFromCart}
                    />
                  </RequireSeller>
                }
              />

              <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />

              <Route path="/success" element={<Success />} />
              <Route path="/cancel" element={<Cancel />} />

              <Route
                path="/product/:productId"
                element={
                  <ProductDetails
                    products={products} // 🔥 ADDED
                    favorites={favorites}
                    toggleFav={toggleFav}
                  />
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
        </CartProvider>
      </AuthProvider>
    );
  };

  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function RequireAdmin({ children }) {
  const { user } = useContext(AuthContext);
  if (!user || user.role !== "admin") return <Navigate to="/auth" />;
  return children;
}

function RequireSeller({ children }) {
  const { user } = useContext(AuthContext);
  if (!user || (user.role !== "seller" && user.role !== "admin")) return <Navigate to="/auth" />;
  return children;
}

function RequireAuth({ children }) {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/auth" />;
  return children;
}
