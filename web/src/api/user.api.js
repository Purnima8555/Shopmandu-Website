import api from "./axios";


// Update User Avatar
export const updateUserAvatarApi = async (formData) => {
    const res = await api.patch(
        "/api/user/update-avatar",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return res.data;
};

// Update User Name
export const updateUserNameApi = async (param) => {
    const updatedUser = await api.patch(
        "/api/user/update-name",
        param
    );

    return updatedUser.data;
};
export const getAllUsersApi = async (queryData = {}) => {
    const res = await api.get("/api/users/all", {
        params: queryData,
    });

    return res.data;
};
