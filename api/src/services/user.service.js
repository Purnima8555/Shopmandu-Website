import UserModel from "../models/user.model.js";
import Roles from "../constants/userRoles.js";
import { ForbiddenError, NotFoundError } from "../utils/AppError.js";

//
// GET ALL USERS
// ONLY ADMIN / SUPER_ADMIN
//
export const getAllUsersService = async (requesterId) => {
  const requester = await UserModel.findById(requesterId);

  if (!requester) {
    throw new NotFoundError("Requester not found");
  }

  const allowedRoles = [Roles.ADMIN_ROLE, Roles.SUPER_ADMIN_ROLE];
  const hasAccess = requester.roles.some((role) => allowedRoles.includes(role));

  if (!hasAccess) {
    throw new ForbiddenError("You are not allowed to view all users");
  }

  return await UserModel.find({});
};

//
// GET USER BY ID
//
export const getUserByIdService = async (requesterId, targetId) => {
  const requester = await UserModel.findById(requesterId);

  if (!requester) {
    throw new NotFoundError("Requester not found");
  }

  const isOwner = requesterId === targetId;
  const isAdmin = requester.roles.some((role) =>
    [Roles.ADMIN_ROLE, Roles.SUPER_ADMIN_ROLE].includes(role),
  );

  if (!isOwner && !isAdmin) {
    throw new ForbiddenError("You are not allowed to view this profile");
  }

  const user = await UserModel.findById(targetId);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return user;
};

//
// UPDATE USER
//
export const updateUserService = async (requesterId, targetId, updateData) => {
  const requester = await UserModel.findById(requesterId);

  if (!requester) {
    throw new NotFoundError("Requester not found");
  }

  const isOwner = requesterId === targetId;
  const isAdmin = requester.roles.some((role) =>
    [Roles.ADMIN_ROLE, Roles.SUPER_ADMIN_ROLE].includes(role),
  );

  if (!isOwner && !isAdmin) {
    throw new ForbiddenError("You are not allowed to update this user");
  }

  // Changable FIELDS ONLY
  const allowedFields = ["userName", "mobile", "avatar"];
  const filteredData = {};

  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      filteredData[field] = updateData[field];
    }
  });

  const updatedUser = await UserModel.findByIdAndUpdate(
    targetId,
    {
      $set: filteredData,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedUser) {
    throw new NotFoundError("User not found");
  }

  return updatedUser;
};

//
// DELETE USER
//
export const deleteUserService = async (requesterId, targetId) => {
  const requester = await UserModel.findById(requesterId);

  if (!requester) {
    throw new NotFoundError("Requester not found");
  }

  const isOwner = requesterId === targetId;
  const isAdmin = requester.roles.some((role) =>
    [Roles.ADMIN_ROLE, Roles.SUPER_ADMIN_ROLE].includes(role),
  );

  if (!isOwner && !isAdmin) {
    throw new ForbiddenError("You are not allowed to delete this account");
  }

  const deletedUser = await UserModel.findByIdAndDelete(targetId);

  if (!deletedUser) {
    throw new NotFoundError("User not found");
  }

  return {
    message: "Account deleted successfully",
  };
};
