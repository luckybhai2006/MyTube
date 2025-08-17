import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1", // change this to your backend base URL
  withCredentials: true,
});

export default axiosInstance;
