import api from "./axios";

// export const login = (email: string, password: string) =>
//     api.post("/login", { email, password });

// export const register = (email: string, password: string) =>
//     api.post("/register", { email, password });

export const login = async (email: string, password: string) => {
    if (!email || !password) {
        throw new Error("Email và password là bắt buộc");
    }

    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.data.token);
    return res.data;
};

export const register = async (
    name: string,
    email: string,
    password: string,
    password_confirmation: string
) => {
    if (!name) {
        throw new Error("Name là bắt buộc");
    }
    if (!email) {
        throw new Error("Email là bắt buộc");
    }
    if (!password) {
        throw new Error("Password là bắt buộc");
    }
    if (password !== password_confirmation) {
        throw new Error("Password confirmation không khớp");
    }

    const res = await api.post("/auth/register", {
        name,
        email,
        password,
        password_confirmation,
    });

    localStorage.setItem("token", res.data.data.token);
    return res.data;
};


export const logout = () => api.post("/auth/logout");

export const getUser = () => api.get("/auth/user");
// add
export const forgotPassword = (email: string) => {
    return api.post('/auth/forgot-password', { email });
};

// Admin password reset
export const adminForgotPassword = (email: string) => {
    return api.post('/admin/forgot-password', { email });
};

export const adminResetPassword = (token: string, password: string, passwordConfirmation: string) => {
    return api.post('/admin/reset-password', { 
        token, 
        password, 
        password_confirmation: passwordConfirmation 
    });
};