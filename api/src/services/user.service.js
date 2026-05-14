import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";

import Credential from "../models/credential.model.js";
import Customer from "../models/user.model.js";

import { sendWelcomeEmail } from "../utils/email.js";
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

  // 5. send welcome email
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
