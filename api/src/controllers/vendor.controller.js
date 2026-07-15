
import { assign } from "nodemailer/lib/shared/index.js";
import Roles from "../constants/userRoles.js";
import vendorService from "../services/vendor.service.js"
import { BadRequestError } from "../utils/AppError.js"
import CloudinaryUpload from "../utils/CloudinaryUpload.js";
import { signJwt } from "../utils/jwt.utils.js";
import config from "../config/config.js";




/// vendor kyc submit
const vendorkycSubmit = async (req, res, next) => {

    const vendorKycData = req.body;
    const vendorId = req.user?._id;

    // citizenship Images
    const citizenshipFrontImage = req.files?.frontSideImage?.[0];
    const citizenshipBackImage = req.files?.backSideImage?.[0];

    // fi front image are not upload
    if (!citizenshipFrontImage) {
        throw new BadRequestError("Front side citizenship image is required.");
    }

    /// if back image are not upload
    if (!citizenshipBackImage) {
        throw new BadRequestError("Back side citizenship image is required.");
    }

    // Validation data checked
    if (!vendorKycData || !vendorId) {
        throw new BadRequestError("Vendor profile data and vendor ID are required.");
    }

    try {
        const vendorKyc = await vendorService.vendorKycSubmit(vendorId, vendorKycData, [citizenshipFrontImage, citizenshipBackImage]);
        // Response

        res.status(201).json({
            success: true,
            message: "Vendor KYC application submitted successfully.",
            vendorKyc: vendorKyc["_doc"]
        });



    } catch (error) {
        next(error)
    }
}

/// get all vendor by status 

const getKycByStatus = async (req, res, next) => {
    try {


        const { status, page, limit } = req.query
        // console.log(req.query)
        const result = await vendorService.getVendorKycByStatus(status, page, limit)

        res.status(200).json({
            ...result
        })

    } catch (error) {
        next(error)
    }
}

/// get vendor kyc status
const getVendorKycStatus = async (req, res, next) => {
    try {
        const vendorId = req.user._id
        // console.log(req)
        const vendorKycStatus = await vendorService.getVendorKycStatus(vendorId);

        res.status(200).json({
            ...vendorKycStatus
        })
    } catch (error) {
        next(error)
    }
}

/// get vendor kyc full status 
const getVendorKyc = async (req, res, next) => {
    try {
        const vendorId = req.user._id
        // console.log(req)
        const vendorKycStatusDetail = await vendorService.getVendorKyc(vendorId);

        res.status(200).json({
            ...vendorKycStatusDetail
        })
    } catch (error) {
        next(error)
    }
}


/// get vendor profile 
const getVendorProfile = async (req, res, next) => {

    const { email, roles } = req.user


    if (!email || !roles) {
        throw new BadRequestError("Vendor email and roles are required.");
    }
    /// roles are vendor
    // if (!roles.includes(Roles.VENDOR_ROLE)) {
    //     throw new BadRequestError(
    //         "Access denied."
    //     );
    // }
    try {
        // get vendor profile from service
        const vendorProfile = await vendorService.getVendorProfile(email)
        res.status(200).json({ vendorProfile });
    } catch (error) {
        next(error)
    }

}



/// ##### ADMIN vendor controller function
/// Get vendor details
const getVendorById = async (req, res, next) => {
    try {
        const vendorId = req.params.id;

        if (!vendorId) {
        throw new BadRequestError("Vendor ID is required.");
        }

        const vendor = await vendorService.getVendorById(vendorId);

        res.status(200).json({
        success: true,
        data: vendor,
        });
    } catch (error) {
        next(error);
    }
};


/// get all vendors
const getAllVendors = async (req, res, next) => {

    try {
        const vendors = await vendorService.getAllVendors(req.query);
        res.status(200).json( vendors )
    } catch (error) {
        next(error)
    }

}

/// get all vendor by filtering.
const filterVendors = async (req, res, next) => {
    try {

        const { search, authProvider, sortBy, order, page, verified, limit } = req.query;
        const result = await vendorService.vendorFilter(search, authProvider, sortBy, order,
            Number(page) || 1,
            verified === "true",
            Number(limit) || 10
        );

        res.status(200).json(result);

    } catch (error) {
        next(error);
    }
};


//// vendor kyc verifaction.
const getVendorKycVerifyDoc = async (req, res, next) => {

    try {
        const vendorId = req.params.id
        // console.log(vendorId)
        const vendor_kyc = await vendorService.getvendorKycDoc(vendorId)
        res.status(200).json({ ...vendor_kyc })
    } catch (error) {
        next(error)
    }

}


/// vendor kyc Approve

const approveVendorKyc = async (req, res, next) => {

    try {

        const vendorId = req.params.id
        const result = await vendorService.vendorKycAccountApprove(vendorId)
        res.status(200).json({
            ...result
        })
    } catch (error) {
        next(error)
    }
}

/// vendor kyc reject

const rejectVendorKyc = async (req, res, next) => {

    try {

        const vendorId = req.params.id
        const reason = req.body.reason

        if (!vendorId || !reason) {
            throw new BadRequestError("Vendor Id and reject reason are required.")
        }

        const result = await vendorService.vendorKycReject(vendorId, reason)
        res.status(200).json({
            ...result
        })
    } catch (error) {
        next(error)
    }
}


/// update vendor name/avatar 

const updateVendorName = async (req, res, next) => {
    try {
        const vendorId = req.user?._id;
        const { userName } = req.body;
        const vendor = await vendorService.updateVendorName(userName, vendorId);

        //// creatre jwt token
        let payload = {
            userName: vendor.userName,
            _id: vendor._id,
            email: vendor.email,
            roles: vendor.roles,
            authProvider: vendor.authProvider,
            avatar: vendor.avatar,
            mobile: vendor.mobile

        }
        const token = await signJwt(payload)

        res.cookie("authToken", token, {
            maxAge: 86400 * 1000, /// valid for 1 day 
            httpOnly: true,
            secure: config.node_env === "production",
            sameSite: "lax",
        })

        res.status(200).json({
            success: true,
            message: "Vendor name updated successfully",
            data: vendor,
        });

    } catch (error) {
        next(error);
    }
};


const updateVendorAvatar = async (req, res, next) => {
    try {
        const file = req.file
        const vendorId = req.user?._id
        if (!file) {
            throw new BadRequestError("Vendor Avatar is required.")
        }
        const updatedVendor = await vendorService.updateVendorAvatar(file, vendorId);

         //// creatre jwt token
        let payload = {
            userName: updatedVendor.userName,
            _id: updatedVendor._id,
            email: updatedVendor.email,
            roles: updatedVendor.roles,
            authProvider: updatedVendor.authProvider,
            avatar: updatedVendor.avatar,
            mobile: updatedVendor.mobile

        }
        const token = await signJwt(payload)

        res.cookie("authToken", token, {
            maxAge: 86400 * 1000, /// valid for 1 day 
            httpOnly: true,
            secure: config.node_env === "production",
            sameSite: "lax",
        })

        res.status(200).json({
            success: true,
            message: "Vendor profile image updated successfully",
            data: updatedVendor
        })
    } catch (error) {
        next(error)
    }

}


export {
    getVendorProfile,
    getVendorById,
    getAllVendors,

    filterVendors,
    getVendorKycVerifyDoc,
    approveVendorKyc,
    getKycByStatus,
    rejectVendorKyc,
    vendorkycSubmit,
    getVendorKycStatus,
    getVendorKyc,
    updateVendorName,
    updateVendorAvatar
};



