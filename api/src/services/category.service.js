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


    /// get all category with filter/ pagination 
    getAllCategories = async ({ page = 1, limit = 10, search }) => {
        const filter = {};

        /// category search by name.
        if (search) {
            filter.name = { $regex: search, $options: "i" };
        }

        const skip = (page - 1) * limit;

        const [categories, total] = await Promise.all([
            CategoryModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
            CategoryModel.countDocuments(filter)
        ]);
        return {
            categories,
            total,
            page,
            totalPages: Math.ceil(total / limit)
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