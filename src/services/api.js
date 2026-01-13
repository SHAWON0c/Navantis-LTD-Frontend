import axios from "axios";

// 1️⃣ Create Axios instance
const api = axios.create({
  baseURL: "http://localhost:5000/api", // Replace with your backend
  headers: {
    "Content-Type": "application/json",
  },
});

// 2️⃣ Request interceptor: attach token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // get token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3️⃣ Response interceptor: handle global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject({ message: "Network Error" });
  }
);

export default api;
