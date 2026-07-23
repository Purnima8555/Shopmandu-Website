import CategoryModel from "../models/Category.model.js";
import { BadRequestError, NotFoundError } from "../utils/AppError.js";
import { generatedUniqueCategorySlug } from "../utils/slug.utils.js";

class CategoryService {


    createCategory = async (data) => {
        const { name, slug, description, isActive } = data;

        /// if same exist
        const existingCategory = await CategoryModel.exists({
            name: name.trim()
        });

        if (existingCategory) {
            throw new BadRequestError("Category name already exists.");
        }

        //// generate slug for category
        const categorySlug = await generatedUniqueCategorySlug(slug || name);

        return await CategoryModel.create({
            name: name.trim(),
            slug: categorySlug,
            description: description?.trim(),
            isActive
        });
    };


    /// Get all categories with filtering & pagination
    getAllCategories = async (data) => {
        const page = parseInt(data.page, 10) || 1;
        const limit = parseInt(data.limit, 10) || 10;
        const skip = (page - 1) * limit;

        const filter = { };

        // Category search by name
        if (data.search) {
            filter.name = {
                $regex: data.search,
                $options: "i",
            };
        }

        const [categories, totalResults] = await Promise.all([
            CategoryModel.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),

            CategoryModel.countDocuments(filter),
        ]);

        const totalPages = Math.ceil(totalResults / limit);

        return {
            success: true,
            metadata: {
                totalResults,
                totalPages,
                currentPage: page,
                limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
            data: categories,
        };
    };

    /// get category by id 
    getCategoryById = async (categoryId) => {
        const category = await CategoryModel.findById(categoryId);

        if (!category) {
            throw new NotFoundError("Category not found.");
        }

        return category;
    };


    /// update category 

    updateCategory = async (categoryId, data) => {
        const category = await CategoryModel.findByIdAndUpdate(
            categoryId,
            data,
            {
                // new: true,
                returnDocument: "after",
                runValidators: true,
            }
        );

        if (!category) {
            throw new NotFoundError("Category not found.");
        }

        return category;
    };

    /// delete category

    deleteCategory = async (categoryId) => {
        const category = await CategoryModel.findById(categoryId);

        if (!category) {
            throw new BadRequestError("Category not found.");
        }

        await category.deleteOne();

        return true;
    };


    //// toggele category status 

    toggleCategoryStatus = async (categoryId) => {
        const category = await CategoryModel.findById(categoryId);

        if (!category) {
            throw new BadRequestError("Category not found.");
        }

        category.isActive = !category.isActive;

        await category.save();

        return category;
    };

    /// get active category

    getActiveCategories = async () => {
        return await CategoryModel.find({
            isActive: true
        }).sort({ name: 1 });
    };

    /// use categorie

    useCategory = async (categoryId) => {
        const category = await CategoryModel.findOneAndUpdate(
            {
                _id: categoryId,
                isActive: true,
            },
            { $inc: { productCount: 1 } },
            {
                returnDocument: "after"
                // new: true,
            }
        );

        if (!category) {
            throw new BadRequestError("Category not found or is not currently active");
        }

        return {
            isUsed: true,
        };
    };

}

export default new CategoryService();