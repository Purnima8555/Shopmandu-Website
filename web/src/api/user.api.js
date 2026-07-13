import api from "./axios";

/// Get all users
export const getAllUsersApi = async () => {
    const res = await api.get("/api/users/all");
    return res.data;
};
