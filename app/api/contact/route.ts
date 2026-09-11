import { sendFormNotification } from "@/lib/server/email";

export const runtime = "nodejs";

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

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      turnstileToken?: unknown;
      payload?: unknown;
    };

    if (typeof body.turnstileToken !== "string" || !body.payload || typeof body.payload !== "object") {
      return Response.json({ error: "Invalid enquiry." }, { status: 400 });
    }

    const forwardedFor = request.headers.get("x-forwarded-for");
    const ipAddress = forwardedFor?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip");
    await verifyTurnstile(body.turnstileToken, ipAddress);

    await sendFormNotification({
      formType: "enquiry",
      payload: body.payload as Record<string, unknown>,
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Contact enquiry email failed", error);
    return Response.json({ error: "Unable to send enquiry notification." }, { status: 500 });
  }
}
