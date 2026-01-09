// import React, { useState, useEffect, useContext } from 'react';
// import { Link, useNavigate, useSearchParams } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { AuthContext } from '../context/AuthContext.jsx';
// import axios from "../axios.js";

// export default function LogIn() {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();
//     const [searchParams] = useSearchParams();
//     const { logIn } = useContext(AuthContext);

//     const redirectByRole = (user) => {
//         if (user?.role === "admin") navigate('/admin');
//         else if (user?.role === "seller") navigate('/your-products');
//         else navigate('/');
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);

//         try {
//             const resp = await axios.post("/api/auth/log-in", { email, password });
//             if (resp.status === 200 && resp.data.user) {
//                 logIn(resp.data.user);
//                 toast.success('Logged in successfully');
//                 redirectByRole(resp.data.user);
//             }
//         } catch (err) {
//             if (err.response?.data?.message) toast.error(err.response.data.message);
//             else toast.error("Unexpected error during login");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         const token = searchParams.get('token');
    
//         if (token) {
//             document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24}`;
    
//             (async () => {
//                 try {
//                     const me = await axios.get(
//                         "/api/auth/me",
//                         { withCredentials: true }
//                     );
    
//                     logIn(me.data.user);
//                     toast.success('Logged in successfully');
//                     redirectByRole(me.data.user);
    
//                 } catch (err) {
//                     console.error(err);
//                     toast.error("Failed to fetch user info after login.");
//                     navigate('/');
//                 }
//             })();
//         }
//     }, [searchParams]);
    

//     return (
//         <div className="flex flex-col justify-center items-center h-screen p-4">
//             <h1 className="text-3xl font-bold mb-6">Log In</h1>

//             <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-md gap-4">
//                 <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="border-2 border-gray-400 rounded p-2"/>
//                 <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="border-2 border-gray-400 rounded p-2"/>
//                 <button type="submit" disabled={loading} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">
//                     {loading ? 'Logging in...' : 'Log In'}
//                 </button>
//             </form>

//             <div className="my-4">
//                 <a href={`${import.meta.env.VITE_API_BASE_PROD}/auth/google`} className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition">
//                     Continue with Google
//                 </a>
//             </div>

//             <p>
//                 Don't have an account? <Link className="text-blue-500" to="/sign-up">Sign up</Link>
//             </p>
//         </div>
//     );
// }
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext.jsx';
import axios from "../axios.js";

export default function LogIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { logIn } = useContext(AuthContext);

    const redirectByRole = (user) => {
        if (user?.role === "admin") navigate('/admin');
        else if (user?.role === "seller") navigate('/your-products');
        else navigate('/');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const resp = await axios.post("/api/auth/log-in",
                { email, password },
                { withCredentials: true } // important
            );

            if (resp.status === 200 && resp.data.user) {
                logIn(resp.data.user);
                toast.success('Logged in successfully');
                redirectByRole(resp.data.user);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Unexpected error during login");
        } finally {
            setLoading(false);
        }
    };

    // handle token from OAuth / redirect
    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24}`;
            (async () => {
                try {
                    const me = await axios.get("/api/auth/me", { withCredentials: true });
                    logIn(me.data.user);
                    toast.success('Logged in successfully');
                    redirectByRole(me.data.user);
                } catch (err) {
                    console.error(err);
                    toast.error("Failed to fetch user info after login.");
                    navigate('/');
                }
            })();
        }
    }, [searchParams]);

    return (
        <div className="flex flex-col justify-center items-center h-screen p-4">
            <h1 className="text-3xl font-bold mb-6">Log In</h1>
            <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-md gap-4">
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="border-2 border-gray-400 rounded p-2"/>
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="border-2 border-gray-400 rounded p-2"/>
                <button type="submit" disabled={loading} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">
                    {loading ? 'Logging in...' : 'Log In'}
                </button>
            </form>
            <div className="my-4">
  <a
    href={`${
    //   import.meta.env.VITE_API_BASE 
      import.meta.env.VITE_API_BASE_PROD
    }/auth/google`}
    className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
  >
    Continue with Google
  </a>
</div>

            <p>
                Don't have an account? <Link className="text-blue-500" to="/sign-up">Sign up</Link>
            </p>
        </div>
    );
}
