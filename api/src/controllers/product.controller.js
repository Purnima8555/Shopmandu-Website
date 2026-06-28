import productService from "../services/product.service.js";
import { BadRequestError } from "../utils/AppError.js";



/// create product
const createProduct = async (req, res, next) => {
    try {
        const vendorId = req.user._id;
        const productData = req.body;
        const images = req.files;

        /// validate images
        if (!images || images.length === 0) {
            throw new BadRequestError("Image is required");
        }
        const product = await productService.createProduct(vendorId, productData, images);
        res.status(201).json({
            success: true,
            message: "Product created successfully.",
            data: product
        });

    } catch (error) {
        next(error);
    }
};


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
        // console.log(slug)
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
        const { imageIndex } = req.body
        const updatedProduct = await productService.updateProductImage(vendorId, productId, file, imageIndex)

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

const deleteProductImage = async (req, res, next) => {

    try {

        const vendorId = req.user._id;
        const productId = req.params.id;
        const { imageIndex } = req.body
        const deleteProduct = await productService.updateProductImage(vendorId, productId, imageIndex)

        res.status(200).json({
            success: true,
            data: deleteProduct
        });

    } catch (error) {
        next(error)
    }

}


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

const getTopProductsPublic = async (req, res, next) => {
    try {

        const limit = Math.min(Number(req.query.limit) || 10, 20);

        const result = await productService.getTopProducts(limit);

        res.status(200).json({
            success: true,
            data: result,
        });

    } catch (err) {
        next(err);
    }
};

const getTopProducts = async (req, res, next) => {
    try {

        const limit = Math.min(Number(req.query.limit) || 10, 20);

        const result = await productService.getTopProducts(limit);

        res.status(200).json({
            success: true,
            data: result
        });

    } catch (err) {
        next(err);
    }
};


const getTopProductsVendor = async (req, res, next) => {
    try {

        const limit = Math.min(Number(req.query.limit) || 10, 20);

        const result = await productService.getTopProductsVendor(
            req.user._id,
            limit
        );

        res.status(200).json({
            success: true,
            data: result
        });

    } catch (err) {
        next(err);
    }
};



export {
    createProduct,
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
    getTopProductsPublic,
    getTopProducts,
    getTopProductsVendor,
}