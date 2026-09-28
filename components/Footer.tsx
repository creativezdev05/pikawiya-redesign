import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import CulturalPattern from "./CulturalPattern";
import PageTitle from "./PageTitle";
import TrLogo from "./TrLogo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[#1b2433] text-sand border-t border-ochre/30 mt-auto">
      {/* <CulturalPattern variant="footer" className="cultural-pattern--footer" /> */}
      <TrLogo motion="float" placement="tl" className="footer-tr-logo"/>
      {/* Corner dot arc — center pinned exactly to the footer's top-right corner, same as news/page.tsx */}
      <CulturalPattern
        variant="footer"
        fit="fill"
        className="z-[3]"
        dotsConfig={[{ x: "100%", y: "0%", rings: 5, startR: 14, gap: 12, speed: 60 }]}
      />
      <CulturalPattern
        variant="footer"
        fit="fill"
        // motif1Config={[{ x: -920, y: 150 }]}
        // motif2Config={[{ x: 2200, y: 650 }]}
        // motif3Config={[{ x: -920, y: 460 }]}
        // dashedOrbitsConfig={[{ x: 300, y: 400 }, { x: 200, y: 800 }]}
        uShapeConfig={[{ x: "-13%", y: "90%" }]}
        cornerTLConfig={{ x: "12%", y: "-15%", scale: 0.9 }}       // Pin strictly to top-left edge, clear of the TR logo
        cornerBRConfig={{ x: "88%", y: "112%", scale: 0.9 }}  // Pin strictly to bottom-right edge
        // showFeet
        // flowPathsConfig={[
        // {
        //   startX: "0%",
        //   startY: "0%",
        //   endX: "90%",
        //   endY: "10%",
        //   controlX: "5%",
        //   controlY: "10%",
        //   speed: 10,
        //   dotCount: 20,
        //   strokeColor: "#E66023",
        //   dotColor: "#E66023",
        //   x: "10%",
        //   y: "0%",
        //   length: "100%"
        // }, {
        //   startX: "0%",
        //   startY: "10%",
        //   endX: "90%",
        //   endY: "20%",
        //   controlX: "0%",
        //   controlY: "0%",
        //   speed: 10,
        //   dotCount: 20,
        //   strokeColor: "#E66023",
        //   dotColor: "#E66023",
        //   x: "-10%",
        //   y: "80%",
        //   length: "100%"
        // }]}
      />
      {/* <div aria-hidden="true" className="cultural-background cultural-background--footer" /> */}
      <div className="absolute inset-0 bg-[#1b2433]/78" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand / About Column */}
          <div className="md:col-span-2 space-y-4">
            <span className="block text-ochre uppercase tracking-[0.22em] text-xs font-semibold mb-3">Pika Wiya Health Service</span>
            <PageTitle as="h2" onDark className="text-2xl md:text-3xl font-bold tracking-wide">
              Pika Wiya Health Service
            </PageTitle>
            <p className="text-sand/80 text-sm leading-relaxed max-w-md">
              Providing culturally safe healthcare and community wellbeing services across Port Augusta and surrounding regions.
            </p>
            <div className="flex items-center gap-2 text-xs text-sand/60 border-l-2 border-ochre pl-3">
              <span>Aboriginal Corporation</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-ochre">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-sand/80">
              <li>
                <Link href="/" className="hover: transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/corporate-documents" className="hover: transition">
                  Corporate Documents
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover: transition">
                  Careers & Vacancies
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover: transition">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-ochre">
                Contact & Location
              </h3>
              <div className="flex items-center gap-2 shrink-0">
                <Image
                  src="/assets/flag1.webp"
                  alt="Flag"
                  width={28}
                  height={18}
                  className="h-auto w-7 object-contain"
                />
                <Image
                  src="/assets/flag2.webp"
                  alt="Flag"
                  width={28}
                  height={18}
                  className="h-auto w-7 object-contain"
                />
              </div>
            </div>
            <ul className="space-y-2 text-sm text-sand/80">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-ochre shrink-0 mt-0.5" />
                <span>40-46 Dartford St, Port Augusta SA 5700</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-ochre shrink-0" />
                <a href="tel:0886429900" className="hover: transition">
                  (08) 8642 9991
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-ochre shrink-0" />
                <a
                  href="mailto:generalenquiries@pikawiyahealth.org.au"
                  className="hover: transition truncate"
                >
                  admin@pikawiyahealth.org.au
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-sand/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-sand/70">
          
          {/* Copyright */}
          <p>
            © {currentYear} Pika Wiya Health Service Aboriginal Corporation. All rights reserved.
          </p>

          {/* Separate Privacy Policy & Terms Links */}
          <div className="flex items-center gap-6">
            <Link
              href="/privacy-policy"
              className="hover: transition underline-offset-4 hover:underline"
            >
              Privacy Policy
            </Link>
            <span className="text-sand/30">•</span>
            <Link
              href="/terms-of-use"
              className="hover: transition underline-offset-4 hover:underline"
            >
              Terms of Use
            </Link>
          </div>
        </div>

        {/* Powered by strip */}
        <div className="mt-6 bg-black rounded-md px-4 py-3 text-center">
          <p className="text-sand text-xs font-bold tracking-wide">
            Powered by Red Banks
          </p>
        </div>
      </div>
    </footer>
  );
}