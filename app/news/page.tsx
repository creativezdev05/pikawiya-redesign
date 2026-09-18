import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTitle from "@/components/PageTitle";
import CulturalPattern from "@/components/CulturalPattern";
import PageHero from "@/components/PageHero";
import PartnersTicker from "@/components/PartnersTicker";
import FramerMouseGradient from "@/components/FramerMouseGradient";

export default function NewsPage() {
  return (
    <div className="flex flex-col relative min-h-screen bg-page text-ink overflow-hidden">
      
    
      <FramerMouseGradient/>
      <Navbar />
      <PageHero
        eyebrow="Healthcare Services"
        title="News & Community Announcements"
        description="Stay updated on community health notices, upcoming vaccination clinics, events, and health alerts."
        imageSrc="/assets/news-ann.png"
        imageAlt="Aboriginal flowing country dot painting"
        pageName="news"
      />
      <div 
          className="absolute inset-[-20%] z-0 opacity-20 pointer-events-none animate-drift"
          style={{ 
            backgroundImage: "url('/assets/background-pattern.png')",
            backgroundSize: "contain",
            filter: "brightness(0) saturate(100%) invert(47%) sepia(2%) saturate(210%) hue-rotate(349deg) brightness(93%) contrast(82%)"
          }}
        />
      <div className="flex-1 relative z-10 max-w-5xl mx-auto px-4 py-16">
        
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
        <PartnersTicker />
        <Footer />
      </div>
    </div>
  );
}