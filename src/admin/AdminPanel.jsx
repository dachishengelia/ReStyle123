// import React, { useEffect, useState, useContext } from "react";
// import axios from "../axios.js";
// import { AuthContext } from "../context/AuthContext.jsx";
// import { ThemeContext } from "../context/ThemeContext.jsx";

// const AdminPanel = () => {
//    const { user, fetchUser } = useContext(AuthContext);
//    const { theme } = useContext(ThemeContext);
//    const [stats, setStats] = useState({ totalUsers: 0, buyers: 0, sellers: 0, admins: 0 });
//    const [users, setUsers] = useState([]);
//    const [loading, setLoading] = useState(true);
//    const [products, setProducts] = useState([]);
//    const [searchQuery, setSearchQuery] = useState("");

//   const fetchStats = async () => {
//     try {
//       const res = await axios.get("/admin/stats");
//       setStats(res.data);
//     } catch (err) {
//       console.error("Failed to fetch stats:", err);
//     }
//   };

//   const fetchUsers = async () => {
//     try {
//       const res = await axios.get("/admin/users");
//       setUsers(res.data);
//     } catch (err) {
//       console.error("Failed to fetch users:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchProducts = async () => {
//     try {
//       const res = await axios.get("/api/products");
//       setProducts(res.data);
//     } catch (err) {
//       console.error("Failed to fetch products:", err);
//     }
//   };

//   const deleteUser = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this user?")) return;
//     try {
//       await axios.delete(`/admin/users/${id}`);
//       setUsers(users.filter((user) => user._id !== id));
//     } catch (err) {
//       console.error("Failed to delete user:", err);
//       alert("Failed to delete user");
//     }
//   };

//   const changeUserRole = async (id, newRole) => {
//     try {
//       const res = await axios.patch(`/admin/users/${id}/role`, { role: newRole });
//       setUsers(users.map((u) => (u._id === id ? res.data : u)));
//     } catch (err) {
//       console.error("Failed to update role:", err);
//       alert("Failed to update role");
//     }
//   };

//   const handleDeleteProduct = async (productId) => {
//     try {
//       await axios.delete(`/api/products/admin/${productId}`);
//       setProducts(products.filter((product) => product._id !== productId));
//       alert("Product deleted successfully");
//     } catch (err) {
//       console.error("Failed to delete product:", err.message);
//       alert("Failed to delete product");
//     }
//   };

//   useEffect(() => {
//     if (!user) {
//       fetchUser();
//     }
//     fetchStats();
//     fetchUsers();
//     fetchProducts();
//   }, [user]);

//   if (loading) return <div className="text-center py-10">Loading admin panel...</div>;

//   return (
//     <div className={`flex items-center justify-center min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
//       <div className={`p-6 w-[90%] ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow-md`}>
//         <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-200">Admin Dashboard</h1>

//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-4 rounded-lg shadow">
//             <h2 className="text-lg font-semibold">Total Users</h2>
//             <p className="text-2xl font-bold">{stats.totalUsers}</p>
//           </div>
//           <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-4 rounded-lg shadow">
//             <h2 className="text-lg font-semibold">Buyers</h2>
//             <p className="text-2xl font-bold">{stats.buyers}</p>
//           </div>
//           <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 p-4 rounded-lg shadow">
//             <h2 className="text-lg font-semibold">Sellers</h2>
//             <p className="text-2xl font-bold">{stats.sellers}</p>
//           </div>
//           <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-lg shadow">
//             <h2 className="text-lg font-semibold">Admins</h2>
//             <p className="text-2xl font-bold">{stats.admins}</p>
//           </div>
//         </div>

//         <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-200">All Users</h2>
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse border border-gray-200 dark:border-gray-600 rounded-lg shadow">
//             <thead className="bg-gray-100 dark:bg-gray-700">
//               <tr>
//                 <th className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-gray-200">Username</th>
//                 <th className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-gray-200">Email</th>
//                 <th className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-gray-200">Role</th>
//                 <th className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-gray-200">Change Role</th>
//                 <th className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-gray-200">Delete</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.map((u) => (
//                 <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
//                   <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-gray-200">{u.username}</td>
//                   <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-gray-200">{u.email}</td>
//                   <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-gray-200">{u.role}</td>
//                   <td className="border border-gray-200 dark:border-gray-600 px-4 py-2">
//                     <select
//                       value={u.role}
//                       onChange={(e) => changeUserRole(u._id, e.target.value)}
//                       className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
//                     >
//                       <option value="buyer">Buyer</option>
//                       <option value="seller">Seller</option>
//                       <option value="admin">Admin</option>
//                     </select>
//                   </td>
//                   <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-center">
//                     <button
//                       onClick={() => deleteUser(u._id)}
//                       className="bg-red-500 dark:bg-red-600 text-white px-4 py-2 rounded hover:bg-red-600 dark:hover:bg-red-700"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-gray-200">All Products</h2>
//         <input
//           type="text"
//           placeholder="Search products..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="border border-gray-300 dark:border-gray-600 p-2 rounded w-full mb-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
//         />
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse border border-gray-200 dark:border-gray-600 rounded-lg shadow">
//             <thead className="bg-gray-100 dark:bg-gray-700">
//               <tr>
//                 <th className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-gray-200">Name</th>
//                 <th className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-gray-200">Price</th>
//                 <th className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-gray-200">Category</th>
//                 <th className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-gray-200">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {products
//                 .filter((product) =>
//                   product.name.toLowerCase().includes(searchQuery.toLowerCase())
//                 )
//                 .map((product) => (
//                   <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
//                     <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-gray-200">{product.name}</td>
//                     <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-gray-200">{product.price} GEL</td>
//                     <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-gray-200">{product.category}</td>
//                     <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-center">
//                       <button
//                         onClick={() => handleDeleteProduct(product._id)}
//                         className="bg-red-500 dark:bg-red-600 text-white px-4 py-2 rounded hover:bg-red-600 dark:hover:bg-red-700"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminPanel;



import React, { useEffect, useState, useContext } from "react";
import axios from "../axios.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { ThemeContext } from "../context/ThemeContext.jsx";

const AdminPanel = () => {
  const { user, fetchUser } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const [stats, setStats] = useState({ totalUsers: 0, buyers: 0, sellers: 0, admins: 0 });
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchStats = async () => {
    try {
      const res = await axios.get("/admin/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`/admin/users/${id}`);
      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("Failed to delete user");
    }
  };

  const changeUserRole = async (id, newRole) => {
    try {
      const res = await axios.patch(`/admin/users/${id}/role`, { role: newRole });
      setUsers(users.map((u) => (u._id === id ? res.data : u)));
    } catch (err) {
      console.error("Failed to update role:", err);
      alert("Failed to update role");
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`/api/products/admin/${productId}`);
      setProducts(products.filter((product) => product._id !== productId));
      alert("Product deleted successfully");
    } catch (err) {
      console.error("Failed to delete product:", err.message);
      alert("Failed to delete product");
    }
  };

  useEffect(() => {
    if (!user) fetchUser();
    fetchStats();
    fetchUsers();
    fetchProducts();
  }, [user]);

  if (loading)
    return <div className={`text-center py-10 ${theme === "dark" ? "text-gray-200" : "text-gray-900"}`}>Loading admin panel...</div>;

  // Define border colors based on theme
  const borderColor = theme === "dark" ? "border-gray-600" : "border-gray-400";

  return (
    <div className={`flex items-center justify-center min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"}`}>
      <div className={`p-6 w-[90%] rounded-lg shadow-md ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
        <h1 className={`text-3xl font-bold mb-6 text-center ${theme === "dark" ? "text-gray-200" : "text-gray-900"}`}>
          Admin Dashboard
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Users", value: stats.totalUsers, color: "blue" },
            { label: "Buyers", value: stats.buyers, color: "green" },
            { label: "Sellers", value: stats.sellers, color: "yellow" },
            { label: "Admins", value: stats.admins, color: "red" },
          ].map((item) => (
            <div
              key={item.label}
              className={`p-4 rounded-lg shadow ${
                theme === "dark"
                  ? `bg-${item.color}-900 text-${item.color}-200`
                  : `bg-${item.color}-100 text-${item.color}-800`
              }`}
            >
              <h2 className="text-lg font-semibold">{item.label}</h2>
              <p className="text-2xl font-bold">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Users Table */}
        <h2 className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-gray-200" : "text-gray-900"}`}>
          All Users
        </h2>
        <div className="overflow-x-auto">
          <table className={`w-full border-collapse rounded-lg shadow`}>
            <thead className={`${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
              <tr>
                {["Username", "Email", "Role", "Change Role", "Delete"].map((th) => (
                  <th
                    key={th}
                    className={`px-4 py-2 border ${borderColor} ${theme === "dark" ? "text-gray-200" : "text-gray-900"}`}
                  >
                    {th}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className={`hover:${theme === "dark" ? "bg-gray-600" : "bg-gray-50"}`}>
                  <td className={`px-4 py-2 border ${borderColor} ${theme === "dark" ? "text-gray-200" : "text-gray-900"}`}>{u.username}</td>
                  <td className={`px-4 py-2 border ${borderColor} ${theme === "dark" ? "text-gray-200" : "text-gray-900"}`}>{u.email}</td>
                  <td className={`px-4 py-2 border ${borderColor} ${theme === "dark" ? "text-gray-200" : "text-gray-900"}`}>{u.role}</td>
                  <td className={`px-4 py-2 border ${borderColor}`}>
                    <select
                      value={u.role}
                      onChange={(e) => changeUserRole(u._id, e.target.value)}
                      className={`border rounded px-2 py-1 w-full ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-gray-200"
                          : "bg-white border-gray-400 text-gray-900"
                      }`}
                    >
                      <option value="buyer">Buyer</option>
                      <option value="seller">Seller</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className={`px-4 py-2 border ${borderColor} text-center`}>
                    <button
                      onClick={() => deleteUser(u._id)}
                      className="bg-red-500 dark:bg-red-600 text-white px-4 py-2 rounded hover:bg-red-600 dark:hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Products Table */}
        <h2 className={`text-2xl font-bold mt-8 mb-4 ${theme === "dark" ? "text-gray-200" : "text-gray-900"}`}>
          All Products
        </h2>
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`border rounded p-2 w-full mb-4 ${
            theme === "dark"
              ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400"
              : "bg-white border-gray-400 text-gray-900 placeholder-gray-500"
          }`}
        />
        <div className="overflow-x-auto">
          <table className={`w-full border-collapse rounded-lg shadow`}>
            <thead className={`${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
              <tr>
                {["Name", "Price", "Category", "Actions"].map((th) => (
                  <th
                    key={th}
                    className={`px-4 py-2 border ${borderColor} ${theme === "dark" ? "text-gray-200" : "text-gray-900"}`}
                  >
                    {th}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products
                .filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((product) => (
                  <tr key={product._id} className={`hover:${theme === "dark" ? "bg-gray-600" : "bg-gray-50"}`}>
                    <td className={`px-4 py-2 border ${borderColor} ${theme === "dark" ? "text-gray-200" : "text-gray-900"}`}>
                      {product.name}
                    </td>
                    <td className={`px-4 py-2 border ${borderColor} ${theme === "dark" ? "text-gray-200" : "text-gray-900"}`}>
                      {product.price} GEL
                    </td>
                    <td className={`px-4 py-2 border ${borderColor} ${theme === "dark" ? "text-gray-200" : "text-gray-900"}`}>
                      {product.category}
                    </td>
                    <td className={`px-4 py-2 border ${borderColor} text-center`}>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="bg-red-500 dark:bg-red-600 text-white px-4 py-2 rounded hover:bg-red-600 dark:hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
