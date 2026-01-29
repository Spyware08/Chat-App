import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
const API = axios.create({
    // baseURL: "http://192.168.31.107:8000/",
    baseURL: API_URL,
    timeout: 10000, // 10 seconds in milliseconds
    headers: {
        "Content-Type": "application/json",
        
    },
    withCredentials: true
});
export default API;