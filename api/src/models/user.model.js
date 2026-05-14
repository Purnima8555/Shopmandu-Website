import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Credential",
        },

        full_name: String,
        email: String,
        contact_no: String,
        role: String,
        image: String,
    },
    { timestamps: true },
);

export default mongoose.model("Customer", customerSchema, "customers");
