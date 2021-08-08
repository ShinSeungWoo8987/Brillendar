"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const nodemailer_1 = __importDefault(require("nodemailer"));
const auth_1 = require("./auth");
const serverUrl_1 = __importDefault(require("./serverUrl"));
const sendVerifyEmail = (receiverEmail, uuid) => {
    return new Promise((resolve, reject) => {
        const transporter = nodemailer_1.default.createTransport({
            service: process.env.SMTP_SERVICE_NAME,
            host: process.env.SMTP_SERVER_URL,
            port: Number(process.env.SMTP_PORT),
            auth: {
                user: process.env.AUTH_USER,
                pass: process.env.AUTH_PASS,
            },
        });
        const emailVerifyToken = auth_1.createEmailVerifyToken({ email: receiverEmail, uuid });
        const html = `<a href='${serverUrl_1.default}/verify_email/${emailVerifyToken}'>메일 인증</a>`;
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: receiverEmail,
            subject: '[Brillendar] 이메일 인증 안내',
            html,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
                transporter.close();
            }
            else {
                resolve();
                // console.log(info.response);
                transporter.close();
            }
        });
    });
};
exports.default = sendVerifyEmail;
