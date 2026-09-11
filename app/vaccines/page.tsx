import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTitle from "@/components/PageTitle";
import PatternField from "@/components/PatternField";
import { Briefcase, Mail, HeartHandshake, CheckCircle2 } from "lucide-react";

export default function CareersPage() {
  return (
    <div className="relative min-h-screen bg-page text-ink overflow-hidden">
      <PatternField variant="inward" logoMotion="glow" logoPlacement="tr" />
      <Navbar />

      <main className="relative z-10 max-w-4xl mx-auto px-4 py-16 space-y-10">
        {/* Header Section */}
        <div className="space-y-3 text-center max-w-2xl mx-auto">
          <span className="text-ochre font-semibold uppercase text-xs tracking-wider flex items-center justify-center gap-1.5">
            <Briefcase className="w-4 h-4" /> Join Our Team
          </span>
          <PageTitle className="text-4xl md:text-5xl font-bold tracking-tight">
            Vaccinations and Immunisations
          </PageTitle>
          <p className="text-ink/70 text-base md:text-lg">
            Work alongside dedicated healthcare professionals delivering culturally safe care in South Australia.
          </p>
        </div>

        {/* Current Vacancies Status Card */}
        <div className="bg-surface p-8 md:p-10 rounded-3xl border border-border shadow-sm space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-page text-ink/80 text-xs font-medium border border-border">
              <span className="w-2 h-2 rounded-full bg-ochre" />
              Current Status: No Active Advertised Vacancies
            </div>

            <p className="text-ink/80 text-base md:text-lg leading-relaxed">
              We currently have no vacancies advertised, but we are always on the lookout for passionate and dedicated people who share our commitment to improving the health and wellbeing of Aboriginal communities.
            </p>
          </div>

          <div className="border-t border-border pt-8 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-ink flex items-center gap-2">
                <HeartHandshake className="w-6 h-6 text-ochre" />
                Submit an Expression of Interest
              </h2>
              <p className="text-ink/70 text-sm leading-relaxed">
                If you believe you have the skills, values and drive to contribute to our team, we’d love to hear from you. You are welcome to submit an expression of interest by emailing a brief cover letter and your resume to:
              </p>
            </div>

            {/* Email Contact CTA Card */}
            <div className="bg-page p-6 rounded-2xl border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-ochre/10 text-ochre flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-ink/60 font-medium">Send applications to</p>
                  <a
                    href="mailto:generalenquiries@pikawiyahealth.org.au"
                    className="text-ink font-bold text-base hover:text-ochre transition"
                  >
                    generalenquiries@pikawiyahealth.org.au
                  </a>
                </div>
              </div>

              <a
                href="mailto:generalenquiries@pikawiyahealth.org.au?subject=Expression%20of%20Interest%20-%20Careers"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-ochre hover:bg-ochre-dark text-white font-semibold rounded-xl text-sm transition shadow-sm hover:shadow text-center shrink-0"
              >
                Email Resume
              </a>
            </div>

            <p className="text-ink/70 text-sm leading-relaxed italic">
              We will keep your details on file and be in touch should a suitable opportunity arise. Thank you for your interest in joining the Pika Wiya Health Service Aboriginal Corporation team, we look forward to hearing from you.
            </p>
          </div>
        </div>
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}