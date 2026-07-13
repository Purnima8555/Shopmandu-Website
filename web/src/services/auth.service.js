import {
  getMeApi,
  loginApi,
  logoutApi,
  registerApi,
  verifyEmailApi,
} from "../api/auth.api";

export const loginService = async (credentials) => {
  const res = await loginApi(credentials);
  return {
    user: {
      _id: res._id,
      email: res.email,
      userName: res.userName,
      roles: res.roles,
      avatar: res.avatar,
    },
    token: res.token,
  };
};
export const registerUserService = async (userData) => {
  return await registerApi(userData);
};

export const verifyEmailService = async (otp) => {
  return await verifyEmailApi({ otp });
};

export const getMeService = async () => {
  return await getMeApi();
};

export const logoutService = async () => {
  await logoutApi();
};