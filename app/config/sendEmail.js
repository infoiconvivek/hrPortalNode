import nodemailer from "nodemailer";
//const nodemailer = require('nodemailer');
//const mailConfig = require('./mailConfig');
import mailConfig from "./mailConfig.js";

console.log(mailConfig);
// Create a transporter object
const transporter = nodemailer.createTransport(mailConfig);
// Function to send the email
async function sendEmail(recipient, subject, body) {
    try {
        // Send the email
        await transporter.sendMail({
            from: mailConfig.auth.user,
            to: recipient,
            subject: subject,
            //text: body,
            html: body, // html body
        });

        console.log('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

//module.exports = sendEmail;

export default sendEmail;

