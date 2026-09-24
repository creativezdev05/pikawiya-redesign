// lib/gtag.ts
"use client";

import { sendGAEvent } from "@next/third-parties/google";

export const trackFormSubmission = (
  formType: string,
  status: "success" | "error" = "success"
) => {
  if (typeof window === "undefined") return;

  const eventName = `submit_${formType}_form`;

  // Safely trigger GA4 custom event via @next/third-parties helper
  sendGAEvent("event", eventName, {
    form_name: formType,
    status: status,
  });

  console.log(`[GA4 Event Fired]: ${eventName}`);
};