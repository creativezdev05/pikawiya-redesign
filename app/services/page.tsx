import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import PatternField from "@/components/PatternField";
import { supabase, ServiceCategory } from "@/lib/supabaseClient";
import { ChevronRight } from "lucide-react";

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
    console.error("Error fetching services:", error);
    return [];
  }

  return data as ServiceCategory[];
}

export default async function ServicesPage() {
  const categories = await getServicesWithCategories();

  return (
    <div className="relative min-h-screen bg-page text-ink overflow-hidden">
      <PatternField variant="pulse" />
      <Navbar />
      <PageHero
        eyebrow="Healthcare Services"
        title="Our Health & Wellbeing Programs"
        description="Pika Wiya Health Service delivers comprehensive, culturally safe healthcare across our clinical facilities, community outreach centers, and school programs."
        imageSrc="/assets/patterns/pat5.jpg"
        imageAlt="Aboriginal flowing country dot painting"
        trLogo="pulse"
      />

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-16 space-y-16">
        {/* Categories Section */}
        {categories.map((category) => (
          <div key={category.id} className="space-y-8 border-t border-border pt-12 first:border-0 first:pt-0">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-ink">
                {category.category_title}
              </h2>
              {category.category_desc && (
                <p className="text-ink/70 mt-1 max-w-2xl text-sm md:text-base">
                  {category.category_desc}
                </p>
              )}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.services.map((service) => (
                <div
                  key={service.id}
                  className="bg-surface border border-border p-6 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition group"
                >
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-ink group-hover:text-ochre transition">
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
                      Learn More <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}