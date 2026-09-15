import React from "react";
import { PhoneCall, MapPin, Clock, MessageSquare, ShieldAlert } from "lucide-react";
import CulturalPattern from "./CulturalPattern";
import PageTitle from "./PageTitle";
import ContactForm from "./ContactForm";

export default function ContactSection() {
  return (
    <section className="relative overflow-hidden landing-ink py-20 md:py-32 px-6 md:px-10 text-sand dark:text-ink">
      {/* Background Cultural Artwork */}
      {/* <CulturalPattern variant="contact" showFeet /> */}
      <CulturalPattern 
          variant="contact"
          motif1Config={[{ x: 30, y: 150 }]}
          motif2Config={[{ x: 1150, y: 650 }]}
          motif3Config={[{ x: 30, y: 460 }]}
          dotsConfig={[{ x: 200, y: 200 }, { x: 1170, y: 200 }]}
          spiralsConfig={[{ x: 300, y: 400 }]}
          uShapeConfig={[{ x: 40 , y: 700 }]}
          showFeet
        />
      <div aria-hidden="true" className="cultural-background cultural-background--contact" />
      <div className="absolute inset-0 z-0 landing-ink-veil--soft" />

      {/* Ambient Lighting Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-ochre/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-ochre/10 border border-ochre/20 text-ochre text-xs md:text-sm font-bold uppercase tracking-widest">
            <MessageSquare className="w-3.5 h-3.5" /> Connect With Us
          </span>

          <PageTitle 
            as="h2" 
            onDark 
            className="text-[clamp(2rem,4vw,3.25rem)] font-extrabold leading-[1.08] tracking-tight text-white"
          >
            Get in Touch with Our Healthcare Team
          </PageTitle>

          <p className="text-sand/80 text-base md:text-lg font-light leading-relaxed">
            Complete the form below to connect directly with our health services team, submit an inquiry, or{" "}
            <strong className="text-white font-semibold underline decoration-ochre/60 underline-offset-4">
              request an appointment
            </strong>.
          </p>
        </div>

        {/* Form & Quick Contact Cards Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Quick Info Sidebar Column */}
          <div className="lg:col-span-4 space-y-4 order-2 lg:order-1">
            
            {/* Urgent Care Notice */}
            <div className="p-5 rounded-2xl bg-ochre/15 border border-ochre/30 text-sand space-y-2 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-ochre text-xs font-bold uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4" /> Medical Emergency Notice
              </div>
              <p className="text-xs leading-relaxed text-sand/85">
                For medical emergencies, please call <strong className="text-white">000</strong> immediately. Do not rely on form submissions for urgent clinical care.
              </p>
            </div>

            {/* Hub Details Card */}
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4 backdrop-blur-md">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider border-b border-white/10 pb-3">
                Port Augusta Main Hub
              </h4>
              
              <div className="space-y-3 text-xs text-sand/80">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-ochre shrink-0 mt-0.5" />
                  <span>40 Dartmouth St, Port Augusta SA 5700</span>
                </div>
                <div className="flex items-center gap-3">
                  <PhoneCall className="w-4 h-4 text-ochre shrink-0" />
                  <span>(08) 8642 9999</span>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-ochre shrink-0 mt-0.5" />
                  <span>Mon – Fri: 8:30 AM – 5:00 PM</span>
                </div>
              </div>
            </div>

          </div>

          {/* Main Form Container Block */}
          <div className="lg:col-span-8 order-1 lg:order-2">
            <div className="bg-white relative rounded-3xl border border-white/10 border-t-4 border-t-ochre bg-navy/80 p-6 md:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] backdrop-blur-md">
              <ContactForm />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}