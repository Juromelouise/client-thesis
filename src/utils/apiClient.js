import axios from "axios";
import { getToken } from "./helpers";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_KEY,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
