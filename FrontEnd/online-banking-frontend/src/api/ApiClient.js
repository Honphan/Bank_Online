import axios from 'axios';

// Cấu hình base URL cho API
const API_URL = `${import.meta.env.VITE_API_URL}/api`;
console.log('API URL:', API_URL);

// Tạo instance axios với các cấu hình mặc định
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để tự động thêm token vào header
apiClient.interceptors.request.use(
    (config) => {
        // BỎ QUA token cho các endpoint auth
        const isAuthPath = config.url?.startsWith('/auth/');
        if (!isAuthPath) {
          const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
);

// Thêm interceptor để xử lý response
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
);

export default apiClient;