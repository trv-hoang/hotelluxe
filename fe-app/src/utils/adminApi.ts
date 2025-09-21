// Admin API utility with automatic token handling and refresh

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

const refreshAdminToken = async (): Promise<boolean> => {
    if (isRefreshing && refreshPromise) {
        return refreshPromise;
    }

    isRefreshing = true;
    refreshPromise = (async () => {
        try {
            const adminToken = localStorage.getItem('admin-token');
            if (!adminToken) {
                return false;
            }

            const response = await fetch('http://localhost:8000/api/auth/refresh', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${adminToken}`,
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    localStorage.setItem('admin-token', data.data.token);
                    return true;
                }
            }
            
            return false;
        } catch (error) {
            console.error('Token refresh failed:', error);
            return false;
        } finally {
            isRefreshing = false;
            refreshPromise = null;
        }
    })();

    return refreshPromise;
};

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
                // Refresh failed, redirect to login
                localStorage.removeItem('admin-token');
                localStorage.removeItem('admin-user');
                window.location.href = '/admin/login';
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
