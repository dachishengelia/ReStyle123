// import React, { useState, useContext } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { AuthContext } from '../context/AuthContext.jsx';

// export default function SignUp() {
//   const [fullName, setFullName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();
//   const { logIn } = useContext(AuthContext);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const resp = await fetch(
//         `${import.meta.env.VITE_API_BASE}/api/auth/register`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ fullName, email, password }),
//           credentials: "include", // important to handle cookies
//         }
//       );

//       const data = await resp.json();

//       if (resp.status === 201) {
//         // If backend returns user, log them in immediately
//         if (data.user) logIn(data.user);

//         toast.success('User registered successfully');

//         // Redirect depending on role
//         if (data.user?.role === 'admin') {
//           navigate('/admin');
//         } else {
//           navigate('/');
//         }
//       } else {
//         toast.error(data.message || "Registration failed");
//         console.log(data);
//       }
//     } catch (e) {
//       toast.error(e.message || "Something went wrong");
//       console.error(e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col justify-center items-center h-screen">
//       <h1>Sign-up</h1>

//       <form onSubmit={handleSubmit} className="flex flex-col w-[400px] gap-2">
//         <input
//           type="text"
//           placeholder="Full Name"
//           value={fullName}
//           onChange={(e) => setFullName(e.target.value)}
//           required
//           className="border-2 border-black p-2 rounded"
//         />
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//           className="border-2 border-black p-2 rounded"
//         />
//         <input
//           type="password"
//           placeholder="********"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//           className="border-2 border-black p-2 rounded"
//         />

//         <button
//           type="submit"
//           className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
//         >
//           {loading ? 'Loading...' : 'Sign-up'}
//         </button>

//         <h2 className="mt-2">
//           Already have an account? <Link to={'/sign-in'} className="text-blue-500">Sign-in</Link>
//         </h2>
//       </form>
//     </div>
//   );
// }
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext.jsx';
import axios from "../axios.js";

export default function SignUp() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { logIn } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const resp = await axios.post(
        "/api/auth/register",
        { 
          username: fullName, // must be exactly "username"
          email,
          password
        },
        { withCredentials: true } // important to send cookies
      );
  
      const data = resp.data;
  
      if (resp.status === 201) {
        if (data.user) logIn(data.user); // update context immediately
        toast.success('User registered successfully');
  
        // Redirect depending on role
        if (data.user?.role === 'admin') navigate('/admin');
        else if (data.user?.role === 'seller') navigate('/your-products');
        else navigate('/');
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (e) {
      toast.error(e.response?.data?.message || e.message || "Something went wrong");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex flex-col justify-center items-center h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-md gap-4">
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          required
          className="border-2 border-gray-400 rounded p-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="border-2 border-gray-400 rounded p-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="border-2 border-gray-400 rounded p-2"
        />
        <button type="submit" disabled={loading} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
      </form>
      <p className="mt-4">
        Already have an account? <Link to="/log-in" className="text-blue-500">Log In</Link>
      </p>
    </div>
  );
}
