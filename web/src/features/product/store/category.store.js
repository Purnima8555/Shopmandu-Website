

import { create } from "zustand";

import {
    createCategoryApi,
    getAllCategoriesApi,
    getCategoryByIdApi,
    updateCategoryApi,
    toggleCategoryStatusApi,
    deleteCategoryApi,
} from "../../../api/category.api";

const useCategoryStore = create((set, get) => ({
    loading: false,

    categories: [],
    categoryMetadata: null,
    selectedCategory: null,

    /// Get all categories
    getAllCategories: async (params = {}) => {
        set({ loading: true });

        try {
            const res = await getAllCategoriesApi(params);

            set({
                categories: res.data || [],
                categoryMetadata: res.metadata,
            });

            return res;
        } finally {
            set({ loading: false });
        }
    },

    /// Get category by ID
    getCategoryById: async (categoryId) => {
        set({ loading: true });

        try {
            const res = await getCategoryByIdApi(categoryId);

            set({
                selectedCategory: res.category,
            });

            return res;
        } finally {
            set({ loading: false });
        }
    },

    /// Create category
    createCategory: async (data) => {
        set({ loading: true });

        try {
            const res = await createCategoryApi(data);

            await get().getAllCategories();

            return res;
        } finally {
            set({ loading: false });
        }
    },

    /// Update category
    updateCategory: async (categoryId, data) => {
        set({ loading: true });

        try {
            const res = await updateCategoryApi(categoryId, data);

            await get().getAllCategories();

            return res;
        } finally {
            set({ loading: false });
        }
    },

    /// Toggle category status
    toggleCategoryStatus: async (categoryId) => {
        set({ loading: true });

        try {
            const res = await toggleCategoryStatusApi(categoryId);

            await get().getAllCategories();

            return res;
        } finally {
            set({ loading: false });
        }
    },

    /// Delete category
    deleteCategory: async (categoryId) => {
        set({ loading: true });

        try {
            const res = await deleteCategoryApi(categoryId);

            await get().getAllCategories();

            return res;
        } finally {
            set({ loading: false });
        }
    },
}));

export default useCategoryStore;

