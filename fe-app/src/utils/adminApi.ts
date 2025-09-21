// Admin API utility with automatic token handling and refresh using Zustand

import { create } from 'zustand';

interface AdminAPIState {
    isRefreshing: boolean;
    refreshPromise: Promise<boolean> | null;
}

export const useAdminAPIStore = create<AdminAPIState>(() => ({
    isRefreshing: false,
    refreshPromise: null,
}));

export const adminApiCall = async (url: string, options: RequestInit = {}) => {
    const adminToken = localStorage.getItem('admin-token');

    if (!adminToken) {
        throw new Error('No admin token found');
    }

    const defaultHeaders = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${adminToken}`,
    };

    const mergedOptions: RequestInit = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    try {
        let response = await fetch(url, mergedOptions);

        // If token is expired (401), try to refresh and retry
        if (response.status === 401) {
            // Import here to avoid circular dependency
            const { refreshAdminToken } = await import('../store/useAdminAuthStore');
            
            const refreshSuccess = await refreshAdminToken();
            
            if (refreshSuccess) {
                // Retry with new token
                const newToken = localStorage.getItem('admin-token');
                const retryOptions = {
                    ...mergedOptions,
                    headers: {
                        ...mergedOptions.headers,
                        Authorization: `Bearer ${newToken}`,
                    },
                };
                response = await fetch(url, retryOptions);
            } else {
                // Refresh failed, clear session but don't redirect
                localStorage.removeItem('admin-token');
                localStorage.removeItem('admin-user');
                // Only redirect if we're NOT on login page and we're on admin pages
                if (window.location.pathname.startsWith('/admin') && 
                    window.location.pathname !== '/admin/login') {
                    window.location.href = '/admin/login';
                }
                throw new Error('Session expired. Please login again.');
            }
        }

        return response;
    } catch (error) {
        console.error('Admin API call failed:', error);
        throw error;
    }
};

// Helper function to handle JSON responses
export const adminApiCallJson = async (
    url: string,
    options: RequestInit = {},
) => {
    const response = await adminApiCall(url, options);
    return await response.json();
};
