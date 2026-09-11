import { createClient } from "@supabase/supabase-js";
import { encryptFormPayload, hashLookupValue } from "@/lib/server/formCrypto";
import { sendFormNotification } from "@/lib/server/email";

export const runtime = "nodejs";

const FORM_TYPES = ["membership", "address", "feedback", "complaint"] as const;
type FormType = (typeof FORM_TYPES)[number];

function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Server Supabase credentials are not configured.");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function verifyTurnstile(token: string, ipAddress: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    throw new Error("TURNSTILE_SECRET_KEY is not configured on the server.");
  }

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret, response: token, remoteip: ipAddress ?? undefined }),
    cache: "no-store",
  });
  const result = (await response.json()) as { success?: boolean };
  if (!response.ok || !result.success) {
    throw new Error("Cloudflare security verification failed.");
  }
}

function isFormType(value: unknown): value is FormType {
  return typeof value === "string" && FORM_TYPES.includes(value as FormType);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      formType?: unknown;
      turnstileToken?: unknown;
      payload?: unknown;
    };

    if (!isFormType(body.formType) || typeof body.turnstileToken !== "string" || !body.payload) {
      return Response.json({ error: "Invalid form submission." }, { status: 400 });
    }

    const forwardedFor = request.headers.get("x-forwarded-for");
    const ipAddress = forwardedFor?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip");
    await verifyTurnstile(body.turnstileToken, ipAddress);

    const payload = body.payload as Record<string, unknown>;
    const icn = typeof payload.icn_number === "string" ? payload.icn_number : undefined;
    const icnLookupHash = icn ? hashLookupValue(icn) : null;
    const encryptedPayload = encryptFormPayload({ formType: body.formType, payload });
    const supabase = getAdminClient();

    if (body.formType === "membership" && icnLookupHash) {
      const { data: existing, error: lookupError } = await supabase
        .from("encrypted_form_submissions")
        .select("id")
        .eq("form_type", "membership")
        .eq("lookup_hash", icnLookupHash)
        .maybeSingle();
      if (lookupError) throw lookupError;
      if (existing) return Response.json({ error: "This ICN number is already registered." }, { status: 409 });
    }

    if (body.formType === "address" && !icnLookupHash) {
      return Response.json({ error: "ICN number is required." }, { status: 400 });
    }

    // 1. Insert into Supabase
    const { error } = await supabase.from("encrypted_form_submissions").insert({
      form_type: body.formType,
      payload_ciphertext: encryptedPayload,
      lookup_hash: icnLookupHash,
    });
    if (error) throw error;

    // 2. Dispatch Email Notification asynchronously
    try {
      await sendFormNotification({
        formType: body.formType,
        payload,
      });
    } catch (emailErr) {
      console.error("Failed to send submission email notification:", emailErr);
      // We log the error but allow database operation to succeed
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Form submission failed", error);
    const message = error instanceof Error ? error.message : "Unknown form submission error.";
    return Response.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? message
            : "Unable to submit this form securely.",
      },
      { status: 500 },
    );
  }
}