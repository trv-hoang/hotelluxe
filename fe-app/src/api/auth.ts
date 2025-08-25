import api from "./axios";

// export const login = (email: string, password: string) =>
//     api.post("/login", { email, password });

// export const register = (email: string, password: string) =>
//     api.post("/register", { email, password });

export const login = async (email: string, password: string) => {
    if (!email || !password) {
        throw new Error("Email và password là bắt buộc");
    }

    const res = await api.post("/login", { email, password });
    localStorage.setItem("token", res.data.token);
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

    const res = await api.post("/register", {
        name,
        email,
        password,
        password_confirmation,
    });

    localStorage.setItem("token", res.data.token);
    return res.data;
};


export const logout = () => api.post("/logout");

export const getUser = () => api.get("/user");
