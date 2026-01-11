import SendEmail from "@/emails/SendEmail";

export async function POST(req: Request) {
    const { html, subject, to, from } = await req.json();
    SendEmail(html, subject, to, from);
    return new Response("Email sent successfully", { status: 200 });
}