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
    // UPDATE USER PROFILE
    //
    // async updateUser(userId, updateData, file) {

    //     const user = await UserModel.findById(userId);

    //     if (!user) {
    //     throw new NotFoundError("User not found");
    //     }

    //     const updatePayload = { ...updateData };
    //     // Upload avatar
    //     if (file) {
    //         const uploaded = await CloudinaryUpload.uploadSingleImage(file, "upload");

    //     if (uploaded?.secure_url) {
    //         updatePayload.avatar = uploaded.secure_url;
    //     }}

    //     const updatedUser = await UserModel.findByIdAndUpdate(
    //     userId,
    //     { $set: updatePayload },
    //     { new: true }
    //     );

    //     return updatedUser;
    // }

    //
    // DELETE USER PROFILE
    //
    async deleteUser(userId) {

        const user = await UserModel.findById(userId);

        if (!user) {
        throw new NotFoundError("User not found");
        }

        await UserModel.findByIdAndDelete(userId);
        return {
        message: "Account deleted successfully",
        };
    }

    // update avatar
    async updateUserAvatar(avatar, userId) {

        const uploadedAvatar =
            await CloudinaryUpload.uploadSingleImage(
                avatar,
                "upload"
            );

        const user = await UserModel.findByIdAndUpdate(
            userId,
            {
                avatar: uploadedAvatar.secure_url,
            },
            {
                returnDocument: "after",
            }
        );

        if (!user) {
            throw new NotFoundError("User not found.");
        }

        return user;
    }

    // Update user name
    async updateUserName(userName, _id) {
    return await UserModel.findByIdAndUpdate(
        _id,
        { userName },
        { returnDocument: "after" },);
    }
}

export default new userService();
