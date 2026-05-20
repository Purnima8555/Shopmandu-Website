

import { assign } from "nodemailer/lib/shared/index.js";
import Roles from "../constants/userRoles.js";
import AccountStatus from "../constants/accountStatus.js";
import vendorService from "../services/vendor.service.js"
import { BadRequestError } from "../utils/AppError.js"
import CloudinaryUpload from "../utils/CloudinaryUpload.js";



//// apply for vendor
const applyForVendor = async (req, res, next) => {
    try {
        const vendorProfileData = req.body;
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
        if (!vendorProfileData || !vendorId) {
            throw new BadRequestError("Vendor profile data and vendor ID are required.");
        }


        // /// upload image in cloudinary with private flag
        // const cloudUploadResult = await CloudinaryUpload.uploadMultipleImage([citizenshipFrontImage, citizenshipBackImage], "private")

        // /// add that cloudinary images upload data in vendorProfile Data object

        // const frontUpload = cloudUploadResult[0];
        // const backUpload = cloudUploadResult[1];
        // // console.log(frontUpload.public_id)

        // vendorProfileData.citizenship.citizenshipFrontImage = {public_id: frontUpload.public_id,format: frontUpload.format,resource_type: frontUpload.resource_type,folder: frontUpload.asset_folder,};
        // vendorProfileData.citizenship.citizenshipBackImage = {public_id: backUpload.public_id,format: backUpload.format,resource_type: backUpload.resource_type,folder: backUpload.asset_folder,};


        // Create vendor profile
        const vendorProfile = await vendorService.applyForVendor(vendorId, vendorProfileData, [citizenshipFrontImage, citizenshipBackImage]);
        // Response
        res.status(201).json({
            success: true,
            message: "Vendor application submitted successfully.",
            vendorProfile: vendorProfile["_doc"]
        });
    } catch (error) {
        next(error);
    }
};

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


const getVendorById = async (req, res, next) => {
    const vendorId = req.params.id

    if (!vendorId) {
        throw new BadRequestError("Vendor id is required.")
    }
    try {
        const vendor = await vendorService.getVendorById(vendorId)
        res.status(200).json({ vendor });
    } catch (error) {
        next(error)
    }

}

// update vendor detail

const updateVendorDetail = async (req, res, next) => {
    const updatedData = req.body
    const { email } = req.user
    if (!updatedData) {
        throw new BadRequestError("Data is required.")
    }
    try {


        res.status(200).json({ updatedVendor });
    } catch (error) {
        next(error)
    }

}

/// get vendors

const getVendors = async (req, res, next) => {

    try {
        const vendors = await vendorService.getAllVendors();

        res.status(200).json({ ...vendors })
    } catch (error) {
        next(error)
    }

}

/// get all vendor by fultering.
const filterVendor = async (req, res, next) => {
    try {

        const { search, status, sortBy, order, page, limit, verified } = req.query;
        const result = await vendorService.vendorFilter(search, status, sortBy, order,
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

const vendorKycVerify = async (req, res, next) => {

    try {
        const vendorId = req.params.id
        // console.log(vendorId)
        const vendor_kyc = await vendorService.vendorKyc(vendorId)
        res.status(200).json({ ...vendor_kyc })
    } catch (error) {
        next(error)
    }

}


/// vendor kyc status 

const vendorKycStatus = async (req, res, next) => {

    try {
        const vendorId = req.user._id
        // console.log(req)
        const vendorKycStatusDetail = await vendorService.getVendorKycStatus(vendorId);

        res.status(200).json({
            ...vendorKycStatusDetail
        })


    } catch (error) {
        next(error)
    }

}

/// vendor kyc Approve

const vendorKycApprove = async (req, res, next) => { 
    
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

 const vendorKycReject = async (req, res, next) => { 
    
    try {
        
        const vendorId = req.params.id
        const reason = req.body.reason

        if(!vendorId || !reason){
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

/// kyc re submit 

const vendorKycResubmit = async (req,res,next) => { 
    
    try {

        const vendorProfileData = req.body;
        const vendorId = req.user?._id;

        // citizenship Images
        const citizenshipFrontImage = req.files?.frontSideImage?.[0];
        const citizenshipBackImage = req.files?.backSideImage?.[0];

        // if front image are not upload
        if (!citizenshipFrontImage) {
            throw new BadRequestError("Front side citizenship image is required.");
        }

        /// if back image are not upload
        if (!citizenshipBackImage) {
            throw new BadRequestError("Back side citizenship image is required.");
        }

        // Validation data checked
        if (!vendorProfileData || !vendorId) {
            throw new BadRequestError("Vendor profile data and vendor ID are required.");
        }

        // Create vendor profile
        const vendorProfile = await vendorService.vendorKycResubmit(vendorId, vendorProfileData, [citizenshipFrontImage, citizenshipBackImage]);
        // Response
        res.status(201).json({
            success: true,
            message: "Vendor application Resubmit submitted successfully.",
            vendorProfile: vendorProfile["_doc"]
        });

    } catch (error) {
        next(error)
    }

 }




/// file upload for test
const fileUpload = async (req, res, next) => {

    const image1 = req.files?.image1?.[0];
    const image2 = req.files?.image2?.[0];

    try {

        const file = req.file;
        // console.log(file)
        const result = await CloudinaryUpload.uploadMultipleImage([image1, image2], 'private')
        res.status(200).json({
            ...result
        })

    } catch (error) {
        next(error)
    }

}

/// video upload for test 
const video_Upload = async (req, res, next) => {
    try {
        const video = req.file

        if (!video) {
            throw new BadRequestError("Video file is required.");
        }

        const result = await CloudinaryUpload.videoUpload(video, 'upload')
        res.status(200).json({
            ...result
        })
    } catch (error) {
        next(error)
    }

}

/// update vendor profile
// const updateVendorProfile = async (req,res,next)=>{
//     const updatedData = req.body
//     const {email} = req.user
//     if(!updatedData){
//         throw new BadRequestError("Data is required.")
//     }
//     try {


//           res.status(200).json({updatedVendor});
//     } catch (error) {
//         next(error)
//     }
// }


export { getVendorProfile, applyForVendor, getVendorById, getVendors, fileUpload, filterVendor, vendorKycVerify, vendorKycStatus, video_Upload, vendorKycApprove, vendorKycReject, vendorKycResubmit };







