import nodemailer from "nodemailer";
import config from "../config/config.js";
// const nodemailer = require("nodemailer");

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: config.emailUser,
        pass: config.passUser,
    },
});

const sendEmail = async (to, subject, body) => {

    // check SMTP and nodemailer are connected or not
    try {
        await transporter.verify();
        console.log("Server is ready to send our messages");
    } catch (err) {
        console.error("Verification failed:", err);
    }
    try {

        const mail = await transporter.sendMail({
            from: config.emailUser, // sender address
            to: to, // recipient
            subject: subject, // subject line
            html: body,
        });

        console.log("Message sent succesfull:", mail.messageId);
    } catch (err) {
        console.error("Error while sending email:", err);
    }
};

export default sendEmail;

// sendEmail("hamalprabin454@gmail.com", "Test mail.", "<h4> hello this is Test mail</h4>")
