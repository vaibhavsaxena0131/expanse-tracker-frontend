import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.NODE_APP_BACKEND_URL,
  withCredentials: true
});

export default api;