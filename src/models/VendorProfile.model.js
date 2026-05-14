

import mongoose from "mongoose";
import Roles from "../constants/userRoles.js";
import AccountStatus from "../constants/accountStatus.js";
import { required } from "zod/mini";

///// Vendor Schema

const vendorSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        businessDetail: {
            shopName: {
                type: String,
                required: [true, "Business name is required."],
            },
            businessEmail: {
                type: String,
                required: [true, "Business email is required."],
                validate: {
                    validator: function (value) {
                        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                        return regex.test(value);
                    },
                    message: "Invalid email address.",
                },
            },

            businessMobile: {
                type: String,
            },
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

        shopAddress: {
            location: {
                type: String,
                required: [true, "locality is required."]
            },

            city: {
                type: String,
                required: [true, "city is required."]
            },
            state: {
                type: String,
                required: [true, "state is required."]
            },
            pincode: {
                type: String,
            },

            landmark: {
                type: String,

            },
            mobile: {
                type: String
            }
        },


        accountStatus: {
            type: String,
            enum: [
                AccountStatus.ACTIVE_STATUS,
                AccountStatus.PENDING_STATUS,
                AccountStatus.REJECT_STATUS,
                AccountStatus.SUSPENDED_STATUS,
                AccountStatus.DEACTIVATED_STATUS,
                AccountStatus.BANNED_STATUS,
                AccountStatus.CLOSED,
            ],
            default: AccountStatus.PENDING_STATUS,
        },

        // document verification
        citizenship: {
            number: {
                type: String,
                required: [true, "Citizenship number is required."],
                unique: true,
            },
            dateOfBirth:{
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
        }

        //// additional information Banner, Logo, social icon, Discription,
    },
    { timestamps: true },
);

//// create collection in MongoDb database
const VendorProfileModel = mongoose.model("VendorProfile", vendorSchema);

export default VendorProfileModel;
