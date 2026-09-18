import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTitle from "@/components/PageTitle";
import CulturalPattern from "@/components/CulturalPattern";
import PageHero from "@/components/PageHero";
import PartnersTicker from "@/components/PartnersTicker";
import FramerMouseGradient from "@/components/FramerMouseGradient";
import { Briefcase } from "lucide-react";


export default function NewsPage() {
  return (
    <div className="flex flex-col relative min-h-screen bg-navy text-ink overflow-hidden">
      
    
      <FramerMouseGradient/>
      <Navbar />
      
      <div 
          className="absolute inset-[0%] z-0 opacity-20 pointer-events-none animate-drift"
          style={{ 
            backgroundImage: "url('/assets/background-pattern-new1.png')",
            backgroundSize: "contain",
            opacity: 0.15,
            filter: "brightness(0) saturate(100%) invert(47%) sepia(2%) saturate(210%) hue-rotate(349deg) brightness(93%) contrast(82%)"
          }}
        />
      <div className="flex-1 relative z-10 max-w-5xl mx-auto px-4 py-16">
        <div className="space-y-3 text-center max-w-2xl mx-auto">
          <span className="text-ochre font-semibold uppercase text-xs tracking-wider flex items-center justify-center gap-1.5">
            <Briefcase className="w-4 h-4" /> Healthcare Services
          </span>
          <PageTitle className="text-4xl md:text-5xl font-bold tracking-tight">
            News & Community Announcements
          </PageTitle>
          <p className="text-white/70 text-base md:text-lg">
            News & Community Announcements
          </p>
        </div>
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