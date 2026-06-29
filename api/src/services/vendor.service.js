
import kycStatus from "../constants/kycStatus.js";
import Roles from "../constants/userRoles.js";
import { kycApproveTemplate, kycRejectTemplate } from "../messaging/email/templates/vendorKycStatus.template.js";
import Address from "../models/Address.model.js";
import UserModel from "../models/User.model.js";
import vendorKycModel from "../models/VendorKYC.model.js";
import { BadRequestError, ConflictError, NotFoundError } from "../utils/AppError.js";
import CloudinaryUpload from "../utils/CloudinaryUpload.js";
import addEmailJob from "../utils/EmailQueue.js";
import sendEmail from "../messaging/email/email.service.js";
import { verifyJwt } from "../utils/jwt.utils.js";

import { v2 as cloudinary } from "cloudinary"

class vendorService {

  /// vendor kyc submit.
  async vendorKycSubmit(vendorId, vendorKycData, files) {

    /// checked vendor are alrady apply for kyc
    const vendorExists = await vendorKycModel.findOne({ user_id: vendorId });

    if (vendorExists?.kycStatus === kycStatus.PENDING_STATUS) {
      throw new ConflictError("KYC already under review.");
    }

    if (vendorExists?.kycStatus === kycStatus.APPROVED_STATUS) {
      // console.log(vendorExists?.kycStatus, kycStatus.APPROVED_STATUS )
      throw new ConflictError("KYC already approved....");
    }

    /// upload image in cloudinary with private flag
    const cloudUploadResult = await CloudinaryUpload.uploadMultipleImage(files, "private");

    /// add that cloudinary images upload data in vendorProfile Data object
    const frontUpload = cloudUploadResult[0];
    const backUpload = cloudUploadResult[1];

    vendorKycData.citizenship.citizenshipFrontImage = {
      public_id: frontUpload.public_id,
      format: frontUpload.format,
      resource_type: frontUpload.resource_type,
      folder: frontUpload.asset_folder,
    };

    vendorKycData.citizenship.citizenshipBackImage = {
      public_id: backUpload.public_id,
      format: backUpload.format,
      resource_type: backUpload.resource_type,
      folder: backUpload.asset_folder,
    };

    /// if rejected then update 
    if (vendorExists?.kycStatus === kycStatus.REJECTED_STATUS) {

      const updatedKYC = await vendorKycModel.findOneAndUpdate(
        { user_id: vendorId },
        {
          fullName: vendorKycData.fullName,
          kycStatus: kycStatus.PENDING_STATUS,
          // rejectionReason: null,
          bankDetails: { ...vendorKycData.bankDetails, },
          citizenship: {
            number: vendorKycData?.citizenship.number,
            dateOfBirth: vendorKycData?.citizenship.dateOfBirth,
            frontSideImage: { ...vendorKycData?.citizenship.citizenshipFrontImage, },
            backSideImage: { ...vendorKycData?.citizenship.citizenshipBackImage, },
          },
          nidNumber: vendorKycData?.nidNumber,
          panNumber: vendorKycData?.panNumber,
        },
        {
          returnDocument: "after"
        }
      );
      // console.log("Update KYC : ", updatedKYC)
      return updatedKYC;
    }
    ///  if not crate new kyc document
    const vendorKYC = await vendorKycModel.create({
      user_id: vendorId,
      fullName: vendorKycData.fullName,
      kycStatus: kycStatus.PENDING_STATUS,
      rejectionReason: null,
      bankDetails: { ...vendorKycData.bankDetails, },
      citizenship: {
        number: vendorKycData?.citizenship.number,
        dateOfBirth: vendorKycData?.citizenship.dateOfBirth,
        frontSideImage: { ...vendorKycData?.citizenship.citizenshipFrontImage, },
        backSideImage: { ...vendorKycData?.citizenship.citizenshipBackImage, },
      },
      nidNumber: vendorKycData?.nidNumber,
      panNumber: vendorKycData?.panNumber,
    });

    // console.log( "KYC : ",vendorKYC)
    return vendorKYC;
  }

  // async getVendorProfile(jwt_token) {
  //   const decoded = verifyJwt(jwt_token); /// get email from token
  //      if (!decoded?.email) {
  //       throw new BadRequestError("Invalid token");
  //   }
  //   return this.getVendorProfile(decoded.email);
  // }

  /**
   * @param {*} email // vendro email
   * @returns /// it return vendor profile data
   */
  /// get vendor by email
  async getVendorProfile(email) {
    const vendor = await UserModel.findOne({ email }, { password: 0 });

    if (!vendor) {
      throw new NotFoundError("Vendor not found in database.");
    }
    const vendorKyc = await vendorKycModel.findOne({
      user_id: vendor._id,
    });
    return {
      vendor,
      vendorKyc,
    };
  }

  /// get all vendors from database

  /// it only access for admin
 async getAllVendors(data) {
  const page = parseInt(String(data?.page), 10) || 1;
  const limit = parseInt(String(data?.limit), 10) || 10;
  const skip = (page - 1) * limit;

  const filter = {
    roles: Roles.VENDOR_ROLE,
  };

  const [vendors, totalDocuments] = await Promise.all([
    UserModel.find(filter, { password: 0 }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    UserModel.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalDocuments / limit);

  return {
    metadata: {
      totalResults: totalDocuments,
      totalPages,
      currentPage: page,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
    data: vendors,
  };
}

  /// get vendor by ID

  async getVendorById(vendorID) {
    if (!vendorID) {
      throw new BadRequestError("Vendor ID is required");
    }
    return await UserModel.findOne({ $and: [{ _id: vendorID }, { roles: Roles.VENDOR_ROLE }] }, { password: 0 });
  }

  /// update vendor detail

  async updateVendorName(userName, _id) {
    return await UserModel.findByIdAndUpdate(
      { _id },
      {
        userName: userName,
      },
      {
        returnDocument: "after",
      },
    );
  }

  async updateVendorAvatar(avatar, _id) {
    /// upload file in cloudinary
    const userAvatar = await CloudinaryUpload.uploadSingleImage(avatar, "upload")

    const vendor = await UserModel.findByIdAndUpdate(
      _id,
      { avatar: userAvatar.secure_url },
      {
        returnDocument: "after",
      },
    );

    return vendor;
  }


  /// Filter Vendors
  async vendorFilter(search = "",authProvider = "",sortBy = "createdAt",order = "desc",page = 1,verified,limit = 10) {
    const skip = (page - 1) * limit;
    const filter = {roles: "VENDOR"};
    //// Search by username or email
    if (search) {
      filter.$or = [
        { userName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
    ];
    }
    /// filter by auth provider
    if (authProvider) {
      filter.authProvider = authProvider;
    }
    //// filter by email verified or not.
    if (verified !== undefined) {
      filter.isVerify = verified;
    }
    /// short by asc and desc.
    const sortOrder = order === "asc" ? 1 : -1;

    // apply filter on collection.
    const vendorProfile = await UserModel.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    //// total count for pagination
    const total = await UserModel.countDocuments(filter);

    return {
      data: vendorProfile,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /// vendor kyc verify
  async getvendorKycDoc(vendorKycId) {

    /// 1. ctz image back + front, ctz number,  nid number.

    const vendor = await vendorKycModel.findOne({ _id: vendorKycId })

    if (!vendor) {
      throw new NotFoundError("Vendor not Found, Invalid vendor Id.")
    }

    //  const oneMinuteFromNow = Math.floor(Date.now() / 1000) + 60;
    const exptime = Math.floor(Date.now() / 1000) + 60 * 5;

    /// generate front side image link
    const frontSideImageURL = cloudinary.utils.private_download_url(
      vendor.citizenship.frontSideImage.public_id,
      vendor.citizenship.frontSideImage.format,
      // expires time set 
      {
        expires_at: exptime
      }
    )

    /// generate back side image link 
    const backSideImageURL = cloudinary.utils.private_download_url(
      vendor.citizenship.backSideImage.public_id,
      vendor.citizenship.backSideImage.format,
      // expires time set 
      {
        expires_at: exptime
      }
    )

    return {

      citizenshipNumber: vendor.citizenship.number,
      nidNumber: vendor.nidNumber,
      dateOfBirth: vendor.citizenship.dateOfBirth,
      panNumber: vendor.panNumber,

      frontSideImageURL,
      backSideImageURL
    }


  }

  /// vendor kyc detail get all filter by status 
  async getVendorKycByStatus(status, page = 1, limit = 10) {
    /// validate status input (optional but recommended)
    const validStatuses = [kycStatus.PENDING_STATUS, kycStatus.APPROVED_STATUS, kycStatus.REJECTED_STATUS];

    if (!validStatuses.includes(status)) {
      throw new BadRequestError("Invalid KYC status filter.");
    }
    /// pagination setup
    const skip = (page - 1) * limit;
    /// fetch data
    const vendors = await vendorKycModel
      .find({ kycStatus: status })
      .sort({ createdAt: -1 }) // latest first
      .skip(skip)
      .limit(limit);

    return {
      success: true,
      data: vendors
    };
  }


  /// vendor kyc status get 
  async getVendorKycStatus(vendorId) {

    /// get vendor profile 
    // console.log(vendorId)
    const vendorKyc = await vendorKycModel.findOne({ user_id: vendorId });
    if (!vendorKyc) {
      throw new NotFoundError("Vendor profile Status not found.")
    }

    return {
      _id: vendorKyc._id,
      user_id: vendorKyc.user_id,
      kycStatus: vendorKyc.kycStatus,
      rejectionReason: vendorKyc.rejectionReason,
    }


  }

  /// vendor kyc full detail
  async getVendorKyc(vendorId) {
    /// get vendor profile 
    // console.log(vendorId)
    const vendorKyc = await vendorKycModel.findOne({ user_id: vendorId });
    if (!vendorKyc) {
      throw new NotFoundError("Vendor profile Status not found.")
    }

    return vendorKyc


  }

  //// vendor kyc Approve
  async vendorKycAccountApprove(vendorKycId) {
    /// checked if vendor are present in database
    const vendorKYC = await vendorKycModel.findOne({ _id: vendorKycId });
    if (!vendorKYC) {
      throw new NotFoundError("Vendor KYC detail not found, invalid vendor KYC Id.");
    }

    const vendor = await UserModel.findOne({ _id: vendorKYC.user_id });
    /// if vendor found then update ther accound status and send email to you accound kyc are approved.
    vendorKYC.kycStatus = kycStatus.APPROVED_STATUS
    await vendorKYC.save()


    /// create mail body for vendor say you accound are active now.

    const emailBody = kycApproveTemplate();
    // console.log(emailBody)
    // await sendEmail(vendor.email, "KYC Verification Approved", emailBody)
    await addEmailJob(vendor.email, "Kyc Verifaction Approved", emailBody)

    return {
      success: true,
      message: "Vendor approved successfully.",
      _id: vendorKYC._id,
      kycStatus: vendorKYC.kycStatus,
    }

  }


  //// vendor kyc reject
  async vendorKycReject(vendorKycId, reason) {
    /// checked if vendor are present in database
    const vendorKYC = await vendorKycModel.findOne({ _id: vendorKycId });
    if (!vendorKYC) {
      throw new NotFoundError("Vendor KYC detail not found, invalid vendor KYC Id.");
    }

    const vendor = await UserModel.findOne({ _id: vendorKYC.user_id });
    /// if vendor found then update ther accound status and send email to you accound kyc are approved.
    vendorKYC.kycStatus = kycStatus.REJECTED_STATUS
    vendorKYC.rejectionReason = reason
    await vendorKYC.save()

    // create email for reject reason
    const emailBody = kycRejectTemplate(reason)
    // await sendEmail(vendor.email, "Kyc Document Verification.", emailBody)
    await addEmailJob(vendor.email, "Kyc Document Verification", emailBody)

    return {
      success: true,
      message: "Vendor Reject submitted successfully.",
      _id: vendorKYC._id,
      kycStatus: vendorKYC.kycStatus,
      rejectionReason: vendorKYC.rejectionReason
    }

  }


}

export default new vendorService();
