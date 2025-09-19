import api from "./axios";

export const getProfile = () => api.get("/auth/profile");
export const updateProfile = (data: any) => api.put("/auth/profile", data);
