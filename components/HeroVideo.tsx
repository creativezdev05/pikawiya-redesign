"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { SkipForward, ArrowRight, ChevronDown } from "lucide-react";
import PageTitle from "@/components/PageTitle";

export interface HeroVideoProps {
  onEnterWebsite?: () => void;
}

export default function HeroVideo({ onEnterWebsite }: HeroVideoProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const [isSkipped, setIsSkipped] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const targetProgressRef = useRef(0);
  const animationFrameIdRef = useRef<number | null>(null);

  // Prevent instant unmount on SSR / initial hydration load
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const handleExitVideo = () => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setIsSkipped(true);
    if (onEnterWebsite) {
      onEnterWebsite();
    }
  };

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Ignore scroll calculations until hydration completes
    if (!isMounted) return;

    targetProgressRef.current = latest;

    // Only auto-remove if user scrolled all the way down AND page isn't just loading at scroll 0
    if (latest >= 0.98 && window.scrollY > 200) {
      handleExitVideo();
      return;
    }

    if (latest >= 0.88) {
      setIsVideoEnded(true);
    } else {
      setIsVideoEnded(false);
    }
  });

  // Lerp loop for smooth video frame updates
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let currentVideoTime = 0;

    const updateVideoFrame = () => {
      if (video.duration) {
        const targetTime = targetProgressRef.current * video.duration;

        // Smooth interpolation
        currentVideoTime += (targetTime - currentVideoTime) * 0.12;

        if (Math.abs(video.currentTime - currentVideoTime) > 0.01) {
          video.currentTime = currentVideoTime;
        }
      }

      animationFrameIdRef.current = requestAnimationFrame(updateVideoFrame);
    };

    animationFrameIdRef.current = requestAnimationFrame(updateVideoFrame);

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);

  if (isSkipped) return null;

  return (
    <div ref={containerRef} className="relative h-[350vh] bg-black">
      {/* Sticky Fullscreen Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/assets/ParallexVideo_keyframed.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/30 z-10" />

        {/* Action Controls */}
        <div className="absolute top-8 right-8 z-30 flex items-center gap-4">
          <button
            onClick={handleExitVideo}
            className="flex items-center gap-2 px-5 py-2.5 bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white text-sm font-semibold rounded-full transition shadow-lg cursor-pointer"
          >
            <SkipForward className="w-4 h-4 text-ochre" />
            Skip Intro
          </button>

          {isVideoEnded && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleExitVideo}
              className="flex items-center gap-2 px-6 py-2.5 bg-ochre hover:bg-ochre-dark text-white text-sm font-bold rounded-full transition shadow-xl cursor-pointer"
            >
              Enter Website
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          )}
        </div>

        {/* Hero Title Overlay */}
        <div className="relative z-20 text-center max-w-3xl px-4 pointer-events-none">
          <PageTitle onDark className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
            Pika Wiya Health Service
          </PageTitle>
          <p className="text-lg md:text-xl text-sand/90">
            Scroll down to walk through the experience.
          </p>
        </div>

        {/* Scroll Prompt */}
        {!isVideoEnded && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 animate-bounce pointer-events-none">
            <span className="text-xs uppercase tracking-widest text-sand/80 font-medium">
              Scroll to play video
            </span>
            <ChevronDown className="w-5 h-5 text-sand" />
          </div>
        )}
      </div>
    </div>
  );
}