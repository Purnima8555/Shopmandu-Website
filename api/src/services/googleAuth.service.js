import config from "../config/config.js";
import authProvider from "../constants/authProvider.js";
import Roles from "../constants/userRoles.js";
import UserModel from "../models/User.model.js";
import { AppError, BadRequestError } from "../utils/AppError.js";
import GoogleLogin from "../utils/GoogleOauth.js";
import * as arctic from "arctic"
import passworehashUtils from "../utils/passworehash.utils.js";
import { isValid } from "zod/v3";


let scope = config.scope.split("-")
let client_Id = config.client_Id
let redirect_URI = config.redirect_URI
let client_Secret = config.client_Secret



/// instance create 

const client = new GoogleLogin(client_Id, client_Secret, scope, redirect_URI)
/// initalize client 

const google = client.google()

/// url generate, const url = client.googleAuthURI(google)
//// validate auth code and exchange code with token, const tokens = await client.validate_authorization_code(google, code)

const generateOAuthURI = () => {
    try {
        const url = client.googleAuthURI(google);
        return url.href;
    } catch (error) {
        throw new AppError("Failed to generate Oauth URL")
    }
};

const googleLogin = async (code) => {
    try {
        const tokens = await client.validate_authorization_code(google, code)


        /// validate id_token
        const id_token = tokens.idToken()
        // console.log(id_token)
        if (!id_token) {
            throw new BadRequestError("Invalid or fake authorization code received....")
        }

        /// get user Data such as email, name, profile and google id
        const payload = arctic.decodeIdToken(id_token)

        const { sub, email, name, picture, email_verified } = payload
        // check if that user are alrady present in databse 



        const user = await UserModel.findOne({ email })
        //// we do that

        // if (user.authProvider === authProvider.LOCAL) {
        //     throw new BadRequestError("You are alrady register, plase login with password.")
        // }

        /// we also do like this

        

        const hashGoogleId = await passworehashUtils.hashPassword(sub)
        if (user) {
            if (!user.authProvider.includes(authProvider.GOOGLE)) {
                user.googleId = hashGoogleId
                user.authProvider.push(authProvider.GOOGLE)
                await user.save();
            }

            //// google id checked 
            const matchGoogleId = await passworehashUtils.verifyPassword( sub, user.googleId )

            if(!matchGoogleId){
                throw new BadRequestError("Your Google Id are not match.")
            }
            /// if user alrady login then return that user
                    return {
            _id: user._id,
            email: user.email,
            userName: user.userName,
            avatar: user.avatar,
            authProvider: user.authProvider,
            password: user.password,
            roles: user.roles,
            googleId: user.googleId,
            isValid: user.isValid
        }
        }

        /// if user are no register and first time in our platform
        // console.log("HI")
        const newUser = await UserModel.create({
            userName: name,
            email: email,
            password: null,
            googleId: hashGoogleId,
            roles: [Roles.USER_ROLE],
            avatar: picture,
            authProvider: [authProvider.GOOGLE],
            isVerify: email_verified,
        })


        return {
            _id: newUser._id,
            email: newUser.email,
            userName: newUser.userName,
            avatar: newUser.avatar,
            authProvider: newUser.authProvider,
            password: newUser.password,
            roles: newUser.roles,
            googleId: newUser.googleId,
            isValid: newUser.isValid
        }

    } catch (error) {
        throw new BadRequestError("Invalid or fake authorization code received..")
    }
}

export { generateOAuthURI, googleLogin }

