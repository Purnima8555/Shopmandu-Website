import Address from "../models/address.model.js";
import { BadRequestError, NotFoundError } from "../utils/AppError.js";

const createAddress = async (userId, addressData) => {
    // check existing address count
    const totalAddress = await Address.countDocuments({
        user_id: userId,
    });

    if (totalAddress >= 10) {
        throw new BadRequestError("Maximum 10 addresses allowed per user.");
    }

    const address = await Address.create({
        ...addressData,
        user_id: userId,
    });

    return address;
};

const getUserAddresses = async (userId) => {
    return await Address.find({ user_id: userId }).sort({
        createdAt: -1,
    });
};

const updateAddress = async (addressId, userId, updateData) => {
    const address = await Address.findOne({
        _id: addressId,
        user_id: userId,
    });

    if (!address) {
        throw new NotFoundError("Address not found.");
    }

    Object.assign(address, updateData);

    await address.save();

    return address;
};

const deleteAddress = async (addressId, userId) => {
    const address = await Address.findOneAndDelete({
        _id: addressId,
        user_id: userId,
    });

    if (!address) {
        throw new NotFoundError("Address not found.");
    }

    return address;
};

export default {
    createAddress,
    getUserAddresses,
    updateAddress,
    deleteAddress,
};
