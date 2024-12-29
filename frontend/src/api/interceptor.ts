import { CONFIG } from "@/lib/config";
import axios from "axios";

const API = axios.create({
  baseURL: CONFIG.API_BASE_URL,
});

API.interceptors.request.use((config) => {
  if (localStorage) {
    let state = localStorage.getItem("news-app");
    if (state) {
      const { token } = JSON.parse(state) as { token: string };
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  }
  return config;
});

export default API;
