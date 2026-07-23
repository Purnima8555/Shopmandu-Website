import { sendContactUsEmail } from "../services/contactUsEmailSend.service.js";

export const contactUsEmailSend = async (req, res, next) => {
  try {
    await sendContactUsEmail(req.body);

    return res.status(200).json({
      success: true,
      message: "Your message has been sent successfully.",
    });
  } catch (error) {
    next(error);
  }
};