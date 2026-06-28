
import kycStatus from "../constants/kycStatus.js";
import ShopStatus from "../constants/ShopStatus.js";
import ShopModel from "../models/Shop.model.js";
import vendorKycModel from "../models/VendorKYC.model.js";
import { AppError, BadRequestError, ForbiddenError, NotFoundError } from "../utils/AppError.js"
import CloudinaryUpload from "../utils/CloudinaryUpload.js";
import {generateUniqueShopSlug} from "../utils/slug.utils.js";



class shopServices {

    /// creat shop 
    async createShop(shopData, vendorId, files) {

        /// check vendor KYC is verified
        const verifiedKYC = await vendorKycModel.findOne({ user_id: vendorId });
        if (!verifiedKYC) {
            throw new NotFoundError("Vendor has not applied for KYC.");
        }

        if (verifiedKYC.kycStatus !== kycStatus.APPROVED_STATUS) {
            throw new BadRequestError("Vendor KYC verification is waiting for approval.");
        }

        /// generate unique slug for vendor shop
        const slug = await generateUniqueShopSlug(shopData?.slug || shopData.shopName);
        /// upload logo and banner to cloudinary
        // console.log(slug)
        const cloudUploadResult = await CloudinaryUpload.uploadMultipleImage(files);
        const logo = cloudUploadResult[0];
        const banner = cloudUploadResult[1];

        shopData.logo = logo.secure_url;
        shopData.banner = banner.secure_url;

        /// create shop
        const shop = await ShopModel.create({
            user_id: vendorId,
            ShopStatus: ShopStatus.ACTIVE_STATUS,
            slugs: slug,
            shopAddress: { ...shopData.shopAddress },
            ...shopData,
        });
        return shop;
    }

    //// public get shop data
    async getShopBySlug(slug) {
        const shop = await ShopModel.findOne({ slugs: slug },{user_id: 0, _id: 0});
        if (!shop) {
            throw new NotFoundError("Shop not found. Invalid slug.");
        }
        return shop;
    }

    /// get vendor own shop 
    async getMyShop(vendorId) {
        /// get shop data
        const shop = await ShopModel.findOne({ user_id: vendorId });
        if (!shop) {
            throw new NotFoundError("Vendor shop not found.")
        }
        return shop;
    }


    /// update shop Data 
    async updateShopData(shopData, vendorId) {

        /// check vendor KYC is verified
        const verifiedKYC = await vendorKycModel.findOne({ user_id: vendorId });
        if (!verifiedKYC) {
            throw new NotFoundError("Vendor has not applied for KYC.");
        }
        if (verifiedKYC.kycStatus !== kycStatus.APPROVED_STATUS) {
            throw new BadRequestError("Vendor KYC verification is waiting for approval.");
        }
        /// try to add that data it delete by default. for save 
        delete shopData.rating;
        delete shopData.reviews;
        delete shopData.user_id;
        delete shopData.ShopStatus;

        /// allow email only if provided
        if (!shopData.businessEmail || shopData.businessEmail === "") {
            delete shopData.businessEmail;
        }
        /// create shop
        const shop = await ShopModel.findOneAndUpdate({ user_id: vendorId }, {
            ...shopData,
        }, {
            returnDocument: "after"
        });
        return shop;

    }


    /// update media
    async updateShopLogo(vendorId, logo) {
        const shop = await this.getMyShop(vendorId);
        const cloudUploadResult = await CloudinaryUpload.uploadSingleImage(logo);
        const logoURL = cloudUploadResult?.secure_url;
        if (!logoURL) {
            throw new AppError("Logo upload failed.");
        }
        shop.logo = logoURL
        await shop.save()
        return shop
    }

    /// upload banner 
    async updateShopBanner(vendorId, banner) {
        const shop = await this.getMyShop(vendorId);
        const cloudUploadResult = await CloudinaryUpload.uploadSingleImage(banner);
        const bannerURL = cloudUploadResult?.secure_url;
        if (!bannerURL) {
            throw new AppError("Banner upload failed.");
        }
        shop.banner = bannerURL
        await shop.save()
        return shop
    }

    //// shop Status change 
    async updateShopStatus(vendorId, status){
       const shop = await this.getMyShop(vendorId);
        // vendor only can update ther few status

        

        if(![ShopStatus.ACTIVE_STATUS, ShopStatus.DEACTIVATED_STATUS, ShopStatus.CLOSED_STATUS].includes(status)){
            throw new ForbiddenError( "You can only change status to ACTIVE, DEACTIVATED, or CLOSED.")
        }

        // if admin alrady ther accound baned 
         if([ShopStatus.PENDING_STATUS, ShopStatus.SUSPENDED_STATUS, ShopStatus.BANNED_STATUS ].includes(shop.ShopStatus)){
            throw new ForbiddenError(`Your account is ${shop.shopStatus}, status update is not allowed.`)
        }

        shop.ShopStatus = status;
         await shop.save()
        return shop
    }

    /// update shop status by Admin
        async updateShopStatusByAdmin(vendorId, status){
       const shop = await this.getMyShop(vendorId);
        // vendor only can update ther few status

        if(![ShopStatus.ACTIVE_STATUS, ShopStatus.DEACTIVATED_STATUS, ShopStatus.CLOSED_STATUS,  ShopStatus.PENDING_STATUS, ShopStatus.SUSPENDED_STATUS, ShopStatus.BANNED_STATUS ].includes(status)){
            throw new ForbiddenError("Invalid shop status.")
        }
        shop.ShopStatus = status;
         await shop.save()
        return shop
    }

    /// shop details by ID
    async getShopById(shopId) {

        const shop = await ShopModel.findOne(
            {
                _id: shopId,
                ShopStatus: ShopStatus.ACTIVE_STATUS
            },
            {
                user_id: 0
            }
        ).lean();
        if (!shop) {
            throw new NotFoundError("Shop not found.");
        }
        return shop;
    }

}


export default new shopServices();

