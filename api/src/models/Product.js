import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required."],
        minLength: 2,
        maxLength: 50
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: [true, "Price is required."],
        min: [0.01, "Price must be greater than 0.01"],
        max: [1000000, "Price must be less than 1000000."]
    },
    category: [{
        type: String,
        required: [true, "Category is required."]
    }],
    stock: {
        type: Number,
        min: 0,
        default: 0
    },
    rating: {
        type: Number,
        min: 0,
        max: 5
    },
    review: {
        type: String,
        maxLength: 1000
    },
}, {timestamps:true})

export default mongoose.model("Product", productSchema);