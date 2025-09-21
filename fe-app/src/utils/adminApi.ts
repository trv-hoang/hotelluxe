// Admin API utility with automatic token handling

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
        const response = await fetch(url, mergedOptions);

        // If token is expired (401), clear admin session and redirect
        if (response.status === 401) {
            localStorage.removeItem('admin-token');
            localStorage.removeItem('admin-user');
            window.location.href = '/admin/login';
            throw new Error('Session expired. Please login again.');
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
