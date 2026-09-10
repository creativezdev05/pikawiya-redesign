import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import CulturalPattern from "./CulturalPattern";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[#000D1F] text-sand border-t border-ochre/30 mt-auto">
      <CulturalPattern variant="footer" className="cultural-pattern--footer" />
      <div aria-hidden="true" className="cultural-background cultural-background--footer" />
      <div className="absolute inset-0 bg-[#000D1F]/78" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand / About Column */}
          <div className="md:col-span-2 space-y-4">
            <span className="block text-ochre uppercase tracking-[0.22em] text-xs font-semibold mb-3">Pika Wiya Health Service</span>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
              Pika Wiya Health Service
            </h2>
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
            <h3 className="text-sm font-semibold uppercase tracking-wider text-ochre">
              Contact & Location
            </h3>
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
      </div>
    </footer>
  );
}