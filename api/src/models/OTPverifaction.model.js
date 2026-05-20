import mongoose from "mongoose";

const otpVerificationSchema = new mongoose.Schema({

    email: {
        type: String,
        unique: [true, "Email is uniqued"],
        required: [true, "Email is required."],
        validate: {
            validator: function (value) {
                const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                return regex.test(value);
            },
            message: "Invalid email address."
        }
    },

    otp: {
        type: String,
        required: [true, "OTP is required"]
    },

    expiresAt: {
        type: Date,
        default: () => Date.now() + 300 * 1000,
        /// Date.now() provides current time, adding 300 second * 1000 millisecond  = 5 minutes. 300 
        expires: 300, /// it means auto delete after 5 minutes
        immutable: true
    }

});

const OTPModels = mongoose.model("OTP_Verification", otpVerificationSchema);

export default OTPModels;