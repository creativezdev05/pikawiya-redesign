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
import PageTitle from "@/components/PageTitle";
import TrLogo from "@/components/TrLogo";

const mainServices = [
  {
    name: "Clinical Health Care",
    icon: Heart,
    desc: "General Practitioner care, chronic disease management, and primary nursing.",
    image: "/assets/services/core-services/clinic-health-care.jpg",
    objectPosition: "center 68%",
  },
  {
    name: "Family Support",
    icon: Users,
    desc: "Maternal and child health services, parenting programs, and early intervention.",
    image: "/assets/services/core-services/family-support.jpg",
    objectPosition: "center 58%",
  },
  {
    name: "Women's & Men's Health",
    icon: UserCheck,
    desc: "Gender-specific clinical care, health checks, and preventative education.",
    image: "/assets/services/core-services/men-women-health.jpg",
    objectPosition: "center 55%",
  },
  {
    name: "Youth Programs",
    icon: Sparkles,
    desc: "Youth engagement, physical health, active sports, and community leadership.",
    image: "/assets/services/core-services/youth-programe.jpg",
    objectPosition: "center 72%",
  },
  {
    name: "Cultural Support",
    icon: Compass,
    desc: "Care grounded in community connection, traditional knowledge, and Elders' wisdom.",
    image: "/assets/services/core-services/cultural-support.jpg",
    objectPosition: "center 70%",
  },
  {
    name: "Emotional Wellbeing",
    icon: Shield,
    desc: "Social and emotional wellbeing support, mental health services, and counseling.",
    image: "/assets/services/core-services/emotional-wellbeing.jpg",
    objectPosition: "center 68%",
  },
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
    <div className="relative bg-page min-h-screen">
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
            <PageTitle as="h2" onDark className="text-3xl font-bold">
              Our Story Starts From Here
            </PageTitle>
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

      {/* CORE SERVICES — tall cultural columns */}
      <section className="relative overflow-hidden landing-ink py-20 md:py-28">
        <CulturalPattern variant="services" showFeet />
        <TrLogo motion="wave" placement="tr" className="tr-logo--hero" />
        <div className="absolute inset-0 z-0 landing-ink-veil--soft" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-12 gap-6">
            <div className="max-w-2xl space-y-4">
              <span className="inline-flex items-center gap-2.5 text-ochre text-sm md:text-base font-bold uppercase tracking-[0.14em]">
                <span className="h-px w-10 bg-ochre" /> What we provide
              </span>
              <PageTitle as="h2" onDark className="text-[clamp(1.8rem,3.8vw,3rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
                Our Core Services
              </PageTitle>
              <p className="text-sand/75 text-base md:text-lg leading-relaxed">
                Comprehensive clinical and community services delivered with{" "}
                <strong className="accent-text">respect, cultural safety</strong>, and community control.
              </p>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-ochre font-semibold text-sm hover:gap-3 transition-all"
            >
              View All Services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
            {mainServices.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="group relative min-h-[340px] md:min-h-[420px] overflow-hidden border border-ochre/25"
                >
                  <NextImage
                    src={item.image}
                    alt=""
                    fill
                    sizes="(max-width: 1280px) 50vw, 16vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                    style={{ objectPosition: item.objectPosition }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/55 to-navy/20" />
                  <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-end">
                    <div className="w-10 h-10 rounded-full bg-ochre/20 border border-ochre/40 text-ochre flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base md:text-lg font-bold text-white mb-2 leading-snug">{item.name}</h3>
                    <p className="text-sand/75 text-xs md:text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* MISSION STATEMENT — white */}
      <section className="relative overflow-hidden landing-paper py-20 md:py-24">
        <CulturalPattern variant="mission" className="cultural-pattern--light" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-center">
          <div className="space-y-5">
            <span className="inline-flex items-center gap-2.5 text-ochre text-sm md:text-base font-bold uppercase tracking-[0.14em]">
              <span className="h-px w-10 bg-ochre" /> Mission statement
            </span>
            <PageTitle as="h3" className="text-[clamp(1.7rem,3.5vw,2.75rem)] font-extrabold leading-[1.1] tracking-[-0.02em]">
              Empowering community through health, dignity and culture
            </PageTitle>
            <p className="text-ink/75 text-base md:text-lg leading-relaxed max-w-2xl">
              Pika Wiya Health Service Aboriginal Corporation will provide a{" "}
              <strong className="accent-text">culturally appropriate service</strong> to Aboriginal and Torres
              Strait Islander people, addressing preventative, promotive and curative aspects of health, which
              encourages our community to achieve greater{" "}
              <strong className="accent-text">dignity and quality of life</strong> equal with all Australians.
            </p>
          </div>

          <div className="relative min-h-[420px] md:min-h-[480px] overflow-hidden border border-ochre/30 group">
            <NextImage
              src="/assets/about/Rachael-Schmerl.jpeg"
              alt="Rachael Schmerl, Chief Executive Officer of Pika Wiya Health Service"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-center scale-[1.15] -translate-y-[6%] transition duration-700 group-hover:scale-[1.18]"
            />
            {/* Stylish name banner */}
            <div className="absolute bottom-5 left-5 right-5">
              <div className="relative overflow-hidden bg-navy/92 border-l-4 border-ochre px-5 py-4 backdrop-blur-sm shadow-lg">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage: "radial-gradient(rgba(232,93,38,0.45) 1px, transparent 1px)",
                    backgroundSize: "10px 10px",
                  }}
                />
                <p className="relative text-ochre text-xs font-bold uppercase tracking-[0.18em]">
                  Rachael Schmerl
                </p>
                <p className="relative text-white text-base md:text-lg font-semibold mt-1">
                  Chief Executive Officer
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AboutHome />

      {/* CULTURAL HERITAGE — white (after navy values / ochre purpose) */}
      <section className="relative overflow-hidden landing-paper py-20 md:py-28">
        <CulturalPattern variant="heritage" className="cultural-pattern--light" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div className="relative min-h-[380px] md:min-h-[460px] overflow-hidden border border-ochre/30 order-2 lg:order-1">
              <NextImage
                src="/assets/home/services-heritage-800.webp"
                alt="Aboriginal cultural heritage artwork"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="space-y-6 order-1 lg:order-2">
              <span className="inline-flex items-center gap-2.5 text-ochre text-sm md:text-base font-bold uppercase tracking-[0.14em]">
                <span className="h-px w-10 bg-ochre" /> Governance &amp; Culture
              </span>
              <PageTitle as="h2" className="text-[clamp(1.8rem,3.8vw,2.9rem)] font-extrabold leading-[1.08] tracking-[-0.02em]">
                Walking with our ancestors. Building for community.
              </PageTitle>
              <p className="text-ink/75 leading-relaxed text-base md:text-lg max-w-xl">
                Pika Wiya Health Service operates under the guidance of our{" "}
                <strong className="accent-text">Aboriginal Board of Directors</strong> and constitution. We
                walk paths shaped by our ancestors — honouring tradition while ensuring{" "}
                <strong className="accent-text">community priorities</strong> drive every aspect of our care.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/governance"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-ochre hover:bg-ochre-dark text-white text-sm font-semibold transition"
                >
                  Governance &amp; Rule Book
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-6 py-3.5 border border-border hover:bg-ink/5 text-ink text-sm font-semibold transition"
                >
                  Learn About PWHS
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT — navy */}
      <section className="relative overflow-hidden landing-ink py-20 md:py-28 px-6 md:px-10">
        <CulturalPattern variant="contact" showFeet />
        <div aria-hidden="true" className="cultural-background cultural-background--contact" />
        <div className="absolute inset-0 z-0 landing-ink-veil" />
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="text-center mb-10 space-y-4">
            <span className="inline-flex items-center gap-2.5 text-ochre text-sm md:text-base font-bold uppercase tracking-[0.14em]">
              <span className="h-px w-10 bg-ochre" /> Connect with us <span className="h-px w-10 bg-ochre" />
            </span>
            <PageTitle as="h2" onDark className="text-[clamp(1.8rem,3.8vw,2.9rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
              Get in Touch
            </PageTitle>
            <p className="text-sand/70 max-w-2xl mx-auto">
              Complete the form below to connect with our health services team or{" "}
              <strong className="accent-text">request an appointment</strong>.
            </p>
          </div>
          <div className="border border-white/10 border-t-4 border-t-ochre bg-surface p-8 md:p-12 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.45)]">
            <ContactForm />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}