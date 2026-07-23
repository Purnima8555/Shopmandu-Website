

import { create } from "zustand";

import {
  getMeApi,
  loginApi,
  logoutApi,
  registerApi,
  verifyEmailApi,
} from "../../../api/auth.api";


import { updateProfile, updateVendorName } from "../../../api/vendor";
import { updateUserAvatarApi, updateUserNameApi } from "../../../api/user.api";

const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  isAuthenticated: false,
  authChecked: false,

  login: async (credentials) => {
    set({ loading: true });

    try {
      const  user  = await loginApi(credentials);
      set({
        user,
        isAuthenticated: true,
        authChecked: true,
      });

      return user;
    } finally {
      set({ loading: false });
    }
  },

  registerUser: async (userData) => {
    set({ loading: true });

    try {
      return await registerApi(userData);
    } finally {
      set({ loading: false });
    }
  },

  verifyEmail: async (otp) => {
    set({ loading: true });

    try {
      return await verifyEmailApi(otp);
    } finally {
      set({ loading: false });
    }
  },

  getMe: async () => {
    set({ loading: true });
    try {
      const user = await getMeApi();
      set({
        user,
        isAuthenticated: true,
      });
      return user;
    } catch {
      set({
        user: null,
        isAuthenticated: false,
      });
    } finally {
      set({
        loading: false,
        authChecked: true,
      });
    }
  },

  logout: async () => {
    set({ loading: true });

    try {
      await logoutApi();
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  },

  //// Update User Name
  updateVendorUserName: async (data) => {
    try {
      set({ loading: true });
      const res = await updateVendorName(data);
      const updatedData = res?.data;

      set((state) => ({
        user: {
          ...state.user,
          userName: updatedData?.userName,
          mobile: updatedData?.mobile || state.user.mobile,
          avatar: updatedData?.avatar || state.user.avatar,
        },
        loading: false,
      }));
      return res;
    } finally {
      set({ loading: false });
    }
  },

  //// Update Avatar
  updateAvatar: async (image) => {
    try {
      set({ loading: true });
      const res = await updateProfile(image);
      const updatedData = res?.data;

      set((state) => ({
        user: {
          ...state.user,
          avatar: updatedData?.avatar,
        },
        loading: false,
      }));
      return res;
    } finally {
      set({ loading: false });
    }
  },

  // Update User Avatar
  updateUserAvatar: async (image) => {
    try {
      set({ loading: true });

      const res = await updateUserAvatarApi(image);

      set((state) => ({
        user: {
          ...state.user,
          avatar: res.data.avatar,
        },
      }));

      return res;
    } finally {
      set({ loading: false });
    }
  },

  // Update User Name
  updateUserName: async (data) => {
    try {
      set({ loading: true });

      const res = await updateUserNameApi(data);
      const updatedData = res?.data;

      set((state) => ({
        user: {
          ...state.user,
          userName: updatedData?.userName,
          mobile: updatedData?.mobile || state.user.mobile,
          avatar: updatedData?.avatar || state.user.avatar,
        },
      }));

      return res;
    } finally {
      set({ loading: false });
    }
  },
}));

export default useAuthStore;
