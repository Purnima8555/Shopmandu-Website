import api from "./axios";

/// login request
export const loginApi = async (data) => {
    // console.log("Sending:", data);
    const res = await api.post("api/auth/login", data);
    return res.data;
};

/// register request
export const registerApi = async (data) => {
    const res = await api.post("api/auth/register", data);
    return res.data;
};

/// generate google login url
export const generateGoogleOauthUrl = async ()=>{
    const res = await api.get('api/auth/register')
    console.log(res.data.url)
    return res.data.url
}


//// verify email 
export const verifyEmailApi = async (data) => {
    console.log(data)
    const res = await api.post("api/auth/verify-email", data);
    return res.data;
};

//// user logout
export const logoutApi = async () => {
    const res = await api.post("api/auth/logout");
    return res.data;
};

/// forget password api

export const forgetPasswordApi = async (data) => {
    const res = await api.post("api/auth/forget-password", data)
    return res.data;
}


/// reset password api
export const resetPasswordApi = async (data, id, token) => {
  const res = await api.post( `/api/auth/reset-password/?id=${id}&token=${token}`,data );
  return res.data;
};
/// reset password api
export const resendEmailVerifyOtp = async (data) => {
  const res = await api.post( `/api/auth/resent-otp`, data );
  return res.data;
};

/// get me when app reload 

export const getMeApi = async () => {
  const res = await api.get("/api/auth/me");
  return res?.data;
};