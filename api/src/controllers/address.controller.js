import addressService from "../services/address.service.js";

const createAddress = async (req, res, next) => {
    try {
        const userId = req.user._id;
        // console.log(req.user);

        const address = await addressService.createAddress(userId, req.body);

        res.status(201).json({
        success: true,
        message: "Address created successfully.",
        address,
        });
    } catch (error) {
        next(error);
    }
};

const getUserAddresses = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const addresses = await addressService.getUserAddresses(userId);

        res.status(200).json({
        success: true,
        addresses,
        });
    } catch (error) {
        next(error);
    }
};

const updateAddress = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const updatedAddress = await addressService.updateAddress(
        req.params.id,
        userId,
        req.body,
        );

        res.status(200).json({
        success: true,
        message: "Address updated successfully.",
        address: updatedAddress,
        });
    } catch (error) {
        next(error);
    }
};

const deleteAddress = async (req, res, next) => {
    try {
        const userId = req.user._id;

        await addressService.deleteAddress(req.params.id, userId);

        res.status(200).json({
        success: true,
        message: "Address deleted successfully.",
        });
    } catch (error) {
        next(error);
    }
};

export default {
    createAddress,
    getUserAddresses,
    updateAddress,
    deleteAddress,
};
