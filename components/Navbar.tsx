"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Forms", href: "/forms" },
    { name: "Governance", href: "/governance" },
    { name: "News & Announcements", href: "/news" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="header sticky top-0 z-50 bg-earth/95 backdrop-blur-md border-b border-ochre/20 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/assets/PWHS_Logo_Orange.png"
            alt="Pika Wiya Health Service Logo"
            width={180}
            height={60}
            className="h-12 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Nav with Guaranteed CSS Underline */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
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

                {/* Visible Underline Container */}
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

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 text-white hover:text-ochre focus:outline-none"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-earth border-b border-ochre/20 px-4 pt-2 pb-6 space-y-3">
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
        </div>
      )}
    </header>
  );
}