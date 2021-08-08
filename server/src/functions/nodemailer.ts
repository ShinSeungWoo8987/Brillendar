import dotenv from 'dotenv';
dotenv.config();

import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { createEmailVerifyToken } from './auth';
import serverUrl from './serverUrl';

const sendVerifyEmail = (receiverEmail: string, uuid: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: process.env.SMTP_SERVICE_NAME!,
      host: process.env.SMTP_SERVER_URL!,
      port: Number(process.env.SMTP_PORT!),
      auth: {
        user: process.env.AUTH_USER!,
        pass: process.env.AUTH_PASS!,
      },
    });

    const emailVerifyToken = createEmailVerifyToken({ email: receiverEmail, uuid });

    const html = `<a href='${serverUrl}/verify_email/${emailVerifyToken}'>메일 인증</a>`;

    const mailOptions: Mail.Options = {
      from: process.env.SENDER_EMAIL!,
      to: receiverEmail,
      subject: '[Brillendar] 이메일 인증 안내',
      html,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
        transporter.close();
      } else {
        resolve();
        // console.log(info.response);
        transporter.close();
      }
    });
  });
};

export default sendVerifyEmail;
