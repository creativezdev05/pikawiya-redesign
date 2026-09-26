import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTitle from "@/components/PageTitle";
import CulturalPattern from "@/components/CulturalPattern";
import PageHero from "@/components/PageHero";
import PartnersTicker from "@/components/PartnersTicker";
import FramerMouseGradient from "@/components/FramerMouseGradient";
import { Briefcase } from "lucide-react";
import NextImage from "next/image";
import NewsGrid from "@/components/NewsGrid"; // Import the new grid component

export const CORNER_DOTS = [{ x: "100%", y: "0%", rings: 7, startR: 26, gap: 22, speed: 60 }];

export default function NewsPage() {
  return (
    <div className="flex flex-col relative min-h-screen  text-ink overflow-hidden">
      
    
      <FramerMouseGradient/>
      <Navbar />
      {/* Page background: fixed to the viewport so it sits behind the whole page while scrolling */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        <NextImage
          src="/assets/home/main_page_2nd_bg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      <div 
          className="absolute inset-[0%] z-0 opacity-20 pointer-events-none animate-drift"
          style={{ 
            backgroundImage: "url('/assets/background-pattern-new1.png')",
            backgroundSize: "contain",
            opacity: 0.15,
            filter: "brightness(0) saturate(100%) invert(96%) sepia(94%) saturate(122%) hue-rotate(32deg) brightness(116%) contrast(98%)"
          }}
        />
      {/* Full-width header with background image */}
      <section className="relative z-10 w-full px-4 py-20 md:py-28">
        {/* Corner dot arc — above the bloom, behind the copy and deck */}
        <CulturalPattern variant="about" fit="fill" className="z-[3]" dotsConfig={CORNER_DOTS} />
        <div className="absolute inset-0 -z-10">
          <NextImage
            src="/assets/news_bg_top.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-top opacity-90"
          />
        </div>
        <div className="space-y-3 text-center max-w-2xl mx-auto">
          <span className="text-ochre font-semibold uppercase text-xs tracking-wider flex items-center justify-center gap-1.5">
            <Briefcase className="w-4 h-4" /> Healthcare Services
          </span>
          <PageTitle className="text-4xl md:text-7xl font-bold tracking-tight">
            News & Community Announcements
          </PageTitle>
          <p className="text-white/70 text-base md:text-lg">
            News & Community Announcements
          </p>
        </div>
      </section>
      <div className="flex-1 relative z-10 w-full max-w-5xl mx-auto px-4 py-16">
        
        <div className="space-y-6 pb-6">
          <div className="relative isolate overflow-hidden rounded-2xl p-6 md:p-8 pr-28 md:pr-56 md:min-h-56.25 flex flex-col justify-center">
            {/* Banner artwork already includes the card's rounded corners, border and shadow */}
            <NextImage
              src="/assets/home/banner-bg.png"
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 992px"
              className="object-fill -z-10"
            />
            <span className="text-xs font-semibold text-ochre uppercase">Community Notice</span>
            <h2 className="text-2xl font-bold mt-1 mb-2 text-neutral-900">Seasonal Health Checks & Vaccine Clinics</h2>
            <p className="text-neutral-600 text-sm">
              Pika Wiya is encouraging all community members to drop in for annual health assessments and influenza vaccines. Contact reception to schedule your visit.
            </p>
          </div>
        </div>
        {/* Dynamic Posts Grid from Supabase */}
        <NewsGrid />
      </div>
      <div className="relative z-10">
        <PartnersTicker />
        <Footer />
      </div>
    </div>
  );
}