import UserModel from "../models/User.model.js";
import Roles from "../constants/userRoles.js";
import { ForbiddenError, NotFoundError } from "../utils/AppError.js";
import CloudinaryUpload from "../utils/CloudinaryUpload.js";
import { v2 as cloudinary } from "cloudinary";

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
// OWNER OR ADMIN ONLY
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
// ONLY SELF UPDATE (NO ADMIN EDITS)
//
export const updateUserService = async ( requesterId, targetId, updateData, file) => {
  const requester = await UserModel.findById(requesterId);

  if (!requester) {
    throw new NotFoundError("Requester not found");
  }

  if (requesterId !== targetId) {
    throw new ForbiddenError("You can only update your own profile");
  }

  const user = await UserModel.findById(targetId);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  // update object
  const updatePayload = { ...updateData };

  if (file) {
    const uploaded = await CloudinaryUpload.uploadSingleImage(file, "upload");

    if (uploaded?.secure_url) {
      updatePayload.avatar = uploaded.secure_url;
    }
  }

  // update user
  const updatedUser = await UserModel.findByIdAndUpdate(
    targetId,
    { $set: updatePayload },
    { new: true },
  );

  return updatedUser;
};

//
// DELETE USER
// ADMIN + SUPER_ADMIN CAN DELETE ANY USER
// USER CAN DELETE SELF
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

  const user = await UserModel.findById(targetId);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  await UserModel.findByIdAndDelete(targetId);

  return {
    message: "Account deleted successfully",
  };
};