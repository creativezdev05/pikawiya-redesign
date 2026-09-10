"use client";

import { useState, useRef, useEffect, MouseEvent, WheelEvent } from "react";
import HeroVideo from "@/components/HeroVideo";
import AboutHome from "@/components/AboutHome";
import { motion, AnimatePresence } from "framer-motion";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  X,
  Heart,
  Users,
  UserCheck,
  Sparkles,
  Shield,
  Compass,
  ArrowRight,
} from "lucide-react";
import NextImage from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import CulturalPattern from "@/components/CulturalPattern";

const mainServices = [
  { name: "Clinical Health Care", icon: Heart, desc: "General Practitioner care, chronic disease management, and primary nursing." },
  { name: "Family Support", icon: Users, desc: "Maternal and child health services, parenting programs, and early intervention." },
  { name: "Women's & Men's Health", icon: UserCheck, desc: "Gender-specific clinical care, health checks, and preventative education." },
  { name: "Youth Programs", icon: Sparkles, desc: "Youth engagement, physical health, active sports, and community leadership." },
  { name: "Cultural Support", icon: Compass, desc: "Care grounded in community connection, traditional knowledge, and Elders' wisdom." },
  { name: "Emotional Wellbeing", icon: Shield, desc: "Social and emotional wellbeing support, mental health services, and counseling." },
];

export default function LandingPage() {
  const [showVideoIntro, setShowVideoIntro] = useState(true);
  const [isExploring, setIsExploring] = useState(false);
  const [isZoomingIn, setIsZoomingIn] = useState(false);

  // Canvas State for 360 Interactive Viewer
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const [touchStartDist, setTouchStartDist] = useState<number | null>(null);
  const [lastTouchPos, setLastTouchPos] = useState<{ x: number; y: number } | null>(null);

  // CORS-friendly Panorama Image
  // const imageUrl = "https://images.unsplash.com/photo-1557971370-e7298ee473fb?q=80&w=2500&auto=format&fit=crop";
  const imageUrl = "/assets/5+98 (2).jpeg";


  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    img.onload = () => {
      imageRef.current = img;
      renderCanvas();
    };
  }, []);
  
    useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, []);

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imageRef.current) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imageRef.current;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.save();

    const scaleFactor = Math.max(canvasHeight / img.height, 1) * zoom;
    const scaledWidth = img.width * scaleFactor;
    const scaledHeight = img.height * scaleFactor;

    // Wrap pan horizontally to prevent black gaps
    const wrappedX = ((pan.x % scaledWidth) + scaledWidth) % scaledWidth;

    ctx.translate(canvasWidth / 2, canvasHeight / 2 + pan.y);

    // Multi-tile seamless draw
    ctx.drawImage(img, wrappedX - scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight);
    ctx.drawImage(img, wrappedX - scaledWidth * 1.5, -scaledHeight / 2, scaledWidth, scaledHeight);
    ctx.drawImage(img, wrappedX + scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight);

    ctx.restore();
  };

  useEffect(() => {
    if (isExploring) {
      renderCanvas();
    }
  }, [zoom, pan, isExploring]);

  useEffect(() => {
    if (isExploring) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isExploring]);

  const handleStartExploring = () => {
    setIsZoomingIn(true);
    setTimeout(() => {
      setIsExploring(true);
      setIsZoomingIn(false);
    }, 700);
  };

  const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!isExploring) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !isExploring) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: WheelEvent<HTMLCanvasElement>) => {
    if (!isExploring) return;
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    setZoom((prev) => Math.min(Math.max(prev * zoomFactor, 0.5), 4));
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };
// Get touch distance for multi-touch pinch zoom
  const getTouchDistance = (touches: React.TouchList) => {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
  };

const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
  if (e.touches.length === 1) {
    // Single finger pan
    const touch = e.touches[0];
    setLastTouchPos({ x: touch.clientX, y: touch.clientY });
  } else if (e.touches.length === 2) {
    // Two fingers pinch zoom
    setTouchStartDist(getTouchDistance(e.touches));
  }
};

const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
  if (e.touches.length === 1 && lastTouchPos) {
    // Single touch drag / pan
    const touch = e.touches[0];
    const deltaX = touch.clientX - lastTouchPos.x;
    const deltaY = touch.clientY - lastTouchPos.y;

    // Adjust pan coordinates (map deltaX / deltaY to your canvas offset state)
    setPan((prev) => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY,
    }));

    setLastTouchPos({ x: touch.clientX, y: touch.clientY });
  } else if (e.touches.length === 2 && touchStartDist !== null) {
    // Pinch to zoom calculation
    const currentDist = getTouchDistance(e.touches);
    const zoomFactor = currentDist / touchStartDist;

    setZoom((prevZoom) => {
      const newZoom = prevZoom * (zoomFactor > 1 ? 1.03 : 0.97);
      return Math.min(Math.max(newZoom, 0.5), 4);
    });

    setTouchStartDist(currentDist);
  }
};

const handleTouchEnd = () => {
  setLastTouchPos(null);
  setTouchStartDist(null);
};
  return (
    <div className="relative bg-earth min-h-screen">
      {/* SECTION 1: SCROLL-DRIVEN HERO VIDEO */}
      {showVideoIntro && (
        <HeroVideo onEnterWebsite={() => setShowVideoIntro(false)} />
      )}

      <Navbar />

      {/* SECTION 2: 360 EXPLORATION BANNER */}
      <section className="relative w-full h-screen bg-black flex flex-col items-center justify-center overflow-hidden">
        <motion.div
          animate={isZoomingIn ? { scale: 2.5, opacity: 0 } : { scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="relative w-full h-full flex items-center justify-center origin-center"
        >
          <img
            src={imageUrl}
            alt="Pika Wiya Facility View"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 space-y-4">
            <Compass className="w-16 h-16 text-ochre animate-pulse" />
            <h2 className="text-3xl font-bold text-white">Our Story Starts From Here</h2>
            <p className="text-sm max-w-md text-gray-300">
              Take a virtual walk through our facilities with pan and zoom capabilities.
            </p>
            <button
              onClick={handleStartExploring}
              disabled={isZoomingIn}
              className="px-8 py-3 bg-ochre hover:bg-ochre-dark font-semibold text-white rounded-full transition transform hover:scale-105 shadow-lg cursor-pointer"
            >
              {isZoomingIn ? "Zooming In..." : "Start 360 Exploration"}
            </button>
          </div>
        </motion.div>
      </section>

      {/* FULLSCREEN 360 CANVAS MODAL */}
      <AnimatePresence>
        {isExploring && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden"
          >
            <canvas
              ref={canvasRef}
              width={1280}
              height={720}
              // Mouse Controls
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onWheel={handleWheel}
              // Touch Controls (Mobile)
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="w-full h-full object-cover cursor-grab active:cursor-grabbing touch-none select-none"
            />

            <div className="absolute top-6 right-6 flex items-center gap-3 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 z-50">
              <button
                onClick={() => setZoom((prev) => Math.min(prev * 1.2, 4))}
                className="p-2 text-white hover:text-ochre transition cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-5 h-5" />
              </button>

              <button
                onClick={() => setZoom((prev) => Math.max(prev / 1.2, 0.5))}
                className="p-2 text-white hover:text-ochre transition cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-5 h-5" />
              </button>

              <button
                onClick={handleReset}
                className="p-2 text-white hover:text-ochre transition cursor-pointer"
                title="Reset View"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <div className="w-px h-6 bg-white/20 mx-1" />

              <button
                onClick={() => setIsExploring(false)}
                className="flex items-center gap-1 px-3 py-1.5 bg-red-600/80 hover:bg-red-600 text-white text-xs font-semibold rounded-full transition cursor-pointer"
              >
                <X className="w-4 h-4" /> Exit 360
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AboutHome />

      {/* CORE SERVICES */}
      <section className="relative overflow-hidden bg-white py-24">
        <CulturalPattern variant="services" className="cultural-pattern--light" />
        <div aria-hidden="true" className="cultural-background cultural-background--services">
          <NextImage src="/assets/home/dot-pattern-dark.webp" alt="" fill sizes="100vw" />
        </div>
        <div className="absolute inset-0 z-0 bg-white/75" />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <span className="inline-flex items-center gap-3 text-ochre uppercase tracking-[0.22em] text-xs font-semibold mb-4"><span className="h-px w-10 bg-ochre" /> What we provide</span>
              <h2 className="text-4xl md:text-6xl font-bold text-earth mb-4 leading-none">Our Core Services</h2>
              <p className="text-earth/70 max-w-2xl text-lg leading-relaxed">
                Comprehensive clinical and community services delivered with respect, cultural safety, and community control.
              </p>
            </div>
            <Link
              href="/services"
              className="mt-4 md:mt-0 text-ochre hover:text-ochre-dark font-bold text-sm inline-flex items-center gap-1"
            >
              View All Services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-earth/20 border border-earth/20">
            {mainServices.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="bg-white/95 p-8 md:p-10 min-h-[260px] hover:bg-white transition">
                  <div className="w-12 h-12 border border-ochre/50 text-ochre flex items-center justify-center mb-8">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-earth mb-3">{item.name}</h3>
                  <p className="text-earth/70 text-sm leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CULTURAL HERITAGE BANNER */}
      <section className="py-24 bg-[#000D1F] text-sand relative overflow-hidden border-y border-ochre/30">
        <CulturalPattern variant="heritage" />
        <div aria-hidden="true" className="cultural-background cultural-background--heritage">
          <NextImage src="/assets/home/dot-pattern-dark.webp" alt="" fill sizes="100vw" />
        </div>
        <div className="absolute inset-0 z-0 bg-[#000D1F]/78" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-0 items-stretch border border-sand/15">
          <div className="relative min-h-[420px] overflow-hidden border-r border-ochre/30">
            <NextImage
              src="/assets/home/services-heritage-800.webp"
              alt="Aboriginal Artwork"
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-6 p-8 md:p-14 flex flex-col justify-center bg-[#000D1F]/70">
            <span className="inline-flex items-center gap-3 text-ochre text-sm font-semibold uppercase tracking-wider"><span className="h-px w-10 bg-ochre" /> Governance & Culture</span>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">Controlled by Community, Dedicated to Health</h2>
            <p className="text-sand/80 leading-relaxed text-lg">
              Pika Wiya Health Service operates under the guidance of our Aboriginal Board of Directors and constitution. We ensure community priorities drive every aspect of our care and community support programs.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/governance"
                className="px-5 py-3 bg-ochre hover:bg-ochre-dark  rounded-md text-sm font-medium transition"
              >
                Governance & Rule Book
              </Link>
              <Link
                href="/about"
                className="px-5 py-3 border border-sand/30 hover:bg-white/10 text-sand rounded-md text-sm font-medium transition"
              >
                Learn About PWHS
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT FORM SECTION */}
      <section className="relative overflow-hidden bg-white py-24 px-4">
        <CulturalPattern variant="contact" className="cultural-pattern--light" />
        <div aria-hidden="true" className="cultural-background cultural-background--contact">
          <NextImage src="/assets/home/dot-pattern-dark.webp" alt="" fill sizes="100vw" />
        </div>
        <div className="absolute inset-0 z-0 bg-white/82" />
        <div className="relative z-10 max-w-5xl mx-auto bg-white/90 backdrop-blur-sm p-8 md:p-14 border-t-4 border-ochre shadow-xl">
          <span className="block text-center text-ochre uppercase tracking-[0.22em] text-xs font-semibold mb-4">Connect with us</span>
          <h2 className="text-3xl md:text-5xl font-bold text-earth text-center mb-3">Get in Touch / Request an Appointment</h2>
          <p className="text-center text-earth/70 mb-10 max-w-2xl mx-auto">
            Complete the form below to connect with our health services team directly.
          </p>
          <ContactForm />
        </div>
      </section>
      <Footer/>
    </div>
  );
}