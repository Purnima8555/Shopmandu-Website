import AccountStatus from "../constants/accountStatus.js";
import Roles from "../constants/userRoles.js";
import Address from "../models/Address.model.js";
import UserModel from "../models/User.model.js";
import VendorProfileModel from "../models/VendorProfile.model.js";
import { BadRequestError, ConflictError, NotFoundError } from "../utils/AppError.js";
import CloudinaryUpload from "../utils/CloudinaryUpload.js";
import sendEmail from "../utils/emailsend.utils.js";
import { verifyJwt } from "../utils/jwt.utils.js";

import { v2 as cloudinary } from "cloudinary"

class vendorService {
  /// Apply for vendor
  /**
   *
   * @param {*} userId /// vendor id
   * @param {*} vendorProfileData /// vendor profile detail
   * @returns /// it return vendor full data when vendor is create
   */
  async applyForVendor(userId, vendorProfileData, files) {
    // Check already applied vendor
    const vendorExists = await VendorProfileModel.findOne({ user_id: userId });

    if (vendorExists) {
      throw new ConflictError("Vendor already registered.");
    }

    // const vendorAddress = await Address.create({
    //   user_id: userId,
    //   address: [...vendorProfile.address]
    // })

    /// upload image in cloudinary with private flag
    const cloudUploadResult = await CloudinaryUpload.uploadMultipleImage(files, "private");
    /// add that cloudinary images upload data in vendorProfile Data object
    const frontUpload = cloudUploadResult[0];
    const backUpload = cloudUploadResult[1];
    // console.log(frontUpload.public_id)

    vendorProfileData.citizenship.citizenshipFrontImage = {
      public_id: frontUpload.public_id,
      format: frontUpload.format,
      resource_type: frontUpload.resource_type,
      folder: frontUpload.asset_folder,
    };
    vendorProfileData.citizenship.citizenshipBackImage = {
      public_id: backUpload.public_id,
      format: backUpload.format,
      resource_type: backUpload.resource_type,
      folder: backUpload.asset_folder,
    };

    // Create vendor profile
    const vendorProfile = await VendorProfileModel.create({
      user_id: userId,
      // address: vendorAddress._id,
      businessDetail: {
        ...vendorProfileData.businessDetail,
      },
      bankDetails: {
        ...vendorProfileData.bankDetails,
      },
      citizenship: {
        number: vendorProfileData?.citizenship.number,
        dateOfBirth: vendorProfileData?.citizenship.dateOfBirth,
        frontSideImage: {
          ...vendorProfileData?.citizenship.citizenshipFrontImage,
        },
        backSideImage: {
          ...vendorProfileData?.citizenship.citizenshipBackImage,
        },
      },
      shopAddress: { ...vendorProfileData.shopAddress },
      nidNumber: vendorProfileData?.nidNumber,
      panNumber: vendorProfileData?.panNumber,

      accountStatus: AccountStatus.PENDING_STATUS,
    });

    return { ...vendorProfile };
  }

  // async getVendorProfile(jwt_token) {
  //   const decoded = verifyJwt(jwt_token); /// get email from token
  //      if (!decoded?.email) {
  //       throw new BadRequestError("Invalid token");
  //   }
  //   return this.getVendorProfile(decoded.email);
  // }

  /**
   *
   * @param {*} email // vendro email
   * @returns /// it return vendor profile data
   */
  /// get vendor by email
  async getVendorProfile(email) {
    const vendor = await UserModel.findOne({ email }, { password: 0 });

    if (!vendor) {
      throw new BadRequestError("Vendor not found in database.");
    }
    const vendorProfile = await VendorProfileModel.findOne({
      user_id: vendor._id,
    });
    return {
      vendor,
      vendorProfile,
    };
  }

  /// get all vendors from database

  /// it only access for admin

  async getAllVendors() {
    const vendors = await UserModel.find(
      { roles: Roles.VENDOR_ROLE },
      { password: 0 },
    );
    return vendors;
  }

  async getAllVendorsProfile() {
    const profiles = await VendorProfileModel.find();
    return profiles
  }

  /// get vendor by ID

  async getVendorById(vendorID) {
    if (!vendorID) {
      throw new BadRequestError("Vendor ID is required");
    }
    return await UserModel.findOne({ $and: [{ _id: vendorID }, { roles: Roles.VENDOR_ROLE }] }, { password: 0 });
  }

  /// update vendor detail

  async updateVendorDetail(data, email) {
    return await UserModel.findByIdAndUpdate(
      { email },
      {
        userName: data?.userName,
      },
      {
        returnDocument: "after",
      },
    );
  }

  /// get vendor by their account status
  async getVendorsByStatus(status) {
    if (!status) {
      throw new Error("Account status is required.");
    }
    return await UserModel.findOne({ accountStatus: status }, { password: 0 });
  }

  //// update vendor account status

  async updateVendorAccountStatus(status, vendorId) {
    if (!status) {
      throw new Error("Account status is required.");
    }
    return await VendorProfileModel.findOneAndUpdate(
      { user_id: vendorId },
      { $set: { accountStatus: status } },
      { new: true },
    );
  }

  /// filter vendors

  async vendorFilter(search = "", status = "PENDING", sortBy = "createdAt", order = "desc", page = 1, verified = false, limit = 10,) {
    const skip = (page - 1) * limit;
    const vendorProfile = await VendorProfileModel.aggregate([
      // filter vendor with ther status
      {
        $match: {
          accountStatus: status,
        },
      },
      //  join vendor profile with user collection
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $unwind: "$userInfo",
      },
      //  filger user base is verified
      {
        $match: {
          ...(verified !== undefined && { "userInfo.isVerify": verified, }),
        },
      },

      //  search query (name/email)
      {
        $match: {
          ...(search && {
            $or: [
              { "userInfo.userName": { $regex: search, $options: "i" } },
              { "userInfo.email": { $regex: search, $options: "i" } },
            ],
          }),
        },
      },

      //  short by 
      {
        $sort: {
          [sortBy]: order === "asc" ? 1 : -1,
        },
      },

      // pagination
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);

    return vendorProfile;
  }


  /// vendor kyc verify

  async vendorKyc(vendorProfileId) {

    /// 1. ctz image back + front, ctz number,  nid number.

    const vendor = await VendorProfileModel.findOne({ _id: vendorProfileId })

    if (!vendor) {
      throw new NotFoundError("Vendor not Found, Invalid vendor Id.")
    }

    //  const oneMinuteFromNow = Math.floor(Date.now() / 1000) + 60;
    const exptime = Math.floor(Date.now() / 1000) + 60;

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

  /// vendor kyc status get 

  async getVendorKycStatus(vendorId) {

    /// get vendor profile 
    // console.log(vendorId)
    const vendorProfile = await VendorProfileModel.findOne({ user_id: vendorId });
    if (!vendorProfile) {
      throw new NotFoundError("Vendor profile Status not found.")
    }

    return {
      _id: vendorProfile._id,
      user_id: vendorProfile.user_id,
      accountStatus: vendorProfile.accountStatus,
    }


  }

  //// vendor kyc Approve
  async vendorKycAccountApprove(vendorId) {
    /// checked if vendor are present in database
    const vendor = await VendorProfileModel.findOne({ _id: vendorId })

    if (!vendor) {
      throw new NotFoundError("Vendor profile not found, invalid vendor Id.")
    }

    /// if vendor found then update ther accound status and send email to you accound kyc are approved.
    vendor.accountStatus = AccountStatus.ACTIVE_STATUS
    await vendor.save()


    /// create mail body for vendor say you accound are active now.

    const emailBody = `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2 style="color: #16a34a;">
        KYC Verification Successful
    </h2>
    <p>
        Dear User,
    </p>
    <p>Congratulations! Your KYC and business verification process has been completed successfully.</p>
    <p>Your vendor account is now active on <strong>ShopMandu</strong>. </p>
    <p>You can now start listing products, manage your store, and sell products on our platform.</p>
    <p>Thank you for choosing ShopMandu.</p>
    <p>Regards,<br />ShopMandu Team</p>
</div>
`
    await sendEmail(vendor.businessDetail.businessEmail, "Kyc Document Verification.", emailBody)

    return {
      success: true,
      message: "Vendor Approve submitted successfully.",
      _id: vendor._id,
      accountStatus: vendor.accountStatus,
    }

  }


  //// vendor kyc reject

  async vendorKycReject(vendorId, reason) {
    /// checked if vendor are present in database
    const vendor = await VendorProfileModel.findOne({ _id: vendorId })
    if (!vendor) {
      throw new NotFoundError("Vendor profile not found, invalid vendor Id.")
    }

    /// if vendor found then update ther accound status and send email to you accound kyc are approved.
    vendor.accountStatus = AccountStatus.REJECT_STATUS
    await vendor.save()

    // create email for reject reason
    const emailBody = ` <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                        <h2 style="color: #dc2626;"> KYC Verification Rejected </h2> 
                        <p> Dear User, </p> 
                        <p> We reviewed your submitted KYC documents, but unfortunately your verification request has been rejected. </p> 
                        <p> <strong>Reason:</strong> ${reason} </p> 
                        <p> Please review and resubmit the correct documents again. </p> 
                        <p> Regards,<br/> ShopMandu Team </p> 
                        </div> `
    await sendEmail(vendor.businessDetail.businessEmail, "Kyc Document Verification.", emailBody)

    return {
      success: true,
      message: "Vendor Reject submitted successfully.",
      _id: vendor._id,
      accountStatus: vendor.accountStatus,
    }

  }

  /// vendor kyc document resubmit 

  async vendorKycResubmit(userId, vendorProfileData, files) {
    // Check already applied vendor
    const vendorExists = await VendorProfileModel.findOne({ user_id: userId });

    if (vendorExists && vendorExists.accountStatus !== AccountStatus.REJECT_STATUS) {
      throw new ConflictError("Only rejected vendors can resubmit documents.");
    }

    /// upload image in cloudinary with private flag
    const cloudUploadResult = await CloudinaryUpload.uploadMultipleImage(files, "private");
    /// add that cloudinary images upload data in vendorProfile Data object
    const frontUpload = cloudUploadResult[0];
    const backUpload = cloudUploadResult[1];
    // console.log(frontUpload.public_id)

    vendorProfileData.citizenship.citizenshipFrontImage = {
      public_id: frontUpload.public_id,
      format: frontUpload.format,
      resource_type: frontUpload.resource_type,
      folder: frontUpload.asset_folder,
    };
    vendorProfileData.citizenship.citizenshipBackImage = {
      public_id: backUpload.public_id,
      format: backUpload.format,
      resource_type: backUpload.resource_type,
      folder: backUpload.asset_folder,
    };

    // Create vendor profile
    const vendorProfile = await VendorProfileModel.findOneAndUpdate({ user_id: userId }, {
      // address: vendorAddress._id,
      businessDetail: {
        ...vendorProfileData.businessDetail,
      },
      bankDetails: {
        ...vendorProfileData.bankDetails,
      },
      citizenship: {
        number: vendorProfileData?.citizenship.number,
        dateOfBirth: vendorProfileData?.citizenship.dateOfBirth,
        frontSideImage: {
          ...vendorProfileData?.citizenship.citizenshipFrontImage,
        },
        backSideImage: {
          ...vendorProfileData?.citizenship.citizenshipBackImage,
        },
      },
      shopAddress: { ...vendorProfileData.shopAddress },
      nidNumber: vendorProfileData?.nidNumber,
      panNumber: vendorProfileData?.panNumber,

      accountStatus: AccountStatus.PENDING_STATUS,
    },
  {
   new: true
},
  );

    return vendorProfile;

  }

}

export default new vendorService();
