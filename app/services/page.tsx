import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import PatternField from "@/components/PatternField";
import { supabase, ServiceCategory } from "@/lib/supabaseClient";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import PartnersTicker from "@/components/PartnersTicker";
import FramerMouseGradient from "@/components/FramerMouseGradient";
import CulturalPattern from "@/components/CulturalPattern";
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
    <div className="relative min-h-screen text-ink overflow-hidden">
    <CulturalPattern
      dashedOrbitsConfig={[{ x: 900, y: 5, pathHeight:300, pathWidth:300, speed:10 }, { x: 200, y: 25, pathHeight:400, pathWidth:420, speed:11 } ,
         { x: 600, y: 50, pathHeight:500, pathWidth:700, speed:12 },
        { x: 400, y: 10, pathHeight:300, pathWidth:700, speed:13 },
        { x: 500, y: 20, pathHeight:300, pathWidth:700, speed:14 }]}
    />
    <div className="relative z-10">
      {/* <PatternField variant="pulse" /> */}
      <Navbar />
      <PageHero
        eyebrow="Healthcare Services"
        title="Our Health & Wellbeing Programs"
        description="Pika Wiya Health Service delivers comprehensive, culturally safe healthcare across our clinical facilities, community outreach centers, and school programs."
        imageSrc="/assets/servicesmain1.png"
        imageAlt="Aboriginal flowing country dot painting"
        pageName="service"
      />

      <main className="max-w-7xl mx-auto px-4 py-16 space-y-16">
        {/* Animated Background Pattern spanning behind all main content sections */}
        <div 
          className="absolute inset-[-20%] z-0 opacity-20 pointer-events-none animate-drift"
          style={{ 
            backgroundImage: "url('/assets/background-pattern.png')",
            backgroundSize: "contain",
            filter: "brightness(0) saturate(100%) invert(47%) sepia(2%) saturate(210%) hue-rotate(349deg) brightness(93%) contrast(82%)"
          }}
        />
        {/* Categories Section */}
        {categories.map((category, index) => (
          <div key={category.id} className="space-y-8 border-t border-border pt-12 first:border-0 first:pt-0">
          {/* Banner Outer Card with Solid White Background */}
            <div className="relative overflow-hidden rounded-xl border border-ochre/20 bg-white p-5 md:p-6 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-ochre/40 hover:shadow-ochre/10">
              
              {/* Local Asset Background Image (Masked to show only top and bottom) */}
              <div className="absolute inset-0 pointer-events-none -z-0">
                <Image
                  src={`/assets/patterns/pat${index + 1}.jpg`}
                  alt="Background Pattern"
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover object-center"
                  style={{
                    maskImage: "linear-gradient(to bottom, black 0%, transparent 25%, transparent 75%, black 100%)",
                    WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 25%, transparent 75%, black 100%)",
                  }}
                />
              </div>

              {/* Left Accent Ribbon Edge */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-ochre via-amber-500 to-ochre" />

              {/* Banner Content */}
              <div className="group/title relative space-y-3 z-10">
                {/* Title - Splits at '&' into separate lines */}
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-ink leading-tight cursor-pointer">
                  {category.category_title.includes("&") ? (
                    category.category_title.split("&").map((part, pIdx) => (
                      <span key={pIdx} className="block first:inline-block">
                        {pIdx > 0 && <span className="text-ochre mr-2">&</span>}
                        {part.trim()}
                      </span>
                    ))
                  ) : (
                    <span className="block break-words">{category.category_title}</span>
                  )}
                </h2>

                {/* Sparking Line */}
                <div className="relative w-full h-1.5 rounded-full bg-ochre/20 overflow-hidden shadow-[0_0_12px_rgba(217,119,6,0.35)] transition-all duration-300 group-hover/title:shadow-[0_0_20px_rgba(245,158,11,0.8)]">
                  <div className="absolute inset-0 bg-gradient-to-r from-ochre via-amber-500 to-ochre animate-pulse group-hover/title:brightness-125" />
                  <div className="absolute inset-0 w-full bg-gradient-to-r from-transparent via-white/80 to-transparent -translate-x-full animate-[shimmer_2.5s_infinite]" />
                  <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 -translate-x-full group-hover/title:opacity-100 group-hover/title:animate-[shimmer_0.8s_ease-in-out_infinite]" />
                  <div className="absolute right-0 top-0 bottom-0 w-6 bg-white blur-[2px] opacity-30 group-hover/title:opacity-100 group-hover/title:animate-[ping_0.6s_infinite]" />
                </div>

                {/* Description */}
                {category.category_desc && (
                  <p className="text-ink/80 text-sm md:text-base leading-relaxed break-words pt-1 font-medium">
                    {category.category_desc}
                  </p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pointer-coarse:cursor-pointer">
              {category.services.map((service) => (
              <Link key={service.id}
                href={`/services/${service.slug}`}
                className="inline-flex items-center text-sm font-semibold text-ochre hover:text-ochre-dark transition gap-1">
                <div
                  className="zoom-box group relative bg-surface border border-border p-6 rounded-2xl flex flex-col justify-between shadow-sm origin-center transition-all duration-500 hover:z-20 hover:scale-[1.03] hover:border-ochre hover:shadow-[0_28px_55px_-18px_rgba(0,0,0,0.25)]"
                >
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-ink group-hover:text-ochre transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-ink/70 text-sm leading-relaxed">
                      {service.short_desc}
                    </p>
                  </div>

                  <div className="pt-6 mt-4 border-t border-border flex items-center gap-1">
                    
                      Learn More <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    
                  </div>
                </div>
              </Link>
              ))}
            </div>
          </div>
        ))}
      </main>
      <PartnersTicker />
      <Footer />
    </div>
  </div>
  );
}