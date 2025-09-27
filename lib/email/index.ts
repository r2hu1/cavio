import transporter from "./transporter";

interface SendEmailProps {
  type: "reset-password" | "verify-email" | "delete-account";
  to: string;
  subject: string;
  text: string;
}

export async function sendEmail({ type, to, subject, text }: SendEmailProps) {
  const emailTemplate: Record<string, string> = {
    "reset-password": `
    <p>You requested a password reset.</p>
    <p>${text}</p>
    <p>If you did not request this, please ignore this email.</p>`,
    "verify-email": `
    <p>Email verification.</p>
    <p>${text}</p>
    <p>If you did not request this, please ignore this email.</p>`,
    "delete-account": `
    <p>Delete your account.</p>
    <p>${text}</p>
    <p>If you did not request this, please ignore this email.</p>`,
  };

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_PASS,
      to,
      subject,
      html: emailTemplate[type],
    });
    //@ts-ignore
  } catch (error: any) {
    console.log(`Transporter error: ${error}`);
  }
}
