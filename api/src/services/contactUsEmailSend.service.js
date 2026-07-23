import config from "../config/config.js";
import { contactUsEmail } from "../messaging/email/templates/contactUsEmail.template.js";
import addEmailJob from "../utils/EmailQueue.js";

export const sendContactUsEmail = async (data) => {
  const emailBody = contactUsEmail(data.name,data.email,data.phone,data.message);
  await addEmailJob(
    config.emailUser,
    `New Contact Us Message from ${data.name}`,
    emailBody
  );
};