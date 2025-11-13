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
        <body style="margin:0; padding:0; background-color:#3A6F43; font-family:Arial, sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#3A6F43; padding:20px;">
                <tr>
                <td align="center">

                    <!-- Outer Card -->
                    <table width="600" cellpadding="0" cellspacing="0" role="presentation" 
                        style="max-width:600px; width:100%; background-color:#ffffff; border-radius:8px;
                                padding:40px; box-shadow:0 2px 6px rgba(0,0,0,0.1);">

                    <tr>
                        <td align="center" style="text-align:center;">

                        <!-- Logo -->
                        <img src="${logoUrl}" width="60" height="60" alt="Apple" style="margin-bottom:20px;" />

                        <!-- Heading -->
                        <h2 style="color:#333; margin:0 0 10px 0; font-size:24px;">Sign in to Apple</h2>

                        <!-- Sub text -->
                        <p style="color:#555; margin:0 0 5px 0;">We don’t store any password.</p>
                        <p style="color:#555; margin:0 0 20px 0;">Use the secure link below to sign in.</p>

                        <!-- Button -->
                        <a href="${url}"
                            style="display:inline-block; padding:14px 28px; margin-top:10px;
                                    background-color:#3A6F43; color:#ffffff; text-decoration:none;
                                    border-radius:6px; font-weight:bold; font-size:15px;">
                            Sign in to your account
                        </a>

                        <!-- Divider -->
                        <hr style="border:none; border-top:1px solid #eee; margin:30px 0; width:80%">

                        <!-- Disclaimer -->
                        <p style="color:#888; font-size:12px; line-height:18px; margin:0;">
                            If you did not request this email, you can safely ignore it.<br />
                            This magic link will be valid for <strong>10 minutes</strong>.
                        </p>

                        </td>
                    </tr>
                    </table>

                    <!-- Footer -->
                    <table width="600" cellpadding="0" cellspacing="0" role="presentation"
                        style="max-width:600px; width:100%; margin-top:20px; color:#e5e5e5;">
                    <tr>
                        <td align="center" style="font-size:11px; line-height:16px;">
                        <p style="margin:0; color:#e5e5e5;">
                            You’re receiving this email because a sign-in was requested for your account.
                        </p>
                        <p style="margin:5px 0 0 0; color:#dcdcdc;">
                            © ${new Date().getFullYear()} Apple. All rights reserved.
                        </p>
                        </td>
                    </tr>
                    </table>

                </td>
                </tr>
            </table>
            </body>`;
    try {
        await transport.sendMail({
                to: email,
                from: provider.from,
                subject: `Sign in to ${host}`,
                text: `Sign in to ${host}\n\n${url}\n\n`,
                html: emailHtml,
            });
    } catch (error) {
        console.error("Email send error:", error);
        throw new Error("Could not send verification email");
    }
}