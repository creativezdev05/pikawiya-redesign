import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import PatternField from "@/components/PatternField";
import { supabase, ServiceCategory } from "@/lib/supabaseClient";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import PartnersTicker from "@/components/PartnersTicker";

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
  {/* Move background image to top level with positive stacking relative to base */}
  <div className="fixed inset-0 z-0 pointer-events-none opacity-10">
    <Image
      src="/assets/Jap-016925-Tarisse.jpg"
      alt=""
      fill
      className="object-cover object-center"
      priority={false}
    />
  </div>

  <div className="relative z-10">
    {/* <PatternField variant="pulse" /> */}
    <Navbar />
    <PageHero
      eyebrow="Healthcare Services"
      title="Our Health & Wellbeing Programs"
      description="Pika Wiya Health Service delivers comprehensive, culturally safe healthcare across our clinical facilities, community outreach centers, and school programs."
      imageSrc="/assets/patterns/pat5.jpg"
      imageAlt="Aboriginal flowing country dot painting"
      trLogo="pulse"
      trLogoClassName="tr-logo--inset"
    />

    <main className="max-w-7xl mx-auto px-4 py-16 space-y-16">
      {/* Categories Section */}
      {categories.map((category) => (
        <div key={category.id} className="space-y-8 border-t border-border pt-12 first:border-0 first:pt-0">
          <div className="relative space-y-3">
            <div className="group/title relative inline-block space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold text-ink cursor-pointer">
                {category.category_title}
              </h2>

              {/* Full-width Sparking Line */}
              <div className="relative w-full h-1.5 rounded-full bg-ochre/20 overflow-hidden shadow-[0_0_12px_rgba(217,119,6,0.35)] transition-all duration-300 group-hover/title:shadow-[0_0_20px_rgba(245,158,11,0.8)]">
                {/* Base Ochre Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-ochre via-amber-500 to-ochre animate-pulse group-hover/title:brightness-125" />

                {/* Passive Ambient Shimmer Beam */}
                <div className="absolute inset-0 w-full bg-gradient-to-r from-transparent via-white/80 to-transparent -translate-x-full animate-[shimmer_2.5s_infinite]" />

                {/* Hover Spark Flash Wave */}
                <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 -translate-x-full group-hover/title:opacity-100 group-hover/title:animate-[shimmer_0.8s_ease-in-out_infinite]" />

                {/* Hover Spark Flare Accent */}
                <div className="absolute right-0 top-0 bottom-0 w-6 bg-white blur-[2px] opacity-30 group-hover/title:opacity-100 group-hover/title:animate-[ping_0.6s_infinite]" />
              </div>

              {category.category_desc && (
                <p className="text-ink/70 mt-1 max-w-2xl text-sm md:text-base">
                  {category.category_desc}
                </p>
              )}
            </div>
           
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pointer-coarse:cursor-pointer">
            {category.services.map((service) => (
              <div
                key={service.id}
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

                <div className="pt-6 mt-4 border-t border-border">
                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center text-sm font-semibold text-ochre hover:text-ochre-dark transition gap-1"
                  >
                    Learn More <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
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