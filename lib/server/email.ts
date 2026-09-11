import nodemailer from "nodemailer";

interface SendFormNotificationParams {
  formType: "membership" | "address" | "feedback" | "complaint";
  payload: Record<string, unknown>;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendFormNotification({ formType, payload }: SendFormNotificationParams) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("SMTP credentials missing. Skipping email dispatch.");
    return;
  }

  const recipient = process.env.NOTIFICATION_EMAIL || "admin@pikawiyahealth.org.au";
  const subject = `New ${formType.toUpperCase()} Form Submission`;

  const applicantName =
    payload.complainant_name ||
    payload.full_name ||
    `${payload.first_name ?? ""} ${payload.last_name ?? ""}`.trim() ||
    "N/A";
  const contactEmail = payload.email || "Not provided";

  const htmlContent = `
    <h2>New Form Submission Received</h2>
    <p><strong>Form Type:</strong> ${formType}</p>
    <p><strong>Submitted By:</strong> ${applicantName}</p>
    <p><strong>Contact Email:</strong> ${contactEmail}</p>
    <hr />
    <h3>Form Summary Details</h3>
    <pre style="background-color: #f4f4f4; padding: 12px; border-radius: 4px;">
${JSON.stringify(payload, null, 2)}
    </pre>
  `;

  await transporter.sendMail({
    from: `"Pika Wiya Web" <${process.env.SMTP_USER}>`,
    to: recipient,
    subject,
    html: htmlContent,
  });
}