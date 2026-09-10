import Link from "next/link";
import Navbar from "@/components/Navbar";
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
    <div className="min-h-screen bg-sand text-earth">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-16 space-y-16">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-ochre font-semibold uppercase text-xs tracking-wider">
            Healthcare Services
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-earth">
            Our Health & Wellbeing Programs
          </h1>
          <p className="text-earth/70 text-lg">
            Pika Wiya Health Service delivers comprehensive, culturally safe healthcare across our clinical facilities, community outreach centers, and school programs.
          </p>
        </div>

        {/* Categories Section */}
        {categories.map((category) => (
          <div key={category.id} className="space-y-8 border-t border-earth/10 pt-12 first:border-0 first:pt-0">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-earth">
                {category.category_title}
              </h2>
              {category.category_desc && (
                <p className="text-earth/70 mt-1 max-w-2xl text-sm md:text-base">
                  {category.category_desc}
                </p>
              )}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.services.map((service) => (
                <div
                  key={service.id}
                  className="bg-white/70 border border-earth/10 p-6 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition group"
                >
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-earth group-hover:text-ochre transition">
                      {service.title}
                    </h3>
                    <p className="text-earth/70 text-sm leading-relaxed">
                      {service.short_desc}
                    </p>
                  </div>

                  <div className="pt-6 mt-4 border-t border-earth/5">
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
    </div>
  );
}