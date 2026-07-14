import userService from "../services/user.service.js";
import { BadRequestError } from "../utils/AppError.js";
import { signJwt } from "../utils/jwt.utils.js";
import config from "../config/config.js";


// update avatar
export const updateUserAvatar = async (req, res, next) => {
  try {
    const file = req.file;
    const userId = req.user._id;

    if (!file) {
      throw new BadRequestError("Profile image is required.");
    }

    const updatedUser = await userService.updateUserAvatar(file, userId);

    // Create new JWT
    const payload = {
      _id: updatedUser._id,
      userName: updatedUser.userName,
      email: updatedUser.email,
      roles: updatedUser.roles,
      authProvider: updatedUser.authProvider,
      avatar: updatedUser.avatar,
      mobile: updatedUser.mobile,
    };

    const token = await signJwt(payload);

    res.cookie("authToken", token, {
      maxAge: 86400 * 1000,
      httpOnly: true,
      secure: config.node_env === "production",
      sameSite: "lax",
    });

    res.status(200).json({
      success: true,
      message: "Profile picture updated successfully.",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};


// Update user name
export const updateUserName = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const { userName } = req.body;

    const user = await userService.updateUserName(userName, userId);

    // Create new JWT
    const payload = {
      _id: user._id,
      userName: user.userName,
      email: user.email,
      roles: user.roles,
      authProvider: user.authProvider,
      avatar: user.avatar,
      mobile: user.mobile,
    };

    const token = await signJwt(payload);

    res.cookie("authToken", token, {
      maxAge: 86400 * 1000,
      httpOnly: true,
      secure: config.node_env === "production",
      sameSite: "lax",
    });

    res.status(200).json({
      success: true,
      message: "Username updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

//
// GET ALL USERS
//
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

//
// GET USER BY ID
//
export const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

//
// UPDATE USER
//
// export const updateUser = async (req, res, next) => {
//   try {
//     // console.log("FILE RECEIVED:", req.file);
//     const updatedUser = await userService.updateUser(
//       req.user._id,
//       req.params.id,
//       req.body,
//       req.file,
//     );

//     res.status(200).json({
//       success: true,
//       message: "Profile updated successfully",
//       data: updatedUser,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

//
// DELETE USER (SELF OR ADMIN CHECK INSIDE SERVICE)
//
export const deleteUser = async (req, res, next) => {
  try {
    const result = await userService.deleteUser(req.user._id, req.params.id);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
