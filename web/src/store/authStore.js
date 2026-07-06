

import { create } from "zustand";
import { loginApi, registerApi, verifyEmailApi, logoutApi, getMeApi,} from "../api/auth.api";

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  loading: false,
  isAuthenticated: false,
  authChecked: false,

  login: async (data) => {
    try {
      set({ loading: true });
      const res = await loginApi(data);
      set({
        user: {
          _id: res._id,
          email: res.email,
          userName: res.userName,
          roles: res.roles,
          avatar: res.avatar,
        },
        token: res.token,
        isAuthenticated: true,
      });
      //   localStorage.setItem("authToken", res.token);
      return res;
    } catch (error) {
      throw error.response?.data || error;
    } finally {
      set({ loading: false });
    }
  },

  registerUser: async (data) => {
    try {
      set({ loading: true });
      const res = await registerApi(data);
      return res;
    } catch (error) {
      throw error.response?.data || error;
    } finally {
      set({ loading: false });
    }
  },

  verifyEmail: async (otp) => {
    try {
      set({ loading: true });
      const res = await verifyEmailApi({ otp });
      return res;
    } catch (error) {
      throw error.response?.data || error;
    } finally {
      set({ loading: false });
    }
  },

  getMe: async () => {
    try {
      const user = await getMeApi();
      // console.log("User:", user);
      set({
        user,
        isAuthenticated: true,
      });
      // console.log("after set:", useAuthStore.getState());
    } catch (error) {
      console.log(error);
      set({
        user: null,
        isAuthenticated: false,
      });
    } finally {
      // runs whether getMe succeeded or failed — either way, "checking" is done
      set({ authChecked: true });
    }
  },

  logout: async () => {
    try {
      await logoutApi();
    } finally {
      //// localStorage.removeItem("token");
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    }
  },
}));

export default useAuthStore;