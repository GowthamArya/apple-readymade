import { SendVerificationRequestParams } from "next-auth/providers/email";
import nodemailer from "nodemailer";

export async function sendVerificationRequest({
    identifier: email,
    url,
    provider,
    }: SendVerificationRequestParams): Promise<void> {
    const { host } = new URL(url);

    const transport = nodemailer.createTransport(provider.server);
    const logoUrl = "https://apple-readymade.vercel.app/logo.png";
    const emailHtml = `
        <body style="background-color:#f4f4f7; font-family:Arial, sans-serif; padding:20px;">
        <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; padding:40px; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
                <tr>
                    <td align="center">
                        <img src="${logoUrl}" width="50" height="50" alt="Apple"/>
                    </td>
                    <td align="center">
                    <h2 style="color:#333;">Sign in to Apple</h2>
                    <p style="color:#555;">Click the button below to sign in.</p>
                    <a href="${url}" style="display:inline-block; margin-top:20px; padding:12px 24px; background-color:#4F46E5; color:#ffffff; text-decoration:none; border-radius:4px; font-weight:bold;">
                        Sign in
                    </a>
                    <p style="color:#888; font-size:12px; margin-top:40px;">
                        If you did not request this email, you can safely ignore it.<br/>
                        This magic link will expire in 10 minutes.
                    </p>
                    </td>
                </tr>
                </table>
            </td>
            </tr>
        </table>
        </body>
    `;

    await transport.sendMail({
        to: email,
        from: provider.from,
        subject: `Sign in to ${host}`,
        text: `Sign in to ${host}\n\n${url}\n\n`,
        html: emailHtml,
    });
}
