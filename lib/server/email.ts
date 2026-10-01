import nodemailer from "nodemailer";
import { getAdminClient } from "@/lib/server/supabaseAdmin";

type FormType = "membership" | "address" | "feedback" | "complaint" | "enquiry";

interface SendFormNotificationParams {
  formType: FormType;
  payload: Record<string, unknown>;
}

const SAND = "#F7F4EF";
const INK = "#0a0a0a";
const SURFACE = "#ffffff";
const BOX_BG = SURFACE;
const BOX_LABEL = "rgba(10,10,10,0.6)";
const BOX_VALUE = INK;
const HEADER_MUTED = "rgba(255,255,255,0.78)";
const DIVIDER = "rgba(10,10,10,0.15)";
const CARD_BORDER = "rgba(10,10,10,0.12)";
const BOX_BORDER = "rgba(10,10,10,0.15)";

const SITE_URL = (
  process.env.SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : "")
).replace(/\/$/, "");
const LOGO_URL = `${SITE_URL}/assets/pika_wiya_logo.png`;
const BG_IMAGE_URL = `${SITE_URL}/assets/home/main_page_2nd_bg.png`;

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

type SectionDef = { heading: string; fields: string[] };

const FORM_SECTIONS: Record<FormType, SectionDef[]> = {
  membership: [
    {
      heading: "Applicant Details",
      fields: ["icn_number", "surname", "first_name", "last_name", "address", "postcode", "phone", "email", "date_of_birth", "place_of_birth"],
    },
    { heading: "Witness Information", fields: ["witness_name", "witness_phone", "witness_address", "witness_date"] },
  ],
  address: [
    { heading: "Applicant Details", fields: ["icn_number", "surname", "first_name", "last_name", "phone", "email", "date_of_birth", "place_of_birth"] },
    { heading: "Previous Address", fields: ["previous_address", "previous_postcode"] },
    { heading: "New Address", fields: ["new_address", "new_postcode", "change_date"] },
  ],
  feedback: [{ heading: "Respondent Details", fields: ["full_name", "access_frequency"] }],
  complaint: [
    { heading: "Complainant Details", fields: ["complainant_name", "complainant_address", "daytime_contact", "complainant_date", "email"] },
    { heading: "Incident Details", fields: ["incident_date", "incident_time", "incident_location", "complaint_subject"] },
    { heading: "Witness Details", fields: ["witness_name", "witness_address", "witness_contact"] },
    { heading: "Complaint Outcome", fields: ["desired_outcome", "signature", "date_submitted"] },
  ],
  enquiry: [{ heading: "Enquiry Details", fields: ["service_type", "phone", "email"] }],
};

const FORM_HIGHLIGHTS: Record<FormType, string[]> = {
  membership: [],
  address: [],
  feedback: ["what_like", "how_improve", "what_dislike", "suggestions"],
  complaint: ["complaint_summary", "outcome_details"],
  enquiry: ["message"],
};

type FieldEntry = { label: string; value: string };

function fieldEntry(payload: Record<string, unknown>, key: string): FieldEntry | null {
  const value = payload[key];
  if (value == null || String(value).trim() === "") return null;
  const label = FIELD_LABELS[key] || key.replace(/_/g, " ");
  return { label, value: formatValue(value) };
}

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

function entryCell(entry: FieldEntry, columns: number) {
  return `
    <td width="${100 / columns}%" style="padding:6px 20px;vertical-align:top;">
      <div style="font-size:10px;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;color:${BOX_LABEL};">
        ${escapeHtml(entry.label)}
      </div>
      <div style="font-size:14px;font-weight:700;color:${BOX_VALUE};margin-top:2px;line-height:1.3;white-space:pre-wrap;">
        ${escapeHtml(entry.value)}
      </div>
    </td>`;
}

// Renders every entry inside a single shared box, two fields per row, so a
// section with any number of fields still reads as one card (not one box per
// field) while still pairing fields like Name/Email on the same row. No
// border-collapse here — collapsing table borders breaks the outer
// border-radius clipping in Gmail, squaring off the box corners.
function sectionBox(entries: FieldEntry[], columns = 1) {
  if (!entries.length) return "";
  const rowGroups = chunk(entries, columns);
  const rows = rowGroups
    .map((rowEntries) => {
      const cells = rowEntries.map((entry) => entryCell(entry, columns)).join("");
      const filler = `<td width="${100 / columns}%" style="padding:6px 20px;"></td>`.repeat(
        columns - rowEntries.length
      );
      return `<tr>${cells}${filler}</tr>`;
    })
    .join("");
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BOX_BG};border:1px solid ${BOX_BORDER};border-radius:10px;">
      ${rows}
    </table>`;
}

function renderSection(heading: string, fields: string[], payload: Record<string, unknown>) {
  const entries = fields
    .map((key) => fieldEntry(payload, key))
    .filter((entry): entry is FieldEntry => entry !== null);
  if (!entries.length) return "";
  return `
    <tr>
      <td style="padding:18px 0 2px;border-top:1px solid ${DIVIDER};">
        <div style="font-size:14px;font-weight:700;color:${INK};">${escapeHtml(heading)}</div>
      </td>
    </tr>
    <tr>
      <td style="padding:8px 0 0;">
        ${sectionBox(entries)}
      </td>
    </tr>`;
}

function renderHighlight(key: string, payload: Record<string, unknown>) {
  const entry = fieldEntry(payload, key);
  if (!entry) return "";
  return `
    <tr>
      <td style="padding:6px 0 0;">
        ${sectionBox([entry], 1)}
      </td>
    </tr>`;
}

function themedHtml(formType: FormType, payload: Record<string, unknown>) {
  const copy = FORM_COPY[formType];
  const name = applicantName(payload);
  const email = applicantEmail(payload) || "Not provided";

  const sections = FORM_SECTIONS[formType]
    .map((section) => renderSection(section.heading, section.fields, payload))
    .filter(Boolean)
    .join("");
  const highlights = FORM_HIGHLIGHTS[formType]
    .map((key) => renderHighlight(key, payload))
    .filter(Boolean)
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:0;background:${SAND};font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${SAND};padding:28px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="820" cellpadding="0" cellspacing="0" style="max-width:820px;width:100%;border-radius:16px;border:1px solid ${CARD_BORDER};">
          <tr>
            <td background="${BG_IMAGE_URL}" style="background-color:${SAND};background-image:url('${BG_IMAGE_URL}');background-repeat:round;background-size:cover;border-radius:16px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:${INK};padding:26px 32px 24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td valign="middle" style="vertical-align:middle;">
                          <img src="${LOGO_URL}" width="113" height="36" alt="Pika Wiya Health Service" style="display:block;" />
                        </td>
                        <td align="right" valign="middle" style="vertical-align:middle;">
                          <span style="display:inline-block;padding:6px 12px;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);border-radius:999px;font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#ffffff;">
                            ${escapeHtml(copy.title)}
                          </span>
                        </td>
                      </tr>
                    </table>

                    <div style="font-size:21px;font-weight:800;color:#ffffff;letter-spacing:-0.01em;margin-top:24px;line-height:1.35;">
                      New ${escapeHtml(copy.title.toLowerCase())} from ${escapeHtml(name)}
                    </div>
                    <div style="font-size:13px;color:${HEADER_MUTED};margin-top:8px;line-height:1.6;">
                      ${escapeHtml(copy.intro)}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:22px 26px 28px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:0 0 2px;">
                          <div style="font-size:14px;font-weight:700;color:${INK};">Contact Details</div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0 0;">
                          ${sectionBox([
                            { label: "Name", value: name },
                            { label: "Email", value: email },
                          ])}
                        </td>
                      </tr>
                      ${sections}
                      ${highlights}
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="background:${INK};padding:16px 32px;color:${HEADER_MUTED};font-size:11px;letter-spacing:0.03em;">
                    40–46 Dartford St, Port Augusta SA 5700 · (08) 8642 9991
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function fallbackNotificationEmail() {
  return process.env.NOTIFICATION_EMAIL || "admin@pikawiyahealth.org.au";
}

function isUsableEmail(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const email = value.trim();
  return email.includes("@") && email.includes(".");
}

async function getNotificationEmail() {
  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "notification_email")
      .maybeSingle();

    if (error) {
      console.warn("Could not load notification_email from site_settings.", error.message);
      return fallbackNotificationEmail();
    }

    if (isUsableEmail(data?.value)) {
      return data.value.trim();
    }
  } catch (error) {
    console.warn("Could not load notification_email from site_settings.", error);
  }

  return fallbackNotificationEmail();
}

interface FormEmailConfig {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  notificationEmail: string;
}

async function getFormEmailConfig(formType: FormType): Promise<FormEmailConfig | null> {
  try {
    const supabase = getAdminClient();

    const { data: formTypeRow, error: formTypeError } = await supabase
      .from("form_types")
      .select("id")
      .eq("code", formType)
      .maybeSingle();

    if (formTypeError || !formTypeRow) {
      console.warn(`No form_types row for code "${formType}".`, formTypeError?.message);
      return null;
    }

    const { data, error } = await supabase
      .from("form_emails")
      .select("smtp_host, smtp_port, smtp_user, smtp_pass, notification_email")
      .eq("form_type_id", formTypeRow.id)
      .eq("is_active", true)
      .maybeSingle();

    if (error || !data) {
      console.warn(`No active form_emails row for form type "${formType}".`, error?.message);
      return null;
    }

    return {
      smtpHost: data.smtp_host,
      smtpPort: data.smtp_port,
      smtpUser: data.smtp_user,
      smtpPass: data.smtp_pass,
      notificationEmail: data.notification_email,
    };
  } catch (error) {
    console.warn(`Could not load form_emails config for "${formType}".`, error);
    return null;
  }
}

export async function sendFormNotification({ formType, payload }: SendFormNotificationParams) {
  const dbConfig = await getFormEmailConfig(formType);

  const smtpHost = dbConfig?.smtpHost || process.env.SMTP_HOST;
  const smtpPort = dbConfig?.smtpPort || Number(process.env.SMTP_PORT) || 587;
  const smtpUser = dbConfig?.smtpUser || process.env.SMTP_USER;
  const smtpPass = dbConfig?.smtpPass || process.env.SMTP_PASS;
  const recipient =
    dbConfig?.notificationEmail && isUsableEmail(dbConfig.notificationEmail)
      ? dbConfig.notificationEmail.trim()
      : await getNotificationEmail();

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.warn(`SMTP credentials missing for form type "${formType}". Skipping email dispatch.`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const copy = FORM_COPY[formType];
  const name = applicantName(payload);
  const userEmail = applicantEmail(payload);
  const subject = `${copy.title} — ${name}`;
  const html = themedHtml(formType, payload);

  const displayFrom = userEmail
    ? `"${name}" <${userEmail}>`
    : `"Pika Wiya Web" <${smtpUser}>`;

  await transporter.sendMail({
    from: displayFrom,
    to: recipient,
    replyTo: userEmail ? `"${name}" <${userEmail}>` : smtpUser,
    subject,
    html,
    text: `${copy.title}\n${copy.intro}\n\n${JSON.stringify(payload, null, 2)}`,
    envelope: {
      from: smtpUser,
      to: recipient,
    },
  });
}
