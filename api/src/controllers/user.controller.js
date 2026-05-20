import {
  forgotPasswordSchema,
  googleLoginSchema,
  loginSchema,
  resetPasswordSchema,
  verifyOtpSchema,
  updateUserSchema,
} from "../libs/schema/auth.schema.js";

import { upload } from "../middleware/multer.middleware.js";
import validate from "../middleware/validator.js";

import * as userService from "../services/user.service.js";

// //
// // GOOGLE LOGIN
// //
// export const googleLogin = [
//   validate(googleLoginSchema),

//   async (req, res) => {
//     try {
//       const result = await userService.googleLoginUser(req.body.idToken);

//       res.status(200).json({
//         success: true,
//         message: "Google login successful",
//         ...result,
//       });
//     } catch (error) {
//       console.error("Google Login Error:", error);

//       res.status(error.status || 500).json({
//         success: false,
//         message: error.message || "Invalid Google token",
//       });
//     }
//   },
// ];

//
// REGISTER
//
export const register = [
  upload.single("avatar"),

  async (req, res) => {
    try {
      const result = await userService.registerUser(req.body, req.file);

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        ...result,
      });
    } catch (error) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message,
      });
    }
  },
];

//
// LOGIN
//
export const login = [
  validate(loginSchema),

  async (req, res) => {
    try {
      const result = await userService.loginUser(
        req.body.email,
        req.body.password,
      );

      res.status(200).json({
        success: true,
        message: "Login successful",
        ...result,
      });
    } catch (error) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message,
      });
    }
  },
];

//
// GET ALL USERS
//
export const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsersService();

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//
// GET USER BY ID
//
export const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserByIdService(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Invalid ID format or Server Error",
    });
  }
};

//
// UPDATE USER
//
export const updateUser = [
  validate(updateUserSchema),

  async (req, res) => {
    try {
      const updatedUser = await userService.updateUserService(
        req.user.id,
        req.params.id,
        req.body,
      );

      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message,
      });
    }
  },
];

//
// DELETE USER
//
export const deleteUser = async (req, res) => {
  try {
    const result = await userService.deleteUserService(
      req.user.id,
      req.params.id,
    );

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

//
// FORGOT PASSWORD
//
export const forgotPassword = [
  validate(forgotPasswordSchema),

  async (req, res) => {
    try {
      await userService.sendForgotPasswordOtpService(req.body.email);

      res.status(200).json({
        success: true,
        message: "If that email is registered, an OTP has been sent.",
      });
    } catch (error) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message,
      });
    }
  },
];

//
// VERIFY OTP
//
export const verifyOtp = [
  validate(verifyOtpSchema),

  async (req, res) => {
    try {
      await userService.verifyOtpService(req.body.email, req.body.otp);

      res.status(200).json({
        success: true,
        message: "OTP verified successfully",
      });
    } catch (error) {
      res.status(error.status || 400).json({
        success: false,
        message: error.message,
      });
    }
  },
];

//
// RESET PASSWORD
//
export const resetPassword = [
  validate(resetPasswordSchema),

  async (req, res) => {
    try {
      const { email, otp, newPassword } = req.body;

      await userService.resetPasswordService(email, otp, newPassword);

      res.status(200).json({
        success: true,
        message: "Password reset successful",
      });
    } catch (error) {
      res.status(error.status || 400).json({
        success: false,
        message: error.message,
      });
    }
  },
];
