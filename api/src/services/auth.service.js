import UserModel from "../models/User.model.js";
import bcrypt from "bcrypt";
import passworehashUtils from "../utils/passworehash.utils.js";
import Roles from "../constants/userRoles.js";
import UserProfileModel from "../models/UserProfile.model.js";
import {
    AppError,
    BadRequestError,
    ConflictError,
    NotFoundError,
} from "../utils/AppError.js";
import OTPModels from "../models/OTPverifaction.model.js";
import generateOTP from "../utils/otp.utils.js";
import sendEmail from "../messaging/email/email.service.js";
import mongoose from "mongoose";
import authProvider from "../constants/authProvider.js";
import CloudinaryUpload from "../utils/CloudinaryUpload.js";
import config from "../config/config.js";
import crypto from "crypto"
import ResetForgetPassword from "../models/ResetForgerPassword.models.js";
import addEmailJob, { addResetPasswordEmailJob } from "../utils/EmailQueue.js";
import { otpEmailBody } from "../messaging/email/templates/otp.template.js";


class authService {

    /**
     * 
     * @param {*} userData //// accept user login data email and password
     * @returns //// it return user login data.  
     */

    async logIn(userData) {
        const user = await UserModel.findOne({ email: userData.email });

        if (!user) {
            // throw {
            //     status: 404,
            //     message: "User not found"
            // };

            throw new NotFoundError("User not found");
        }

        //// checked user are verify
        if (!user.isVerify) {
            throw new BadRequestError("User is not verified. Please register again.")
        }

        /// if user auth provider is google but try to login with local
        if (!user.authProvider.includes(authProvider.LOCAL) && !user.password) {
            throw new BadRequestError("This account was created with Google login. Please continue with Google or reset your password.");
        }

        /// password validate
        // const passwordMatch = await bcrypt.compare(userData.password, user.password)  /// firs is user enter password, second is hash password which is store in database.
        const passwordMatch = await passworehashUtils.verifyPassword(
            userData.password,
            user.password,
        );
        if (!passwordMatch) {
            // throw {
            //     status: 400,
            //     message: "Password do not match"
            // }
            throw new BadRequestError("Password do not match");
        }

        return {
            _id: user._id,
            email: user.email,
            userName: user.userName,
            mobile: user.mobile,
            roles: user.roles,
            avatar: user.avatar,
            authProvider: user.authProvider
        };
    }

    /**
     * 
     * @param {*} userData //// it take user credentials(email, password, roles, userName, mobile)
     * @returns /// return message 'user create succesfully'
     * 
     * This function send back otp to the user vai email and to verify there email
     */

    async register(userData, avatar) {
        //// check if user are alrady register or not
        const { email, password, roles, userName, mobile, userAuthProvider } = userData;
        // console.log("hello")
        // console.log(userData)


        const userIsRegister = await UserModel.findOne({ email });


        if (userIsRegister?.isVerify) {
            if (userIsRegister.authProvider.includes(authProvider.GOOGLE) && !userIsRegister.password) {
                throw new ConflictError("This account uses Google login. Please continue with Google.");
            } else {
                throw new ConflictError("Email is already registered....");
            }
        }

        /// roles check
        if (![Roles.USER_ROLE, Roles.VENDOR_ROLE,].includes(userData.roles)) {
            throw new BadRequestError("Invalid user role");
        }

        /// hash password
        const hashPassword = await passworehashUtils.hashPassword(
            userData.password,
        );
        let createUser;

        /// upload avatar 
        if (avatar) {
            const userAvatar = await CloudinaryUpload.uploadSingleImage(avatar, "upload")
            userData.avatar = userAvatar.secure_url
        }

        // Update existing unverified user
        if (userIsRegister && !userIsRegister?.isVerify) {
            createUser = await UserModel.findOneAndUpdate({ email },
                {
                    userName,
                    mobile,
                    roles,
                    avatar: userData?.avatar,
                    authProvider: userAuthProvider || authProvider.LOCAL,
                    password: hashPassword,
                    isVerify: false,
                },
                {
                    returnDocument: "after",
                }
            )
        } else {
            /// user Table
            createUser = await UserModel.create({
                email,
                userName,
                mobile,
                roles,
                avatar: userData.avatar,
                authProvider: userAuthProvider || authProvider.LOCAL,
                password: hashPassword,
                isVerify: false,
            });

        }

        /// send otp for email verifaction
        const response = this.sendOTP(createUser.email, "Email verifaction.", createUser);
        return response;
    }


    /**
     * 
     * @param {*} email /// useremail address where the email was sent
     * @param {*} subject /// email subject
     * @param {*} body ///  body is a call back function it take otp.
     * @returns //// it send back, 'otp send succesfully' message.
     */

    /// OTP send function
    async sendOTP(email, subject, user) {
        if (!email) {
            throw new BadRequestError("Email is required");
        }
        // generate otp
        const otp = generateOTP();

        // hash otp
        const hashOtp = await passworehashUtils.hashPassword(otp);

        try {
            // upsert OTP (update if exists, insert if not)
            await OTPModels.findOneAndUpdate(
                { email },
                {
                    otp: hashOtp,
                    expiresAt: new Date(Date.now() + 5 * 60 * 1000), // expire after 5 minutes
                },
                {
                    // new: true,
                    returnDocument: "after",
                    upsert: true,
                }
            );
            const emailbody = otpEmailBody(otp, user);
            // send email
            // await sendEmail(email, subject, emailbody);

            await addEmailJob(email, subject, emailbody)

            return { success: true, message: "OTP sent successfully, please verify your email." };
        } catch (error) {
            console.error("OTP send error:", error);
            throw new Error("Failed to send OTP");
        }
    }

    /**
     * 
     * @param {*} email /// user email address where the email was sent
     * @param {*} subject /// email subject
     * @param {*} body /// body is a call back function it take otp.
     * @returns //// it response back, 'resend otp message succesfully.'
     */
    //// resend otp
    async resendOtp(email, subject) {
        /// check user are not verified
        const userVerify = await UserModel.findOne({ email })
        if (!userVerify) {
            throw new NotFoundError("User not found. Please register again!")
        }

        // Check user already verified
        if (userVerify.isVerify) {
            throw new BadRequestError("User is already verified!");
        }

        // generate otp
        const otp = generateOTP();

        // hash otp
        const hashOtp = await passworehashUtils.hashPassword(otp);

        try {
            // upsert OTP (update if exists, insert if not)
            await OTPModels.findOneAndUpdate(
                { email },
                {
                    otp: hashOtp,
                    expiresAt: new Date(Date.now() + 5 * 60 * 1000), // expire after 5 minutes
                },
                {
                    new: true,
                    upsert: true,
                }
            );
            const emailbody = otpEmailBody(otp, userVerify);

            // send email
            // await sendEmail(email, subject, emailbody);

            await addEmailJob(email, subject, emailbody)

            return { message: "OTP sent resend successfully, please checked your email and verify." };
        } catch (error) {
            console.error("OTP send error:", error);
            throw new AppError("Failed to send OTP");
        }


    }


    /**
     * Verifies the OTP sent to the user email.
     *
     * @param {*} otp    /// otp Expected 6 digit OTP sent to the user email
     * @param {*} email // email user email address where the OTP was sent
     * @returns       ///     return a success message when the user is verified successfully
     */
    async otpVerification(otp, email) {
        // Check required fields
        if (!otp || !email) {
            throw new BadRequestError("OTP and email are required!");
        }

        // Find OTP record
        const record = await OTPModels.findOne({ email });

        if (!record) {
            throw new BadRequestError("OTP record not found!");
        }

        // Check OTP and expiry fields
        if (!record.otp || !record.expiresAt) {
            throw new BadRequestError("Invalid OTP record!");
        }

        // Verify OTP
        const isValidOtp = await passworehashUtils.verifyPassword(
            String(otp),
            String(record.otp),
        );

        // console.log(record.expiresAt.getTime() < Date.now())

        if (!isValidOtp) {
            throw new BadRequestError("Invalid OTP!");
        }

        // Check expiration
        if (record.expiresAt.getTime() < Date.now()) {
            throw new BadRequestError("OTP expired!");
        }

        try {

            // Verify user
            const verifyUser = await UserModel.findOneAndUpdate(
                { email },
                {
                    isVerify: true,
                },
                {
                    returnDocument: "after",
                },
            );

            // if (!verifyUser) {
            //     throw new BadRequestError("User not found!");
            // }

            //delete OTP after success
            // await OTPModels.deleteOne({ email });

            return {
                status: 200,
                message: "User verified successfully",
                user: verifyUser,
            };
        } catch (error) {
            if (error instanceof BadRequestError) {
                throw error;
            }

            console.error(error);

            throw new AppError("Server error during OTP verification");
        }
    }



    async forgetPassword(email) {

        /// generate random token 32bytes string
        const token = crypto.randomBytes(32).toString('hex') //// crypto.randomBytes(32) => it return 32 bytes buffer cheracters and .toString('hex') => it convert that buffer into rando string
        // console.log(token)
        // console.log(email)

        /// hash token/ encrypt the token
        // const hashToken = crypto.createHash('sha256').update(token).digest('hex')
        // console.log(hashToken)

        /// check if user are present in our database?
        const user = await UserModel.findOne({ email })
        // console.log(user)
        if (!user) {
            throw new NotFoundError("User not found, please Register first.")
        }

        /// auth provider are local or not?
        // if (!user?.authProvider.includes(authProvider.LOCAL)) {
        //     throw new BadRequestError("Your are register with email. unable to reset password.")
        // }

        //// create reset password link
        // const resetPasswordLink = `http://localhost:${config.port}/api/auth/reset-password/?id=${user._id}&token=${token}`
        try {

            await ResetForgetPassword.findOneAndUpdate(
                { userId: user._id },
                {
                    // token: hashToken,
                    token: token,
                    isUsed: false,
                    expiresAt: new Date(Date.now() + 15 * 60 * 1000), // expire after 15 minutes
                },
                {
                    // new: true,
                    returnDocument: "after",
                    upsert: true,
                }
            );

            /// send mail to user with there reset password link

            // const emailHtml = emailbody(resetPasswordLink)
            // await sendEmail(email, "Reset Password.", emailHtml);
            await addResetPasswordEmailJob(email, user._id, token);

            return {success: true, message: "Reset password Link send succesfully." };

        } catch (error) {
            throw new AppError("Fail to send forget password link.")
        }




    }


    async resetPassword(_id, newPassword, token) {

        /// check in recodrd to get reset token
        const sendRequestForResetPassword = await ResetForgetPassword.findOne({ userId: _id })
        // if request not found 
        if (!sendRequestForResetPassword) {
            throw new BadRequestError("Please send reset password request again.")
        }

        /// that token are validate or not
        // const hashToken = crypto.createHash('sha256').update(token).digest('hex')
        // if (hashToken !== sendRequestForResetPassword.token) {
        //     throw new BadRequestError("Invalid Link.")
        // }

        // console.log(sendRequestForResetPassword)

        const hashToken = crypto.createHash('sha256').update(sendRequestForResetPassword.token).digest('hex')
        if (hashToken !== token) {
            throw new BadRequestError("Invalid Link.")
        }

        // validate that record
        if (sendRequestForResetPassword.expiresAt.getTime() < Date.now()) {
            throw new BadRequestError("Link is expired!");
        }
        // console.log(sendRequestForResetPassword)
        /// last checked is used or not 
        if (sendRequestForResetPassword?.isUsed) {
            throw new BadRequestError("Link already used.");
        }
        /// now completer validation process
        // update that user password first hash ther new password
        const hashPassword = await passworehashUtils.hashPassword(newPassword)


        const user = await UserModel.findOne({ _id })

        if (!user?.authProvider.includes(authProvider.LOCAL) && !user.password) {
            // const result = await UserModel.findByIdAndUpdate(_id, {
            //     password: hashPassword,
            // },
            //     {
            //         new: true,
            //     })

            user.password = hashPassword

            user.authProvider.push(authProvider.LOCAL)
            await user.save()
            // update that record and update used true
            sendRequestForResetPassword.isUsed = true;
            await sendRequestForResetPassword.save();
            return user
        }



        // const result = await UserModel.findByIdAndUpdate(_id, {
        //     password: hashPassword
        // },
        //     {
        //         new: true,
        //     })

        user.password = hashPassword
        await user.save()
        // update that record and update used true
        sendRequestForResetPassword.isUsed = true;
        await sendRequestForResetPassword.save();

        return {
            success: true,
            message: "password change successfully."
        }


    }

}

export default new authService();
