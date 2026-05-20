import bcrypt from "bcryptjs";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";

import UserModel from "../models/user.model.js";
import Otp from "../models/otp_model.js";

import Roles from "../constants/userRoles.js";
import authProvider from "../constants/authProvider.js";

import { sendWelcomeEmail, sendOtpEmail } from "../utils/email.js";
import { generateToken } from "../utils/jwt.js";
import cloudinaryUpload from "../utils/CloudinaryUpload.js";

const client = new OAuth2Client(process.env.CLIENT_ID);

//
// REGISTER USER
//
export const registerUser = async (data, file) => {
  const { userName, email, password, mobile } = data;

  // Check existing user
  const existingUser = await UserModel.findOne({ email });

  if (existingUser) {
    throw {
      status: 409,
      message: "Email already registered",
    };
  }

  let avatar = null;

  // Upload avatar if exists
  if (file) {
    const uploadResult = await cloudinaryUpload.uploadSingleImage(file);

    avatar = uploadResult.secure_url;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await UserModel.create({
    userName,
    email,
    mobile,
    password: hashedPassword,
    avatar,

    roles: [Roles.USER_ROLE],

    authProvider: [authProvider.LOCAL],
  });

  // Send email
  sendWelcomeEmail(user).catch(console.error);

  // Generate JWT
  const token = generateToken(user);

  return {
    token,

    user: {
      id: user._id,
      userName: user.userName,
      email: user.email,
      mobile: user.mobile,
      roles: user.roles,
      avatar: user.avatar,
    },
  };
};

// //
// // GOOGLE LOGIN
// //
// export const googleLoginUser = async (idToken) => {
//   const ticket = await client.verifyIdToken({
//     idToken,
//     audience: process.env.CLIENT_ID,
//   });

//   const { sub: googleId, email, name, picture } = ticket.getPayload();

//   let user = await UserModel.findOne({
//     $or: [{ googleId }, { email }],
//   });

//   // Create new Google user
//   if (!user) {
//     user = await UserModel.create({
//       userName: name,
//       email,
//       googleId,
//       avatar: picture,

//       roles: [Roles.USER_ROLE],

//       authProvider: [authProvider.GOOGLE],
//     });
//   }

//   // Existing email account adds Google login
//   else if (!user.googleId) {
//     user.googleId = googleId;

//     if (!user.authProvider.includes(authProvider.GOOGLE)) {
//       user.authProvider.push(authProvider.GOOGLE);
//     }

//     await user.save();
//   }

//   const token = generateToken(user);

//   return {
//     token,

//     user: {
//       id: user._id,
//       userName: user.userName,
//       email: user.email,
//       roles: user.roles,
//       avatar: user.avatar,
//     },
//   };
// };

//
// LOGIN USER
//
export const loginUser = async (email, password) => {
  const user = await UserModel.findOne({ email }).select("+password");

  if (!user) {
    throw {
      status: 401,
      message: "Invalid email or password",
    };
  }

  // Google-only account
  if (!user.password) {
    throw {
      status: 401,
      message: "Please continue with Google login",
    };
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw {
      status: 401,
      message: "Invalid email or password",
    };
  }

  const token = generateToken(user);

  return {
    token,

    user: {
      id: user._id,
      userName: user.userName,
      email: user.email,
      mobile: user.mobile,
      roles: user.roles,
      avatar: user.avatar,
    },
  };
};

//
// GET ALL USERS
//
export const getAllUsersService = async () => {
  return await UserModel.find({});
};

//
// GET USER BY ID
//
export const getUserByIdService = async (id) => {
  return await UserModel.findById(id);
};

//
// GET USER BY EMAIL
//
export const getUserByEmailService = async (email) => {
  return await UserModel.findOne({ email });
};

//
// UPDATE USER
//
export const updateUserService = async (requesterId, targetId, updateData) => {
  // Owner or admin only
  if (requesterId !== targetId) {
    const requester = await UserModel.findById(requesterId);

    if (!requester || !requester.roles.includes(Roles.ADMIN_ROLE)) {
      throw {
        status: 403,
        message: "Forbidden",
      };
    }
  }

  const updatedUser = await UserModel.findByIdAndUpdate(
    targetId,
    {
      $set: updateData,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedUser) {
    throw {
      status: 404,
      message: "User not found",
    };
  }

  return updatedUser;
};

//
// DELETE USER
//
export const deleteUserService = async (requesterId, targetId) => {
  // Owner or admin only
  if (requesterId !== targetId) {
    const requester = await UserModel.findById(requesterId);

    if (!requester || !requester.roles.includes(Roles.ADMIN_ROLE)) {
      throw {
        status: 403,
        message: "Forbidden",
      };
    }
  }

  const deletedUser = await UserModel.findByIdAndDelete(targetId);

  if (!deletedUser) {
    throw {
      status: 404,
      message: "User not found",
    };
  }

  return {
    message: "Account deleted successfully",
  };
};

//
// SEND OTP
//
export const sendForgotPasswordOtpService = async (email) => {
  const user = await UserModel.findOne({ email });

  // Prevent email enumeration
  if (!user) return;

  // Delete old OTPs
  await Otp.deleteMany({ email });

  // Generate OTP
  const otp = crypto.randomInt(100000, 999999).toString();

  // Hash OTP
  const hashedOtp = await bcrypt.hash(otp, 10);

  // Save OTP
  await Otp.create({
    email,
    otp: hashedOtp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  // Send email
  await sendOtpEmail(email, otp);
};

//
// VERIFY OTP
//
export const verifyOtpService = async (email, otp) => {
  const record = await Otp.findOne({
    email,
    verified: false,
  });

  if (!record) {
    throw {
      status: 400,
      message: "No active OTP found",
    };
  }

  // Check expiry
  if (record.expiresAt < new Date()) {
    await record.deleteOne();

    throw {
      status: 400,
      message: "OTP expired",
    };
  }

  // Compare OTP
  const isMatch = await bcrypt.compare(otp, record.otp);

  if (!isMatch) {
    throw {
      status: 400,
      message: "Invalid OTP",
    };
  }

  // Mark verified
  record.verified = true;

  await record.save();
};

//
// RESET PASSWORD
//
export const resetPasswordService = async (email, otp, newPassword) => {
  const record = await Otp.findOne({
    email,
    verified: true,
  });

  if (!record) {
    throw {
      status: 400,
      message: "OTP not verified",
    };
  }

  // Check expiry
  if (record.expiresAt < new Date()) {
    await record.deleteOne();

    throw {
      status: 400,
      message: "OTP expired",
    };
  }

  // Compare OTP again
  const isMatch = await bcrypt.compare(otp, record.otp);

  if (!isMatch) {
    throw {
      status: 400,
      message: "Invalid OTP",
    };
  }

  const user = await UserModel.findOne({
    email,
  }).select("+password");

  if (!user) {
    throw {
      status: 404,
      message: "User not found",
    };
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;

  // Add local provider if missing
  if (!user.authProvider.includes(authProvider.LOCAL)) {
    user.authProvider.push(authProvider.LOCAL);
  }

  await user.save();

  // Delete OTP
  await record.deleteOne();
};
