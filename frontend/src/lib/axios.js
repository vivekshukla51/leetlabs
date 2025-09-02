import axios from "axios";

export const axiosInstance = axios.create({
  // Allow overriding API base URL via env (useful for Vercel -> Render)
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.MODE === "development"
      ? "http://localhost:8081/api/v1"
      : "/api/v1"),
  withCredentials: true,
});
