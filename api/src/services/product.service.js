
import productStatus from "../constants/productStatus.js";
import ShopStatus from "../constants/ShopStatus.js";
import ProductModel from "../models/Product.model.js";
import ShopModel from "../models/Shop.model.js";
import { BadRequestError, NotFoundError } from "../utils/AppError.js";
import CloudinaryUpload from "../utils/CloudinaryUpload.js";
import { generateUniqueProductSlug } from "../utils/slug.utils.js"



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

        /// generate slug
        const slug = await generateUniqueProductSlug(productData.slug || productData.name);

        console.log("product Slug: ",slug)
        /// upload images
        const uploadedProductImages = await CloudinaryUpload.uploadMultipleImage(images, "upload");
        const productImages = uploadedProductImages.map(img => img.secure_url);

        /// build final product object
        const productPayload = {
            vendorId,
            shopId: vendorShop._id,
            slug,
            images: productImages,
            ...productData,
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
    async getMyProducts(vendorId) {
        const products = await ProductModel.find({
            vendorId: vendorId
        });

        return products;
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

}

export default new ProductService();
