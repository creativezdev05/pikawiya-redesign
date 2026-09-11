import nodemailer from "nodemailer";

type FormType = "membership" | "address" | "feedback" | "complaint" | "enquiry";

interface SendFormNotificationParams {
  formType: FormType;
  payload: Record<string, unknown>;
}

const NAVY = "#00060f";
const OCHRE = "#E85D26";
const SAND = "#F7F4EF";
const INK = "#1a1615";
const MUTED = "#5c534c";
const SURFACE = "#ffffff";
const PAGE = "#F7F4EF";
const BORDER = "#e8e2d5";

const FORM_COPY: Record<FormType, { title: string; intro: string }> = {
  membership: {
    title: "Membership Application",
    intro: "A new membership application was submitted through the Pika Wiya website.",
  },
  address: {
    title: "Change of Address",
    intro: "A client has requested an address update through the Pika Wiya website.",
  },
  feedback: {
    title: "Community Feedback",
    intro: "New feedback was submitted through the Pika Wiya website.",
  },
  complaint: {
    title: "Complaint Form",
    intro: "A complaint was lodged through the Pika Wiya website. Please handle confidentially.",
  },
  enquiry: {
    title: "Service Enquiry",
    intro: "Someone reached out through the Get in Touch form on the Pika Wiya website.",
  },
};

const FIELD_LABELS: Record<string, string> = {
  icn_number: "ICN Number",
  surname: "Surname",
  first_name: "First Name",
  last_name: "Last Name",
  full_name: "Full Name",
  address: "Address",
  postcode: "Postcode",
  phone: "Phone",
  email: "Email",
  date_of_birth: "Date of Birth",
  place_of_birth: "Place of Birth",
  witness_name: "Witness Name",
  witness_phone: "Witness Phone",
  witness_address: "Witness Address",
  witness_date: "Witness Date",
  previous_address: "Previous Address",
  previous_postcode: "Previous Postcode",
  new_address: "New Address",
  new_postcode: "New Postcode",
  change_date: "Date of Update",
  access_frequency: "How often they access the service",
  what_like: "What they like",
  how_improve: "How we can improve",
  what_dislike: "What they dislike",
  suggestions: "Other comments",
  complainant_name: "Complainant Name",
  complainant_address: "Complainant Address",
  daytime_contact: "Daytime Contact",
  complainant_date: "Date Lodged",
  incident_date: "Incident Date",
  incident_time: "Incident Time",
  incident_location: "Incident Location",
  complaint_subject: "Subject of Complaint",
  complaint_summary: "Summary",
  witness_contact: "Witness Contact",
  desired_outcome: "Desired Outcome",
  outcome_details: "Outcome Details",
  signature: "Signature",
  date_submitted: "Date Submitted",
  service_type: "Service Required",
  message: "Message",
  created_at: "Submitted At",
};

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatValue(value: unknown) {
  if (value == null || value === "") return "—";
  if (typeof value === "string") return value;
  return JSON.stringify(value);
}

function applicantName(payload: Record<string, unknown>) {
  return (
    String(payload.complainant_name || "").trim() ||
    String(payload.full_name || "").trim() ||
    `${payload.first_name ?? ""} ${payload.last_name ?? ""}`.trim() ||
    "Website visitor"
  );
}

function applicantEmail(payload: Record<string, unknown>) {
  return typeof payload.email === "string" && payload.email.trim() ? payload.email.trim() : undefined;
}

function detailRows(payload: Record<string, unknown>) {
  return Object.entries(payload)
    .filter(([, value]) => value != null && String(value).trim() !== "")
    .map(([key, value], index) => {
      const label = FIELD_LABELS[key] || key.replace(/_/g, " ");
      const bg = index % 2 === 0 ? PAGE : SURFACE;
      return `
        <tr>
          <td style="padding:10px 14px;font-size:12px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;color:${OCHRE};background:${bg};width:34%;border-bottom:1px solid ${BORDER};">
            ${escapeHtml(label)}
          </td>
          <td style="padding:10px 14px;font-size:14px;color:${INK};background:${bg};border-bottom:1px solid ${BORDER};white-space:pre-wrap;">
            ${escapeHtml(formatValue(value))}
          </td>
        </tr>`;
    })
    .join("");
}

function themedHtml(formType: FormType, payload: Record<string, unknown>) {
  const copy = FORM_COPY[formType];
  const name = applicantName(payload);
  const email = applicantEmail(payload) || "Not provided";

  return `<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:0;background:${PAGE};font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAGE};padding:28px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;background:${SURFACE};border:1px solid ${BORDER};">
          <tr>
            <td style="background:${NAVY};padding:28px 32px 24px;border-bottom:4px solid ${OCHRE};">
              <div style="color:${OCHRE};font-size:11px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;">Pika Wiya Health Service</div>
              <div style="color:${SURFACE};font-size:24px;font-weight:800;letter-spacing:-0.02em;margin-top:10px;">${escapeHtml(copy.title)}</div>
              <div style="color:${SAND};font-size:13px;margin-top:8px;opacity:0.85;">Aboriginal Community Controlled Health Organisation</div>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px 8px;color:${INK};font-size:15px;line-height:1.6;">
              ${escapeHtml(copy.intro)}
            </td>
          </tr>
          <tr>
            <td style="padding:8px 32px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAGE};border-left:4px solid ${OCHRE};">
                <tr>
                  <td style="padding:14px 16px;">
                    <div style="font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:${OCHRE};">Submitted by</div>
                    <div style="font-size:16px;font-weight:700;color:${INK};margin-top:4px;">${escapeHtml(name)}</div>
                    <div style="font-size:13px;color:${MUTED};margin-top:2px;">${escapeHtml(email)}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${BORDER};border-collapse:collapse;">
                ${detailRows(payload)}
              </table>
            </td>
          </tr>
          <tr>
            <td style="background:${NAVY};padding:16px 32px;color:${SAND};font-size:11px;letter-spacing:0.04em;">
              40–46 Dartford St, Port Augusta SA 5700 · (08) 8642 9991
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendFormNotification({ formType, payload }: SendFormNotificationParams) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("SMTP credentials missing. Skipping email dispatch.");
    return;
  }

  const recipient = process.env.NOTIFICATION_EMAIL || "admin@pikawiyahealth.org.au";
  const copy = FORM_COPY[formType];
  const name = applicantName(payload);
  const userEmail = applicantEmail(payload);
  const subject = `${copy.title} — ${name}`;
  const html = themedHtml(formType, payload);

  const displayFrom = userEmail
    ? `"${name}" <${userEmail}>`
    : `"Pika Wiya Web" <${process.env.SMTP_USER}>`;

  await transporter.sendMail({
    from: displayFrom,
    to: recipient,
    replyTo: userEmail ? `"${name}" <${userEmail}>` : process.env.SMTP_USER,
    subject,
    html,
    text: `${copy.title}\n${copy.intro}\n\n${JSON.stringify(payload, null, 2)}`,
    envelope: {
      from: process.env.SMTP_USER as string,
      to: recipient,
    },
  });
}
