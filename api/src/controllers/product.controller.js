import productService from "../services/product.service.js";

const getAllProducts = async (req, res) => {
    const products = await productService.getAllProducts();
    if (!products || products.length == 0) {
        res.status(404).json({ message: "No Products Available." })
    }
    res.json(products);
};

const getProductById = async (req, res) => {
    const id = req.params.id;
    const product = await productService.getProductById(id);
    if (!product) return res.status(404).json({ message: "Product not found." });
    res.json(product);
};

const createProduct = async (req, res) => {
    try {
        const product = await productService.createProduct(req.body, req.files);
        res.json(product);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

// const updateProduct = async (req, res) => {
//     const id = req.params.id;
//     const input = req.body;
//     try {
//         const product = await productService.updateProduct(id, input);
//         res.json(product);
//     } catch (error) {
//         res.status(400).send(error.message);
//     }
// };

const deleteProduct = async (req, res) => {
    const id = req.params.id;
    try {
        const deletedProduct = await productService.deleteProduct(id);
        if (!deletedProduct) {
            res.status(404).json({ message: "No such product found." })
        }
        res.json({ Message: `${deletedProduct.name} deleted successfully.` });
    } catch (error) {
        res.status(400).send(error.message);
    }
}

export default { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct }