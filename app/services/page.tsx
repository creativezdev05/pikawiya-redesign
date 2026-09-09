import Navbar from "@/components/Navbar";

const serviceDetails = [
  { title: "Clinical & Health Care", desc: "General Practitioner clinics, health assessments, chronic disease management, and nursing care." },
  { title: "Family & Maternal Support", desc: "Antenatal care, maternal child health, immunizations, and early parenting guidance." },
  { title: "Women's & Men's Health", desc: "Specialized screenings, preventative care, and health education tailored for men and women." },
  { title: "Youth Programs", desc: "School-based health checks, active youth engagement, physical health, and leadership initiatives." },
  { title: "Cultural Support & Elders Care", desc: "Culturally safe support delivered in partnership with community Elders and traditional healers." },
  { title: "Social & Emotional Wellbeing", desc: "Mental health counseling, trauma-informed support, substance use intervention, and group therapy." },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-sand text-earth">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-4 text-earth">Our Health Services</h1>
        <p className="text-lg text-earth/70 max-w-3xl mb-12">
          Pika Wiya Health Service provides comprehensive, culturally responsive healthcare tailored to meet the physical, mental, and cultural needs of our community.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceDetails.map((service, i) => (
            <div key={i} className="bg-white p-8 rounded-xl shadow-sm border border-earth/10">
              <h2 className="text-xl font-bold mb-3 text-ochre">{service.title}</h2>
              <p className="text-earth/70 text-sm leading-relaxed">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}