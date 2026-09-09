"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabaseClient";
import { CheckCircle2, UserPlus, MapPin, Volume2, VolumeX } from "lucide-react";
import Turnstile from "react-turnstile";

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

export default function FormsPage() {
  const [activeTab, setActiveTab] = useState<"membership" | "address">("membership");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Audio State
  const [isMuted, setIsMuted] = useState(false);

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
    witness_date: new Date().toISOString().split("T")[0],
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
    change_date: new Date().toISOString().split("T")[0],
  });

  // --- Speech & Audio Helpers ---

  const speakText = (text: string) => {
    if (isMuted || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel(); // Stop ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

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
    if (activeTab === "membership") {
      speakText("Membership Application Form selected. Enter your ICN number to begin.");
    } else {
      speakText("Change of Address Form selected. Enter your ICN number to begin.");
    }
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

  // --- Submit Handlers ---

  const handleMembershipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!turnstileToken) {
      const msg = "Please complete the Cloudflare security verification.";
      setErrorMsg(msg);
      speakText(msg);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const { data: existingMember } = await supabase
        .from("members")
        .select("id")
        .eq("icn_number", membershipData.icn_number)
        .maybeSingle();

      if (existingMember) {
        throw new Error(
          `ICN number ${membershipData.icn_number} is already registered. If you need to update details, please use the Change of Address form.`
        );
      }

      const { data: member, error: memberError } = await supabase
        .from("members")
        .insert([
          {
            icn_number: membershipData.icn_number,
            surname: membershipData.surname,
            first_name: membershipData.first_name,
            last_name: membershipData.last_name,
            current_address: membershipData.address,
            current_postcode: membershipData.postcode,
            phone: membershipData.phone,
            email: membershipData.email,
            date_of_birth: membershipData.date_of_birth,
            place_of_birth: membershipData.place_of_birth,
          },
        ])
        .select()
        .single();

      if (memberError) throw memberError;

      const { error: witnessError } = await supabase
        .from("membership_witnesses")
        .insert([
          {
            member_id: member.id,
            witness_name: membershipData.witness_name,
            witness_address: membershipData.witness_address,
            witness_phone: membershipData.witness_phone,
            witness_date: membershipData.witness_date,
          },
        ]);

      if (witnessError) throw witnessError;

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
    if (!turnstileToken) {
      const msg = "Please complete the Cloudflare security verification.";
      setErrorMsg(msg);
      speakText(msg);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const { data: existingMember, error: searchError } = await supabase
        .from("members")
        .select("id")
        .eq("icn_number", addressData.icn_number)
        .maybeSingle();

      if (searchError) throw searchError;

      if (!existingMember) {
        throw new Error(
          `No member record found for ICN: ${addressData.icn_number}. Please register via the Membership Application first.`
        );
      }

      const { error: updateError } = await supabase
        .from("members")
        .update({
          current_address: addressData.new_address,
          current_postcode: addressData.new_postcode,
          phone: addressData.phone,
          email: addressData.email,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingMember.id);

      if (updateError) throw updateError;

      const { error: historyError } = await supabase
        .from("member_address_history")
        .insert([
          {
            member_id: existingMember.id,
            icn_number: addressData.icn_number,
            previous_address: addressData.previous_address,
            previous_postcode: addressData.previous_postcode,
            new_address: addressData.new_address,
            new_postcode: addressData.new_postcode,
            changed_at: addressData.change_date,
          },
        ]);

      if (historyError) throw historyError;

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

  return (
    <div className="min-h-screen bg-sand text-earth">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-16">
        {/* Header & Mute Button Bar */}
        <div className="flex justify-between items-start mb-10">
          <div className="text-center w-full">
            <span className="text-ochre font-semibold uppercase text-xs tracking-wider">
              Online Client Services
            </span>
            <h1 className="text-4xl font-bold text-earth mt-1 mb-3">Client Forms</h1>
            <p className="text-earth/70 max-w-xl mx-auto text-sm">
              Submit membership applications or update your official address record with Pika Wiya Health Service.
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-earth/20 bg-white text-earth/80 hover:text-earth text-xs font-medium transition shadow-sm"
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
        <div className="flex justify-center gap-4 mb-8">
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
                : "bg-white text-earth/70 hover:text-earth border border-earth/10"
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
                : "bg-white text-earth/70 hover:text-earth border border-earth/10"
            }`}
          >
            <MapPin className="w-4 h-4 text-ochre" />
            Change of Address Form
          </button>
        </div>

        {/* Success Confirmation */}
        {submitted ? (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-earth/10 text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-ochre mx-auto" />
            <h2 className="text-2xl font-bold text-earth">Submission Successful</h2>
            <p className="text-earth/70 text-sm max-w-md mx-auto">
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
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-earth/10">
            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                {errorMsg}
              </div>
            )}

            {/* MEMBERSHIP FORM */}
            {activeTab === "membership" && (
              <form onSubmit={handleMembershipSubmit} className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-earth mb-1">Membership Application</h2>
                  <p className="text-xs text-earth/60">Fill in each field sequentially to unlock the form.</p>
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-earth/80 mb-1">ICN Number</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ICN-10293"
                      value={membershipData.icn_number}
                      onFocus={() => speakText("ICN Number input field")}
                      onChange={(e) => handleMembershipChange("icn_number", e.target.value)}
                      className="w-full px-3 py-2 border border-earth/20 rounded-md text-sm focus:outline-none focus:border-ochre font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-earth/80 mb-1">Surname</label>
                    <input
                      type="text"
                      required
                      disabled={!isMembershipFieldUnlocked("surname")}
                      value={membershipData.surname}
                      onFocus={() => speakText("Surname input field")}
                      onChange={(e) => handleMembershipChange("surname", e.target.value)}
                      className="w-full px-3 py-2 border border-earth/20 rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-earth/80 mb-1">First Name</label>
                    <input
                      type="text"
                      required
                      disabled={!isMembershipFieldUnlocked("first_name")}
                      value={membershipData.first_name}
                      onFocus={() => speakText("First Name input field")}
                      onChange={(e) => handleMembershipChange("first_name", e.target.value)}
                      className="w-full px-3 py-2 border border-earth/20 rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-earth/80 mb-1">Last Name</label>
                    <input
                      type="text"
                      required
                      disabled={!isMembershipFieldUnlocked("last_name")}
                      value={membershipData.last_name}
                      onFocus={() => speakText("Last Name input field")}
                      onChange={(e) => handleMembershipChange("last_name", e.target.value)}
                      className="w-full px-3 py-2 border border-earth/20 rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-earth/80 mb-1">Address</label>
                    <input
                      type="text"
                      required
                      disabled={!isMembershipFieldUnlocked("address")}
                      value={membershipData.address}
                      onFocus={() => speakText("Address input field")}
                      onChange={(e) => handleMembershipChange("address", e.target.value)}
                      className="w-full px-3 py-2 border border-earth/20 rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-earth/80 mb-1">Postcode</label>
                    <input
                      type="text"
                      required
                      disabled={!isMembershipFieldUnlocked("postcode")}
                      value={membershipData.postcode}
                      onFocus={() => speakText("Postcode input field")}
                      onChange={(e) => handleMembershipChange("postcode", e.target.value)}
                      className="w-full px-3 py-2 border border-earth/20 rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-earth/80 mb-1">Telephone Number</label>
                    <input
                      type="tel"
                      required
                      disabled={!isMembershipFieldUnlocked("phone")}
                      value={membershipData.phone}
                      onFocus={() => speakText("Telephone Number input field")}
                      onChange={(e) => handleMembershipChange("phone", e.target.value)}
                      className="w-full px-3 py-2 border border-earth/20 rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-earth/80 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      disabled={!isMembershipFieldUnlocked("email")}
                      value={membershipData.email}
                      onFocus={() => speakText("Email address input field")}
                      onChange={(e) => handleMembershipChange("email", e.target.value)}
                      className="w-full px-3 py-2 border border-earth/20 rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-earth/80 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      required
                      disabled={!isMembershipFieldUnlocked("date_of_birth")}
                      value={membershipData.date_of_birth}
                      onFocus={() => speakText("Date of Birth field")}
                      onChange={(e) => handleMembershipChange("date_of_birth", e.target.value)}
                      className="w-full px-3 py-2 border border-earth/20 rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-earth/80 mb-1">Place of Birth</label>
                    <input
                      type="text"
                      required
                      disabled={!isMembershipFieldUnlocked("place_of_birth")}
                      value={membershipData.place_of_birth}
                      onFocus={() => speakText("Place of Birth input field")}
                      onChange={(e) => handleMembershipChange("place_of_birth", e.target.value)}
                      className="w-full px-3 py-2 border border-earth/20 rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* WITNESS SECTION */}
                <div className="border-t border-earth/10 pt-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-earth">Witness Information</h3>
                    <p className="text-xs text-earth/60">Details of the witness attesting to this application.</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-earth/80 mb-1">Witness Name</label>
                      <input
                        type="text"
                        required
                        disabled={!isMembershipFieldUnlocked("witness_name")}
                        value={membershipData.witness_name}
                        onFocus={() => speakText("Witness Name input field")}
                        onChange={(e) => handleMembershipChange("witness_name", e.target.value)}
                        className="w-full px-3 py-2 border border-earth/20 rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-earth/80 mb-1">Witness Phone</label>
                      <input
                        type="tel"
                        required
                        disabled={!isMembershipFieldUnlocked("witness_phone")}
                        value={membershipData.witness_phone}
                        onFocus={() => speakText("Witness Phone input field")}
                        onChange={(e) => handleMembershipChange("witness_phone", e.target.value)}
                        className="w-full px-3 py-2 border border-earth/20 rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-earth/80 mb-1">Witness Address</label>
                      <input
                        type="text"
                        required
                        disabled={!isMembershipFieldUnlocked("witness_address")}
                        value={membershipData.witness_address}
                        onFocus={() => speakText("Witness Address input field")}
                        onChange={(e) => handleMembershipChange("witness_address", e.target.value)}
                        className="w-full px-3 py-2 border border-earth/20 rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-earth/80 mb-1">Witness Date</label>
                      <input
                        type="date"
                        required
                        disabled={!isMembershipFieldUnlocked("witness_date")}
                        value={membershipData.witness_date}
                        onFocus={() => speakText("Witness Date field")}
                        onChange={(e) => handleMembershipChange("witness_date", e.target.value)}
                        className="w-full px-3 py-2 border border-earth/20 rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                    onVerify={(token) => {
                      setTurnstileToken(token);
                      speakText("Security verification complete.");
                    }}
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
                  <h2 className="text-2xl font-bold text-earth mb-1">Change of Address Form</h2>
                  <p className="text-xs text-earth/60">Fill in each field sequentially to unlock the form.</p>
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-earth/80 mb-1">ICN Number</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ICN-10293"
                      value={addressData.icn_number}
                      onFocus={() => speakText("ICN Number input field")}
                      onChange={(e) => handleAddressChange("icn_number", e.target.value)}
                      className="w-full px-3 py-2 border border-earth/20 rounded-md text-sm focus:outline-none focus:border-ochre font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-earth/80 mb-1">Surname</label>
                    <input
                      type="text"
                      required
                      disabled={!isAddressFieldUnlocked("surname")}
                      value={addressData.surname}
                      onFocus={() => speakText("Surname input field")}
                      onChange={(e) => handleAddressChange("surname", e.target.value)}
                      className="w-full px-3 py-2 border border-earth/20 rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-earth/80 mb-1">First Name</label>
                    <input
                      type="text"
                      required
                      disabled={!isAddressFieldUnlocked("first_name")}
                      value={addressData.first_name}
                      onFocus={() => speakText("First Name input field")}
                      onChange={(e) => handleAddressChange("first_name", e.target.value)}
                      className="w-full px-3 py-2 border border-earth/20 rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-earth/80 mb-1">Last Name</label>
                    <input
                      type="text"
                      required
                      disabled={!isAddressFieldUnlocked("last_name")}
                      value={addressData.last_name}
                      onFocus={() => speakText("Last Name input field")}
                      onChange={(e) => handleAddressChange("last_name", e.target.value)}
                      className="w-full px-3 py-2 border border-earth/20 rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-earth/80 mb-1">Previous Address</label>
                    <input
                      type="text"
                      required
                      disabled={!isAddressFieldUnlocked("previous_address")}
                      value={addressData.previous_address}
                      onFocus={() => speakText("Previous Address input field")}
                      onChange={(e) => handleAddressChange("previous_address", e.target.value)}
                      className="w-full px-3 py-2 border border-earth/20 rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-earth/80 mb-1">Previous Postcode</label>
                    <input
                      type="text"
                      required
                      disabled={!isAddressFieldUnlocked("previous_postcode")}
                      value={addressData.previous_postcode}
                      onFocus={() => speakText("Previous Postcode input field")}
                      onChange={(e) => handleAddressChange("previous_postcode", e.target.value)}
                      className="w-full px-3 py-2 border border-earth/20 rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-earth/80 mb-1">New Address</label>
                    <input
                      type="text"
                      required
                      disabled={!isAddressFieldUnlocked("new_address")}
                      value={addressData.new_address}
                      onFocus={() => speakText("New Address input field")}
                      onChange={(e) => handleAddressChange("new_address", e.target.value)}
                      className="w-full px-3 py-2 border border-earth/20 rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-earth/80 mb-1">New Postcode</label>
                    <input
                      type="text"
                      required
                      disabled={!isAddressFieldUnlocked("new_postcode")}
                      value={addressData.new_postcode}
                      onFocus={() => speakText("New Postcode input field")}
                      onChange={(e) => handleAddressChange("new_postcode", e.target.value)}
                      className="w-full px-3 py-2 border border-earth/20 rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-earth/80 mb-1">Telephone Number</label>
                    <input
                      type="tel"
                      required
                      disabled={!isAddressFieldUnlocked("phone")}
                      value={addressData.phone}
                      onFocus={() => speakText("Telephone Number input field")}
                      onChange={(e) => handleAddressChange("phone", e.target.value)}
                      className="w-full px-3 py-2 border border-earth/20 rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-earth/80 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      disabled={!isAddressFieldUnlocked("email")}
                      value={addressData.email}
                      onFocus={() => speakText("Email address input field")}
                      onChange={(e) => handleAddressChange("email", e.target.value)}
                      className="w-full px-3 py-2 border border-earth/20 rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-earth/80 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      required
                      disabled={!isAddressFieldUnlocked("date_of_birth")}
                      value={addressData.date_of_birth}
                      onFocus={() => speakText("Date of Birth field")}
                      onChange={(e) => handleAddressChange("date_of_birth", e.target.value)}
                      className="w-full px-3 py-2 border border-earth/20 rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-earth/80 mb-1">Place of Birth</label>
                    <input
                      type="text"
                      required
                      disabled={!isAddressFieldUnlocked("place_of_birth")}
                      value={addressData.place_of_birth}
                      onFocus={() => speakText("Place of Birth input field")}
                      onChange={(e) => handleAddressChange("place_of_birth", e.target.value)}
                      className="w-full px-3 py-2 border border-earth/20 rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-earth/80 mb-1">Date of Update</label>
                    <input
                      type="date"
                      required
                      disabled={!isAddressFieldUnlocked("change_date")}
                      value={addressData.change_date}
                      onFocus={() => speakText("Date of Update field")}
                      onChange={(e) => handleAddressChange("change_date", e.target.value)}
                      className="w-full px-3 py-2 border border-earth/20 rounded-md text-sm focus:outline-none focus:border-ochre disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                    onVerify={(token) => {
                      setTurnstileToken(token);
                      speakText("Security verification complete.");
                    }}
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
          </div>
        )}
      </main>
    </div>
  );
}