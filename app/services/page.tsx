import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import PatternField from "@/components/PatternField";
import { supabase, ServiceCategory } from "@/lib/supabaseClient";
import PartnersTicker from "@/components/PartnersTicker";
import FramerMouseGradient from "@/components/FramerMouseGradient";
import CulturalPattern from "@/components/CulturalPattern";
import PageTitle from "@/components/PageTitle";
import ServiceCategoryStack from "@/components/ServiceCategoryStack";
import NextImage from "next/image";
import {
  ShieldCheck,
} from "lucide-react";
export const revalidate = 60; // Revalidate cache every 60 seconds

async function getServicesWithCategories(): Promise<ServiceCategory[]> {
  const { data, error } = await supabase
    .from("service_categories")
    .select(`
      id,
      category_title,
      category_desc,
      display_order,
      services (*)
    `)
    .order("display_order", { ascending: true });

  if (error) {
    console.log("Error fetching services:", error);
    return [];
  }

  return data as ServiceCategory[];
}

export default async function ServicesPage() {
  const categories = await getServicesWithCategories();

  return (
    <div className="relative min-h-screen text-ink overflow-x-clip">
    {/* overflow-x-clip (not overflow-hidden) so position: sticky keeps working */}
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
    {/* <CulturalPattern
      dashedOrbitsConfig={[{ x: 900, y: 5, pathHeight:300, pathWidth:300, speed:10, radius: 25 }, 
        { x: 200, y: 25, pathHeight:400, pathWidth:420, speed:11, radius: 25 } ,
         { x: 600, y: 50, pathHeight:500, pathWidth:700, speed:12, radius: 25 },
        { x: 400, y: 10, pathHeight:300, pathWidth:700, speed:13, radius: 25 },
        { x: 500, y: 20, pathHeight:300, pathWidth:700, speed:14, radius: 25 }]}
    /> */}
    <div className="relative z-10">
      {/* <PatternField variant="pulse" /> */}
      <Navbar />
      <PageHero
        eyebrow="Healthcare Services"
        title="Our Health & Wellbeing Programs"
        description=""
        imageSrc="/assets/servicesmain2.png"
        imageAlt="Aboriginal flowing country dot painting"
        pageName="service"
      />

      <main className="max-w-8xl mx-auto px-12 py-16 space-y-16">
        {/* Categories Section - stacking cards; each category's title strip stays visible and is clickable */}
        <div className="relative z-10">
          <ServiceCategoryStack categories={categories} />
        </div>
      </main>
      <PartnersTicker />
      <Footer />
    </div>
  </div>
  );
}