import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import PageTitle from "@/components/PageTitle";
import PatternField from "@/components/PatternField";
import { MapPin, Phone, Mail, Clock, AlertCircle } from "lucide-react";
import PartnersTicker from "@/components/PartnersTicker";

export default function ContactPage() {
  return (
    <div className="relative min-h-screen bg-page text-ink overflow-hidden">
      <PatternField variant="inward" logoMotion="drift" logoPlacement="tl" />
      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-16 space-y-12">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-ochre font-semibold uppercase text-xs tracking-wider">
            Get in Touch
          </span>
          <PageTitle className="text-4xl md:text-5xl font-bold mt-2 mb-4">
            Contact Pika Wiya Health Service
          </PageTitle>
          <p className="text-ink/70 text-lg">
            Have a question about our health programs, appointments, or cultural support services? Reach out to our team below.
          </p>
        </div>

        {/* Emergency Notice Banner */}
        <div className="bg-ochre/10 border border-ochre/30 rounded-xl p-4 flex items-center gap-3 text-ink text-sm max-w-4xl mx-auto">
          <AlertCircle className="w-5 h-5 text-ochre shrink-0" />
          <p>
            <strong>Medical Emergency?</strong> For urgent medical emergencies, please call <strong>000</strong> immediately. For after-hours medical assistance, contact your local hospital.
          </p>
        </div>

        {/* Grid Section: Details + Form */}
        <div className="grid lg:grid-cols-3 gap-12 max-w-7xl mx-auto items-start">
          {/* Contact Details Panel */}
          <div className="contrast-card bg-earth text-sand p-8 rounded-2xl space-y-8 shadow-xl border border-transparent">
            <div>
              <h2 className="text-2xl font-bold  mb-2">Clinic Details</h2>
              <p className="text-sand/70 text-sm">
                Aboriginal Community Controlled Health Organisation in Port Augusta.
              </p>
            </div>

            <div className="space-y-6">
              {/* Updated Location Block with Fixed Google Map */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-ochre/20 text-ochre flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="w-full space-y-3">
                  <div>
                    <h3 className="font-semibold">Location</h3>
                    <p className="text-sm text-sand/80 mt-1">
                      40-46 Dartford St, Port Augusta SA 5700, Australia
                    </p>
                  </div>

                  {/* Embedded Google Map */}
                  <div className="w-full h-44 rounded-xl overflow-hidden border border-sand/20 shadow-inner">
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

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-ochre/20 text-ochre flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <a href="tel:0886429991" className="  text-ochre hover:bg-ochre/10  transition"
                >
                  <h3 className="font-semibold ">Phone</h3>
                  <p className="text-sm text-sand/80 mt-1">
                    (08) 8642 9991
                  </p>
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-ochre/20 text-ochre flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <a
                    href="mailto:generalenquiries@pikawiyahealth.org.au"
                    className=" hover:text-ochre transition"
                  >
                  <h3 className="font-semibold ">Email</h3>
                  <p className="text-sm text-sand/80 mt-1">
                    admin@pikawiyahealth.org.au
                  </p>
                </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-ochre/20 text-ochre flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold ">Opening Hours</h3>
                  <p className="text-sm text-sand/80 mt-1">
                    Monday – Friday: 8:30 AM – 5:00 PM
                  </p>
                  <p className="text-xs text-sand/60">Closed on Weekends & Public Holidays</p>
                </div>
              </div>
            </div>
          </div>

          {/* Supabase Contact Form */}
          <div className="lg:col-span-2 bg-surface p-8 md:p-12 rounded-2xl shadow-sm border border-border">
            <h2 className="text-2xl font-bold text-ink mb-2">Send Us an Enquiry</h2>
            <p className="text-ink/70 text-sm mb-8">
              Fill out the form below and your enquiry will be sent directly to our administrative team.
            </p>
            <ContactForm />
          </div>
        </div>
      </main>
      <div className="relative z-10">
        <PartnersTicker/>
        <Footer />
      </div>
    </div>
  );
}