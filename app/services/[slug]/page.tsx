import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTitle from "@/components/PageTitle";
import PatternField from "@/components/PatternField";
import { supabase, Service } from "@/lib/supabaseClient";
import Image from "next/image";
import PartnersTicker from "@/components/PartnersTicker";
import {
  Calendar,
  MapPin,
  UserCheck,
  PhoneCall,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

export const revalidate = 60;

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

function isGeneralAppointments(service: Service) {
  return (
    service.slug === "general-appointments" ||
    service.title.toLowerCase() === "general appointments"
  );
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
    ? `/assets/services/practitioners/${service.practitioner_name.toLowerCase().replace(/\s+/g, "-")}.png`
    : null;
  const showPractitionerCard = Boolean(service.practitioner_name);
  const showPattern = isGeneralAppointments(service);

  return (
    <div className="relative min-h-screen bg-page text-ink flex flex-col overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-10">
          <Image
            src="/assets/PWHS_Logo_Mark.png"
            alt=""
            fill
            className="object-cover object-center"
            priority={false}
          />
        </div>
      {/* <PatternField variant="twirl" logoMotion="sway" logoPlacement="br" /> */}
      <Navbar />

      <main className="relative z-10 max-w-6xl mx-auto px-4 py-12 md:py-16 space-y-10 w-full">
        <Link
          href="/services"
          className="inline-flex items-center text-sm font-medium text-ink/60 hover:text-ochre transition gap-2 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to All Services
        </Link>

        <div className="contrast-card bg-earth text-sand rounded-3xl shadow-xl relative overflow-hidden border border-transparent">
          {showPattern && (
            <div className="absolute inset-0" aria-hidden="true">
              <Image
                src="/assets/patterns/pat4.jpg"
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 72rem"
                className="object-cover object-[70%_center] opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/82 to-navy/45" />
              <div className="absolute inset-0 bg-gradient-to-b from-navy/30 via-transparent to-navy/55" />
            </div>
          )}

          <div
            className={`relative z-10 p-8 md:p-12 ${
              showPractitionerCard
                ? "grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-center"
                : "space-y-6"
            }`}
          >
            <div className="space-y-2">
              <span className="text-ochre font-semibold uppercase text-xs tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Pika Wiya Health Program
              </span>
              <PageTitle onDark className="text-3xl md:text-5xl font-bold tracking-tight">
                {service.title}
              </PageTitle>
              {service.short_desc && (
                <p className="text-sand/80 text-base md:text-lg max-w-2xl pt-2 font-normal leading-relaxed">
                  {service.short_desc}
                </p>
              )}
            </div>

            {showPractitionerCard && (
              <div className="relative min-h-[360px] md:min-h-[480px] overflow-hidden border border-ochre/30 group">
                {practitionerImage ? (
                  <Image
                    src={practitionerImage}
                    alt={service.practitioner_name ?? ""}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover object-center scale-[1.15] -translate-y-[6%] transition duration-700 group-hover:scale-[1.18]"
                  />
                ) : (
                  <div className="absolute inset-0 bg-ochre/20 flex items-center justify-center text-ochre text-6xl font-bold">
                    {service.practitioner_name?.charAt(0)}
                  </div>
                )}
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="relative overflow-hidden bg-navy/92 border-l-4 border-ochre px-5 py-4 backdrop-blur-sm shadow-lg">
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 opacity-20 pointer-events-none"
                      style={{
                        backgroundImage:
                          "radial-gradient(rgba(232,93,38,0.45) 1px, transparent 1px)",
                        backgroundSize: "10px 10px",
                      }}
                    />
                    <p className="relative text-ochre text-xs font-bold uppercase tracking-[0.18em]">
                      {service.practitioner_name}
                    </p>
                    {service.practitioner_role && (
                      <p className="relative text-white text-base md:text-lg font-semibold mt-1">
                        {service.practitioner_role}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2 space-y-8 bg-surface border border-border p-8 md:p-10 rounded-3xl shadow-sm">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-ink tracking-tight">
                About this Service
              </h2>
              <div className="text-ink/80 text-base leading-relaxed whitespace-pre-line space-y-4">
                {service.overview || "Service details coming soon."}
              </div>
            </div>

            {service.schedule_location && (
              <div className="border-t border-border pt-8 space-y-4">
                <h3 className="text-xl font-bold text-ink flex items-center gap-2.5">
                  <Calendar className="w-5 h-5 text-ochre" /> Schedule & Location
                </h3>
                <div className="bg-page border border-border p-5 rounded-2xl flex items-start gap-3 text-ink/80 text-sm leading-relaxed">
                  <MapPin className="w-5 h-5 text-ochre shrink-0 mt-0.5" />
                  <div>{service.schedule_location}</div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {service.eligibility && (
              <div className="bg-surface border border-border p-6 rounded-3xl space-y-3 shadow-sm">
                <div className="flex items-center gap-2 text-ochre font-bold text-xs uppercase tracking-wider">
                  <UserCheck className="w-4 h-4" /> Who Can Access This
                </div>
                <h3 className="text-lg font-bold text-ink">Eligibility</h3>
                <p className="text-ink/80 text-sm leading-relaxed">
                  {service.eligibility}
                </p>
              </div>
            )}

            <div className="bg-ochre/50 border border-ochre/30 p-6 rounded-3xl space-y-5">
              <div className="flex items-center gap-2 text-ink font-bold text-xs uppercase tracking-wider">
                <PhoneCall className="w-4 h-4 text-ochre" /> Get in Touch
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-ink">Make an Appointment</h3>
                <p className="text-ink/80 text-md leading-relaxed">
                  {service.contact_info ||
                    "Contact our clinic reception team to book or inquire about this program."}
                </p>
              </div>

              <a
                href="tel:0886429991"
                className="inline-flex items-center justify-center w-full py-3.5 px-4 bg-ochre hover:bg-ochre-dark text-white text-sm font-semibold rounded-xl transition shadow-sm hover:shadow gap-2 text-center"
              >
                <PhoneCall className="w-4 h-4" /> Call Reception (08) 8642 9991
              </a>
            </div>
          </div>
        </div>
      </main>
      <div className="relative z-10">
        <PartnersTicker />
        <Footer />
      </div>
    </div>
  );
}
