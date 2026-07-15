import UserModel from "../models/User.model.js";
import { ForbiddenError, NotFoundError } from "../utils/AppError.js";
import CloudinaryUpload from "../utils/CloudinaryUpload.js";

class userService {
  //
  // GET ALL USERS
  //
async getAllUsers(queryData) {

    const page = parseInt(queryData.page, 10) || 1;
    const limit = parseInt(queryData.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    //// search by username or email
    if (queryData.search?.trim()) {
        filter.$or = [
            {
                userName: {
                    $regex: queryData.search.trim(),
                    $options: "i"
                }
            },
            {
                email: {
                    $regex: queryData.search.trim(),
                    $options: "i"
                }
            }
        ];
    }

    //// filter by role
    if (queryData.role && queryData.role !== "All" ) {
        filter.roles = queryData.role;
    }

    const [users, totalDocuments] = await Promise.all([

        UserModel.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),

        UserModel.countDocuments(filter)

    ]);

    const totalPages = Math.ceil(totalDocuments / limit);

    return {
        success: true,
        message: "",
        metadata: {
            totalResults: totalDocuments,
            totalPages,
            currentPage: page,
            limit,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        },

        data: users
    };
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
