import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Thêm interceptor cho request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("user-token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Thêm interceptor cho response
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Chỉ xử lý 401 cho user auth, không ảnh hưởng admin
            localStorage.removeItem("user-token");
            // Chỉ redirect nếu đang ở protected routes và không phải admin route
            const currentPath = window.location.pathname;
            const isAdminRoute = currentPath.startsWith('/admin');
            const isProtectedRoute = ['/profile', '/my-bookings', '/cart'].some(route => 
                currentPath.startsWith(route)
            );
            
            if (!isAdminRoute && isProtectedRoute) {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);
export default api;
