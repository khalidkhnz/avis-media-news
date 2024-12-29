import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api/v1",
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
