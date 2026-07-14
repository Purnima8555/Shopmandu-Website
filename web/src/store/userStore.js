import { create } from "zustand";
import { getAllUsersApi,} from "../api/user.api";

const useUserStore = create((set) => ({
    loading: false,

    users: [],

    // get all
    getUsers: async () => {
        set({ loading: true });

        try {
        const res = await getAllUsersApi();

        set({
            users: res.data || [],
        });

        return res;
        } finally {
        set({ loading: false });
        }
    },
}));

export default useUserStore;
