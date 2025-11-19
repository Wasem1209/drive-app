// src/utils/sendEmail.ts
import emailjs from "emailjs-com";

export const sendEmail = async (to: string, subject: string, html: string) => {
    try {
        const serviceID = process.env.EMAILJS_SERVICE_ID!;
        const templateID = process.env.EMAILJS_TEMPLATE_ID!;
        const userID = process.env.EMAILJS_USER_ID!; // your public key / user id

        const templateParams = {
            to_email: to,
            subject,
            message: html,
        };

        const response = await emailjs.send(serviceID, templateID, templateParams, userID);

        console.log("EmailJS response:", response.status, response.text);
    } catch (error) {
        console.error("EmailJS send error:", error);
        throw error;
    }
};
