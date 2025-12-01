import { render } from "@react-email/render";
import VerificationEmail from "@/emails/VerificationEmail";
import nodemailer from "nodemailer";

export async function sendVerificationRequest({ identifier: email, url }: any) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Convert React Email component to HTML
    const htmlContent: string = await render(VerificationEmail({ url }));

    await transporter.sendMail({
      from: `"Apple Menswear" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Login to Apple Menswear",
      html: htmlContent,
    });

  } catch (error) {
    console.error("Gmail SMTP Email Error:", error);
    throw new Error("Could not send verification email");
  }
}