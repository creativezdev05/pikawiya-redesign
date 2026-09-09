"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, X } from "lucide-react";

export default function HeroVideo_Old() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Check sessionStorage only after component mounts on client
    const hasSeenVideo = sessionStorage.getItem("pwhs_video_seen");
    // if (!hasSeenVideo) {
      setIsVisible(true);
    // }

    const handleScroll = () => {
      if (window.scrollY > 50) {
        dismissVideo();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const dismissVideo = () => {
    setIsVisible(false);
    sessionStorage.setItem("pwhs_video_seen", "true");
  };

  // Avoid rendering client-only UI until initial hydration completes
  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: "-100%" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-earth overflow-hidden"
        >
          <video
            autoPlay
            muted
            playsInline
            onEnded={dismissVideo}
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/assets/video_1.mp4" type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-gradient-to-t from-earth via-earth/40 to-transparent" />

          <div className="relative z-10 text-center px-4 max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-wide mb-4">
              Pika Wiya Health Service
            </h1>
            <p className="text-lg md:text-xl text-sand/90 mb-8">
              Empowering Community, Health, and Culture
            </p>

            <div className="flex flex-col items-center gap-4">
              <button
                onClick={dismissVideo}
                className="px-6 py-3 bg-ochre hover:bg-ochre-dark text-white font-medium rounded-full shadow-lg transition-all flex items-center gap-2"
              >
                <span>Enter Website</span>
                <ChevronDown className="w-4 h-4 animate-bounce" />
              </button>

              <button
                onClick={dismissVideo}
                className="text-sm text-sand/70 hover:text-white flex items-center gap-1 underline underline-offset-4"
              >
                <X className="w-3 h-3" /> Skip intro
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}