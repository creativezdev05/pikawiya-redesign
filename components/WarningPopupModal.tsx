"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

export default function WarningPopupModal() {
  const [isOpen, setIsOpen] = useState(true);

  // Lock the background (video) from scrolling while the warning is up
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-b from-black/50 via-black/30 to-black/50 p-4 backdrop-blur-[2px] animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-earth-dark p-6 shadow-2xl transition-all animate-in zoom-in-95 duration-200 sm:max-w-2xl sm:p-8">
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white sm:right-4 sm:top-4"
          aria-label="Close warning"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Our logo mark, parallel with the heading */}
        <div className="mb-4 flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md sm:h-12 sm:w-12">
            <Image
              src="/assets/pika_wiya_logo.png"
              alt="Pika Wiya Health Service"
              fill
              sizes="48px"
              className="object-cover object-left"
              priority
            />
          </div>
          <h2 className="text-xl font-extrabold uppercase tracking-wide text-white sm:text-2xl">
            Warning
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-white/80 sm:text-base">
          This website may contain images, voices or names of deceased persons in
          photographs, film, audio or printed material.
        </p>
      </div>
    </div>
  );
}
