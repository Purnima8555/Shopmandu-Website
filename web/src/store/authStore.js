import { create } from "zustand";

import {
  loginService,
  registerUserService,
  verifyEmailService,
  getMeService,
  logoutService,
} from "../services/auth.service";
import { updateProfile, updateVendorName } from "../api/vendor";

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  loading: false,
  isAuthenticated: false,
  authChecked: false,

  login: async (credentials) => {
    set({ loading: true });

    try {
      const { user, token } = await loginService(credentials);

      set({
        user,
        token,
        isAuthenticated: true,
      });

      return { user, token };
    } finally {
      set({ loading: false });
    }
  },

  registerUser: async (userData) => {
    set({ loading: true });

    try {
      return await registerUserService(userData);
    } finally {
      set({ loading: false });
    }
  },

  verifyEmail: async (otp) => {
    set({ loading: true });

    try {
      return await verifyEmailService(otp);
    } finally {
      set({ loading: false });
    }
  },

  getMe: async () => {
    set({ loading: true });
    try {
      const user = await getMeService();
      set({
        user,
        isAuthenticated: true,
      });
      return user;
    } catch {
      set({
        user: null,
        token: null,
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
      await logoutService();
    } finally {
      set({
        user: null,
        token: null,
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
        loading: false
      }));
      return res;
    } finally  {
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
        loading: false
      }));
      return res;
    } finally {
      set({ loading: false });
    }
  }




}));

export default useAuthStore;