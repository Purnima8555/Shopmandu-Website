import bcrypt from "bcryptjs";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
 
import Credential from "../models/credential.model.js";
import Customer from "../models/user.model.js";
import Otp from "../models/otp.model.js";
 
import { sendWelcomeEmail, sendOtpEmail } from "../utils/email.js";
import { generateToken } from "../utils/jwt.js";
 
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// REGISTER USER
export const registerUser = async (data) => {
  const { full_name, email, password, contact_no, image, role } = data;

  // check if credential exists
  const existing = await Credential.findOne({ email });

  if (existing) {
    throw { status: 409, message: "Email already registered" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // create credential record
  const cred = await Credential.create({
    full_name,
    email,
    password: hashedPassword,
    role: role || "customer",
  });

  // create customer profile
  const customer = await Customer.create({
    _id: cred._id,
    full_name,
    email,
    contact_no: contact_no || null,
    role: cred.role,
    image: image || null,
  });

  // send welcome email
  sendWelcomeEmail(customer).catch(() => {});

  return {
    user: {
      id: cred._id,
      full_name: customer.full_name,
      email: customer.email,
      role: cred.role,
      image: customer.image,
    },
  };
};

// LOGIN USER
export const loginUser = async (email, password) => {
  // find credentials
  const cred = await Credential.findOne({ email }).select("+password");

  if (!cred) {
    throw { status: 401, message: "Invalid email or password" };
  }

  // verify password
  const isMatch = await bcrypt.compare(password, cred.password);

  if (!isMatch) {
    throw { status: 401, message: "Invalid email or password" };
  }

  // get customer profile
  const customer = await Customer.findById(cred._id);

  if (!customer) {
    throw { status: 404, message: "Customer profile not found" };
  }

  const token = generateToken(cred);

  return {
    token,
    user: {
      id: cred._id,
      full_name: customer.full_name,
      email: cred.email,
      role: cred.role,
      image: customer.image,
    },
  };
};

// GOOGLE LOGIN
export const googleLoginUser = async (idToken) => {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const { sub: googleId, email, name, picture } = ticket.getPayload();

  // find credential
  let cred = await Credential.findOne({
    $or: [{ googleId }, { email }],
  });

  // create credential if not exists
  if (!cred) {
    cred = await Credential.create({
      full_name: name,
      email,
      googleId,
      role: "customer",
    });
  } else if (!cred.googleId) {
    cred.googleId = googleId;
    await cred.save();
  }

  // customer profile
  let customer = await Customer.findById(cred._id);

  if (!customer) {
    customer = await Customer.create({
      _id: cred._id,
      full_name: name,
      email,
      contact_no: null,
      role: cred.role,
      image: picture,
    });
  } else if (!customer.image) {
    customer.image = picture;
    await customer.save();
  }

  const token = generateToken(cred);

  return {
    token,
    user: {
      id: cred._id,
      full_name: customer.full_name,
      email: cred.email,
      role: cred.role,
      image: customer.image,
    },
  };
};

// Get all users
export const getAllUsersService = async () => {
  return await Customer.find({});
};

// Get user by ID
export const getUserByIdService = async (id) => {
  return await Customer.findById(id);
};

// Find user by email (used for Forgot Password)
export const getUserByEmailService = async (email) => {
  return await Customer.findOne({ email });
};
// ─── Update ───────────────────────────────────────────────────────────────────
 
/**
 * Update the profile fields (full_name, contact_no, image) of a user.
 * The authenticated user can only update their own profile unless they are admin.
 */
export const updateUserService = async (requesterId, targetId, updateData) => {
    // Only the owner or an admin may update
    if (requesterId !== targetId) {
        const requester = await Credential.findById(requesterId);
        if (!requester || requester.role !== "admin") {
            throw { status: 403, message: "Forbidden: you can only update your own profile" };
        }
    }
 
    const customer = await Customer.findByIdAndUpdate(
        targetId,
        { $set: updateData },
        { new: true, runValidators: true },
    );
 
    if (!customer) {
        throw { status: 404, message: "User not found" };
    }
 
    // Keep full_name in sync inside Credential if it was changed
    if (updateData.full_name) {
        await Credential.findByIdAndUpdate(targetId, { full_name: updateData.full_name });
    }
 
    return customer;
};
 
// ─── Delete ───────────────────────────────────────────────────────────────────
 
/**
 * Hard-delete both the Customer profile and the Credential record.
 * Only the owner or an admin may delete an account.
 */
export const deleteUserService = async (requesterId, targetId) => {
    if (requesterId !== targetId) {
        const requester = await Credential.findById(requesterId);
        if (!requester || requester.role !== "admin") {
            throw { status: 403, message: "Forbidden: you can only delete your own account" };
        }
    }
 
    const customer = await Customer.findByIdAndDelete(targetId);
    if (!customer) {
        throw { status: 404, message: "User not found" };
    }
 
    await Credential.findByIdAndDelete(targetId);
 
    return { message: "Account deleted successfully" };
};
 
// ─── Forgot Password (OTP flow) ───────────────────────────────────────────────
 
/**
 * Step 1 – Send a 6-digit OTP to the user's email.
 * Always responds with a generic success message to prevent email enumeration.
 */
export const sendForgotPasswordOtpService = async (email) => {
    const cred = await Credential.findOne({ email });
 
    // Silently succeed even if email is not found (prevents enumeration)
    if (!cred) return;
 
    // Invalidate any previous unused OTP for this email
    await Otp.deleteMany({ email });
 
    // Generate a 6-digit numeric OTP
    const otp = crypto.randomInt(100000, 999999).toString();
 
    // Hash before storing so raw OTP is never in the DB
    const hashedOtp = await bcrypt.hash(otp, 10);
 
    await Otp.create({
        email,
        otp: hashedOtp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });
 
    await sendOtpEmail(email, otp);
};
 
/**
 * Step 2 – Verify the OTP without resetting the password yet.
 * Returns a short-lived "verified" flag so the frontend can show the reset form.
 * We mark the OTP as verified=true so Step 3 knows it was legitimately checked.
 */
export const verifyOtpService = async (email, otp) => {
    const record = await Otp.findOne({ email, verified: false });
 
    if (!record) {
        throw { status: 400, message: "No active OTP found. Please request a new one." };
    }
 
    if (record.expiresAt < new Date()) {
        await record.deleteOne();
        throw { status: 400, message: "OTP has expired. Please request a new one." };
    }
 
    const isMatch = await bcrypt.compare(otp, record.otp);
    if (!isMatch) {
        throw { status: 400, message: "Invalid OTP." };
    }
 
    // Mark as verified so the reset step can confirm it was checked
    record.verified = true;
    await record.save();
};
 
/**
 * Step 3 – Reset the password after a verified OTP.
 */
export const resetPasswordService = async (email, otp, newPassword) => {
    const record = await Otp.findOne({ email, verified: true });
 
    if (!record) {
        throw { status: 400, message: "OTP not verified. Please verify your OTP first." };
    }
 
    if (record.expiresAt < new Date()) {
        await record.deleteOne();
        throw { status: 400, message: "OTP session expired. Please restart the process." };
    }
 
    // Re-check OTP hash as a second factor (prevents skipping verifyOtp endpoint)
    const isMatch = await bcrypt.compare(otp, record.otp);
    if (!isMatch) {
        throw { status: 400, message: "Invalid OTP." };
    }
 
    const cred = await Credential.findOne({ email }).select("+password");
    if (!cred) {
        throw { status: 404, message: "User not found." };
    }
 
    cred.password = await bcrypt.hash(newPassword, 10);
    await cred.save();
 
    // Clean up the OTP record
    await record.deleteOne();