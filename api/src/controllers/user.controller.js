import userService from "../services/user.service.js";

//
// GET ALL USERS
//
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers(req.query);

    res.status(200).json(users);
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
export const updateUser = async (req, res, next) => {
  try {
    // console.log("FILE RECEIVED:", req.file);
    const updatedUser = await userService.updateUser(
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
