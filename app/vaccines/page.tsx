import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTitle from "@/components/PageTitle";
import CulturalPattern from "@/components/CulturalPattern";
import { Briefcase, Mail, HeartHandshake, CheckCircle2 } from "lucide-react";
import PartnersTicker from "@/components/PartnersTicker";
import FramerMouseGradient from "@/components/FramerMouseGradient";
import NextImage from "next/image";

export const CORNER_DOTS = [{ x: "100%", y: "0%", rings: 7, startR: 26, gap: 22, speed: 60 }];

export default function CareersPage() {
  return (
    <div className="relative min-h-screen bg-navy text-ink overflow-hidden">
      <CulturalPattern
            dashedOrbitsConfig={[{ x: 900, y: 5, pathHeight:300, pathWidth:300, speed:10, radius:25 }, { x: 200, y: 25, pathHeight:400, pathWidth:420, speed:11, radius:25 } ,
               { x: 600, y: 50, pathHeight:500, pathWidth:700, speed:12, radius:25 },
              { x: 400, y: 10, pathHeight:300, pathWidth:700, speed:13, radius:25 },
              { x: 500, y: 20, pathHeight:300, pathWidth:700, speed:14, radius:25 }]}
          />
      <div 
          className="absolute inset-[-20%] z-0 opacity-20 pointer-events-none animate-drift"
          style={{ 
            backgroundImage: "url('/assets/background-pattern.png')",
            backgroundSize: "contain",
            filter: "brightness(0) saturate(100%) invert(47%) sepia(2%) saturate(210%) hue-rotate(349deg) brightness(93%) contrast(82%)"
          }}
        />
      <FramerMouseGradient/>
      <Navbar />
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
          <span className="text-white font-semibold uppercase text-xs tracking-wider flex items-center justify-center gap-1.5">
            <Briefcase className="w-4 h-4" /> Join Our Team
          </span>
          <PageTitle className="text-4xl md:text-5xl font-bold tracking-tight">
            Vaccinations and Immunisations
          </PageTitle>
          <p className="text-white/70 text-base md:text-lg">
            Work alongside dedicated healthcare professionals delivering culturally safe care in South Australia.
          </p>
        </div>
      </section>

      <main className="relative z-10 max-w-[1600px] mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          {/* Left: Feature Image */}
          <div className="relative h-72 sm:h-96 lg:h-auto rounded-3xl overflow-hidden shadow-2xl">
            <NextImage
              src="/assets/patterns/pat1.jpg"
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/10 to-transparent" />
          </div>

          {/* Right: Current Vacancies Status Card */}
          <div className="card-3d bg-surface p-8 md:p-10 rounded-3xl  space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-page text-ink/80 text-xs font-medium border border-border">
              <span className="w-2 h-2 rounded-full bg-ochre" />
              Current Status: No Active Advertised Vacancies
            </div>

            <p className="text-ink/80 text-base md:text-lg leading-relaxed">
              We currently have no vacancies advertised, but we are always on the lookout for passionate and dedicated people who share our commitment to improving the health and wellbeing of Aboriginal communities.
            </p>
          </div>

          <div className="border-t border-border pt-8 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-ink flex items-center gap-2">
                <HeartHandshake className="w-6 h-6 text-ochre" />
                Submit an Expression of Interest
              </h2>
              <p className="text-ink/70 text-sm leading-relaxed">
                If you believe you have the skills, values and drive to contribute to our team, we’d love to hear from you. You are welcome to submit an expression of interest by emailing a brief cover letter and your resume to:
              </p>
            </div>

            {/* Email Contact CTA Card */}
            <div className="bg-page p-6 rounded-2xl border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-ochre/10 text-ochre flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-ink/60 font-medium">Send applications to</p>
                  <a
                    href="mailto:generalenquiries@pikawiyahealth.org.au"
                    className="text-ink font-bold text-base hover:text-ochre transition"
                  >
                    generalenquiries@pikawiyahealth.org.au
                  </a>
                </div>
              </div>

              <a
                href="mailto:generalenquiries@pikawiyahealth.org.au?subject=Expression%20of%20Interest%20-%20Careers"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-ochre hover:bg-ochre-dark text-white font-semibold rounded-xl text-sm transition shadow-sm hover:shadow text-center shrink-0"
              >
                Email Resume
              </a>
            </div>

            <p className="text-ink/70 text-sm leading-relaxed italic">
              We will keep your details on file and be in touch should a suitable opportunity arise. Thank you for your interest in joining the Pika Wiya Health Service Aboriginal Corporation team, we look forward to hearing from you.
            </p>
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