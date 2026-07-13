import mongoose from "mongoose";

const credentialSchema = new mongoose.Schema(
    {
        full_name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },

        password: {
            type: String,
            required: function () {
                return !this.googleId;
            },
            select: false,
        },

        googleId: {
            type: String,
            unique: true,
            sparse: true,
        },

        role: {
            type: String,
            enum: ["customer", "vendor", "admin"],
            default: "customer",
            required: true,
        },
    },
    { timestamps: true },
);

export default mongoose.model("Credential", credentialSchema, "credentials");
