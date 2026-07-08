

import authService from "../services/auth.service.js"
import { signJwt } from "../utils/jwt.utils.js"
import { AppError, BadRequestError } from "../utils/AppError.js"
import { generateOAuthURI, googleLogin } from "../services/googleAuth.service.js"
import CloudinaryUpload from "../utils/CloudinaryUpload.js"
import config from "../config/config.js"

const logIn = async (req, res, next) => {

    const userData = req.body
    if (!userData.email || !userData.password) {
        // return next(new BadRequestError("Email and password are required"));
        throw new BadRequestError("Email and password are required!");
    }
    try {
        const user = await authService.logIn(userData)

        //// creatre jwt token
        let payload = {
            userName: user.userName,
            _id: user._id,
            email: user.email,
            roles: user.roles,
            authProvider: user.authProvider,
            avatar: user.avatar,
            mobile: user.mobile

        }
        const token = await signJwt(payload)

        res.cookie("authToken", token, {
            maxAge: 86400 * 1000, /// valid for 1 day 
            httpOnly: true,
            secure: config.node_env === "production",
            sameSite: "lax",
        })

        res.json({ ...user, token })

    } catch (error) {
        // res.status(error.status || 400).send(error.message);
        // throw new AppError("Internal error", error.message);
        next(error)
    }

}

const register = async (req, res, next) => {

    const userData = req.body



    try {

        // const avatar = await CloudinaryUpload.uploadSingleImage(req.file, "upload")
        // userData.avatar = avatar.secure_url

        const avatar = req?.file

        const user = await authService.register(userData, avatar);

        // let payload = {
        //     // userName: user.userName,
        //     _id: user._id,
        //     email: user.email

        // }
        // const token = await signJwt(payload)

        // res.cookie("authToken", token, {
        //     maxAge: 86400 * 1000 /// valid for 1 day 
        // })

        res.json(user)


    } catch (error) {
        // res.status(error.status || 400).send(error.message);
        next(error)
    }
}

const resendOtp = async (req, res, next) => {
    const { email } = req.body
    try {

        // create email for resend otp
        const body = (otp) => {
            const emailbody = `
                <h4>Resend OTP Verification</h4>
                <p>Dear, user</p>
                <p>
                    Thank you for registering with <b>ShopMandu</b>.
                    Use the OTP below to verify your email address.
                </p>
                <h2><u>${otp}</u></h2>
                <p><b>This code will expire in 5 minutes.</b></p>
                <p>
                    If you did not request this email, you can safely ignore it.
                </p>
                <p>
                    Thanks,<br>
                    <b>The ShopMandu Rock Team</b>
                </p>
                `;
            return emailbody;
        }


        const otpResend = await authService.resendOtp(email, "Resend OTP", body)

        res.status(200).json({
            success: true,
            ...otpResend
        });
    } catch (error) {
        next(error)
    }


}


const verifyEmail = async (req, res, next) => {

    const { email, otp } = req.body;

    try {

        // Verify OTP
        const response = await authService.otpVerification(otp, email);

        // JWT payload
        let payload = {
            userName: response.userName,
            _id: response._id,
            email: response.email,
            roles: response.roles,
            authProvider: response.authProvider,
            avatar: response.avatar,
            mobile: response.mobile

        }

        // Generate token
        const token = await signJwt(payload);

        // Set cookie
        res.cookie("authToken", token, {
            maxAge: 86400 * 1000, /// valid for 1 day 
            httpOnly: true,
            secure: config.node_env === "production",
            sameSite: "lax",
        })

        // Response
        res.status(200).json({
            success: true,
            message: response.message,
            token,
            user: response.user
        });

    } catch (error) {
        next(error);
    }
};

const googleLoginLink = async (req, res, next) => {

    try {
        const url = await generateOAuthURI()
        res.status(200).json({
            success: true,
            url: url,
        });
    } catch (error) {
        next(error)
    }
}
const continueWithGoogle = async (req, res, next) => {
    try {
        const code = req.query.code;
        const user = await googleLogin(code)

        //// creatre jwt token
        let payload = {
            userName: user.userName,
            _id: user._id,
            email: user.email,
            roles: user.roles,
            authProvider: user.authProvider

        }
        const token = await signJwt(payload)

        res.cookie("authToken", token, {
            maxAge: 86400 * 1000 /// valid for 1 day 
        })

        res.json({ ...user, token })

    } catch (error) {
        next(error)
    }
}


const forgetPasswordRequest = async (req, res, next) => {

    try {

        const { email } = req.body

        if (!email) {
            throw new BadRequestError("email fields is required.")
        }

        // create email body in html format 

        const result = await authService.forgetPassword(email)
        res.status(200).json(result)
    } catch (error) {
        next(error)
    }

}

const resetPasswordRequest = async (req, res, next) => {

    try {

        const _id = req.query.id
        const token = req.query.token
        const { newPassword } = req.body
        if (!newPassword || !token || !_id) {
            throw new BadRequestError("Missing required fields")
        }

        const result = await authService.resetPassword(_id, newPassword, token)

        res.clearCookie("authToken", {
            httpOnly: true,
            secure: config.node_env === "production",
            sameSite: "lax",
        });

        res.status(200).json(result)

    } catch (error) {
        next(error)
    }

}

const getme = async (req, res, next) => {

    try {

        res.status(200).json(
            req.user
        )

    } catch (error) {
        next(error)
    }

}


/// logout function.
const logout = async (req, res, next) => {
    try {
        res.clearCookie("authToken", {
            httpOnly: true,
            secure: config.node_env === "production",
            sameSite: "lax",
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully."
        });

    } catch (error) {
        next(error);
    }
};






export default {
    logIn,
    register,
    verifyEmail,
    resendOtp,
    continueWithGoogle,
    googleLoginLink,
    forgetPasswordRequest,
    resetPasswordRequest,
    getme,
    logout
};
