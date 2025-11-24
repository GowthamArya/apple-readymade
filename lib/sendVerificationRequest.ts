import { render } from "@react-email/render";
import VerificationEmail from "@/emails/VerificationEmail";

export async function sendVerificationRequest({ identifier: email, url } : any) {
  try {
    const SibApiV3Sdk = require("@sendinblue/client");
    const client = new SibApiV3Sdk.TransactionalEmailsApi();
    client.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY!);

    // Convert React Email component to HTML
    const htmlContent : string = await render(VerificationEmail({ url }));

    await client.sendTransacEmail({
      sender: {
        name: "Apple Menswear",
        email: process.env.EMAIL_FROM!
      },
      to: [{ email }],
      subject: "Login to Apple Menswear",
      htmlContent,
    });

  } catch (error) {
    console.error("Brevo Email Error:", error);
    throw new Error("Could not send verification email");
  }
}