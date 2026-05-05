import productService from "../services/product.service.js";

const getAllProducts = async (req, res) => {
    const products = await productService.getAllProducts();
    res.json(products);
};

const getProductById = async (req, res) => {
    const id = req.params.id;
    const product = await productService.getProductById(id);
    if (!product) return res.status(400).json({ message: "Product not found." });
    res.json(product);
};

const createProduct = async (req, res) => {
    try {
        const product = await productService.createProduct(req.body);
        res.json(product);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

const updateProduct = async (req, res) => {
    const id = req.params.id;
    const input = req.body;
    try {
        const product = await productService.updateProduct(id, input);
        res.json(product);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

const deleteProduct = async (req, res) => {
    const id = req.params.id;
    try {
        await productService.deleteProduct(id);
        res.json({ Message: "Product deleted successfully." });
    } catch (error) {
        res.status(400).send(error.message);
    }
}

export default { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct }