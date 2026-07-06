
import kycStatus from "../constants/kycStatus.js";
import ShopStatus from "../constants/ShopStatus.js";
import ShopModel from "../models/Shop.model.js";
import vendorKycModel from "../models/VendorKYC.model.js";
import { AppError, BadRequestError, ForbiddenError, NotFoundError } from "../utils/AppError.js"
import CloudinaryUpload from "../utils/CloudinaryUpload.js";
import { generateUniqueShopSlug } from "../utils/slug.utils.js";



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
        const shop = await ShopModel.findOne({ slugs: slug }, { user_id: 0, _id: 0 });
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

        const updateData = {};

        Object.keys(shopData).forEach((key) => {
            if (key !== "shopAddress" && key !== "openingHour") {
                updateData[key] = shopData[key];
            }
        });

        if (shopData.shopAddress) {
            Object.entries(shopData.shopAddress).forEach(([key, value]) => {
                updateData[`shopAddress.${key}`] = value;
            });
        }
        if (shopData.openingHour) {
            Object.entries(shopData.openingHour).forEach(([key, value]) => {
                updateData[`openingHour.${key}`] = value;
            });
        }

        const shop = await ShopModel.findOneAndUpdate(
            { user_id: vendorId },
            { $set: updateData },
            {
               returnDocument: "after",
                runValidators: true,
            }
        );

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
    async updateShopStatus(vendorId, status) {
        const shop = await this.getMyShop(vendorId);
        // vendor only can update ther few status



        if (![ShopStatus.ACTIVE_STATUS, ShopStatus.DEACTIVATED_STATUS, ShopStatus.CLOSED_STATUS].includes(status)) {
            throw new ForbiddenError("You can only change status to ACTIVE, DEACTIVATED, or CLOSED.")
        }

        // if admin alrady ther accound baned 
        if ([ShopStatus.PENDING_STATUS, ShopStatus.SUSPENDED_STATUS, ShopStatus.BANNED_STATUS].includes(shop.ShopStatus)) {
            throw new ForbiddenError(`Your account is ${shop.shopStatus}, status update is not allowed.`)
        }

        shop.ShopStatus = status;
        await shop.save()
        return {
            shopName: shop.shopName,
            businessEmail: shop.businessEmail,
            shopStatus: shop.ShopStatus,
            slugs: shop.slugs
        }
    }

    /// update shop status by Admin
    async updateShopStatusByAdmin(vendorId, status) {
        const shop = await this.getMyShop(vendorId);
        // vendor only can update ther few status

        if (![ShopStatus.ACTIVE_STATUS, ShopStatus.DEACTIVATED_STATUS, ShopStatus.CLOSED_STATUS, ShopStatus.PENDING_STATUS, ShopStatus.SUSPENDED_STATUS, ShopStatus.BANNED_STATUS].includes(status)) {
            throw new ForbiddenError("Invalid shop status.")
        }
        shop.ShopStatus = status;
        await shop.save()
        return shop
    }


    /// get all shop by name 
    async searchShopForPublic(data) {

        // console.log(data)

        const page = parseInt(String(data?.page), 10) || 1;
        const limit = parseInt(String(data?.limit), 10) || 10;
        const skip = (page - 1) * limit;

        const filter = {};

        /// filter by shop name
        if (data?.name) {
            filter.shopName = {
                $regex: data.name,
                $options: "i",
            };
        }

        /// filter by shop status
        if (data?.shopStatus) {
            filter.ShopStatus = data.shopStatus;
        }

        const [shops, totalDocuments] = await Promise.all([
            ShopModel.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            ShopModel.countDocuments(filter),
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
            data: shops,
        };
    }


}


export default new shopServices();

