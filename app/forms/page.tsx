"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import PageTitle from "@/components/PageTitle";
import { AlertTriangle, CheckCircle2, MessageSquare, UserPlus, MapPin, Volume2, VolumeX } from "lucide-react";
import Turnstile from "react-turnstile";
import Image from "next/image";

// Field sequence definitions
const MEMBERSHIP_FIELD_ORDER = [
  "icn_number",
  "surname",
  "first_name",
  "last_name",
  "address",
  "postcode",
  "phone",
  "email",
  "date_of_birth",
  "place_of_birth",
  "witness_name",
  "witness_phone",
  "witness_address",
  "witness_date",
] as const;

const ADDRESS_FIELD_ORDER = [
  "icn_number",
  "surname",
  "first_name",
  "last_name",
  "previous_address",
  "previous_postcode",
  "new_address",
  "new_postcode",
  "phone",
  "email",
  "date_of_birth",
  "place_of_birth",
  "change_date",
] as const;

const FEEDBACK_FIELD_ORDER = [
  "access_frequency",
  "what_like",
  "how_improve",
  "what_dislike",
  "suggestions",
] as const;

const COMPLAINT_FIELD_ORDER = [
  "complainant_name",
  "complainant_address",
  "daytime_contact",
  "complainant_date",
  "email",
  "incident_location",
  "complaint_subject",
  "complaint_summary",
  "desired_outcome",
  "signature",
  "date_submitted",
] as const;

const getLocalDate = () => {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  return new Date(today.getTime() - offset * 60 * 1000).toISOString().split("T")[0];
};

async function submitFormToServer(formType: "membership" | "address" | "feedback" | "complaint", payload: unknown, turnstileToken: string) {
  const response = await fetch("/api/forms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ formType, payload, turnstileToken }),
  });
  const result = (await response.json()) as { error?: string };
  if (!response.ok) throw new Error(result.error || "Unable to submit this form securely.");
}

export default function FormsPage() {
  const [activeTab, setActiveTab] = useState<"membership" | "address" | "feedback" | "complaint">("membership");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Audio State
  const [isMuted, setIsMuted] = useState(false);
  const isMutedRef = useRef(isMuted);

  // Turnstile state
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  // Membership Form State
  const [membershipData, setMembershipData] = useState({
    icn_number: "",
    surname: "",
    first_name: "",
    last_name: "",
    address: "",
    postcode: "",
    phone: "",
    email: "",
    date_of_birth: "",
    place_of_birth: "",
    witness_name: "",
    witness_address: "",
    witness_phone: "",
    witness_date: getLocalDate(),
  });

  // Change of Address State
  const [addressData, setAddressData] = useState({
    icn_number: "",
    surname: "",
    first_name: "",
    last_name: "",
    previous_address: "",
    previous_postcode: "",
    new_address: "",
    new_postcode: "",
    phone: "",
    email: "",
    date_of_birth: "",
    place_of_birth: "",
    change_date: getLocalDate(),
  });

  const [feedbackData, setFeedbackData] = useState({
    full_name: "",
    access_frequency: "",
    what_like: "",
    how_improve: "",
    what_dislike: "",
    suggestions: "",
  });

  const [complaintData, setComplaintData] = useState({
    complainant_name: "",
    complainant_address: "",
    daytime_contact: "",
    complainant_date: getLocalDate(),
    email: "",
    incident_date: "",
    incident_time: "",
    incident_location: "",
    complaint_subject: "",
    complaint_summary: "",
    witness_name: "",
    witness_address: "",
    witness_contact: "",
    desired_outcome: "",
    outcome_details: "",
    signature: "",
    date_submitted: getLocalDate(),
  });

  // --- Speech & Audio Helpers ---

  const speakText = (text: string) => {
    if (isMutedRef.current || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel(); // Stop ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    isMutedRef.current = isMuted;
    if (isMuted && typeof window !== "undefined") {
      window.speechSynthesis?.cancel();
    }
  }, [isMuted]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") {
        window.speechSynthesis?.cancel();
      }
    };
  }, []);

  const playSubmissionSound = () => {
    if (isMuted) return;
    try {
      const audioCtx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5

      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch {
      // Audio fallback
    }
  };

  // Announce tab changes via SpeechSynthesis
  useEffect(() => {
    const messages = {
      membership: "Membership Application Form selected. Enter your ICN number to begin.",
      address: "Change of Address Form selected. Enter your ICN number to begin.",
      feedback: "Feedback Form selected. Choose how often you access Pika Wiya Health Service to begin.",
      complaint: "Complaint Form selected. Enter the name of the person lodging the complaint to begin.",
    };
    speakText(messages[activeTab]);
  }, [activeTab, isMuted]);

  // --- Sequential Field Helper Functions ---

  const isMembershipFieldUnlocked = (fieldKey: keyof typeof membershipData) => {
    const index = MEMBERSHIP_FIELD_ORDER.indexOf(fieldKey as typeof MEMBERSHIP_FIELD_ORDER[number]);
    if (index === 0) return true;

    for (let i = 0; i < index; i++) {
      const prevKey = MEMBERSHIP_FIELD_ORDER[i];
      if (!membershipData[prevKey as keyof typeof membershipData]?.trim()) {
        return false;
      }
    }
    return true;
  };

  const handleMembershipChange = (key: keyof typeof membershipData, value: string) => {
    setMembershipData((prev) => {
      const updated = { ...prev, [key]: value };
      const index = MEMBERSHIP_FIELD_ORDER.indexOf(key as typeof MEMBERSHIP_FIELD_ORDER[number]);

      if (!value.trim()) {
        for (let i = index + 1; i < MEMBERSHIP_FIELD_ORDER.length; i++) {
          const subsequentKey = MEMBERSHIP_FIELD_ORDER[i];
          updated[subsequentKey as keyof typeof membershipData] = "";
        }
      }
      return updated;
    });
  };

  const areAllMembershipFieldsFilled = MEMBERSHIP_FIELD_ORDER.every(
    (key) => membershipData[key as keyof typeof membershipData]?.trim().length > 0
  );

  const isAddressFieldUnlocked = (fieldKey: keyof typeof addressData) => {
    const index = ADDRESS_FIELD_ORDER.indexOf(fieldKey as typeof ADDRESS_FIELD_ORDER[number]);
    if (index === 0) return true;

    for (let i = 0; i < index; i++) {
      const prevKey = ADDRESS_FIELD_ORDER[i];
      if (!addressData[prevKey as keyof typeof addressData]?.trim()) {
        return false;
      }
    }
    return true;
  };

  const handleAddressChange = (key: keyof typeof addressData, value: string) => {
    setAddressData((prev) => {
      const updated = { ...prev, [key]: value };
      const index = ADDRESS_FIELD_ORDER.indexOf(key as typeof ADDRESS_FIELD_ORDER[number]);

      if (!value.trim()) {
        for (let i = index + 1; i < ADDRESS_FIELD_ORDER.length; i++) {
          const subsequentKey = ADDRESS_FIELD_ORDER[i];
          updated[subsequentKey as keyof typeof addressData] = "";
        }
      }
      return updated;
    });
  };

  const areAllAddressFieldsFilled = ADDRESS_FIELD_ORDER.every(
    (key) => addressData[key as keyof typeof addressData]?.trim().length > 0
  );

  const isFeedbackFieldUnlocked = (fieldKey: keyof typeof feedbackData) => {
    const index = FEEDBACK_FIELD_ORDER.indexOf(fieldKey as typeof FEEDBACK_FIELD_ORDER[number]);
    if (index === -1 || index === 0) return true;
    return FEEDBACK_FIELD_ORDER.slice(0, index).every(
      (key) => feedbackData[key as keyof typeof feedbackData]?.trim().length > 0
    );
  };

  const handleFeedbackChange = (key: keyof typeof feedbackData, value: string) => {
    setFeedbackData((prev) => ({ ...prev, [key]: value }));
  };

  const areAllFeedbackFieldsFilled = FEEDBACK_FIELD_ORDER.every(
    (key) => feedbackData[key as keyof typeof feedbackData]?.trim().length > 0
  );

  const isComplaintFieldUnlocked = (fieldKey: keyof typeof complaintData) => {
    const index = COMPLAINT_FIELD_ORDER.indexOf(fieldKey as typeof COMPLAINT_FIELD_ORDER[number]);
    if (index === -1 || index === 0) return true;
    return COMPLAINT_FIELD_ORDER.slice(0, index).every(
      (key) => complaintData[key as keyof typeof complaintData]?.trim().length > 0
    );
  };

  const handleComplaintChange = (key: keyof typeof complaintData, value: string) => {
    setComplaintData((prev) => ({ ...prev, [key]: value }));
  };

  const areAllComplaintFieldsFilled = COMPLAINT_FIELD_ORDER.every(
    (key) => complaintData[key as keyof typeof complaintData]?.trim().length > 0
  );

  const isComplaintComplete =
    areAllComplaintFieldsFilled &&
    (complaintData.desired_outcome !== "yes" || complaintData.outcome_details.trim().length > 0);

  // --- Submit Handlers ---

  const handleMembershipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!turnstileToken) {
      const msg = "Please complete the Cloudflare security verification.";
      setErrorMsg(msg);
      speakText(msg);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await submitFormToServer("membership", membershipData, turnstileToken);

      playSubmissionSound();
      speakText("Your membership application has been successfully submitted.");
      setSubmitted(true);
    } catch (err) {
      const error = err as Error;
      const msg = error.message || "Failed to submit membership application.";
      setErrorMsg(msg);
      speakText(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!turnstileToken) {
      const msg = "Please complete the Cloudflare security verification.";
      setErrorMsg(msg);
      speakText(msg);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await submitFormToServer("address", addressData, turnstileToken);

      playSubmissionSound();
      speakText("Your change of address request has been successfully recorded.");
      setSubmitted(true);
    } catch (err) {
      const error = err as Error;
      const msg = error.message || "Failed to record change of address.";
      setErrorMsg(msg);
      speakText(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!turnstileToken) {
      const msg = "Please complete the Cloudflare security verification.";
      setErrorMsg(msg);
      speakText(msg);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await submitFormToServer("feedback", feedbackData, turnstileToken);
      playSubmissionSound();
      speakText("Your feedback has been successfully submitted.");
      setSubmitted(true);
    } catch (err) {
      const error = err as Error;
      const msg = error.message || "Failed to submit feedback.";
      setErrorMsg(msg);
      speakText(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplaintSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!turnstileToken) {
      const msg = "Please complete the Cloudflare security verification.";
      setErrorMsg(msg);
      speakText(msg);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await submitFormToServer("complaint", complaintData, turnstileToken);
      playSubmissionSound();
      speakText("Your complaint has been successfully submitted.");
      setSubmitted(true);
    } catch (err) {
      const error = err as Error;
      const msg = error.message || "Failed to submit complaint.";
      setErrorMsg(msg);
      speakText(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-page text-ink">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-10">
          <Image
            src="/assets/Jap-016925-Tarisse.jpg"
            alt=""
            fill
            className="object-cover object-center"
            priority={false}
          />
        </div>
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-16">
        {/* Header & Mute Button Bar */}
        <div className="flex justify-between items-start mb-10">
          <div className="text-center w-full">
            <span className="text-ochre font-semibold uppercase text-xs tracking-wider">
              Online Client Services
            </span>
            <PageTitle className="text-4xl font-bold mt-1 mb-3">Client Forms</PageTitle>
            <p className="text-ink/70 max-w-xl mx-auto text-sm">
              Submit a membership application, update your address, share feedback, or lodge a complaint with Pika Wiya Health Service.
            </p>
          </div>

          {/* Speech Audio Toggle Button */}
          <button
            type="button"
            onClick={() => {
              const nextMute = !isMuted;
              setIsMuted(nextMute);
              if (nextMute && typeof window !== "undefined") {
                window.speechSynthesis?.cancel();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-surface text-ink/80 hover:text-ink text-xs font-medium transition shadow-sm"
            title={isMuted ? "Unmute Voice Guidance" : "Mute Voice Guidance"}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-red-500" />
                <span>Muted</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-ochre" />
                <span>Audio On</span>
              </>
            )}
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => {
              setActiveTab("membership");
              setSubmitted(false);
              setErrorMsg(null);
              setTurnstileToken(null);
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm transition ${
              activeTab === "membership"
                ? "bg-earth text-white shadow-md"
                : "bg-surface text-ink/70 hover:text-ink border border-border"
            }`}
          >
            <UserPlus className="w-4 h-4 text-ochre" />
            Membership Application
          </button>

          <button
            onClick={() => {
              setActiveTab("address");
              setSubmitted(false);
              setErrorMsg(null);
              setTurnstileToken(null);
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm transition ${
              activeTab === "address"
                ? "bg-earth text-white shadow-md"
                : "bg-surface text-ink/70 hover:text-ink border border-border"
            }`}
          >
            <MapPin className="w-4 h-4 text-ochre" />
            Change of Address Form
          </button>

          <button
            onClick={() => {
              setActiveTab("feedback");
              setSubmitted(false);
              setErrorMsg(null);
              setTurnstileToken(null);
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm transition ${
              activeTab === "feedback"
                ? "bg-earth text-white shadow-md"
                : "bg-surface text-ink/70 hover:text-ink border border-border"
            }`}
          >
            <MessageSquare className="w-4 h-4 text-ochre" />
            Feedback
          </button>

          <button
            onClick={() => {
              setActiveTab("complaint");
              setSubmitted(false);
              setErrorMsg(null);
              setTurnstileToken(null);
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm transition ${
              activeTab === "complaint"
                ? "bg-earth text-white shadow-md"
                : "bg-surface text-ink/70 hover:text-ink border border-border"
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-ochre" />
            Complaint
          </button>
        </div>

        {/* Success Confirmation */}
        {submitted ? (
          <div className="bg-surface p-12 rounded-2xl shadow-sm border border-border text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-ochre mx-auto" />
            <h2 className="text-2xl font-bold text-ink">Submission Successful</h2>
            <p className="text-ink/70 text-sm max-w-md mx-auto">
              Your information has been updated cleanly in the database under your ICN number.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setTurnstileToken(null);
              }}
              className="mt-4 px-6 py-2.5 bg-ochre text-white text-sm font-medium rounded-md hover:bg-ochre-dark transition"
            >
              Submit Another Request
            </button>
          </div>
        ) : (
          <div className="bg-surface p-8 md:p-12 rounded-2xl shadow-sm border border-border bg-white relative z-10">
            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg dark:bg-red-950/40 dark:border-red-800 dark:text-red-300">
                {errorMsg}
              </div>
            )}

            {/* MEMBERSHIP FORM */}
            {activeTab === "membership" && (
              <form onSubmit={handleMembershipSubmit} className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-ink mb-1">Membership Application</h2>
                  <p className="text-xs text-ink/60">Fill in each field sequentially to unlock the form.</p>
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-ink/80 mb-1">ICN Number</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ICN-10293"
                      value={membershipData.icn_number}
                      onFocus={() => speakText("ICN Number input field")}
                      onChange={(e) => handleMembershipChange("icn_number", e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-ochre font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink/80 mb-1">Surname</label>
                    <input
                      type="text"
                      required
                      disabled={!isMembershipFieldUnlocked("surname")}
                      value={membershipData.surname}
                      onFocus={() => speakText("Surname input field")}
                      onChange={(e) => handleMembershipChange("surname", e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-input-disabled disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink/80 mb-1">First Name</label>
                    <input
                      type="text"
                      required
                      disabled={!isMembershipFieldUnlocked("first_name")}
                      value={membershipData.first_name}
                      onFocus={() => speakText("First Name input field")}
                      onChange={(e) => handleMembershipChange("first_name", e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-input-disabled disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink/80 mb-1">Last Name</label>
                    <input
                      type="text"
                      required
                      disabled={!isMembershipFieldUnlocked("last_name")}
                      value={membershipData.last_name}
                      onFocus={() => speakText("Last Name input field")}
                      onChange={(e) => handleMembershipChange("last_name", e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-input-disabled disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-ink/80 mb-1">Address</label>
                    <input
                      type="text"
                      required
                      disabled={!isMembershipFieldUnlocked("address")}
                      value={membershipData.address}
                      onFocus={() => speakText("Address input field")}
                      onChange={(e) => handleMembershipChange("address", e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-input-disabled disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink/80 mb-1">Postcode</label>
                    <input
                      type="text"
                      required
                      disabled={!isMembershipFieldUnlocked("postcode")}
                      value={membershipData.postcode}
                      onFocus={() => speakText("Postcode input field")}
                      onChange={(e) => handleMembershipChange("postcode", e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-input-disabled disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-ink/80 mb-1">Telephone Number</label>
                    <input
                      type="tel"
                      required
                      disabled={!isMembershipFieldUnlocked("phone")}
                      value={membershipData.phone}
                      onFocus={() => speakText("Telephone Number input field")}
                      onChange={(e) => handleMembershipChange("phone", e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-input-disabled disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink/80 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      disabled={!isMembershipFieldUnlocked("email")}
                      value={membershipData.email}
                      onFocus={() => speakText("Email address input field")}
                      onChange={(e) => handleMembershipChange("email", e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-input-disabled disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-ink/80 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      required
                      disabled={!isMembershipFieldUnlocked("date_of_birth")}
                      value={membershipData.date_of_birth}
                      onFocus={() => speakText("Date of Birth field")}
                      onChange={(e) => handleMembershipChange("date_of_birth", e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-input-disabled disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink/80 mb-1">Place of Birth</label>
                    <input
                      type="text"
                      required
                      disabled={!isMembershipFieldUnlocked("place_of_birth")}
                      value={membershipData.place_of_birth}
                      onFocus={() => speakText("Place of Birth input field")}
                      onChange={(e) => handleMembershipChange("place_of_birth", e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-input-disabled disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* WITNESS SECTION */}
                <div className="border-t border-border pt-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-ink">Witness Information</h3>
                    <p className="text-xs text-ink/60">Details of the witness attesting to this application.</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-ink/80 mb-1">Witness Name</label>
                      <input
                        type="text"
                        required
                        disabled={!isMembershipFieldUnlocked("witness_name")}
                        value={membershipData.witness_name}
                        onFocus={() => speakText("Witness Name input field")}
                        onChange={(e) => handleMembershipChange("witness_name", e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-input-disabled disabled:cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ink/80 mb-1">Witness Phone</label>
                      <input
                        type="tel"
                        required
                        disabled={!isMembershipFieldUnlocked("witness_phone")}
                        value={membershipData.witness_phone}
                        onFocus={() => speakText("Witness Phone input field")}
                        onChange={(e) => handleMembershipChange("witness_phone", e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-input-disabled disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-ink/80 mb-1">Witness Address</label>
                      <input
                        type="text"
                        required
                        disabled={!isMembershipFieldUnlocked("witness_address")}
                        value={membershipData.witness_address}
                        onFocus={() => speakText("Witness Address input field")}
                        onChange={(e) => handleMembershipChange("witness_address", e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-input-disabled disabled:cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ink/80 mb-1">Witness Date</label>
                      <input
                        type="date"
                        required
                        disabled={!isMembershipFieldUnlocked("witness_date")}
                        value={membershipData.witness_date}
                        onFocus={() => speakText("Witness Date field")}
                        onChange={(e) => handleMembershipChange("witness_date", e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-input-disabled disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* Cloudflare Turnstile Captcha */}
                <div
                  className={`my-4 transition-opacity ${
                    areAllMembershipFieldsFilled ? "opacity-100 pointer-events-auto" : "opacity-50 pointer-events-none"
                  }`}
                >
                  <Turnstile
                    sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "YOUR_TURNSTILE_SITE_KEY"}
                    theme="auto"
                    onVerify={(token) => {
                      setTurnstileToken(token);
                      speakText("Security verification complete.");
                    }}
                    onExpire={() => setTurnstileToken(null)}
                    onError={() => setTurnstileToken(null)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !areAllMembershipFieldsFilled || !turnstileToken}
                  className="w-full py-3 bg-ochre hover:bg-ochre-dark text-white font-semibold rounded-md transition shadow-sm text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting Application..." : "Submit Membership Application"}
                </button>
              </form>
            )}

            {/* CHANGE OF ADDRESS FORM */}
            {activeTab === "address" && (
              <form onSubmit={handleAddressSubmit} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-ink mb-1">Change of Address Form</h2>
                  <p className="text-xs text-ink/60">Fill in each field sequentially to unlock the form.</p>
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-ink/80 mb-1">ICN Number</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ICN-10293"
                      value={addressData.icn_number}
                      onFocus={() => speakText("ICN Number input field")}
                      onChange={(e) => handleAddressChange("icn_number", e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-ochre font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink/80 mb-1">Surname</label>
                    <input
                      type="text"
                      required
                      disabled={!isAddressFieldUnlocked("surname")}
                      value={addressData.surname}
                      onFocus={() => speakText("Surname input field")}
                      onChange={(e) => handleAddressChange("surname", e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-input-disabled disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink/80 mb-1">First Name</label>
                    <input
                      type="text"
                      required
                      disabled={!isAddressFieldUnlocked("first_name")}
                      value={addressData.first_name}
                      onFocus={() => speakText("First Name input field")}
                      onChange={(e) => handleAddressChange("first_name", e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-input-disabled disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink/80 mb-1">Last Name</label>
                    <input
                      type="text"
                      required
                      disabled={!isAddressFieldUnlocked("last_name")}
                      value={addressData.last_name}
                      onFocus={() => speakText("Last Name input field")}
                      onChange={(e) => handleAddressChange("last_name", e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-input-disabled disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-ink/80 mb-1">Previous Address</label>
                    <input
                      type="text"
                      required
                      disabled={!isAddressFieldUnlocked("previous_address")}
                      value={addressData.previous_address}
                      onFocus={() => speakText("Previous Address input field")}
                      onChange={(e) => handleAddressChange("previous_address", e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-input-disabled disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink/80 mb-1">Previous Postcode</label>
                    <input
                      type="text"
                      required
                      disabled={!isAddressFieldUnlocked("previous_postcode")}
                      value={addressData.previous_postcode}
                      onFocus={() => speakText("Previous Postcode input field")}
                      onChange={(e) => handleAddressChange("previous_postcode", e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-input-disabled disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-ink/80 mb-1">New Address</label>
                    <input
                      type="text"
                      required
                      disabled={!isAddressFieldUnlocked("new_address")}
                      value={addressData.new_address}
                      onFocus={() => speakText("New Address input field")}
                      onChange={(e) => handleAddressChange("new_address", e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-input-disabled disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink/80 mb-1">New Postcode</label>
                    <input
                      type="text"
                      required
                      disabled={!isAddressFieldUnlocked("new_postcode")}
                      value={addressData.new_postcode}
                      onFocus={() => speakText("New Postcode input field")}
                      onChange={(e) => handleAddressChange("new_postcode", e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-input-disabled disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-ink/80 mb-1">Telephone Number</label>
                    <input
                      type="tel"
                      required
                      disabled={!isAddressFieldUnlocked("phone")}
                      value={addressData.phone}
                      onFocus={() => speakText("Telephone Number input field")}
                      onChange={(e) => handleAddressChange("phone", e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-input-disabled disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink/80 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      disabled={!isAddressFieldUnlocked("email")}
                      value={addressData.email}
                      onFocus={() => speakText("Email address input field")}
                      onChange={(e) => handleAddressChange("email", e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-input-disabled disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-ink/80 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      required
                      disabled={!isAddressFieldUnlocked("date_of_birth")}
                      value={addressData.date_of_birth}
                      onFocus={() => speakText("Date of Birth field")}
                      onChange={(e) => handleAddressChange("date_of_birth", e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-input-disabled disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink/80 mb-1">Place of Birth</label>
                    <input
                      type="text"
                      required
                      disabled={!isAddressFieldUnlocked("place_of_birth")}
                      value={addressData.place_of_birth}
                      onFocus={() => speakText("Place of Birth input field")}
                      onChange={(e) => handleAddressChange("place_of_birth", e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-input-disabled disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink/80 mb-1">Date of Update</label>
                    <input
                      type="date"
                      required
                      disabled={!isAddressFieldUnlocked("change_date")}
                      value={addressData.change_date}
                      onFocus={() => speakText("Date of Update field")}
                      onChange={(e) => handleAddressChange("change_date", e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-input-disabled disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Cloudflare Turnstile Captcha */}
                <div
                  className={`my-4 transition-opacity ${
                    areAllAddressFieldsFilled ? "opacity-100 pointer-events-auto" : "opacity-50 pointer-events-none"
                  }`}
                >
                  <Turnstile
                    sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "YOUR_TURNSTILE_SITE_KEY"}
                    theme="auto"
                    onVerify={(token) => {
                      setTurnstileToken(token);
                      speakText("Security verification complete.");
                    }}
                    onExpire={() => setTurnstileToken(null)}
                    onError={() => setTurnstileToken(null)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !areAllAddressFieldsFilled || !turnstileToken}
                  className="w-full py-3 bg-ochre hover:bg-ochre-dark text-white font-semibold rounded-md transition shadow-sm text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Updating Address Record..." : "Submit Address Change"}
                </button>
              </form>
            )}

            {/* FEEDBACK FORM */}
            {activeTab === "feedback" && (
              <form onSubmit={handleFeedbackSubmit} className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-ink mb-1">Feedback</h2>
                  <p className="text-xs text-ink/60">Please complete the form below to provide us with your feedback.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink/80 mb-1">Full Name <span className="font-normal text-ink/50">(Optional)</span></label>
                  <input
                    type="text"
                    value={feedbackData.full_name}
                    onFocus={() => speakText("Full Name input field, optional")}
                    onChange={(e) => handleFeedbackChange("full_name", e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-ochre"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink/80 mb-1">1. On average, how often do you access Pika Wiya Health Service?</label>
                  <select
                    required
                    value={feedbackData.access_frequency}
                    onFocus={() => speakText("Select how often you access Pika Wiya Health Service")}
                    onChange={(e) => handleFeedbackChange("access_frequency", e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md text-sm bg-surface focus:outline-none focus:border-ochre"
                  >
                    <option value="">Select an option</option>
                    <option value="Once a month">Once a month</option>
                    <option value="Once every 3 months">Once every 3 months</option>
                    <option value="Once every 6 months">Once every 6 months</option>
                    <option value="More than 12 months">More than 12 months</option>
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-ink/80 mb-1">2. What do you like about Pika Wiya Health Service?</label>
                    <textarea
                      required
                      rows={5}
                      disabled={!isFeedbackFieldUnlocked("what_like")}
                      value={feedbackData.what_like}
                      onFocus={() => speakText("What do you like about Pika Wiya Health Service?")}
                      onChange={(e) => handleFeedbackChange("what_like", e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-input-disabled disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink/80 mb-1">3. How can we improve our service?</label>
                    <textarea
                      required
                      rows={5}
                      disabled={!isFeedbackFieldUnlocked("how_improve")}
                      value={feedbackData.how_improve}
                      onFocus={() => speakText("How can we improve our service?")}
                      onChange={(e) => handleFeedbackChange("how_improve", e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-input-disabled disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink/80 mb-1">4. What do you dislike about our Health Service?</label>
                    <textarea
                      required
                      rows={5}
                      disabled={!isFeedbackFieldUnlocked("what_dislike")}
                      value={feedbackData.what_dislike}
                      onFocus={() => speakText("What do you dislike about our Health Service?")}
                      onChange={(e) => handleFeedbackChange("what_dislike", e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-input-disabled disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink/80 mb-1">5. Any other comments or suggestions?</label>
                    <textarea
                      required
                      rows={5}
                      disabled={!isFeedbackFieldUnlocked("suggestions")}
                      value={feedbackData.suggestions}
                      onFocus={() => speakText("Any other comments or suggestions?")}
                      onChange={(e) => handleFeedbackChange("suggestions", e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-input-disabled disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className={`my-4 transition-opacity ${areAllFeedbackFieldsFilled ? "opacity-100 pointer-events-auto" : "opacity-50 pointer-events-none"}`}>
                  <Turnstile
                    sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "YOUR_TURNSTILE_SITE_KEY"}
                    theme="auto"
                    onVerify={(token) => setTurnstileToken(token)}
                    onExpire={() => setTurnstileToken(null)}
                    onError={() => setTurnstileToken(null)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || !areAllFeedbackFieldsFilled || !turnstileToken}
                  className="w-full py-3 bg-ochre hover:bg-ochre-dark text-white font-semibold rounded-md transition shadow-sm text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting Feedback..." : "Submit Feedback"}
                </button>
              </form>
            )}

            {/* COMPLAINT FORM */}
            {activeTab === "complaint" && (
              <form onSubmit={handleComplaintSubmit} className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-ink mb-1">Complaint Form</h2>
                  <p className="text-xs text-ink/60">This form ensures that complaints are heard and responded to respectfully.</p>
                </div>

                <div className="border-t border-border pt-6 space-y-6">
                  <h3 className="text-lg font-bold text-ink">Complainant Details</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-ink/80 mb-1">Name of Person Lodging Complaint</label>
                      <input required type="text" value={complaintData.complainant_name} onFocus={() => speakText("Name of person lodging complaint")} onChange={(e) => handleComplaintChange("complainant_name", e.target.value)} className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-ochre" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ink/80 mb-1">Address</label>
                      <input required type="text" disabled={!isComplaintFieldUnlocked("complainant_address")} value={complaintData.complainant_address} onFocus={() => speakText("Complainant address")} onChange={(e) => handleComplaintChange("complainant_address", e.target.value)} className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-input-disabled disabled:cursor-not-allowed" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ink/80 mb-1">Daytime Contact No.</label>
                      <input required type="tel" disabled={!isComplaintFieldUnlocked("daytime_contact")} value={complaintData.daytime_contact} onFocus={() => speakText("Daytime contact number")} onChange={(e) => handleComplaintChange("daytime_contact", e.target.value)} className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-input-disabled disabled:cursor-not-allowed" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ink/80 mb-1">Date</label>
                      <input required type="date" disabled={!isComplaintFieldUnlocked("complainant_date")} value={complaintData.complainant_date} onChange={(e) => handleComplaintChange("complainant_date", e.target.value)} className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-input-disabled disabled:cursor-not-allowed" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-ink/80 mb-1">Email</label>
                      <input required type="email" disabled={!isComplaintFieldUnlocked("email")} value={complaintData.email} onFocus={() => speakText("Email address")} onChange={(e) => handleComplaintChange("email", e.target.value)} className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-input-disabled disabled:cursor-not-allowed" />
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-6 space-y-6">
                  <h3 className="text-lg font-bold text-ink">Complaint Details</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-ink/80 mb-1">Date of Incident <span className="font-normal text-ink/50">(if relevant)</span></label>
                      <input type="date" disabled={!isComplaintFieldUnlocked("email")} value={complaintData.incident_date} onChange={(e) => handleComplaintChange("incident_date", e.target.value)} className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-input-disabled disabled:cursor-not-allowed" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ink/80 mb-1">Time</label>
                      <input type="time" disabled={!isComplaintFieldUnlocked("email")} value={complaintData.incident_time} onChange={(e) => handleComplaintChange("incident_time", e.target.value)} className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-input-disabled disabled:cursor-not-allowed" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-ink/80 mb-1">Location of Incident</label>
                      <input required type="text" disabled={!isComplaintFieldUnlocked("incident_location")} value={complaintData.incident_location} onFocus={() => speakText("Location of incident")} onChange={(e) => handleComplaintChange("incident_location", e.target.value)} className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-input-disabled disabled:cursor-not-allowed" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-ink/80 mb-1">Who or what is the subject of your complaint?</label>
                      <input required type="text" disabled={!isComplaintFieldUnlocked("complaint_subject")} value={complaintData.complaint_subject} onFocus={() => speakText("Who or what is the subject of your complaint?")} onChange={(e) => handleComplaintChange("complaint_subject", e.target.value)} className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-input-disabled disabled:cursor-not-allowed" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-ink/80 mb-1">Summary of Complaint or Issue</label>
                      <textarea required rows={6} disabled={!isComplaintFieldUnlocked("complaint_summary")} value={complaintData.complaint_summary} onFocus={() => speakText("Summary of complaint or issue")} onChange={(e) => handleComplaintChange("complaint_summary", e.target.value)} className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-input-disabled disabled:cursor-not-allowed" />
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-6 space-y-6">
                  <h3 className="text-lg font-bold text-ink">Witness Details <span className="font-normal text-ink/50 text-xs">(leave blank if not relevant)</span></h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <input aria-label="Witness name" placeholder="Name" type="text" disabled={!isComplaintFieldUnlocked("complaint_summary")} value={complaintData.witness_name} onChange={(e) => handleComplaintChange("witness_name", e.target.value)} className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-input-disabled disabled:cursor-not-allowed" />
                    <input aria-label="Witness address" placeholder="Address" type="text" disabled={!isComplaintFieldUnlocked("complaint_summary")} value={complaintData.witness_address} onChange={(e) => handleComplaintChange("witness_address", e.target.value)} className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-input-disabled disabled:cursor-not-allowed" />
                    <input aria-label="Witness daytime contact number" placeholder="Daytime contact number" type="tel" disabled={!isComplaintFieldUnlocked("complaint_summary")} value={complaintData.witness_contact} onChange={(e) => handleComplaintChange("witness_contact", e.target.value)} className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-input-disabled disabled:cursor-not-allowed" />
                  </div>
                </div>

                <div className="border-t border-border pt-6 space-y-6">
                  <h3 className="text-lg font-bold text-ink">Complaint Outcome</h3>
                  <div>
                    <label className="block text-xs font-semibold text-ink/80 mb-1">Is there an outcome you would like?</label>
                    <select required disabled={!isComplaintFieldUnlocked("desired_outcome")} value={complaintData.desired_outcome} onChange={(e) => handleComplaintChange("desired_outcome", e.target.value)} className="w-full px-3 py-2 border border-border rounded-md text-sm bg-surface focus:outline-none focus:border-ochre disabled:bg-input-disabled disabled:cursor-not-allowed">
                      <option value="">Select an option</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  {complaintData.desired_outcome === "yes" && (
                    <div>
                      <label className="block text-xs font-semibold text-ink/80 mb-1">If yes, please provide details</label>
                      <textarea required rows={4} value={complaintData.outcome_details} onChange={(e) => handleComplaintChange("outcome_details", e.target.value)} className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-ochre" />
                    </div>
                  )}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-ink/80 mb-1">Complainant Signature</label>
                      <input required type="text" disabled={!isComplaintFieldUnlocked("signature")} value={complaintData.signature} onFocus={() => speakText("Complainant signature")} onChange={(e) => handleComplaintChange("signature", e.target.value)} className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-input-disabled disabled:cursor-not-allowed" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ink/80 mb-1">Date Submitted</label>
                      <input required type="date" disabled={!isComplaintFieldUnlocked("date_submitted")} value={complaintData.date_submitted} onChange={(e) => handleComplaintChange("date_submitted", e.target.value)} className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-input-disabled disabled:cursor-not-allowed" />
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-page p-4 text-xs text-ink/70 leading-relaxed space-y-2 border border-border">
                  <p>
                    Complaints may be lodged in writing by mail to PO Box 2021, Port Augusta, SA 5700; by fax to the PWHS Board on (08) 8642 9951; in the clinic suggestion box; by email to Lorraine.Merrick@pikawiyahealth.org.au; or by hand delivery to Administration addressed to the CEO and marked confidential.
                  </p>
                  <p>
                    Complaints may also be made verbally by phone or face to face by asking for an Area Supervisor, Manager, or Executive Team Manager. Business hours are Monday to Friday, 8:30am to 5:00pm. Complaints are handled confidentially and there is no cost to lodge a complaint.
                  </p>
                  <p>
                    Complaints are acknowledged and investigated as soon as practicable, and you will be kept informed throughout the process. If your complaint is not resolved, you may contact the Health and Community Services Complaints Commissioner on 1800 232 007 or visit hcscc.sa.gov.au.
                  </p>
                </div>
                <div className={`my-4 transition-opacity ${isComplaintComplete ? "opacity-100 pointer-events-auto" : "opacity-50 pointer-events-none"}`}>
                  <Turnstile
                    sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "YOUR_TURNSTILE_SITE_KEY"}
                    theme="auto"
                    onVerify={(token) => setTurnstileToken(token)}
                    onExpire={() => setTurnstileToken(null)}
                    onError={() => setTurnstileToken(null)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || !isComplaintComplete || !turnstileToken}
                  className="w-full py-3 bg-ochre hover:bg-ochre-dark text-white font-semibold rounded-md transition shadow-sm text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting Complaint..." : "Submit Complaint"}
                </button>
              </form>
            )}
          </div>
        )}
      </main>
    </div>
  );
}