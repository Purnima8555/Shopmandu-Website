

import mongoose from "mongoose";
import kycStatus from "../constants/kycStatus.js";

const kycSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },

    fullName: {
        type: String,
        required: [true, "User name required"],
        minlength: [3, "User name must be at least 3 characters."],
        maxlength: [50, "User name must be a maximum of 50 characters."]
    },
    kycStatus: {
        type: String,
        enum: [
            kycStatus.APPROVED_STATUS,
            kycStatus.PENDING_STATUS,
            kycStatus.REJECTED_STATUS
        ],
        default: kycStatus.PENDING_STATUS,
    },

    bankDetails: {
        accountNumber: {
            type: String,
            required: [true, "Bank account number is required."],
        },
        accountHolderName: {
            type: String,
            required: [true, "Account holder name is required."],
            minlength: [3, "Account holder name must be at least 3 characters."],
            maxlength: [
                50,
                "Account holder name must be a maximum of 50 characters.",
            ],
        },
        bankName: {
            type: String,
            required: [true, "Bank name is required."],
        },
        branchName: {
            type: String,
        },
    },

    // document verification
    citizenship: {
        number: {
            type: String,
            required: [true, "Citizenship number is required."],
            unique: true,
        },
        dateOfBirth: {
            type: Date,
            required: [true, "Date of Birth is."]
        },

        // here data are store by system
        frontSideImage: {
            public_id: {
                type: String,
                required: [true, "Cloudinary image public id is required."],
            },

            format: {
                type: String,
                required: [true, "Cloudinary image format is required."],
            },

            resource_type: {
                type: String,
                required: [true, "Cloudinary resource type is required."],
                default: "image",
            },

            folder: {
                type: String,
                required: [true, "Cloudinary folder name is required."],
            },
        },

        backSideImage: {
            public_id: {
                type: String,
                required: [true, "Cloudinary image public id is required."],
            },

            format: {
                type: String,
                required: [true, "Cloudinary image format is required."],
            },

            resource_type: {
                type: String,
                required: [true, "Cloudinary resource type is required."],
                default: "image",
            },

            folder: {
                type: String,
                required: [true, "Cloudinary folder name is required."],
            },
        },
    },

    nidNumber: {
        type: String,
        required: [true, "National Identification Number is required."],
    },

    panNumber: {
        type: String,
        required: [true, "PAN number is required"]
    },

    rejectionReason: {
        type: String,
        minlength: [3, "User name must be at least 3 characters."],
        maxlength: [100, "User name must be a maximum of 50 characters."]
    }


}, { timestamps: true })


const vendorKycModel = mongoose.model("VendorKYC", kycSchema);

export default vendorKycModel;


