"use client";

import { useState, useRef, useEffect, MouseEvent, WheelEvent } from "react";
import HeroVideo from "@/components/HeroVideo";
import AboutHome from "@/components/AboutHome";
import NewsPopupModal from "@/components/NewsPopupModal";
import { motion, AnimatePresence } from "framer-motion";
import FramerMouseGradient from "@/components/FramerMouseGradient";
import PageHero from "@/components/PageHero";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  X,
  HeartHandshake,
  UserCheck,
  Sparkles,
  Shield,
  Compass,
  ArrowRight,
  Stethoscope,   // Clinical Care & GP
  Baby,          // Maternal, Child & Family Support
  Users,         // Gender-Specific / Community Health
  Flame,         // Youth Energy & Active Sports
  Sun,           // Cultural Knowledge & Connection
  Smile,
  UserRound         // Emotional Wellbeing & Mental Health
} from "lucide-react";
import NextImage from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import CulturalPattern from "@/components/CulturalPattern";
import PageTitle from "@/components/PageTitle";
import TrLogo from "@/components/TrLogo";
import PatternField from "@/components/PatternField";
import PartnersTicker from "@/components/PartnersTicker";
import ButtonLink from "@/components/ButtonLink";
import FlashlightContainer from "@/components/FlashlightContainer";
import CoreServicesSection from "@/components/CoreServicesSection";
import MissionSection from "@/components/MissionSection";
import GovernanceHeritageSection from "@/components/GovernanceHeritageSection";
import ContactSection from "@/components/ContactSection";
import OurStory from "@/components/OurStory";


export const mainServices = [
  {
    name: "Clinical Health Care",
    icon: Stethoscope,
    desc: "General Practitioner care, chronic disease management, and primary nursing.",
    image: "/assets/services/core-services/clinic-health-care.jpg",
    objectPosition: "center 90%",
    imageClass: "scale-[1.22] -translate-y-[16%]",
    badgeBg: "bg-teal-500/10 border-teal-500/30 text-teal-400",
    iconColor: "text-teal-400 group-hover:scale-110",
    glowColor: "group-hover:shadow-[0_10px_35px_rgba(20,184,166,0.35)]",
    borderColor: "hover:border-teal-500/50",
  },
  {
    name: "Family Support",
    icon: UserRound,
    desc: "Maternal and child health services, parenting programs, and early intervention.",
    image: "/assets/services/core-services/family-support.jpg",
    objectPosition: "center 52%",
    badgeBg: "bg-rose-500/10 border-rose-500/30 text-rose-400",
    iconColor: "text-rose-400 group-hover:scale-110",
    glowColor: "group-hover:shadow-[0_10px_35px_rgba(244,63,94,0.35)]",
    borderColor: "hover:border-rose-500/50",
  },
  {
    name: "Women's & Men's Health",
    icon: HeartHandshake,
    desc: "Gender-specific clinical care, health checks, and preventative education.",
    image: "/assets/services/core-services/men-women-health.jpg",
    objectPosition: "center 62%",
    badgeBg: "bg-indigo-500/10 border-indigo-500/30 text-indigo-400",
    iconColor: "text-indigo-400 group-hover:scale-110",
    glowColor: "group-hover:shadow-[0_10px_35px_rgba(99,102,241,0.35)]",
    borderColor: "hover:border-indigo-500/50",
  },
  {
    name: "Youth Programs",
    icon: Flame,
    desc: "Youth engagement, physical health, active sports, and community leadership.",
    image: "/assets/services/core-services/youth-programe.jpg",
    objectPosition: "center 72%",
    badgeBg: "bg-orange-500/10 border-orange-500/30 text-orange-400",
    iconColor: "text-orange-400 group-hover:scale-110",
    glowColor: "group-hover:shadow-[0_10px_35px_rgba(249,115,22,0.35)]",
    borderColor: "hover:border-orange-500/50",
  },
  {
    name: "Cultural Support",
    icon: Sun,
    desc: "Care grounded in community connection, traditional knowledge, and Elders' wisdom.",
    image: "/assets/services/core-services/cultural-support.jpg",
    objectPosition: "center 68%",
    badgeBg: "bg-amber-500/10 border-amber-500/30 text-amber-400",
    iconColor: "text-amber-400 group-hover:scale-110",
    glowColor: "group-hover:shadow-[0_10px_35px_rgba(245,158,11,0.35)]",
    borderColor: "hover:border-amber-500/50",
  },
  {
    name: "Emotional Wellbeing",
    icon: Smile,
    desc: "Social and emotional wellbeing support, mental health services, and counseling.",
    image: "/assets/services/core-services/emotional-wellbeing.jpg",
    objectPosition: "center 64%",
    badgeBg: "bg-sky-500/10 border-sky-500/30 text-sky-400",
    iconColor: "text-sky-400 group-hover:scale-110",
    glowColor: "group-hover:shadow-[0_10px_35px_rgba(14,165,233,0.35)]",
    borderColor: "hover:border-sky-500/50",
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
  return (
    <div className="relative bg-page min-h-screen">
      <NewsPopupModal/>
      {/* SECTION 1: SCROLL-DRIVEN HERO VIDEO */}
      {showVideoIntro && (
        <HeroVideo onEnterWebsite={() => setShowVideoIntro(false)} />
      )}

      <Navbar />

      {/* <OurStory /> */}
      <PageHero
        eyebrow="About Pika Wiya"
        title="Thriving in Culture,"
        titleHighlight="Built for Community"
        description="Pika Wiya Health Service is an Aboriginal Community Controlled Health Organisation (ACCHO) committed to delivering high-quality, culturally safe healthcare across Port Augusta and regional South Australia."
        ctaLabel="Explore Our Journey"
        ctaHref="/about"
        imageSrc="/assets/home/home-hero1.jpg"
        imageAlt="Sunlit lake and township ringed by red ranges"
        pageName="home"
      />

      <CoreServicesSection mainServices={mainServices} />

      <MissionSection />

      <AboutHome />

      {/* CULTURAL HERITAGE — white (after navy values / ochre purpose) */}
      <GovernanceHeritageSection />

      {/* CONTACT — navy */}
      <ContactSection />
      <PartnersTicker />
      <Footer />
    </div>
  );
}