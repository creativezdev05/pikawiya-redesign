"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabaseClient";
import { CheckCircle2, UserPlus, MapPin } from "lucide-react";

export default function FormsPage() {
  const [activeTab, setActiveTab] = useState<"membership" | "address">("membership");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

    // 1. Handle Membership Application (Checks for unique ICN and creates record)
    const handleMembershipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
        // Check if ICN already exists
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

        // Insert new member
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

        // Insert witness details
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

        setSubmitted(true);
    } catch (err) {
        const error = err as Error;
        setErrorMsg(error.message || "Failed to submit membership application.");
    } finally {
        setIsSubmitting(false);
    }
    };

    // 2. Handle Change of Address (Only allowed if ICN exists)
    const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
        // Verify ICN exists in members table
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

        // Update current address on main member profile
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

        // Log update in member_address_history
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

        setSubmitted(true);
    } catch (err) {
        const error = err as Error;
        setErrorMsg(error.message || "Failed to record change of address.");
    } finally {
        setIsSubmitting(false);
    }
    };

  return (
    <div className="min-h-screen bg-sand text-earth">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <span className="text-ochre font-semibold uppercase text-xs tracking-wider">
            Online Client Services
          </span>
          <h1 className="text-4xl font-bold text-earth mt-1 mb-3">Client Forms</h1>
          <p className="text-earth/70 max-w-xl mx-auto text-sm">
            Submit membership applications or update your official address record with Pika Wiya Health Service.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => { setActiveTab("membership"); setSubmitted(false); setErrorMsg(null); }}
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
            onClick={() => { setActiveTab("address"); setSubmitted(false); setErrorMsg(null); }}
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
              onClick={() => setSubmitted(false)}
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
                  <p className="text-xs text-earth/60">Provide your ICN and personal details to apply or refresh membership.</p>
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-earth/80 mb-1">ICN Number</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ICN-10293"
                      value={membershipData.icn_number}
                      onChange={(e) => setMembershipData({ ...membershipData, icn_number: e.target.value })}
                      className="w-full px-3 py-2 border border-earth/20 rounded-md text-sm focus:outline-none focus:border-ochre font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-earth/80 mb-1">Surname</label>
                    <input
                      type="text"
                      required
                      value={membershipData.surname}
                      onChange={(e) => setMembershipData({ ...membershipData, surname: e.target.value })}
                      className="w-full px-3 py-2 border border-earth/20 rounded-md text-sm focus:outline-none focus:border-ochre"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-earth/80 mb-1">First Name</label>
                    <input
                      type="text"
                      required
                      value={membershipData.first_name}
                      onChange={(e) => setMembershipData({ ...membershipData, first_name: e.target.value })}
                      className="w-full px-3 py-2 border border-earth/20 rounded-md text-sm focus:outline-none focus:border-ochre"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-earth/80 mb-1">Last Name</label>
                    <input
                      type="text"
                      required
                      value={membershipData.last_name}
                      onChange={(e) => setMembershipData({ ...membershipData, last_name: e.target.value })}
                      className="w-full px-3 py-2 border border-earth/20 rounded-md text-sm focus:outline-none focus:border-ochre"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-earth/80 mb-1">Address</label>
                    <input
                      type="text"
                      required
                      value={membershipData.address}
                      onChange={(e) => setMembershipData({ ...membershipData, address: e.target.value })}
                      className="w-full px-3 py-2 border border-earth/20 rounded-md text-sm focus:outline-none focus:border-ochre"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-earth/80 mb-1">Postcode</label>
                    <input
                      type="text"
                      required
                      value={membershipData.postcode}
                      onChange={(e) => setMembershipData({ ...membershipData, postcode: e.target.value })}
                      className="w-full px-3 py-2 border border-earth/20 rounded-md text-sm focus:outline-none focus:border-ochre"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-earth/80 mb-1">Telephone Number</label>
                    <input
                      type="tel"
                      required
                      value={membershipData.phone}
                      onChange={(e) => setMembershipData({ ...membershipData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-earth/20 rounded-md text-sm focus:outline-none focus:border-ochre"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-earth/80 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={membershipData.email}
                      onChange={(e) => setMembershipData({ ...membershipData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-earth/20 rounded-md text-sm focus:outline-none focus:border-ochre"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-earth/80 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      required
                      value={membershipData.date_of_birth}
                      onChange={(e) => setMembershipData({ ...membershipData, date_of_birth: e.target.value })}
                      className="w-full px-3 py-2 border border-earth/20 rounded-md text-sm focus:outline-none focus:border-ochre"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-earth/80 mb-1">Place of Birth</label>
                    <input
                      type="text"
                      required
                      value={membershipData.place_of_birth}
                      onChange={(e) => setMembershipData({ ...membershipData, place_of_birth: e.target.value })}
                      className="w-full px-3 py-2 border border-earth/20 rounded-md text-sm focus:outline-none focus:border-ochre"
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
                        value={membershipData.witness_name}
                        onChange={(e) => setMembershipData({ ...membershipData, witness_name: e.target.value })}
                        className="w-full px-3 py-2 border border-earth/20 rounded-md text-sm focus:outline-none focus:border-ochre"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-earth/80 mb-1">Witness Phone</label>
                      <input
                        type="tel"
                        required
                        value={membershipData.witness_phone}
                        onChange={(e) => setMembershipData({ ...membershipData, witness_phone: e.target.value })}
                        className="w-full px-3 py-2 border border-earth/20 rounded-md text-sm focus:outline-none focus:border-ochre"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-earth/80 mb-1">Witness Address</label>
                      <input
                        type="text"
                        required
                        value={membershipData.witness_address}
                        onChange={(e) => setMembershipData({ ...membershipData, witness_address: e.target.value })}
                        className="w-full px-3 py-2 border border-earth/20 rounded-md text-sm focus:outline-none focus:border-ochre"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-earth/80 mb-1">Witness Date</label>
                      <input
                        type="date"
                        required
                        value={membershipData.witness_date}
                        onChange={(e) => setMembershipData({ ...membershipData, witness_date: e.target.value })}
                        className="w-full px-3 py-2 border border-earth/20 rounded-md text-sm focus:outline-none focus:border-ochre"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-ochre hover:bg-ochre-dark text-white font-semibold rounded-md transition shadow-sm text-sm"
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
                  <p className="text-xs text-earth/60">Enter your ICN to log your address update.</p>
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-earth/80 mb-1">ICN Number</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ICN-10293"
                      value={addressData.icn_number}
                      onChange={(e) => setAddressData({ ...addressData, icn_number: e.target.value })}
                      className="w-full px-3 py-2 border border-earth/20 rounded-md text-sm focus:outline-none focus:border-ochre font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-earth/80 mb-1">Surname</label>
                    <input
                      type="text"
                      required
                      value={addressData.surname}
                      onChange={(e) => setAddressData({ ...addressData, surname: e.target.value })}
                      className="w-full px-3 py-2 border border-earth/20 rounded-md text-sm focus:outline-none focus:border-ochre"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-earth/80 mb-1">First Name</label>
                    <input
                      type="text"
                      required
                      value={addressData.first_name}
                      onChange={(e) => setAddressData({ ...addressData, first_name: e.target.value })}
                      className="w-full px-3 py-2 border border-earth/20 rounded-md text-sm focus:outline-none focus:border-ochre"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-earth/80 mb-1">Last Name</label>
                    <input
                      type="text"
                      required
                      value={addressData.last_name}
                      onChange={(e) => setAddressData({ ...addressData, last_name: e.target.value })}
                      className="w-full px-3 py-2 border border-earth/20 rounded-md text-sm focus:outline-none focus:border-ochre"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-earth/80 mb-1">Previous Address</label>
                    <input
                      type="text"
                      required
                      value={addressData.previous_address}
                      onChange={(e) => setAddressData({ ...addressData, previous_address: e.target.value })}
                      className="w-full px-3 py-2 border border-earth/20 rounded-md text-sm focus:outline-none focus:border-ochre"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-earth/80 mb-1">Previous Postcode</label>
                    <input
                      type="text"
                      required
                      value={addressData.previous_postcode}
                      onChange={(e) => setAddressData({ ...addressData, previous_postcode: e.target.value })}
                      className="w-full px-3 py-2 border border-earth/20 rounded-md text-sm focus:outline-none focus:border-ochre"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-earth/80 mb-1">New Address</label>
                    <input
                      type="text"
                      required
                      value={addressData.new_address}
                      onChange={(e) => setAddressData({ ...addressData, new_address: e.target.value })}
                      className="w-full px-3 py-2 border border-earth/20 rounded-md text-sm focus:outline-none focus:border-ochre"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-earth/80 mb-1">New Postcode</label>
                    <input
                      type="text"
                      required
                      value={addressData.new_postcode}
                      onChange={(e) => setAddressData({ ...addressData, new_postcode: e.target.value })}
                      className="w-full px-3 py-2 border border-earth/20 rounded-md text-sm focus:outline-none focus:border-ochre"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-earth/80 mb-1">Telephone Number</label>
                    <input
                      type="tel"
                      required
                      value={addressData.phone}
                      onChange={(e) => setAddressData({ ...addressData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-earth/20 rounded-md text-sm focus:outline-none focus:border-ochre"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-earth/80 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={addressData.email}
                      onChange={(e) => setAddressData({ ...addressData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-earth/20 rounded-md text-sm focus:outline-none focus:border-ochre"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-earth/80 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      required
                      value={addressData.date_of_birth}
                      onChange={(e) => setAddressData({ ...addressData, date_of_birth: e.target.value })}
                      className="w-full px-3 py-2 border border-earth/20 rounded-md text-sm focus:outline-none focus:border-ochre"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-earth/80 mb-1">Place of Birth</label>
                    <input
                      type="text"
                      required
                      value={addressData.place_of_birth}
                      onChange={(e) => setAddressData({ ...addressData, place_of_birth: e.target.value })}
                      className="w-full px-3 py-2 border border-earth/20 rounded-md text-sm focus:outline-none focus:border-ochre"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-earth/80 mb-1">Date of Update</label>
                    <input
                      type="date"
                      required
                      value={addressData.change_date}
                      onChange={(e) => setAddressData({ ...addressData, change_date: e.target.value })}
                      className="w-full px-3 py-2 border border-earth/20 rounded-md text-sm focus:outline-none focus:border-ochre"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-ochre hover:bg-ochre-dark text-white font-semibold rounded-md transition shadow-sm text-sm"
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