/**
 * Centralized Axios configuration for all API calls
 * Handles:
 * - Base URL configuration (env-based)
 * - Request timeout
 * - Authentication token injection
 * - Response error handling
 * - Auto-logout on 401
 */

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 second timeout for all requests
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor - attach authentication token
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-access-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - handle common errors
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - logout user
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      console.warn('Session expired. Redirecting to login.');
    }

    // Handle 500 Server Error
    if (error.response?.status === 500) {
      console.error('Server error:', error.response?.data?.message || 'Unknown error');
    }

    // Handle network timeout
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout: API took too long to respond');
    }

    return Promise.reject(error);
  }
);

export default api;
