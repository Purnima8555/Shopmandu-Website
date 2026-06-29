


import shopService from "../services/shop.service.js";
import { BadRequestError } from "../utils/AppError.js";

/// create shop
const createShop = async (req, res, next) => {
    /// get shop data
    const shopData = req.body;
    const vendorId = req.user?._id;

    const logo = req.files?.logo?.[0]
    const banner = req.files?.banner?.[0]

    if (!logo) {
        throw new BadRequestError("Shop Logo is required.")
    }
    if (!banner) {
        throw new BadRequestError("Shop Banner is required.")
    }

    try {
        const newShop = await shopService.createShop(shopData, vendorId, [logo, banner])
        res.status(201).json({
            success: true,
            message: "Shop created successfully.",
            data: newShop
        });

    } catch (error) {
        next(error)
    }

}


/// shop get by slag, for public
const getShopBySlug = async (req, res, next) => {
    try {
        const slug = req.params.slug
        const shop = await shopService.getShopBySlug(slug)
        res.status(200).json({
            success: true,
            data: shop
        });
    } catch (error) {
        next(error)
    }

}

/// vendor see there own shop

const myShop = async (req, res, next) => {

    try {
        const vendorId = req.user?._id
        const shop = await shopService.getMyShop(vendorId)
        res.status(200).json({
            success: true,
            data: shop
        });

    } catch (error) {
        next(error)
    }

}


/// update shop data.
const updateShopInfo = async (req, res, next) => {

    try {
        const shopData = req.body
        const vendorId = req.user?._id
        const updatedShop = await shopService.updateShopData(shopData, vendorId);
        res.status(200).json({
            success: true,
            data: updatedShop
        });

    } catch (error) {
        next(error)
    }


}


/// update shop logo
const updateShopLogo = async (req, res, next) => {

    try {

        const logo = req.file
        const vendorId = req.user?._id

        if (!logo) {
            throw new BadRequestError("Shop Logo is required.")
        }

        const updatedShop = await shopService.updateShopLogo(vendorId, logo);
        res.status(200).json({
            success: true,
            message: "Shop logo updated successfully.",
            data: updatedShop
        });

    } catch (error) {
        next(error)
    }

}

/// update shop banner 
const updateShopBanner = async (req, res, next) => {

    try {

        const banner = req.file
        const vendorId = req.user?._id
        if (!banner) {
            throw new BadRequestError("Shop Banner is required.")
        }

        const updatedShop = await shopService.updateShopBanner(vendorId, banner);
        res.status(200).json({
            success: true,
            message: "Shop banner updated successfully.",
            data: updatedShop
        });

    } catch (error) {
        next(error)
    }

}

/// update shop status own vendor 

const updateShopStatus = async (req, res, next) => {

    try {
        const vendorId = req.user?._id
        const { status } = req.body
        const updatedShopStatus = await shopService.updateShopStatus(vendorId, status)
        res.status(200).json({
            success: true,
            message: "Shop status updated successfully.",
            data: updatedShopStatus
        });

    } catch (error) {
        next(error)
    }

}


/// update shop Status by Admin

const updateShopStatusByAdmin = async (req, res, next) => {

    try {

        const vendorId = req.params?.id
        const { status } = req.body

        if(!vendorId){
            throw new BadRequestError("Vendor id is required")
        }

        const updatedShopStatus = await shopService.updateShopStatusByAdmin(vendorId,status);

        res.status(200).json({
            success: true,
            message: "Shop status updated successfully.",
            data: updatedShopStatus
        });

    } catch (error) {
        next(error)
    }

}

/// search shop by name 

const searchShop = async (req, res, next) => { 
    
    try {
        
        const result = await shopService.searchShopForPublic(req.query)

        res.status(200).json(result)

    } catch (error) {
        next(error)
    }
 }

export {
    createShop,
    updateShopBanner,
    updateShopInfo,
    updateShopLogo,
    getShopBySlug,
    myShop,
    updateShopStatusByAdmin,
    updateShopStatus,
    searchShop,
}

