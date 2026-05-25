import UserModel from "../models/User.model.js";
import { ForbiddenError, NotFoundError } from "../utils/AppError.js";
import CloudinaryUpload from "../utils/CloudinaryUpload.js";

class userService {
  //
  // GET ALL USERS
  //
    async getAllUsers() {
        return await UserModel.find({});
    }

    //
    // GET USER BY ID
    //
    async getUserById(userId) {
        const user = await UserModel.findById(userId);

        if (!user) {
        throw new NotFoundError("User not found");
        }
        return user;
    }

    //
    // UPDATE USER
    //
    async updateUser(userIdFromToken, userId, updateData, file) {
    const user = await UserModel.findById(userId);

    if (!user) {
        throw new NotFoundError("User not found");
    }
    if (userIdFromToken !== userId) {
        throw new ForbiddenError("You can only update your own profile");
    }

    const updatePayload = { ...updateData };
    if (file) {
        const uploaded = await CloudinaryUpload.uploadSingleImage(file, "upload");

        if (uploaded?.secure_url) {
        updatePayload.avatar = uploaded.secure_url;
        }
    }

    return await UserModel.findByIdAndUpdate(
        userId,
        { $set: updatePayload },
        { new: true });
    }

    //
    // DELETE USER
    //
    async deleteUser(userIdFromToken, userId) {
    const user = await UserModel.findById(userId);

    if (!user) {
        throw new NotFoundError("User not found");
    }

    if (userIdFromToken !== userId) {
        throw new ForbiddenError("You can only delete your own account");
    }
        await UserModel.findByIdAndDelete(userId);
        return {
        message: "Account deleted successfully",
        };
    }
}

export default new userService();
