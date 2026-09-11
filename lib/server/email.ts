import nodemailer from "nodemailer";

interface SendFormNotificationParams {
  formType: "membership" | "address" | "feedback" | "complaint";
  payload: Record<string, unknown>;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_PORT === "465",
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
    "Form User";

  const userEmail =
    typeof payload.email === "string" && payload.email.trim()
      ? payload.email.trim()
      : undefined;

  const htmlContent = `
    <h2>New Form Submission Received</h2>
    <p><strong>Form Type:</strong> ${formType}</p>
    <p><strong>Submitted By:</strong> ${applicantName}</p>
    <p><strong>Contact Email:</strong> ${userEmail || "Not provided"}</p>
    <hr />
    <h3>Form Summary Details</h3>
    <pre style="background-color: #f4f4f4; padding: 12px; border-radius: 4px;">
${JSON.stringify(payload, null, 2)}
    </pre>
  `;

  // Display user's name & email in the From header if provided
  const displayFrom = userEmail
    ? `"${applicantName}" <${userEmail}>`
    : `"Pika Wiya Web" <${process.env.SMTP_USER}>`;

  await transporter.sendMail({
    from: displayFrom,
    to: recipient,
    replyTo: userEmail ? `"${applicantName}" <${userEmail}>` : process.env.SMTP_USER,
    subject,
    html: htmlContent,
    // Forces the SMTP server to send using your authenticated account under the hood
    envelope: {
      from: process.env.SMTP_USER as string,
      to: recipient,
    },
  });
}