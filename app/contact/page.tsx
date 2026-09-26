import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import PageTitle from "@/components/PageTitle";
import PatternField from "@/components/PatternField";
import { MapPin, Phone, Mail, Clock, AlertCircle } from "lucide-react";
import PartnersTicker from "@/components/PartnersTicker";
import FramerMouseGradient from "@/components/FramerMouseGradient";
import NextImage from 'next/image';

export default function ContactPage() {
  return (
<div className="relative min-h-screen bg-navy text-ink overflow-x-hidden">
  <FramerMouseGradient />
  <Navbar />

  {/* Background Images Overlay */}
  <div
  className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_bottom,#faf6f0,#fefaf4_55%,#fdedd7)] overflow-hidden"
  aria-hidden="true"
>
  {/* Single Top Background Image with Constrained Height */}
  <div
  className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_bottom,#faf6f0,#fefaf4_70%,#faf6f0)] overflow-hidden"
  aria-hidden="true"
>
  <div className="absolute inset-x-0 top-0 h-[120vh] sm:h-[130vh] ">
    <NextImage
      src="/assets/contact_bg.png"
      alt=""
      fill
      priority
      sizes="100vw"
      className="object-cover object-top opacity-90"
    />
  </div>
</div>
</div>
  {/* Separate Top-Left Header Block */}
  <div className="absolute top-28 left-4 sm:left-8 lg:left-12 z-20 max-w-sm sm:max-w-md text-left space-y-1.5">
    <span className="text-ochre font-semibold uppercase text-xs tracking-wider block">
      Get in Touch
    </span>
    <PageTitle className="text-3xl sm:text-4xl font-bold leading-tight">
      Contact Pika Wiya Health Service
    </PageTitle>
    <p className="text-ink text-sm sm:text-base leading-relaxed">
      Have a question about our health programs, appointments, or cultural support services? Reach out to our team below.
    </p>
  </div>

  {/* Main Form Content Area - Positioned Lower Down to Showcase Background */}
  {/* Main Form Content Area - Extended Max Width */}
<main className="relative z-10 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 pt-64 sm:pt-72 lg:pt-90 pb-20">
  
  {/* Grid Layout: Left Column (Details + Emergency Box) | Right Column (Form Only) */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-8 w-full items-start">
    
    {/* Left Column: Stacked Clinic Details + White Emergency Box */}
    <div className="space-y-6">
      
      {/* Clinic Details Panel */}
      <div className="border border-ochre/30 contrast-card bg-white text-ink p-5 sm:p-6 lg:p-7 rounded-2xl space-y-6 shadow-xl">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-1">Clinic Details</h2>
          <p className="text-ink/80 text-xs sm:text-sm">
            Aboriginal Community Controlled Health Organisation in Port Augusta.
          </p>
        </div>

        <div className="space-y-4 text-xs sm:text-sm">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-ochre/20 text-ochre flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="w-full space-y-2">
              <div>
                <h3 className="font-semibold text-xs sm:text-sm">Location</h3>
                <p className="text-xs sm:text-sm text-ink mt-0.5">
                  40-46 Dartford St, Port Augusta SA 5700, Australia
                </p>
              </div>

              <div className="w-full h-36 rounded-lg overflow-hidden border border-sand/20 shadow-inner">
                <iframe
                  title="Pika Wiya Health Service Map"
                  src="https://maps.google.com/maps?q=Pika+Wiya+Health+Service+Port+Augusta&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-ochre/20 text-ochre flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <a href="tel:0886429991" className="hover:text-ochre transition">
                <h3 className="font-semibold text-xs sm:text-sm">Phone</h3>
                <p className="text-xs sm:text-sm text-ink">(08) 8642 9991</p>
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-ochre/20 text-ochre flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <a href="mailto:admin@pikawiyahealth.org.au" className="hover:text-ochre transition">
                <h3 className="font-semibold text-xs sm:text-sm">Email</h3>
                <p className="text-xs sm:text-sm text-ink">admin@pikawiyahealth.org.au</p>
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-ochre/20 text-ochre flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-xs sm:text-sm">Opening Hours</h3>
              <p className="text-xs sm:text-sm text-ink">Mon – Fri: 8:30 AM – 5:00 PM</p>
              <p className="text-[11px] text-ink/60">Closed Weekends & Public Holidays</p>
            </div>
          </div>
        </div>
      </div>

      {/* Medical Emergency Box - White Background below Clinic Details */}
      <div className="bg-white border border-ochre/30 rounded-2xl p-5 shadow-xl flex items-start gap-3.5 text-ink">
        <div className="w-9 h-9 rounded-xl bg-ochre/20 text-ochre flex items-center justify-center shrink-0 mt-0.5">
          <AlertCircle className="w-5 h-5 text-ochre" />
        </div>
        <div className="text-xs sm:text-sm space-y-1">
          <h3 className="font-bold text-ink text-sm sm:text-base">Medical Emergency Notice</h3>
          <p className="text-ink/80 leading-relaxed">
            If you or someone else requires urgent medical care, please call <strong className="text-ochre font-bold">000</strong> immediately. For after-hours assistance, contact your local hospital.
          </p>
        </div>
      </div>

    </div>

    {/* Right Column: Contact Form Only */}
    <div className="lg:col-span-2">
      <div className="bg-surface p-5 sm:p-6 lg:p-7 rounded-2xl shadow-sm border border-border w-full">
        <h2 className="text-lg sm:text-xl font-bold text-ink mb-1">Send Us an Enquiry</h2>
        <p className="text-ink/70 text-xs sm:text-sm mb-4">
          Fill out the form below and your enquiry will be sent directly to our administrative team.
        </p>
        <ContactForm />
      </div>
    </div>

  </div>
</main>

  {/* Scrollable Ticker and Footer */}
  <div className="relative z-10 bg-navy">
    <PartnersTicker />
    <Footer />
  </div>
</div>
  );
}