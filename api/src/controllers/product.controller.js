import productService from "../services/product.service.js";
import { BadRequestError } from "../utils/AppError.js";


/// create product
const createProduct = async (req, res, next) => {
    try {
        const vendorId = req.user._id;
        const productData = req.body;
        const images = req.files["images"];
        const videos = req.files["videos"];

        /// validate images
        if (!images || images.length === 0) {
            throw new BadRequestError("Image is required");
        }

        const product = await productService.createProduct(vendorId, productData, images, videos);
        res.status(201).json({
            success: true,
            message: "Product created successfully.",
            data: product
        });

    } catch (error) {
        next(error);
    }
};

///All products
const getAllProducts = async (req, res, next) => {
    try {
        const products = await productService.getAllProducts(req.query);
        // products validation
        if (!products || products.length == 0) {
            res.status(404).json({ message: "No Products Available." })
        }
        res.status(200).json({
            success: true,
            data: products
        });

    } catch (error) {
        next(error)
    }
}

/// vendor get there own products
const getMyProducts = async (req, res, next) => {

    try {
        const vendorId = req.user._id;
        const products = await productService.getMyProducts(vendorId);
        
        res.status(200).json({
            success: true,
            data: products
        });

    } catch (error) {
        next(error)
    }

}


/// get my product by id
const getMyProductsById = async (req, res, next) => {

    try {
        const vendorId = req.user._id;
        const productId = req.params.id
        const product = await productService.getMyProductById(vendorId, productId);
        res.status(200).json({
            success: true,
            data: product
        });

    } catch (error) {
        next(error)
    }

}


/// get product by id 
const getProductsById = async (req, res, next) => {

    try {
        const productId = req.params.id
        const product = await productService.getProductById(productId);
        res.status(200).json({
            success: true,
            data: product
        });

    } catch (error) {
        next(error)
    }

}


const getProductBySlug = async (req, res, next) => {
    try {
        const slug = req.params.slug
        const product = await productService.getProductBySlug(slug);
        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        next(error)
    }

}

const getProductByShop = async (req, res, next) => {

    try {
        const shopId = req.params.id
        const products = await productService.getProductByShop(shopId);
        res.status(200).json({
            success: true,
            data: products
        });

    } catch (error) {
        next(error)
    }

}

const updateStatus = async (req, res, next) => {
    try {
        const vendorId = req.user._id;
        const productId = req.params.id
        const { productStatus } = req.body

        const product = await productService.updateStatus(productId, vendorId, productStatus);
        res.status(200).json({
            success: true,
            data: product
        });


    } catch (error) {
        next(error)
    }
}

const updateProductInfo = async (req, res, next) => {

    try {
        const vendorId = req.user._id;
        const productId = req.params.id;
        const productData = req.body;

        const updatedProduct = await productService.updateProductInfo(vendorId, productId, productData)

        res.status(200).json({
            success: true,
            data: updatedProduct
        });

    } catch (error) {
        next(error)
    }

}

const updateProductImage = async (req, res, next) => {

    try {
        const vendorId = req.user._id;
        const productId = req.params.id;
        const file = req.file;
        const { imageIndex } = req.body;

        const updatedProduct = await productService.updateProductImage(vendorId, productId, file, imageIndex);

        res.status(200).json({
            success: true,
            data: updatedProduct
        });

    } catch (error) {
        next(error)
    }

}

const addProductImage = async (req, res, next) => {

    try {
        const vendorId = req.user._id;
        const productId = req.params.id;
        const files = req.files;
        const updatedProduct = await productService.addProductImage(vendorId, productId, files)

        res.status(200).json({
            success: true,
            data: updatedProduct
        });

    } catch (error) {
        next(error)
    }

}

const productVideoUpload = async (req, res, next) => {

    try {
        const vendorId = req.user._id;
        const productId = req.params.id;
        const video = req.file

        if (!video) {
            throw new BadRequestError("Video file is required!");
        }
        const product = await productService.productVideoUpload(vendorId, productId, video)

        res.status(200).json({
            success: true,
            message: "Video uploaded successfully!",
            data: product
        });

    } catch (error) {
        next(error)
    }

}

const updateProductVideo = async (req, res, next) => {
    try {
        const vendorId = req.user._id;
        const productId = req.params.id;
        const file = req.file; // Captured by upload.single("video")
        const { videoIndex } = req.body;


        // Execute service invocation matching parameter signatures exactly
        const updatedProduct = await productService.updateProductVideo(
            vendorId,
            productId,
            file,
            videoIndex
        );

        return res.status(200).json({
            success: true,
            data: updatedProduct
        });

    } catch (error) {
        next(error);
    }
};


const deleteProductImage = async (req, res, next) => {

    try {
        const vendorId = req.user._id;
        const productId = req.params.id;
        const { imageIndex } = req.body;

        const deleteImage = await productService.deleteProductImage(vendorId, productId, imageIndex);
        res.status(200).json({
            success: true,
            data: deleteImage,
        });

    } catch (error) {
        next(error)
    }

}


const deleteProductVideo = async (req, res, next) => {
    try {
        const vendorId = req.user._id;
        const productId = req.params.id;
        const { videoIndex } = req.body;

        // Guard clause prevents the "undefined" crash
        if (videoIndex === undefined || videoIndex === null) {
            throw new BadRequestError("Missing required parameter: videoIndex");
        }

        const result = await productService.deleteProductVideo(
            vendorId,
            productId,
            videoIndex // Force cast to a clean Number index safely
        );

        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};


const deleteProduct = async (req, res, next) => {

    try {
        const vendorId = req.user._id;
        const productId = req.params.id

        await productService.deleteProduct(vendorId, productId);
        res.status(200).json({
            success: true,
            message: "product delete succesfull"
        });
    } catch (error) {
        next(error)
    }


}



export {
    createProduct,
    getAllProducts,
    getMyProducts,
    getMyProductsById,
    getProductByShop,
    getProductBySlug,
    getProductsById,
    updateStatus,
    deleteProduct,
    deleteProductImage,
    updateProductImage,
    addProductImage,
    updateProductInfo,
    productVideoUpload,
    updateProductVideo,
    deleteProductVideo,
}