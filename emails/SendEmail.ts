import nodemailer from "nodemailer";

export default function SendEmail(
    html: string,
    subject: string,
    to: string,
    from: string,
) {
    const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });
    transporter.sendMail({
        from: from,
        to: to,
        subject: subject,
        html: html,
    });
}