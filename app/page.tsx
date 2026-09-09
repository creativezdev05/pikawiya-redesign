// "use client";

// import { useState, useRef, useEffect, MouseEvent, WheelEvent } from "react";
// import HeroVideo from "@/components/HeroVideo_old";
// import { motion, AnimatePresence } from "framer-motion";
// import { ZoomIn, ZoomOut, RotateCcw, X, ChevronDown, Heart, Users, UserCheck, Sparkles, Shield, Compass, ArrowRight } from "lucide-react";
// import NextImage from "next/image";
// import Link from "next/link";
// import Navbar from "@/components/Navbar";
// import ContactForm from "@/components/ContactForm";

// const mainServices = [
//   { name: "Clinical Health Care", icon: Heart, desc: "General Practitioner care, chronic disease management, and primary nursing." },
//   { name: "Family Support", icon: Users, desc: "Maternal and child health services, parenting programs, and early intervention." },
//   { name: "Women's & Men's Health", icon: UserCheck, desc: "Gender-specific clinical care, health checks, and preventative education." },
//   { name: "Youth Programs", icon: Sparkles, desc: "Youth engagement, physical health, active sports, and community leadership." },
//   { name: "Cultural Support", icon: Compass, desc: "Care grounded in community connection, traditional knowledge, and Elders' wisdom." },
//   { name: "Emotional Wellbeing", icon: Shield, desc: "Social and emotional wellbeing support, mental health services, and counseling." },
// ];

// export default function LandingPage() {
//   const [isExploring, setIsExploring] = useState(false);
//   const [isZoomingIn, setIsZoomingIn] = useState(false);

//   // Canvas State for 360 Interactive Viewer
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);
//   const [zoom, setZoom] = useState(1);
//   const [pan, setPan] = useState({ x: 0, y: 0 });
//   const [isDragging, setIsDragging] = useState(false);
//   const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

//   const imageUrl = "https://images.unsplash.com/photo-1557971370-e7298ee473fb?q=80&w=2500&auto=format&fit=crop";
//   const imageRef = useRef<HTMLImageElement | null>(null);

//   useEffect(() => {
//     const img = new Image();
//     img.crossOrigin = "anonymous";
//     img.src = imageUrl;
//     img.onload = () => {
//       imageRef.current = img;
//       renderCanvas();
//     };
//   }, []);

//   const renderCanvas = () => {
//     const canvas = canvasRef.current;
//     if (!canvas || !imageRef.current) return;
//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.save();
//     ctx.translate(canvas.width / 2 + pan.x, canvas.height / 2 + pan.y);
//     ctx.scale(zoom, zoom);

//     const img = imageRef.current;
//     ctx.drawImage(img, -img.width / 2, -img.height / 2);
//     ctx.restore();
//   };

//   useEffect(() => {
//     if (isExploring) {
//       renderCanvas();
//     }
//   }, [zoom, pan, isExploring]);

//   // Lock Page Scroll during 360 Mode
//   useEffect(() => {
//     if (isExploring) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "unset";
//     }
//     return () => {
//       document.body.style.overflow = "unset";
//     };
//   }, [isExploring]);

//   // Trigger Zoom Animation then Open 360 Mode
//   const handleStartExploring = () => {
//     setIsZoomingIn(true);
//     setTimeout(() => {
//       setIsExploring(true);
//       setIsZoomingIn(false);
//     }, 700); // Duration matches zoom animation
//   };

//   // Canvas Mouse Controls
//   const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
//     if (!isExploring) return;
//     setIsDragging(true);
//     setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
//   };

//   const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
//     if (!isDragging || !isExploring) return;
//     setPan({
//       x: e.clientX - dragStart.x,
//       y: e.clientY - dragStart.y,
//     });
//   };

//   const handleMouseUp = () => setIsDragging(false);

//   const handleWheel = (e: WheelEvent<HTMLCanvasElement>) => {
//     if (!isExploring) return;
//     e.preventDefault();
//     const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
//     setZoom((prev) => Math.min(Math.max(prev * zoomFactor, 0.5), 4));
//   };

//   const handleReset = () => {
//     setZoom(1);
//     setPan({ x: 0, y: 0 });
//   };

//   return (
//     <div className="relative bg-earth  min-h-screen">
//       <HeroVideo/>
//        <Navbar />
//       {/* SECTION 2: 360 EXPLORATION BANNER WITH CLICK ZOOM */}
//       <section className="relative w-full h-screen bg-black flex flex-col items-center justify-center overflow-hidden">
        
//         {/* Animated Zoom Wrapper */}
//         <motion.div
//           animate={isZoomingIn ? { scale: 2.5, opacity: 0 } : { scale: 1, opacity: 1 }}
//           transition={{ duration: 0.7, ease: "easeInOut" }}
//           className="relative w-full h-full flex items-center justify-center origin-center"
//         >
//           <img
//             src={imageUrl}
//             alt="Pika Wiya Facility View"
//             className="w-full h-full object-cover"
//           />

//           {/* Banner Control Overlay */}
//           <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 space-y-4">
//             <Compass className="w-16 h-16 text-ochre animate-pulse" />
//             <h2 className="text-3xl font-bold">Interactive 360 View</h2>
//             <p className="text-sm max-w-md text-gray-300">
//               Take a virtual walk through our facilities with pan and zoom capabilities.
//             </p>
//             <button
//               onClick={handleStartExploring}
//               disabled={isZoomingIn}
//               className="px-8 py-3 bg-ochre hover:bg-ochre-dark font-semibold text-white rounded-full transition transform hover:scale-105 shadow-lg"
//             >
//               {isZoomingIn ? "Zooming In..." : "Start 360 Exploration"}
//             </button>
//           </div>
//         </motion.div>
//       </section>

//       {/* FULLSCREEN ACTIVE 360 CANVAS MODAL */}
//       <AnimatePresence>
//         {isExploring && (
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.95 }}
//             transition={{ duration: 0.4 }}
//             className="fixed inset-0 z-50 bg-black flex items-center justify-center"
//           >
//             <canvas
//               ref={canvasRef}
//               width={1280}
//               height={720}
//               onMouseDown={handleMouseDown}
//               onMouseMove={handleMouseMove}
//               onMouseUp={handleMouseUp}
//               onWheel={handleWheel}
//               className="w-full h-full object-cover cursor-grab active:cursor-grabbing"
//             />

//             {/* Controls Toolbar */}
//             <div className="absolute top-6 right-6 flex items-center gap-3 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 z-50">
//               <button
//                 onClick={() => setZoom((prev) => Math.min(prev * 1.2, 4))}
//                 className="p-2 hover:text-ochre transition"
//                 title="Zoom In"
//               >
//                 <ZoomIn className="w-5 h-5" />
//               </button>

//               <button
//                 onClick={() => setZoom((prev) => Math.max(prev / 1.2, 0.5))}
//                 className="p-2 hover:text-ochre transition"
//                 title="Zoom Out"
//               >
//                 <ZoomOut className="w-5 h-5" />
//               </button>

//               <button
//                 onClick={handleReset}
//                 className="p-2 hover:text-ochre transition"
//                 title="Reset View"
//               >
//                 <RotateCcw className="w-5 h-5" />
//               </button>

//               <div className="w-px h-6 bg-white/20 mx-1" />

//               <button
//                 onClick={() => setIsExploring(false)}
//                 className="flex items-center gap-1 px-3 py-1.5 bg-red-600/80 hover:bg-red-600 text-xs font-semibold rounded-full transition"
//               >
//                 <X className="w-4 h-4" /> Not Interested / Exit
//               </button>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//       {/* <section className="relative h-[75vh] min-h-[550px] flex items-center justify-center text-white overflow-hidden">
//          <NextImage
//           src="/assets/5+98 (6).jpeg"
//           alt="Pika Wiya Native Journey and Mountain Landscape"
//           fill
//           className="object-cover"
//           priority
//         />
//         <div className="absolute inset-0 bg-gradient-to-r from-earth/95 via-earth/70 to-transparent" />

//         <div className="relative z-10 max-w-7xl mx-auto px-4 w-full grid lg:grid-cols-2 gap-8 items-center">
//           <div className="space-y-6">
//             <span className="inline-block px-3 py-1 bg-ochre/90 text-white text-xs font-bold rounded-full uppercase tracking-wider">
//               Aboriginal Community Controlled Health Organisation
//             </span>
//             <h1 className="text-4xl md:text-6xl font-bold leading-tight">
//               Providing Culturally Safe Healthcare
//             </h1>
//             <p className="text-sand/90 text-lg md:text-xl max-w-xl">
//               Delivering holistic health, emotional wellbeing, and community services for Port Augusta and surrounding regional areas.
//             </p>
//             <div className="flex flex-wrap gap-4 pt-2">
//               <Link
//                 href="/forms"
//                 className="px-6 py-3 bg-ochre hover:bg-ochre-dark font-semibold rounded-md transition shadow-md"
//               >
//                 Book an Appointment
//               </Link>
//               <Link
//                 href="/services"
//                 className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 font-semibold rounded-md transition"
//               >
//                 Explore Services
//               </Link>
//             </div>
//           </div>
//         </div>
//       </section> */}

//       {/* Core Services Overview */}
//       <section className="py-20 max-w-7xl mx-auto px-4">
//         <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
//           <div>
//             <h2 className="text-3xl md:text-4xl font-bold text-earth mb-3">Our Core Services</h2>
//             <p className="text-earth/70 max-w-2xl">
//               Comprehensive clinical and community services delivered with respect, cultural safety, and community control.
//             </p>
//           </div>
//           <Link
//             href="/services"
//             className="mt-4 md:mt-0 text-ochre hover:text-ochre-dark font-bold text-sm inline-flex items-center gap-1"
//           >
//             View All Services <ArrowRight className="w-4 h-4" />
//           </Link>
//         </div>

//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {mainServices.map((item, idx) => {
//             const Icon = item.icon;
//             return (
//               <div key={idx} className="bg-white p-8 rounded-xl shadow-sm border border-earth/10 hover:shadow-md transition">
//                 <div className="w-12 h-12 rounded-lg bg-ochre/10 text-ochre flex items-center justify-center mb-6">
//                   <Icon className="w-6 h-6" />
//                 </div>
//                 <h3 className="text-xl font-bold text-earth mb-2">{item.name}</h3>
//                 <p className="text-earth/70 text-sm leading-relaxed">{item.desc}</p>
//               </div>
//             );
//           })}
//         </div>
//       </section>

//       {/* Cultural Heritage & Governance Banner */}
//       <section className="py-16 bg-earth text-sand relative overflow-hidden">
//         <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
//           <div className="relative h-96 rounded-xl overflow-hidden shadow-2xl border border-ochre/30">
//             <NextImage
//               src="/assets/5+98 (1).jpeg"
//               alt="Aboriginal Artwork"
//               fill
//               className="object-cover"
//             />
//           </div>
//           <div className="space-y-6">
//             <span className="text-ochre text-sm font-semibold uppercase tracking-wider">Governance & Culture</span>
//             <h2 className="text-3xl md:text-4xl font-bold text-white">Controlled by Community, Dedicated to Health</h2>
//             <p className="text-sand/80 leading-relaxed">
//               Pika Wiya Health Service operates under the guidance of our Aboriginal Board of Directors and constitution. We ensure community priorities drive every aspect of our care and community support programs.
//             </p>
//             <div className="flex flex-wrap gap-4 pt-2">
//               <Link
//                 href="/governance"
//                 className="px-5 py-3 bg-ochre hover:bg-ochre-dark text-white rounded-md text-sm font-medium transition"
//               >
//                 Governance & Rule Book
//               </Link>
//               <Link
//                 href="/about"
//                 className="px-5 py-3 border border-sand/30 hover:bg-white/10 text-sand rounded-md text-sm font-medium transition"
//               >
//                 Learn About PWHS
//               </Link>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Quick Contact & Enquiry Form */}
//       <section className="py-20 max-w-4xl mx-auto px-4">
//         <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg border border-earth/10">
//           <h2 className="text-3xl font-bold text-earth text-center mb-2">Get in Touch / Request an Appointment</h2>
//           <p className="text-center text-earth/70 mb-8">
//             Complete the form below to connect with our health services team directly.
//           </p>
//           <ContactForm />
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-earth text-sand py-12 border-t border-ochre/20">
//         <div className="max-w-7xl mx-auto px-4 text-center space-y-4 text-sm text-sand/60">
//           <p className="text-sand/90 max-w-3xl mx-auto">
//             <strong>Acknowledgement of Country:</strong> We acknowledge the Traditional Custodians of the lands across Port Augusta and the Flinders Ranges, paying our respects to Elders past, present, and emerging.
//           </p>
//           <div className="flex justify-center gap-6 text-xs text-sand/70 py-2">
//             <Link href="/about" className="hover:underline">About</Link>
//             <Link href="/services" className="hover:underline">Services</Link>
//             <Link href="/governance" className="hover:underline">Governance</Link>
//             <Link href="/careers" className="hover:underline">Careers</Link>
//             <Link href="/contact" className="hover:underline">Contact</Link>
//           </div>
//           <p>© {new Date().getFullYear()} Pika Wiya Health Service. All rights reserved.</p>
//         </div>
//       </footer>

//     </div>
//   );
// }
"use client";

import { useState, useRef, useEffect, MouseEvent, WheelEvent } from "react";
import HeroVideo from "@/components/HeroVideo";
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

  // CORS-friendly Panorama Image
  const imageUrl = "https://images.unsplash.com/photo-1557971370-e7298ee473fb?q=80&w=2500&auto=format&fit=crop";
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
            <h2 className="text-3xl font-bold text-white">Interactive 360 View</h2>
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
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          >
            <canvas
              ref={canvasRef}
              width={1280}
              height={720}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onWheel={handleWheel}
              className="w-full h-full object-cover cursor-grab active:cursor-grabbing"
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

      {/* HERO BANNER SECTION */}
      <section className="relative h-[75vh] min-h-[550px] flex items-center justify-center text-white overflow-hidden">
        <NextImage
          src="/assets/5+98 (6).jpeg"
          alt="Pika Wiya Native Journey and Mountain Landscape"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-earth/95 via-earth/70 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <span className="inline-block px-3 py-1 bg-ochre/90 text-white text-xs font-bold rounded-full uppercase tracking-wider">
              Aboriginal Community Controlled Health Organisation
            </span>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Providing Culturally Safe Healthcare
            </h1>
            <p className="text-sand/90 text-lg md:text-xl max-w-xl">
              Delivering holistic health, emotional wellbeing, and community services for Port Augusta and surrounding regional areas.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/forms"
                className="px-6 py-3 bg-ochre hover:bg-ochre-dark font-semibold rounded-md transition shadow-md text-white"
              >
                Book an Appointment
              </Link>
              <Link
                href="/services"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 font-semibold rounded-md transition text-white"
              >
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CORE SERVICES */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-earth mb-3">Our Core Services</h2>
            <p className="text-earth/70 max-w-2xl">
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mainServices.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-white p-8 rounded-xl shadow-sm border border-earth/10 hover:shadow-md transition">
                <div className="w-12 h-12 rounded-lg bg-ochre/10 text-ochre flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-earth mb-2">{item.name}</h3>
                <p className="text-earth/70 text-sm leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CULTURAL HERITAGE BANNER */}
      <section className="py-16 bg-earth text-sand relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-96 rounded-xl overflow-hidden shadow-2xl border border-ochre/30">
            <NextImage
              src="/assets/5+98 (1).jpeg"
              alt="Aboriginal Artwork"
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-6">
            <span className="text-ochre text-sm font-semibold uppercase tracking-wider">Governance & Culture</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Controlled by Community, Dedicated to Health</h2>
            <p className="text-sand/80 leading-relaxed">
              Pika Wiya Health Service operates under the guidance of our Aboriginal Board of Directors and constitution. We ensure community priorities drive every aspect of our care and community support programs.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/governance"
                className="px-5 py-3 bg-ochre hover:bg-ochre-dark text-white rounded-md text-sm font-medium transition"
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
      <section className="py-20 max-w-4xl mx-auto px-4">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg border border-earth/10">
          <h2 className="text-3xl font-bold text-earth text-center mb-2">Get in Touch / Request an Appointment</h2>
          <p className="text-center text-earth/70 mb-8">
            Complete the form below to connect with our health services team directly.
          </p>
          <ContactForm />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-earth text-sand py-12 border-t border-ochre/20">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4 text-sm text-sand/60">
          <p className="text-sand/90 max-w-3xl mx-auto">
            <strong>Acknowledgement of Country:</strong> We acknowledge the Traditional Custodians of the lands across Port Augusta and the Flinders Ranges, paying our respects to Elders past, present, and emerging.
          </p>
          <div className="flex justify-center gap-6 text-xs text-sand/70 py-2">
            <Link href="/about" className="hover:underline">About</Link>
            <Link href="/services" className="hover:underline">Services</Link>
            <Link href="/governance" className="hover:underline">Governance</Link>
            <Link href="/careers" className="hover:underline">Careers</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
          </div>
          <p>© {new Date().getFullYear()} Pika Wiya Health Service. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}