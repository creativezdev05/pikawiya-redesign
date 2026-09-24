"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, CalendarCheck, Phone, Icon } from "lucide-react";
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
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-earth/95 backdrop-blur-md border-b border-ochre/25 shadow-xl py-2"
          : "bg-earth/90 backdrop-blur-sm border-b border-white/10 py-3"
      }`}
    >
      {/* Increased max-width from 7xl to 1400px & adjusted horizontal padding */}
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6 flex justify-between items-center gap-3">
        
        {/* Brand Logo */}
        <Link 
          href="/" 
          className="flex items-center gap-2 shrink-0 transition-transform duration-300 hover:scale-[1.02]"
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

        {/* Desktop Links - Tightened padding (px-2.5) & text size (text-[11px] 2xl:text-xs) */}
        <nav className="hidden xl:flex items-center gap-0.5 bg-white/[0.04] p-1 rounded-full border border-white/10 backdrop-blur-md shrink-0">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-3 py-1.5 rounded-full text-xs font-semibold tracking-tight whitespace-nowrap transition-all duration-300 ${
                  isActive
                    ? "bg-ochre text-white shadow-md shadow-ochre/30"
                    : "text-sand/80 hover:text-white hover:bg-white/10"
                }`}
              >
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons - Compact padding & whitespace protection */}
        <div className="hidden lg:flex items-center gap-2 shrink-0 flex-1">
          <ButtonLink
            href="/contact"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-ochre hover:bg-ochre-dark text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-ochre/20 transition-all duration-300 hover:shadow-ochre/40 whitespace-nowrap"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Book Appointment</span>
          </ButtonLink>

          <a
            href="tel:0886429991"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-ochre/50 text-ochre hover:bg-ochre hover:text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap"
          >
            <Phone className="w-3.5 h-3.5" />
            <span className="hidden 2xl:inline">Call</span>
          </a>
          <ButtonLink
            href="https://pikawiya-admin.vercel.app/" target="_blank"
            className="ml-auto inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-ochre/50 text-white hover:bg-ochre hover:text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap"
          >
            <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg></span>
          </ButtonLink>

        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="xl:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-sand hover:text-white focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          {isOpen ? <X className="w-6 h-6 text-ochre" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="xl:hidden bg-earth/98 backdrop-blur-xl border-b border-ochre/30 px-6 pt-4 pb-8 space-y-4 shadow-2xl animate-in slide-in-from-top-4 duration-200">
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
              {/* Added mr-3 here as well for visual consistency */}
              <Phone className="w-4 h-4 mr-3 shrink-0" />
              <span>Call (08) 8642 9991</span>
            </a>
            <a
               href="/contact"
               onClick={() => setIsOpen(false)}  
              className=""
            >
              {/* Added mr-3 here as well for visual consistency */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-calendar preview-icon"><path d="M8 2v3"/><path d="M16 2v3"/><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>

              <span>Book Appointment</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}