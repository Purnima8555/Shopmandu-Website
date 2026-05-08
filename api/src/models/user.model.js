import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    full_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "User",
        required: true
    },
    image: {
        type: String,
        default: null
    },
password: {
    type: String,
    required: true,
},
resetPasswordToken: String,
resetPasswordExpires: Date
});

const Customer = mongoose.model("customers", customerSchema);

export default Customer;

// more attributes to be added