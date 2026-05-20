import mongoose from "mongoose";


const resetForgerSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: [true, "user Id is required."]
    },

    token: {
        type: String,
        required: [true, "token is required"],
    },


    isUsed: {
        type: Boolean,
        default: false
    },

    expiresAt: {
        type: Date,
        default: () => Date.now() + 900 * 1000,
        /// Date.now() provides current time, adding 900 second * 1000 millisecond  = 15 minutes. 900 
        expires: 900, /// it means auto delete after 15 minutes
        immutable: true
    }


}, { timestamps: true })


const ResetForgetPassword = mongoose.model("ForgetPassword",resetForgerSchema)

export default ResetForgetPassword;

