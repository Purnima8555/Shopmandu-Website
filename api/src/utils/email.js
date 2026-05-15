import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendWelcomeEmail = async (user) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Welcome to ShopMandu",
        html: `
            <h2>Welcome ${user.full_name}!</h2>
            <p>Your account has been created successfully.</p>
        `,
    });
};

export const sendOtpEmail = async (email, otp) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "ShopMandu - Password Reset OTP",
        html: `
            <h2>Password Reset Request</h2>
            <p>Use the OTP below to reset your password. It expires in <strong>10 minutes</strong>.</p>
            <div style="font-size:32px; font-weight:bold; letter-spacing:8px; margin:24px 0; color:#4F46E5;">
                ${otp}
            </div>
            <p>If you did not request this, please ignore this email.</p>
        `,
    });
};