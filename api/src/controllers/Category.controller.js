
import categoryService from "../services/category.service.js";


/// create new product category
export const createProductCategory = async (req, res, next) => {
    try {
        const category = await categoryService.createCategory(req.body);

        res.status(201).json({
            success: true,
            message: "Category created successfully.",
            category
        });
    } catch (error) {
        next(error);
    }
};

//// get all product categori

export const getAllProductCategories = async (req, res, next) => {
    try {
        const categories = await categoryService.getAllCategories(
            req.query
        );

        res.status(200).json( categories);
    } catch (error) {
        next(error);
    }
};


//// get category product by id
export const getProductCategoryById = async (req, res, next) => {
    try {
        const { categoryId } = req.params;

        const category = await categoryService.getCategoryById(
            categoryId
        );

        res.status(200).json({
            success: true,
            category
        });
    } catch (error) {
        next(error);
    }
};

/// update category
export const updateProductCategory = async (req, res, next) => {
    try {
        const { categoryId } = req.params;

        const category = await categoryService.updateCategory(
            categoryId,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Category updated successfully.",
            category
        });
    } catch (error) {
        next(error);
    }
};


/// delete category
export const deleteProductCategory = async (req, res, next) => {
    try {
        const { categoryId } = req.params;

        await categoryService.deleteCategory(categoryId);

        res.status(200).json({
            success: true,
            message: "Category deleted successfully."
        });
    } catch (error) {
        next(error);
    }
};

/// toggle active category status
export const toggleProductCategoryStatus = async (req, res, next) => {
    try {
        const { categoryId } = req.params;

        const category =
            await categoryService.toggleCategoryStatus(
                categoryId
            );

        res.status(200).json({
            success: true,
            message: "Category status updated successfully.",
            category
        });
    } catch (error) {
        next(error);
    }
};


/// get all active category
export const getActiveProductCategories = async ( req, res, next) => {
    try {
        const categories =
            await categoryService.getActiveCategories();

        res.status(200).json({
            success: true,
            categories
        });
    } catch (error) {
        next(error);
    }
};