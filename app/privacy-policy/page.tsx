import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShieldCheck, Mail, Phone, Lock, Eye, FileText } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-sand text-earth flex flex-col justify-between">
      <div>
        <Navbar />

        <main className="max-w-4xl mx-auto px-4 py-12 md:py-16 space-y-10">
          {/* Page Header */}
          <div className="space-y-4">
            <span className="text-ochre font-semibold uppercase text-xs tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Confidentiality & Legal
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-earth tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-earth/70 text-base md:text-lg leading-relaxed">
              Pika Wiya Health Service Aboriginal Corporation is committed to protecting your privacy and managing your health information in accordance with the Privacy Act 1988 (Cth) and Australian Privacy Principles (APPs).
            </p>
          </div>

          {/* Privacy Content Container */}
          <div className="bg-white p-8 md:p-12 rounded-3xl border border-earth/10 shadow-sm space-y-8">
            
            {/* Section 1 */}
            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-earth flex items-center gap-2">
                <FileText className="w-5 h-5 text-ochre" />
                Collection of Personal Information
              </h2>
              <p className="text-earth/80 text-sm md:text-base leading-relaxed">
                We collect personal and sensitive health information necessary to provide you with high-quality primary health care, community wellness programs, and social support. This includes your contact details, demographic information, Medicare number, medical history, clinical notes, and treatment records.
              </p>
            </section>

            <hr className="border-earth/10" />

            {/* Section 2 */}
            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-earth flex items-center gap-2">
                <Eye className="w-5 h-5 text-ochre" />
                How We Use Your Information
              </h2>
              <p className="text-earth/80 text-sm md:text-base leading-relaxed">
                Your personal and health information is strictly used for clinical care, diagnostic referrals, pathology requests, continuity of care across visiting specialists, and administrative clinic operations. We will not disclose your personal details to third parties without your written or explicit verbal consent, except where required by law.
              </p>
            </section>

            <hr className="border-earth/10" />

            {/* Section 3 */}
            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-earth flex items-center gap-2">
                <Lock className="w-5 h-5 text-ochre" />
                Data Security & Storage
              </h2>
              <p className="text-earth/80 text-sm md:text-base leading-relaxed">
                Pika Wiya Health Service employs strict technical, physical, and administrative measures to secure your records against unauthorised access, misuse, loss, or disclosure. Clinical data is stored within encrypted medical record management systems accessible only by authorised healthcare professionals.
              </p>
            </section>

            <hr className="border-earth/10" />

            {/* Section 4 */}
            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-earth flex items-center gap-2">
                Access & Correction of Records
              </h2>
              <p className="text-earth/80 text-sm md:text-base leading-relaxed">
                You have the right to request access to the health records we hold about you, or to request corrections if you believe the information is inaccurate or outdated. Please contact our reception staff or Privacy Officer to submit a request.
              </p>
            </section>

            <hr className="border-earth/10" />

            {/* Section 5: Contact Box */}
            <section className="bg-sand/40 p-6 rounded-2xl border border-earth/10 space-y-4">
              <h3 className="text-lg font-bold text-earth">
                Privacy Enquiries & Complaints
              </h3>
              <p className="text-earth/80 text-sm leading-relaxed">
                If you have questions about our privacy practices or wish to lodge a privacy enquiry, please get in touch with our administrative team:
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <a
                  href="mailto:generalenquiries@pikawiyahealth.org.au"
                  className="inline-flex items-center gap-2 text-earth font-semibold text-sm hover:text-ochre transition"
                >
                  <Mail className="w-4 h-4 text-ochre" />
                  generalenquiries@pikawiyahealth.org.au
                </a>
                <a
                  href="tel:0886429900"
                  className="inline-flex items-center gap-2 text-earth font-semibold text-sm hover:text-ochre transition"
                >
                  <Phone className="w-4 h-4 text-ochre" />
                  (08) 8642 9900
                </a>
              </div>
            </section>

          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}