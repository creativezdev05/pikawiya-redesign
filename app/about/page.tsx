import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-sand text-earth">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-16 space-y-16">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-ochre font-semibold uppercase text-xs tracking-wider">About Pika Wiya</span>
          <h1 className="text-4xl md:text-5xl font-bold text-earth mt-2 mb-4">Grounded in Culture, Driven by Community</h1>
          <p className="text-earth/70 text-lg">
            Pika Wiya Health Service is an Aboriginal Community Controlled Health Organisation (ACCHO) committed to delivering high-quality, culturally safe healthcare across Port Augusta and regional South Australia.
          </p>
        </div>

        {/* Culture & Artwork Banner */}
        <div className="grid md:grid-cols-2 gap-12 items-center bg-earth text-sand p-8 md:p-12 rounded-2xl shadow-xl">
          <div className="relative h-80 md:h-96 rounded-xl overflow-hidden border border-ochre/30">
            <Image
              src="/assets/5+98 (1).jpg"
              alt="Aboriginal Dot Painting Artwork"
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Our Cultural Heritage</h2>
            <p className="text-sand/80 leading-relaxed">
              Our name and emblem reflect deep roots within the community. We work closely with Traditional Owners, Elders, and local families to ensure health services honor connection to land, culture, and traditional healing principles.
            </p>
            <p className="text-sand/80 leading-relaxed">
              From our main facility in Port Augusta to outreach health programs, every aspect of our care is designed to offer a safe, respectful environment for Aboriginal people.
            </p>
            <div className="pt-2">
              <Link
                href="/governance"
                className="inline-block px-6 py-3 bg-ochre hover:bg-ochre-dark text-white font-medium rounded-md text-sm transition"
              >
                View Governance & Rule Book
              </Link>
            </div>
          </div>
        </div>

        {/* Regional & Landscape Connection */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-earth">Serving Port Augusta & The Flinders Ranges</h2>
            <p className="text-earth/70 leading-relaxed">
              Surrounded by the iconic Flinders Ranges and sacred lands, Pika Wiya serves a diverse population across remote and regional townships. We bridge healthcare gaps by providing accessible transport, mobile clinics, and specialized community health initiatives.
            </p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-block px-6 py-3 bg-earth hover:bg-earth-light text-white font-medium rounded-md text-sm transition"
              >
                Get in Touch with Our Team
              </Link>
            </div>
          </div>
          <div className="relative h-80 rounded-xl overflow-hidden border border-earth/10 shadow-md">
            <Image
              src="/assets/5+98 (2).jpeg"
              alt="Flinders Ranges Mountain Landscape"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </main>
    </div>
  );
}