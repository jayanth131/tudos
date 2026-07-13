import axios from 'axios';

const API = axios.create({
  baseURL: 'https://tudos-five.vercel.app//api',
});

// Automatically inject the JWT token into headers if it exists in localStorage
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;