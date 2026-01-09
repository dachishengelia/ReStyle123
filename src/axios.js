import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development"
    ? import.meta.env.VITE_API_BASE
    : import.meta.env.VITE_API_BASE_PROD,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      !["/auth", "/sign-up", "/log-in"].includes(window.location.pathname)
    ) {
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
