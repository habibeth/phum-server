import nodemailer from 'nodemailer';
import config from '../config';


export const sendEmail = async (to: string, html: string) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: config.NODE_ENV === "production", // Use `true` for port 465, `false` for all other ports
        auth: {
            user: "habibstk97@gmail.com",
            pass: "zhar ozbq kvnn znjo",
        },
    });


    await transporter.sendMail({
        from: 'habibstk97@gmail.com', // sender address
        to, // list of receivers
        subject: "Password Must be Change as soon as Possible Within 10 minutes", // Subject line
        text: "Are you forget Password", // plain text body
        html, // html body
    });
}