// src/api/axios.js
// Central API configuration

import axios from 'axios';

const API = axios.create({
  baseURL: 'https://womensaftey-app.netlify.app/register'
});

// Attach token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;