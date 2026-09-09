import Navbar from "@/components/Navbar";

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-sand text-earth">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-4">News & Community Announcements</h1>
        <p className="text-earth/70 mb-12">
          Stay updated on community health notices, upcoming vaccination clinics, events, and health alerts.
        </p>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-earth/10 shadow-sm">
            <span className="text-xs font-semibold text-ochre uppercase">Community Notice</span>
            <h2 className="text-2xl font-bold mt-1 mb-2">Seasonal Health Checks & Vaccine Clinics</h2>
            <p className="text-earth/70 text-sm">
              Pika Wiya is encouraging all community members to drop in for annual health assessments and influenza vaccines. Contact reception to schedule your visit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}