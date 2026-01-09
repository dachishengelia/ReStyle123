// import React, { createContext, useState, useEffect } from "react";
// import axios from "../axios.js";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Fetch current logged-in user
//   const fetchUser = async () => {
//     try {
//       const { data } = await axios.get("/api/auth/me", {
//         withCredentials: true, // send cookies
//       });
//       setUser(data.user || null);
//     } catch (err) {
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Log in user after signup/login
//   const logIn = (userData) => {
//     setUser(userData);
//     setLoading(false);
//   };

//   // Sign out user
//   const signOut = async () => {
//     try {
//       // Backend clears the cookie
//       await axios.post(
//         "/api/auth/logout",
//         {},
//         { withCredentials: true } // send cookie to clear it
//       );
//     } catch (err) {
//       console.error("Sign out failed:", err.message);
//     } finally {
//       setUser(null); // clear frontend state
//       setLoading(false);
//     }
//   };

//   // Fetch user on app start
//   useEffect(() => {
//     fetchUser();
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>; // optional spinner
//   }

//   return (
//     <AuthContext.Provider value={{ user, logIn, signOut, fetchUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
import React, { createContext, useState, useEffect } from "react";
import axios from "../axios.js";

function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function removeCookie(name) {
  document.cookie = name + "=; Max-Age=0; path=/;";
}

// Create Auth Context
export const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user info from backend using cookie
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/auth/me", { withCredentials: true });
      setUser(data.user || null);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Log in user and store token in cookie if provided
  const logIn = (userData) => {
    if (!userData) return;
    setUser(userData);
    if (userData?.token) setCookie("token", userData.token, 1);
  };

  // Logout user: clear cookie + context
  const signOut = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout failed:", err.message);
    } finally {
      setUser(null);
      removeCookie("token");
    }
  };

  // On component mount, check if user is already logged in
  useEffect(() => {
    fetchUser();
  }, []);

  // Show loading screen while checking auth
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold">
        Loading...
      </div>
    );
  }

  return (
<AuthContext.Provider value={{ user, loading, logIn, signOut, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};
