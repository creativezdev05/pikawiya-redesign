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
  const endVideoRef = useRef<HTMLVideoElement | null>(null);

  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const [isSkipped, setIsSkipped] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showHeading, setShowHeading] = useState(true);
  const [showEndImage, setShowEndImage] = useState(false);
  // Once the closing sequence starts, the scroll-driven video is unmounted for good — it stays
  // fully covered by the opaque closing video the whole time, so removing it here is invisible.
  // This is what's checked when the closing video later fades out: without it, that fade briefly
  // reveals the scroll video's stale last frame instead of a clean black background.
  const [hasEnded, setHasEnded] = useState(false);

  const targetProgressRef = useRef(0);
  const animationFrameIdRef = useRef<number | null>(null);
  const prevProgressRef = useRef(0);
  const downGestureCountRef = useRef(0);
  const isDownGestureActiveRef = useRef(false);
  const gestureEndTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasTriggeredEndRef = useRef(false);

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

  // When the video finishes on its own (scrolled all the way through), play a full closing
  // video before handing off to the rest of the site, instead of exiting instantly.
  const triggerEndSequence = () => {
    if (hasTriggeredEndRef.current) return;
    hasTriggeredEndRef.current = true;
    setShowEndImage(true);
    setHasEnded(true);
  };

  // The closing video runs to completion (no timer), and the page stays scroll-locked for
  // the whole playback (see effect below). Hand off the instant it ends, in the same tick as
  // the scroll reset — fading the overlay out first and swapping content afterwards (on a
  // delay) left a gap where the unmounted scroll-video track's black background showed through.
  const handleEndVideoEnded = () => {
    handleExitVideo();
  };

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Ignore scroll calculations until hydration completes
    if (!isMounted) return;

    targetProgressRef.current = latest;

    // Track heading visibility by discrete forward scroll gestures: two down-gestures hide it.
    // It only comes back once the user scrolls all the way back to the very start of the video.
    const delta = latest - prevProgressRef.current;
    prevProgressRef.current = latest;

    if (latest <= 0.001) {
      downGestureCountRef.current = 0;
      isDownGestureActiveRef.current = false;
      if (gestureEndTimeoutRef.current) clearTimeout(gestureEndTimeoutRef.current);
      setShowHeading(true);
    } else if (delta > 0.0004) {
      if (!isDownGestureActiveRef.current) {
        isDownGestureActiveRef.current = true;
        downGestureCountRef.current += 1;
        if (downGestureCountRef.current >= 2) {
          setShowHeading(false);
        }
      }
      if (gestureEndTimeoutRef.current) clearTimeout(gestureEndTimeoutRef.current);
      gestureEndTimeoutRef.current = setTimeout(() => {
        isDownGestureActiveRef.current = false;
      }, 200);
    } else if (delta < -0.0004) {
      // Scrolling back up mid-video: stop the current down-gesture streak but keep the
      // heading hidden until the user is back at the very start (handled above).
      isDownGestureActiveRef.current = false;
      if (gestureEndTimeoutRef.current) clearTimeout(gestureEndTimeoutRef.current);
    }

    // Only auto-remove if user scrolled all the way down AND page isn't just loading at scroll 0
    if (latest >= 0.98 && window.scrollY > 200) {
      triggerEndSequence();
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

    // Touch devices decode/seek much slower than desktop — firing a precise `currentTime`
    // seek on every rAF (up to 60/sec) queues up faster than the decoder can keep up,
    // which is what shows up as stutter on mobile scroll. Seek less often and less
    // precisely there, and prefer `fastSeek` (jumps to the nearest keyframe, no
    // frame-accurate decode) where the browser supports it.
    const isCoarsePointer =
      typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
    const seekThreshold = isCoarsePointer ? 0.05 : 0.01;
    const minSeekIntervalMs = isCoarsePointer ? 1000 / 24 : 0;
    const canFastSeek = typeof video.fastSeek === "function";

    let currentVideoTime = 0;
    let lastSeekTime = 0;

    const updateVideoFrame = (now: number) => {
      if (video.duration) {
        const targetTime = targetProgressRef.current * video.duration;

        // Smooth interpolation
        currentVideoTime += (targetTime - currentVideoTime) * 0.12;

        const dueForSeek = now - lastSeekTime >= minSeekIntervalMs;
        if (dueForSeek && Math.abs(video.currentTime - currentVideoTime) > seekThreshold) {
          if (canFastSeek) {
            video.fastSeek(currentVideoTime);
          } else {
            video.currentTime = currentVideoTime;
          }
          lastSeekTime = now;
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

  useEffect(() => {
    return () => {
      if (gestureEndTimeoutRef.current) {
        clearTimeout(gestureEndTimeoutRef.current);
      }
    };
  }, []);

  // Freeze the page in place for the whole closing-video playback, so scrolling can't
  // carry the user past the video into the next section before it's done.
  useEffect(() => {
    if (showEndImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showEndImage]);

  // Start the closing video from the beginning each time it's shown
  useEffect(() => {
    const video = endVideoRef.current;
    if (!video || !showEndImage) return;
    video.currentTime = 0;
    video.play().catch(() => {});
  }, [showEndImage]);

  if (isSkipped) return null;

  return (
    <div ref={containerRef} className="relative h-[350vh] bg-black">
      {/* Everything below unmounts for good once the closing sequence starts. At that point it's
          fully covered by the opaque closing video, so removing it is invisible — and it must
          happen now rather than after the closing video finishes, otherwise that video's fade-out
          briefly reveals this section still sitting on its last scrolled frame. */}
      {!hasEnded && (
        <>
          {/* Action Controls — kept outside the sticky viewport: `position: sticky` creates its own stacking
              context, which trapped these under the fixed Navbar (z-50) no matter their z-index. Here they're a
              fixed layer above the nav, offset below the header and the device safe area. */}
          <div className="fixed right-4 top-[calc(env(safe-area-inset-top)+1rem)] z-[60] flex flex-wrap items-center justify-end gap-3 sm:right-8 sm:top-[calc(env(safe-area-inset-top)+1.25rem)] sm:gap-4">
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

          {/* Sticky Fullscreen Viewport — h-dvh (not h-screen/100vh) so the video fills the
              real visible viewport on mobile even as the browser chrome shows/hides */}
          <div className="sticky top-0 h-dvh w-full overflow-hidden">
            <video
              ref={videoRef}
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover z-0"
            >
              <source src="/assets/sample_keyframed.mp4" type="video/mp4" />
            </video>

            <div className="absolute inset-0 bg-black/30 z-10" />

            {/* Hero Title Overlay — pinned to the top; hides after 2 forward scroll gestures,
                only reappears once scrolled back to the very start of the video */}
            <motion.div
              className="absolute inset-x-0 top-0 z-20 pt-28 sm:pt-32 text-center max-w-3xl mx-auto px-4 pointer-events-none"
              animate={{ opacity: showHeading ? 1 : 0, y: showHeading ? 0 : -24 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <PageTitle onDark className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
                Pika Wiya Health Service
              </PageTitle>
              <p className="text-lg md:text-xl text-sand/90">
                Scroll down to walk through the experience.
              </p>
            </motion.div>

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
        </>
      )}

      {/* Full-page closing video, played once the scroll video finishes; runs to completion
          (scroll locked the whole time) before handing off to the rest of the site.
          Mounted permanently (not gated behind `showEndImage`) with preload="auto" so the
          browser has the whole scroll track's worth of time to buffer it — scrolling fast
          enough to hit the end sequence sooner than usual used to outrun an on-demand mount,
          leaving a black gap before the first frame painted. Visibility toggles via opacity
          instead, which is instant either way. */}
      <div
        aria-hidden={!showEndImage}
        className={`fixed inset-0 z-[90] bg-black transition-opacity duration-300 ${
          showEndImage ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <video
          ref={endVideoRef}
          muted
          playsInline
          preload="auto"
          onEnded={handleEndVideoEnded}
          // object-contain on mobile so the full video stays in frame instead of being
          // cropped left/right on narrow portrait screens — the black bg makes any
          // letterboxing invisible. Wider (sm+) screens keep the fill-the-screen cover.
          className="absolute inset-0 w-full h-full object-contain sm:object-cover"
        >
          <source src="/assets/videologo.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
}