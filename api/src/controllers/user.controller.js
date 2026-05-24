import * as userService from "../services/user.service.js";

//
// GET ALL USERS
//
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsersService(
      req.user._id,
    );

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
    const user = await userService.getUserByIdService(
      req.user._id,
      req.params.id,
    );

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

//
// UPDATE USER (SELF ONLY)
//
export const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await userService.updateUserService(
      req.user._id,
      req.params.id,
      req.body,
      req.file,
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

//
// DELETE USER
//
export const deleteUser = async (req, res, next) => {
  try {
    const result = await userService.deleteUserService(
      req.user._id,
      req.params.id,
    );

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
