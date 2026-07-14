import api from "./axios";

/// Get all users
export const getAllUsersApi = async (queryData = {}) => {
    const res = await api.get("/api/users/all", {
        params: queryData,
    });

    return res.data;
};
