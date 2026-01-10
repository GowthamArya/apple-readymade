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

export async function sendOrderNotificationToAdmin(order: any, items: any[]) {
    try {
        const adminEmails = process.env.ADMIN_EMAILS?.split(",") || ["gowtham.arya999@gmail.com", "mohan.apple586@gmail.com"];
        if (adminEmails.length === 0) return;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        const itemsHtml = items.map((item: any) => `
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">
                    ${item.variant?.product?.name || "Product"} (${item.variant?.size}, ${item.variant?.color})
                </td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">
                    x${item.quantity}
                </td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">
                    ₹${item.price}
                </td>
            </tr>
        `).join("");

        const emailHtml = `
            <h2>New Order Received!</h2>
            <p><strong>Order ID:</strong> ${order.id}</p>
            <p><strong>Customer:</strong> ${order.shipping_address.name} (${order.shipping_address.contact})</p>
            <p><strong>Amount:</strong> ₹${order.total_amount}</p>
            <h3>Items:</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th style="padding: 8px; border-bottom: 2px solid #ddd; text-align: left;">Item</th>
                        <th style="padding: 8px; border-bottom: 2px solid #ddd; text-align: left;">Qty</th>
                        <th style="padding: 8px; border-bottom: 2px solid #ddd; text-align: left;">Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>
            <br/>
            <a href="${process.env.NEXTAUTH_URL}/admin/orders" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Manage Order</a>
        `;

        await transporter.sendMail({
            from: `"Apple Menswear System" <${process.env.GMAIL_USER}>`,
            to: adminEmails,
            subject: `New Order #${order.id} - ₹${order.total_amount}`,
            html: emailHtml,
        });

        console.log("Admin notification sent.");
        return { success: true };
    } catch (error) {
        console.error("Failed to send admin notification:", error);
        return { success: false, error };
    }
}
