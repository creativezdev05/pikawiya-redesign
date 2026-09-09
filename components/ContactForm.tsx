"use client";

import { useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

// Initialize client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // States for sequential field tracking
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [serviceType, setServiceType] = useState("General Health Care");
  const [message, setMessage] = useState("");

  // Sound Control States
  const [isMuted, setIsMuted] = useState(false);
  
  // Track whether the audio instruction has already been played for each field
  const playedFieldsRef = useRef({
    fullName: false,
    phone: false,
    email: false,
    serviceType: false,
    message: false,
  });

  // Native text-to-speech engine
  const speakInstruction = (fieldName: keyof typeof playedFieldsRef.current, text: string) => {
    if (isMuted) return;
    
    // Check if it already played once for this field
    if (playedFieldsRef.current[fieldName]) return;

    if (typeof window !== "undefined" && window.speechSynthesis) {
      // Cancel any ongoing speech so they don't overlap
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0; // Normal speaking pace
      
      // Mark as played so it never runs again during this session
      playedFieldsRef.current[fieldName] = true;
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const payload = {
      full_name: fullName,
      email: email,
      phone: phone,
      service_type: serviceType,
      message: message,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("enquiries").insert([payload]);

    setLoading(false);
    if (error) {
      setStatus({ type: "error", message: "Failed to send message. Please try again or call the clinic." });
    } else {
      setStatus({ type: "success", message: "Thank you. Your message has been received successfully." });
      setFullName("");
      setPhone("");
      setEmail("");
      setServiceType("General Health Care");
      setMessage("");
      // Reset played tracking flags for a fresh submission
      playedFieldsRef.current = {
        fullName: false,
        phone: false,
        email: false,
        serviceType: false,
        message: false,
      };
    }
  };

  const isPhoneDisabled = !fullName.trim();
  const isEmailDisabled = isPhoneDisabled || !phone.trim();
  const isServiceDisabled = isEmailDisabled || !email.trim();
  const isMessageDisabled = isServiceDisabled || !serviceType;

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {/* Mute/Unmute Toggle Controller Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            setIsMuted(!isMuted);
            if (!isMuted && typeof window !== "undefined") {
              window.speechSynthesis.cancel(); // Stop talking instantly when muting
            }
          }}
          className={`px-3 py-1.5 rounded text-xs font-medium border transition ${
            isMuted 
              ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100" 
              : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
          }`}
        >
          {isMuted ? "🔇 Voice Guidance: Off" : "🔊 Voice Guidance: On"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {status && (
          <div
            className={`p-4 rounded-md text-sm ${
              status.type === "success" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {status.message}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* 1. Full Name */}
          <div>
            <label className="block text-xs font-semibold text-earth uppercase mb-2">Full Name</label>
            <input
              required
              type="text"
              name="fullName"
              value={fullName}
              onFocus={() => speakInstruction("fullName", "Please enter your name")}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 rounded-md border border-earth/20 focus:outline-none focus:border-ochre"
            />
          </div>
          
          {/* 2. Phone Number */}
          <div>
            <label className={`block text-xs font-semibold uppercase mb-2 ${isPhoneDisabled ? "text-gray-400" : "text-earth"}`}>
              Phone Number
            </label>
            <input
              required
              type="tel"
              name="phone"
              value={phone}
              onFocus={() => speakInstruction("phone", "Please enter your phone number")}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isPhoneDisabled}
              className="w-full px-4 py-3 rounded-md border border-earth/20 focus:outline-none focus:border-ochre disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 3. Email Address */}
          <div>
            <label className={`block text-xs font-semibold uppercase mb-2 ${isEmailDisabled ? "text-gray-400" : "text-earth"}`}>
              Email Address
            </label>
            <input
              required
              type="email"
              name="email"
              value={email}
              onFocus={() => speakInstruction("email", "Please enter your email address")}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isEmailDisabled}
              className="w-full px-4 py-3 rounded-md border border-earth/20 focus:outline-none focus:border-ochre disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {/* 4. Service Required */}
          <div>
            <label className={`block text-xs font-semibold uppercase mb-2 ${isServiceDisabled ? "text-gray-400" : "text-earth"}`}>
              Service Required
            </label>
            <select
              name="serviceType"
              value={serviceType}
              onFocus={() => speakInstruction("serviceType", "Please select a required service")}
              onChange={(e) => setServiceType(e.target.value)}
              disabled={isServiceDisabled}
              className="w-full px-4 py-3 rounded-md border border-earth/20 focus:outline-none focus:border-ochre bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="General Health Care">General Health Care</option>
              <option value="Family Support">Family Support</option>
              <option value="Women&apos;s Health">Women&apos;s Health</option>
              <option value="Youth Programs">Youth Programs</option>
              <option value="Cultural Support">Cultural Support</option>
              <option value="Wellbeing">Wellbeing</option>
            </select>
          </div>
        </div>

        {/* 5. Message */}
        <div>
          <label className={`block text-xs font-semibold uppercase mb-2 ${isMessageDisabled ? "text-gray-400" : "text-earth"}`}>
            Message
          </label>
          <textarea
            required
            name="message"
            rows={4}
            value={message}
            onFocus={() => speakInstruction("message", "Please enter your message")}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isMessageDisabled}
            className="w-full px-4 py-3 rounded-md border border-earth/20 focus:outline-none focus:border-ochre disabled:bg-gray-100 disabled:cursor-not-allowed"
          ></textarea>
        </div>

        <button
          disabled={loading || !message.trim()}
          type="submit"
          className="w-full py-4 bg-ochre hover:bg-ochre-dark font-bold rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Submitting..." : "Submit Enquiry"}
        </button>
      </form>
    </div>
  );
}
