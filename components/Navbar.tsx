"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, CalendarCheck, Phone } from "lucide-react";
import ButtonLink from "@/components/ButtonLink";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Forms", href: "/forms" },
    { name: "Vaccines", href: "/vaccines" },
    { name: "News", href: "/news" },
    { name: "Documents", href: "/corporate-documents" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header
      /* pointer-events-none lets clicks pass through empty transparent areas */
      className={`fixed top-0 left-0 right-0 z-50 pointer-events-none transition-all duration-300 ${
        scrolled
          ? "bg-earth/95 backdrop-blur-md border-b border-ochre/25 shadow-xl py-2"
          : "bg-transparent border-b border-transparent py-4"
      }`}
    >
      <div className="w-full px-4 lg:px-8 flex justify-between items-center gap-3 xl:grid xl:grid-cols-[1fr_auto_1fr]">
        
        {/* Brand Logo - Re-enable clicks */}
        <Link 
          href="/" 
          className="pointer-events-auto flex items-center gap-2 shrink-0 justify-self-start transition-transform duration-300 hover:scale-[1.02]"
        >
          <Image
            src="/assets/PWHS_Logo_Orange.png"
            alt="Pika Wiya Health Service Logo"
            width={180}
            height={60}
            className="h-10 md:h-12 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Links - Re-enable clicks */}
        <nav
          className={`pointer-events-auto hidden xl:flex items-center gap-1.5 p-1 rounded-full border backdrop-blur-md shrink-0 transition-colors duration-300 ${
            scrolled ? "bg-white/[0.06] border-white/10" : "bg-white/30 border-earth/10"
          }`}
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-4 py-1.5 rounded-full text-xs font-semibold tracking-tight whitespace-nowrap transition-all duration-300 ${
                  isActive
                    ? "bg-ochre text-white shadow-md shadow-ochre/30"
                    : scrolled
                      ? "text-sand/90 hover:text-white hover:bg-white/10"
                      : "text-earth/85 hover:text-earth hover:bg-earth/10"
                }`}
              >
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right cell: actions + mobile toggle, pinned to the far right */}
        <div className="flex items-center justify-end gap-2 justify-self-end">
        {/* Action Buttons - Re-enable clicks */}
        <div className="pointer-events-auto hidden lg:flex items-center gap-2 shrink-0">
          <ButtonLink
            href="/contact"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-ochre hover:bg-ochre-dark text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-ochre/20 transition-all duration-300 hover:shadow-ochre/40 whitespace-nowrap"
          >
            <CalendarCheck className="w-4 h-4 shrink-0 mr-2" />
            <span>Book Appointment</span>
          </ButtonLink>

          <a
            href="tel:0886429991"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-ochre/50 text-ochre hover:bg-ochre hover:text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap"
          >
            <Phone className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden 2xl:inline">Call</span>
          </a>

          <ButtonLink
            href="https://pikawiya-admin.vercel.app/"
            target="_blank"
            className={`inline-flex items-center justify-center p-2 rounded-full border border-ochre/50 hover:bg-ochre hover:text-white transition-all duration-300 whitespace-nowrap ${
              scrolled ? "text-white" : "text-earth"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-user-round shrink-0"
            >
              <circle cx="12" cy="8" r="5" />
              <path d="M20 21a8 8 0 0 0-16 0" />
            </svg>
          </ButtonLink>
        </div>

        {/* Mobile Toggle - Re-enable clicks */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`pointer-events-auto xl:hidden p-2 rounded-xl bg-white/10 border focus:outline-none backdrop-blur-md transition-colors duration-300 ${
            scrolled
              ? "border-white/20 text-sand hover:text-white"
              : "border-earth/20 text-earth hover:text-earth/70"
          }`}
          aria-label="Toggle Navigation Menu"
        >
          {isOpen ? <X className="w-6 h-6 text-ochre" /> : <Menu className="w-6 h-6" />}
        </button>
        </div>
      </div>

      {/* Mobile Menu Drawer - Re-enable clicks */}
      {isOpen && (
        <div className="pointer-events-auto xl:hidden bg-earth/98 backdrop-blur-xl border-b border-ochre/30 px-6 pt-4 pb-8 space-y-4 shadow-2xl animate-in slide-in-from-top-4 duration-200 mt-2">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-ochre/20 text-ochre border border-ochre/30 font-bold"
                      : "text-sand/80 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>{link.name}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-ochre" />}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            <a
              href="tel:0886429991"
              className="inline-flex items-center justify-center px-5 py-3.5 rounded-xl border border-ochre/50 text-ochre text-sm font-bold hover:bg-ochre/10"
            >
              <Phone className="w-4 h-4 mr-3 shrink-0" />
              <span>Call (08) 8642 9991</span>
            </a>
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}  
              className="inline-flex items-center justify-center px-5 py-3.5 rounded-xl bg-ochre text-white text-sm font-bold hover:bg-ochre-dark"
            >
              <CalendarCheck className="w-4 h-4 mr-3 shrink-0" />
              <span>Book Appointment</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}