import axios from 'axios';

/**
 * API Configuration
 * 
 * Uses VITE_API_URL environment variable for the backend URL.
 * For local development: http://localhost:5000
 * For production: https://smart-bookmark-app-cune.onrender.com
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 second timeout
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('[API] Unauthorized - redirecting to login');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;
export { API_BASE_URL };
