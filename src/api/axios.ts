import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true
});

export default api;