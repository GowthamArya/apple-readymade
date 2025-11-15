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
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Sign in to Apple</title>
        </head>
        
        <body style="margin:0; padding:0; background-color:#CEE5D0; font-family:Arial, sans-serif;">
        
            <!-- Outer Full Width Table -->
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" 
                   style="background-color:#CEE5D0; padding:20px 10px;">
                <tr>
                    <td align="center">
        
                        <!-- Main Card -->
                        <table width="600" cellpadding="0" cellspacing="0" role="presentation"
                               style="width:100%; max-width:600px; background:#ffffff; border-radius:8px;">
                            <tr>
                                <td style="padding:40px; text-align:center;">
        
                                    <!-- Logo -->
                                    <img src="${logoUrl}" width="60" height="60" alt="Apple" 
                                         style="margin-bottom:20px;" />
        
                                    <!-- Heading -->
                                    <h2 style="color:#333; margin:0 0 10px 0; font-size:24px; font-weight:bold;">
                                        Sign in to Apple
                                    </h2>
        
                                    <!-- Message -->
                                    <p style="color:#555; margin:0 0 5px 0;">We don’t store any password.</p>
                                    <p style="color:#555; margin:0 0 20px 0;">Use the secure link below to sign in.</p>
        
                                    <!-- Button -->
                                    <a href="${url}"
                                       style="display:inline-block; padding:14px 28px; margin-top:10px;
                                              background-color:#3A6F43; color:#ffffff; text-decoration:none;
                                              border-radius:6px; font-size:15px; font-weight:bold;">
                                        Sign in to your account
                                    </a>
        
                                    <!-- Divider -->
                                    <table width="80%" role="presentation" style="margin:30px auto;">
                                        <tr>
                                            <td style="border-top:1px solid #eee; height:1px;"></td>
                                        </tr>
                                    </table>
        
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
                               style="width:100%; max-width:600px; margin-top:20px; text-align:center;">
                            <tr>
                                <td style="font-size:11px; line-height:16px; color:#a0a0a0; padding:10px 20px;">
                                    <p style="margin:0; color:#b5b5b5;">
                                        You’re receiving this email because a sign-in was requested for your account.
                                    </p>
                                    <p style="margin:5px 0 0 0; color:#b5b5b5;">
                                        © ${new Date().getFullYear()} Apple. All rights reserved.
                                    </p>
                                </td>
                            </tr>
                        </table>
        
                    </td>
                </tr>
            </table>
            </body>
        </html>`;
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