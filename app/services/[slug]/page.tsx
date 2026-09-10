import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { supabase, Service } from "@/lib/supabaseClient";
import Image from "next/image";
import { 
  Calendar, 
  MapPin, 
  UserCheck, 
  PhoneCall, 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  ShieldCheck 
} from "lucide-react";

export const revalidate = 60;

// Generate static routes for all services in Supabase at build time
export async function generateStaticParams() {
  const { data: services } = await supabase.from("services").select("slug");
  return services ? services.map((s) => ({ slug: s.slug })) : [];
}

async function getServiceBySlug(slug: string): Promise<Service | null> {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;
  return data as Service;
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const resolvedParams = await params;
  const service = await getServiceBySlug(resolvedParams.slug);

  if (!service) {
    notFound();
  }
  const practitionerImage = service.practitioner_name
    ? `/assets/services/practitioners/${service.practitioner_name.toLowerCase().replace(/\s+/g, '-')}.png`
    : null;
  return (
    <div className="min-h-screen bg-sand text-earth">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-12 md:py-16 space-y-10">
        {/* Back Navigation */}
        <Link
          href="/services"
          className="inline-flex items-center text-sm font-medium text-earth/60 hover:text-ochre transition gap-2 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to All Services
        </Link>

        {/* Hero Banner Header */}
        <div className="bg-earth text-sand p-8 md:p-12 rounded-3xl shadow-xl space-y-6 relative overflow-hidden">
          <div className="space-y-2 relative z-10">
            <span className="text-ochre font-semibold uppercase text-xs tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Pika Wiya Health Program
            </span>
            <h1 className="text-3xl md:text-5xl font-bold  tracking-tight">
              {service.title}
            </h1>
            {service.short_desc && (
              <p className="text-sand/80 text-base md:text-lg max-w-2xl pt-2 font-normal leading-relaxed">
                {service.short_desc}
              </p>
            )}
          </div>

          {/* Practitioner Badge */}
         {/* 2. Updated Practitioner Profile Badge */}
        {service.practitioner_name && (
        <div className="pt-4 border-t border-sand/15 flex items-center gap-4 relative z-10">
            {practitionerImage ? (
            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-ochre shrink-0 shadow-md">
                <Image
                src={practitionerImage}
                alt={service.practitioner_name}
                fill
                className="object-cover"
                />
            </div>
            ) : (
            <div className="w-12 h-12 rounded-full bg-ochre/20 text-ochre font-bold flex items-center justify-center text-lg border border-ochre/30 shrink-0">
                {service.practitioner_name.charAt(0)}
            </div>
            )}
            <div>
            <p className="text-sm md:text-base font-bold ">
                {service.practitioner_name}
            </p>
            {service.practitioner_role && (
                <p className="text-xs md:text-sm text-sand/80 font-medium">
                {service.practitioner_role}
                </p>
            )}
            </div>
        </div>
        )}
        </div>

        {/* Content & Sidebar Grid */}
        <div className="grid md:grid-cols-3 gap-8 items-start">
          
          {/* Main Details Section */}
          <div className="md:col-span-2 space-y-8 bg-white/70 border border-earth/10 p-8 md:p-10 rounded-3xl shadow-sm">
            
            {/* Service Overview */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-earth tracking-tight">
                About this Service
              </h2>
              <div className="text-earth/80 text-base leading-relaxed whitespace-pre-line space-y-4">
                {service.overview || "Service details coming soon."}
              </div>
            </div>

            {/* Schedule & Location Box */}
            {service.schedule_location && (
              <div className="border-t border-earth/10 pt-8 space-y-4">
                <h3 className="text-xl font-bold text-earth flex items-center gap-2.5">
                  <Calendar className="w-5 h-5 text-ochre" /> Schedule & Location
                </h3>
                <div className="bg-sand/40 border border-earth/5 p-5 rounded-2xl flex items-start gap-3 text-earth/80 text-sm leading-relaxed">
                  <MapPin className="w-5 h-5 text-ochre shrink-0 mt-0.5" />
                  <div>{service.schedule_location}</div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Information */}
          <div className="space-y-6">
            
            {/* Eligibility Card */}
            {service.eligibility && (
              <div className="bg-white/70 border border-earth/10 p-6 rounded-3xl space-y-3 shadow-sm">
                <div className="flex items-center gap-2 text-ochre font-bold text-xs uppercase tracking-wider">
                  <UserCheck className="w-4 h-4" /> Who Can Access This
                </div>
                <h3 className="text-lg font-bold text-earth">Eligibility</h3>
                <p className="text-earth/80 text-sm leading-relaxed">
                  {service.eligibility}
                </p>
              </div>
            )}

            {/* Contact & Appointment Box */}
            <div className="bg-ochre/10 border border-ochre/30 p-6 rounded-3xl space-y-5">
              <div className="flex items-center gap-2 text-earth font-bold text-xs uppercase tracking-wider">
                <PhoneCall className="w-4 h-4 text-ochre" /> Get in Touch
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-earth">Make an Appointment</h3>
                <p className="text-earth/80 text-sm leading-relaxed">
                  {service.contact_info || "Contact our clinic reception team to book or inquire about this program."}
                </p>
              </div>

              <a
                href="tel:0886429991"
                className="inline-flex items-center justify-center w-full py-3.5 px-4 bg-ochre hover:bg-ochre-dark  text-sm font-semibold rounded-xl transition shadow-sm hover:shadow gap-2 text-center"
              >
                <PhoneCall className="w-4 h-4" /> Call Reception (08) 8642 9991
              </a>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}