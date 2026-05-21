import Product from "../models/Product.js"
import uploadFile from "../utils/fileUploader.js"

const getAllProducts = async () => {
    const products = await Product.find();
    return products;
};

const getProductById = async (id) => {
    const product = await Product.findById(id);
    return product;
};

const createProduct = async (data, files) => {
    const uploadedFiles = await uploadFile(files);
    return await Product.create({ ...data, imageUrls: uploadedFiles.map((files) => files.url) });
};

// const updateProduct = async (id, input) => {
//     return await Product.findByIdAndUpdate(id, input, { new: true });
// };

const deleteProduct = async (id) => {
    return await Product.findByIdAndDelete(id);
};

export default { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct }