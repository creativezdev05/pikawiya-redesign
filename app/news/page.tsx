import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTitle from "@/components/PageTitle";
import PatternField from "@/components/PatternField";

export default function NewsPage() {
  return (
    <div className="relative min-h-screen bg-page text-ink overflow-hidden">
      <PatternField variant="rise" logoMotion="bob" logoPlacement="tl" />
      <Navbar />
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-16">
        <PageTitle className="text-4xl font-bold mb-4">
          News & Community Announcements
        </PageTitle>
        <p className="text-ink/70 mb-12">
          Stay updated on community health notices, upcoming vaccination clinics, events, and health alerts.
        </p>

        <div className="space-y-6">
          <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
            <span className="text-xs font-semibold text-ochre uppercase">Community Notice</span>
            <h2 className="text-2xl font-bold mt-1 mb-2">Seasonal Health Checks & Vaccine Clinics</h2>
            <p className="text-ink/70 text-sm">
              Pika Wiya is encouraging all community members to drop in for annual health assessments and influenza vaccines. Contact reception to schedule your visit.
            </p>
          </div>
        </div>
      </div>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}