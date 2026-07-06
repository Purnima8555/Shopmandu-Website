
import mongoose from "mongoose";
import productStatus from "../constants/productStatus.js";
import ShopStatus from "../constants/ShopStatus.js";
import ProductModel from "../models/Product.model.js";
import ShopModel from "../models/Shop.model.js";
import { BadRequestError, NotFoundError } from "../utils/AppError.js";
import CloudinaryUpload from "../utils/CloudinaryUpload.js";
import { generateUniqueProductSlug } from "../utils/slug.utils.js"
import categoryService from "./category.service.js";
import CategoryModel from "../models/Category.model.js";



class ProductService {


    //// create product
    async createProduct(vendorId, productData, images) {

        /// get vendor shop
        const vendorShop = await ShopModel.findOne({ user_id: vendorId });

        if (!vendorShop) {
            throw new NotFoundError("Shop not found, please create shop first.");
        }
        /// check shop status
        if (vendorShop.ShopStatus !== ShopStatus.ACTIVE_STATUS) {
            throw new BadRequestError(`Your shop status is ${vendorShop.ShopStatus}. Only active shops can create products.`);
        }

        let category
        /// category used.
        if (productData?.categoryId) {
            await categoryService.useCategory(productData?.categoryId);
            category = productData?.categoryId

        }

        /// generate slug
        const slug = await generateUniqueProductSlug(productData.slug || productData.name);

        // console.log("product Slug: ", slug)
        /// upload images
        const uploadedProductImages = await CloudinaryUpload.uploadMultipleImage(images, "upload");
        const productImages = uploadedProductImages.map(img => img.secure_url);

        /// build final product object
        const productPayload = {
            vendorId,
            shopId: vendorShop._id,
            images: productImages,
            ...productData,
            slug,
            categoryId: category,
            discountPrice:
                productData.discountPercent > 0
                    ? productData.price -
                    (productData.price * productData.discountPercent) / 100
                    : 0
        };
        /// create product
        const product = await ProductModel.create(productPayload);

        return product;
    }

    //// vendor can get their products
    async getMyProducts(vendorId, query) {

        const page = parseInt(query.page, 10) || 1;
        const limit = parseInt(query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        const filter = {
            vendorId,
        };


        if (query.search?.trim()) {
            filter.name = {
                $regex: query.search.trim(),
                $options: "i",
            };
        }

        if (query.category && query.category !== "ALL") {

            const category = await CategoryModel.findOne({
                $or: [
                    { name: query.category },
                    { slug: query.category.toLowerCase() },
                ],
            }).select("_id");

            if (!category) {
                return {
                    metadata: {
                        totalResults: 0,
                        totalPages: 0,
                        currentPage: page,
                        limit,
                        hasNextPage: false,
                        hasPrevPage: false,
                    },
                    data: [],
                };
            }

            filter.categoryId = category._id;
        }


        if (query.status && query.status !== "ALL") {
            filter.productStatus = query.status;
        }

        if (query.stock && query.stock !== "ALL") {

            switch (query.stock) {

                case "IN_STOCK":
                    filter.stock = { $gte: 6 };
                    break;

                case "LOW_STOCK":
                    filter.stock = {
                        $gte: 1,
                        $lte: 5,
                    };
                    break;

                case "OUT_OF_STOCK":
                    filter.stock = 0;
                    break;
            }
        }

        let sort = {
            createdAt: -1,
        };

        switch (query.sortBy) {

            case "NEWEST":
                sort = { createdAt: -1 };
                break;

            case "OLDEST":
                sort = { createdAt: 1 };
                break;

            case "PRICE_ASC":
                sort = { price: 1 };
                break;

            case "PRICE_DESC":
                sort = { price: -1 };
                break;

            case "STOCK_ASC":
                sort = { stock: 1 };
                break;

            case "STOCK_DESC":
                sort = { stock: -1 };
                break;

            case "NAME_ASC":
                sort = { name: 1 };
                break;

            case "NAME_DESC":
                sort = { name: -1 };
                break;
        }

        const [products, totalDocuments] = await Promise.all([
            ProductModel.find(filter)
                .populate("categoryId", "name slug isActive")
                .sort(sort)
                .skip(skip)
                .limit(limit),

            ProductModel.countDocuments(filter),
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
            data: products,
        };
    }

    /// get my product by id 
    async getMyProductById(vendorId, productId) {
        const product = await ProductModel.findOne({ _id: productId, vendorId: vendorId });
        if (!product) {
            throw new NotFoundError("Product not found");
        }
        return product
    }

    async getProductById(productId) {

        const product = await ProductModel.findById({ _id: productId })

        if (!product) {
            throw new NotFoundError("Product not found")
        }
        return product

    }

    //// get product by slug
    async getProductBySlug(productSlug) {

        const product = await ProductModel.findOne({ slug: productSlug }, { vendorId: 0 })
        if (!product) {
            throw new NotFoundError("Product not found")
        }

        return product
    }

    // get product by shop id
    async getProductByShop(shopId) {
        const products = await ProductModel.find({ shopId }, { vendorId: 0 }).sort({ createdAt: -1 }).lean();
        return products;
    }

    //// update product status 
    async updateStatus(productId, vendorId, status) {
        /// find product
        const product = await this.getMyProductById(vendorId, productId);
        if (!product) {
            throw new NotFoundError("Product not found");
        }
        if (!Object.values(productStatus).includes(status)) {
            throw new BadRequestError(`Invalid product Status, only contain ${productStatus.ACTIVE}, ${productStatus.OUT_OF_STOCK}, ${productStatus.INACTIVE}`)
        }

        product.productStatus = status
        await product.save()

        return product
    }


    /// update product information
    async updateProductInfo(vendorId, productId, updateData) {

        const product = await this.getMyProductById(vendorId, productId);

        //// prevent invalid combination
        if (updateData.discountPrice !== undefined && updateData.discountPercent !== undefined) {
            throw new BadRequestError("You cannot provide both discountPrice and discountPercent");
        }

        /// apply base updates first
        Object.assign(product, updateData);
        const price = product.price;

        /// percent updated => calculate price
        if (updateData.discountPercent !== undefined) {
            const percent = product.discountPercent;
            if (percent <= 0) {
                product.discountPrice = 0;
            } else {
                product.discountPrice = price - (price * percent) / 100;
            }
        }

        ////  discountPrice updated => calculate percent
        else if (updateData.discountPrice !== undefined) {
            const discountPrice = product.discountPrice;
            if (price > 0 && discountPrice >= 0) {
                product.discountPercent = ((price - discountPrice) / price) * 100;
            }
        }

        //// price changed => recompute everything if discount exists
        else if (updateData.price !== undefined) {
            if (product.discountPercent > 0) {
                product.discountPrice = price - (price * product.discountPercent) / 100;
            } else {
                product.discountPrice = 0;
            }
        }

        await product.save();

        return product;
    }

    /// update product image 
    async updateProductImage(vendorId, productId, image, imageIndex) {

        /// find product
        const product = await this.getMyProductById(vendorId, productId);


        /// validate index
        if (imageIndex === undefined || imageIndex < 0 || imageIndex >= product.images.length) {
            throw new NotFoundError("Invalid image index");
        }
        /// upload new image
        const uploadedImage = await CloudinaryUpload.uploadSingleImage(image, "upload");

        /// replace image
        product.images[imageIndex] = uploadedImage.secure_url;
        await product.save();
        return product;
    }

    /// add product image 
    async addProductImage(vendorId, productId, images) {

        ///// find product
        const product = await this.getMyProductById(vendorId, productId);

        const MAX_IMAGES = 8;
        /// check limit before upload
        if (product.images.length >= MAX_IMAGES) {
            throw new BadRequestError("Maximum 8 images allowed for this product");
        }

        if (product.images.length + images.length > MAX_IMAGES) {
            throw new BadRequestError(`You can only add ${MAX_IMAGES - product.images.length} more images`
            );
        }

        ///// upload images
        const uploadedImages = await CloudinaryUpload.uploadMultipleImage(images, "upload");
        /// push safely
        uploadedImages.forEach(img => {
            product.images.push(img.secure_url);
        });

        await product.save();

        return product;
    }

    /// video upload 
    async productVideoUpload(vendorId, productId, video) {
        ///// find product
        const product = await this.getMyProductById(vendorId, productId);

        const videoLength = product.videos.length

        if (videoLength >= 2) {
            throw new BadRequestError("You can't upload more than 2 videos!")
        }

        /// upload video on cluddinary
        const uploadedVideo = await CloudinaryUpload.videoUpload(video, "upload")

        const videoURL = uploadedVideo.secure_url

        product.videos.push(videoURL)
        await product.save()

        return product;

    }

    /// delete product image 

    async deleteProductImage(vendorId, productId, imageIndex) {

        /// find product
        const product = await this.getMyProductById(vendorId, productId);

        /// index checked.
        if (imageIndex === undefined || imageIndex === null || imageIndex < 0 || imageIndex >= product.images.length) {
            throw new BadRequestError("Invalid image Index.")
        }
        product.images.splice(imageIndex, 1)
        await product.save();
        return { message: "Image remove succesfull!" };
    }


    //// delete product
    async deleteProduct(vendorId, productId) {
        //// find product first (for validation + cleanup)
        const product = await ProductModel.findOneAndDelete({ _id: productId, vendorId: vendorId });
        if (!product) {
            throw new NotFoundError("Product not found");
        }
        return {
            message: "Product deleted successfully"
        };
    }


    /// Get all products for public with pagination
    async getAllProduct(data) {
        const page = parseInt(data?.page, 10) || 1;
        const limit = parseInt(data?.limit, 10) || 10;
        const skip = (page - 1) * limit;

        const filter = {};

        let sort = {
            createdAt: -1,
        };

        /// search by product name
        if (data?.name || data?.search) {
            const searchTerm = data.name || data.search;
            filter.name = {
                $regex: searchTerm,
                $options: "i",
            };
        }

        /// multiple brands filter
        if (data?.brand) {
            // We split string into array: "Apple,Samsung" -> ["Apple", "Samsung"]
            const brandArray = Array.isArray(data.brand)
                ? data.brand
                : data.brand.split(",").filter(Boolean);

            if (brandArray.length > 0) {
                filter.brand = { $in: brandArray };
            }
        }

        /// multiple categories filter 
        if (data?.category) {
            const categoryArray = Array.isArray(data.category)
                ? data.category
                : data.category.split(",").filter(Boolean);

            if (categoryArray.length > 0) {
                // First: find the Category IDs based on the names provided from frontend
                const categoryDocs = await CategoryModel.find({
                    name: { $in: categoryArray }
                }).select("_id");

                const categoryIds = categoryDocs.map(cat => cat._id);
                filter.categoryId = { $in: categoryIds };
            }
        }

        /// price range filter
        if (data?.minPrice || data?.maxPrice) {
            filter.discountPrice = {};
            if (data.minPrice) filter.discountPrice.$gte = parseFloat(data.minPrice);
            if (data.maxPrice) filter.discountPrice.$lte = parseFloat(data.maxPrice);
        }

        /// sort order
        if (data?.sort) {
            if (data.sort === "price_asc") sort = { discountPrice: 1 };
            if (data.sort === "price_desc") sort = { discountPrice: -1 };
        }

        /// product status
        if (data?.productStatus) {
            filter.productStatus = data.productStatus;
        }

        /// best selling products
        if (data?.bestSale) {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

            filter.updatedAt = {
                $gte: oneWeekAgo,
            };

            filter.releasedStock = {
                $gt: 0,
            };

            sort = {
                releasedStock: -1,
                updatedAt: -1,
            };
        }

        const [products, totalDocuments] = await Promise.all([
            ProductModel.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .populate("categoryId", "name slug isActive"),

            ProductModel.countDocuments(filter),
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
            data: products,
        };
    }

    /// on flashSales for vendor product

    async onFlashSales(vendorId, productId) {
        const product = await this.getMyProductById(vendorId, productId);

        product.flashSales = true;
        await product.save();

        return {
            message: "Product added to flash sales successfully",
            product,
        };

    }

    async removeFromFlashSales(vendorId, productId) {
        const product = await this.getMyProductById(vendorId, productId);

        product.flashSales = false;
        await product.save();

        return {
            message: "Product removed from flash sales successfully",
            product,
        };
    }

    /// get all flash sales products for public

    async getAllFlashSalesProducts(data) {
        const page = parseInt(data?.page, 10) || 1;
        const limit = parseInt(data?.limit, 10) || 10;
        const skip = (page - 1) * limit;

        const filter = { flashSales: true };

        if (data?.name) {
            filter.name = {
                $regex: data.name,
                $options: "i",
            };
        }

        const [products, totalDocuments] = await Promise.all([
            ProductModel.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            ProductModel.countDocuments(filter),
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
            data: products,
        };
    }

    //// get product summary

    async getProductsSummary(vendorId) {
        const summary = await ProductModel.aggregate([
            {
                $match: {
                    vendorId: new mongoose.Types.ObjectId(vendorId),
                },
            },
            {
                $group: {
                    _id: null,
                    totalProducts: { $sum: 1 },

                    activeProducts: {
                        $sum: {
                            $cond: [
                                { $eq: ["$productStatus", productStatus.ACTIVE] },
                                1,
                                0,
                            ],
                        },
                    },

                    inactiveProducts: {
                        $sum: {
                            $cond: [
                                { $eq: ["$productStatus", productStatus.INACTIVE] },
                                1,
                                0,
                            ],
                        },
                    },

                    outOfStockProducts: {
                        $sum: {
                            $cond: [
                                { $eq: ["$productStatus", productStatus.OUT_OF_STOCK] },
                                1,
                                0,
                            ],
                        },
                    },
                },
            },
        ]);

        return (
            summary[0] ?? {
                totalProducts: 0,
                activeProducts: 0,
                inactiveProducts: 0,
                outOfStockProducts: 0,
            }
        );
    }

}

export default new ProductService();
