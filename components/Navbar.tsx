"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, CalendarCheck, Phone } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Forms", href: "/forms" },
    { name: "Vaccines", href: "/vaccines" },
    { name: "News & Announcements", href: "/news" },
    { name: "Corporate Documents", href: "/corporate-documents" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="header sticky top-0 z-50 bg-earth/95 backdrop-blur-md border-b border-ochre/20 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center gap-4">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Image
            src="/assets/PWHS_Logo_Orange.png"
            alt="Pika Wiya Health Service Logo"
            width={180}
            height={60}
            className="h-12 w-auto object-contain"
            priority
          />
        </Link>

        <nav className="hidden xl:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative py-3 transition-colors duration-200 group flex flex-col items-center justify-center ${
                  isActive ? "text-white font-bold" : "text-[#ffffffbf] hover:text-white"
                }`}
              >
                <span>{link.name}</span>
                <span
                  aria-hidden="true"
                  className={`absolute bottom-0 left-0 w-full h-[3px] bg-[#E06D20] transition-all duration-300 ease-in-out ${
                    isActive
                      ? "opacity-100 scale-x-100"
                      : "opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-2.5 shrink-0">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-ochre hover:bg-ochre-dark text-white text-xs font-semibold transition"
          >
            <CalendarCheck className="w-4 h-4" />
            Book Appointment
          </Link>
          <a
            href="tel:0886429991"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 border border-ochre/60 text-ochre hover:bg-ochre/10 text-xs font-semibold transition"
          >
            <Phone className="w-4 h-4" />
            Call
          </a>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="xl:hidden p-2 text-white hover:text-ochre focus:outline-none"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="xl:hidden bg-earth border-b border-ochre/20 px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block text-base font-medium transition-colors border-l-4 pl-3 ${
                  isActive
                    ? "border-[#E06D20] text-ochre font-semibold"
                    : "border-transparent text-white hover:text-ochre hover:border-[#E06D20]"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-3 flex flex-col gap-2">
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-ochre text-white text-sm font-semibold"
            >
              <CalendarCheck className="w-4 h-4" />
              Book Appointment
            </Link>
            <a
              href="tel:0886429991"
              className="inline-flex items-center justify-center gap-2 px-4 py-3 border border-ochre/60 text-ochre text-sm font-semibold"
            >
              <Phone className="w-4 h-4" />
              Call (08) 8642 9991
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
