import api from "./axios";

/// Create category
export const createCategoryApi = async (data) => {
    const res = await api.post("/api/category", data);
    return res.data;
};

/// Get all categories
export const getAllCategoriesApi = async (params = {}) => {
    const res = await api.get("/api/category", {
        params,
    });
    return res.data;
};

/// Get category by ID
export const getCategoryByIdApi = async (categoryId) => {
    const res = await api.get(`/api/category/${categoryId}`);
    return res.data;
};

/// Update category
export const updateCategoryApi = async (categoryId, data) => {
    const res = await api.put(`/api/category/${categoryId}`, data);
    return res.data;
};

/// Toggle category status
export const toggleCategoryStatusApi = async (categoryId) => {
    const res = await api.patch(`/api/category/${categoryId}/toggle-status`);
    return res.data;
};

/// Delete category
export const deleteCategoryApi = async (categoryId) => {
    const res = await api.delete(`/api/category/${categoryId}`);
    return res.data;
};
