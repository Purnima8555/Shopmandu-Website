import { create } from "zustand";
import { getAllUsersApi } from "../api/user.api";

const useUserStore = create((set) => ({
    loading: false,
    users: [],
    metadata: {},

    getUsers: async (queryData={}) => {
        set({ loading: true });

        try {
        const res = await getAllUsersApi(queryData);

        set({
            users: res.data || [],
            metadata: res.metadata || {}
        });

        return res;
        } finally {
        set({ loading: false });
        }
    },
}));

export default useUserStore;
