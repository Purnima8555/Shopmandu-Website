import mongoose from "mongoose";


const categorySchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Category name is required."],
        trim: true,
        unique: true,
        minlength: 2,
        maxlength: 50
    },
    slug: {
        type: String,
        unique: [true, "Category slug is unique"],
        required: [true, "Category slug is required."],
        trim: true,
        lowercase: true,
        index: true
    },
    description: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    productCount: {
        type: Number,
        min: 0,
        default: 0
    }
}, { timestamps: true })


const CategoryModel = mongoose.model('Category', categorySchema);
export default CategoryModel;


