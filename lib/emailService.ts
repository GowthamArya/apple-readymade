import { render } from "@react-email/render";
import AbandonedCartEmail from "@/emails/AbandonedCartEmail";
import nodemailer from "nodemailer";

export async function sendAbandonedCartEmail(
    email: string,
    productName: string,
    url: string,
    imageUrl?: string | null
) {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        const emailHtml = await render(
            AbandonedCartEmail({
                productName,
                url,
                imageUrl,
            })
        );

        await transporter.sendMail({
            from: `"Apple Menswear" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: "You left something behind! 🛒",
            html: emailHtml,
        });

        console.log("Abandoned cart email sent to:", email);
        return { success: true };
    } catch (error) {
        console.error("Failed to send abandoned cart email:", error);
        return { success: false, error };
    }
}
