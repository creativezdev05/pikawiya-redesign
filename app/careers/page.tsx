import Navbar from "@/components/Navbar";

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-sand text-earth">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-4">Join Our Team</h1>
        <p className="text-earth/70 mb-12">
          Explore rewarding opportunities to work alongside dedicated healthcare professionals delivering culturally safe care in South Australia.
        </p>

        <div className="bg-white p-8 rounded-xl border border-earth/10 shadow-sm">
          <h2 className="text-2xl font-bold text-earth mb-4">Current Opportunities</h2>
          <p className="text-earth/70 text-sm mb-6">
            We regularly hire Aboriginal Health Workers, Registered Nurses, General Practitioners, and Administrative staff.
          </p>
          <a
            href="mailto:careers@pikawiyahealth.org.au"
            className="inline-block px-6 py-3 bg-ochre hover:bg-ochre-dark text-white font-medium rounded-md text-sm transition"
          >
            Email Expression of Interest
          </a>
        </div>
      </div>
    </div>
  );
}