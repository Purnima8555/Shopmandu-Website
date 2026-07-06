

import axios from "axios";

const apiUrl = import.meta.env.VITE_SERVER_URL;
// console.log("server Url : ", apiUrl)

/// create axios 
const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

export default api;
