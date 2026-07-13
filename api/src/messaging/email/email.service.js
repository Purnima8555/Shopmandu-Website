

import nodemailer from "nodemailer";
// import config from "../config/config.js";
// const nodemailer = require("nodemailer");

import dotenv from "dotenv";
import path from "path";

dotenv.config({
    path: path.resolve(process.cwd(), ".env"),
});
// console.log(path.resolve(process.cwd(), "api/.env"))

// dotenv.config()



// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,

    pool: true,
    maxConnections: 5,
    maxMessages: 100,

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.PASS_USER,
    },
});

transporter.verify((err) => {
    if (err) {
        console.error("SMTP connection failed:", err);
    } else {
        console.log("SMTP server is ready");
    }
});

// const sendEmail = async (to, subject, body) => {

// check SMTP and nodemailer are connected or not
// try {
//     await transporter.verify();
//     console.log("Server is ready to send our messages");
// } catch (err) {
//     console.error("Verification failed:", err);
// }
//     try {

//         const mail = transporter.sendMail({
//             from: EMAIL_USER, // sender address
//             to: to, // recipient
//             subject: subject, // subject line
//             html: body,
//         });

//         console.log("Message sent succesfull:", mail.messageId);
//     } catch (err) {
//         console.error("Error while sending email:", err);
//     }
// };
// console.log("Email and password: ", config.emailUser, config.passUser)

const sendEmail = async (to, subject, body) => {
    return transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        html: body,
    });
};

export default sendEmail;

// sendEmail("hamalprabin454@gmail.com", "Test mail.", welcomeEmailTemplate({ userName: "Prabin", email: "prabin@example.com", appUrl: "http://localhost:5000" }))
