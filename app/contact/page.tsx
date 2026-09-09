import Navbar from "@/components/Navbar";
import ContactForm from "@/components/ContactForm";
import { MapPin, Phone, Mail, Clock, AlertCircle } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-sand text-earth">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-16 space-y-12">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-ochre font-semibold uppercase text-xs tracking-wider">
            Get in Touch
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-earth mt-2 mb-4">
            Contact Pika Wiya Health Service
          </h1>
          <p className="text-earth/70 text-lg">
            Have a question about our health programs, appointments, or cultural support services? Reach out to our team below.
          </p>
        </div>

        {/* Emergency Notice Banner */}
        <div className="bg-ochre/10 border border-ochre/30 rounded-xl p-4 flex items-center gap-3 text-earth text-sm max-w-4xl mx-auto">
          <AlertCircle className="w-5 h-5 text-ochre shrink-0" />
          <p>
            <strong>Medical Emergency?</strong> For urgent medical emergencies, please call <strong>000</strong> immediately. For after-hours medical assistance, contact your local hospital.
          </p>
        </div>

        {/* Grid Section: Details + Form */}
        <div className="grid lg:grid-cols-3 gap-12 max-w-7xl mx-auto items-start">
          {/* Contact Details Panel */}
          <div className="bg-earth text-sand p-8 rounded-2xl space-y-8 shadow-xl">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Clinic Details</h2>
              <p className="text-sand/70 text-sm">
                Aboriginal Community Controlled Health Organisation in Port Augusta.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-ochre/20 text-ochre flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Location</h3>
                  <p className="text-sm text-sand/80 mt-1">
                    Port Augusta, South Australia 5700
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-ochre/20 text-ochre flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Phone</h3>
                  <p className="text-sm text-sand/80 mt-1">
                    Reception & Appointments
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-ochre/20 text-ochre flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Email</h3>
                  <p className="text-sm text-sand/80 mt-1">
                    admin@pikawiyahealth.org.au
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-ochre/20 text-ochre flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Opening Hours</h3>
                  <p className="text-sm text-sand/80 mt-1">
                    Monday – Friday: 8:30 AM – 5:00 PM
                  </p>
                  <p className="text-xs text-sand/60">Closed on Weekends & Public Holidays</p>
                </div>
              </div>
            </div>
          </div>

          {/* Supabase Contact Form */}
          <div className="lg:col-span-2 bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-earth/10">
            <h2 className="text-2xl font-bold text-earth mb-2">Send Us an Enquiry</h2>
            <p className="text-earth/70 text-sm mb-8">
              Fill out the form below and your enquiry will be sent directly to our administrative team.
            </p>
            <ContactForm />
          </div>
        </div>
      </main>
    </div>
  );
}