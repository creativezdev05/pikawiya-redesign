import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTitle from "@/components/PageTitle";
import CulturalPattern from "@/components/CulturalPattern";
import { FileText, Download, BookOpen, ShieldCheck, Parasol } from "lucide-react";
import PartnersTicker from "@/components/PartnersTicker";
import FramerMouseGradient from "@/components/FramerMouseGradient";
import NextImage from 'next/image';

export default function CorporateDocumentsPage() {
  return (
<div className="relative min-h-screen bg-navy text-ink overflow-x-hidden">
  <FramerMouseGradient />
  <Navbar />

  {/* Main Wrapper Container */}
  <div className="relative w-full">
    
    {/* Background Overlay Layer - Seamless full-width coverage */}
    <div
      className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_bottom,#faf6f0,#fefaf4_70%,#faf6f0)] overflow-hidden"
      aria-hidden="true"
    >
      {/* Background Image: Covers 100% width, pins subject to the right.
          On lg+ the layer is sized by height and shifted right so the lady sits clear of the cards. */}
      <div className="absolute inset-0 lg:left-auto lg:aspect-1983/793 lg:min-w-[122%] lg:translate-x-[14%]">
        <NextImage
          src="/assets/doc_bg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-right-top opacity-90 transition-all duration-300"
        />
      </div>
    </div>

    {/* Cultural Background Pattern Accent */}
    <CulturalPattern
      dashedOrbitsConfig={[
        { x: 900, y: 5, pathHeight: 300, pathWidth: 300, speed: 10, radius: 25 },
        { x: 200, y: 25, pathHeight: 400, pathWidth: 420, speed: 11, radius: 25 },
        { x: 600, y: 50, pathHeight: 500, pathWidth: 700, speed: 12, radius: 25 },
        { x: 400, y: 10, pathHeight: 300, pathWidth: 700, speed: 13, radius: 25 },
        { x: 500, y: 20, pathHeight: 300, pathWidth: 700, speed: 14, radius: 25 },
      ]}
    />

    {/* Main Content Container */}
    <main className="relative z-10 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 pt-28 sm:pt-32 lg:pt-36 pb-20 lg:pb-32">
      
      {/* Left Column Stack */}
      <div className="w-full lg:max-w-xl xl:max-w-2xl space-y-8">
        
        {/* Header Block */}
        <div className="text-left space-y-2">
          <span className="text-ochre font-semibold uppercase text-xs tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 shrink-0" /> Governance & Transparency
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            Corporate Documents
          </h1>
          <p className="text-ink text-sm sm:text-base leading-relaxed max-w-xl">
            Access key governance publications, operational rulebooks, and annual performance reports for Pika Wiya Health Service Aboriginal Corporation.
          </p>
        </div>

        {/* Document Cards Grid - Pushed down with top margin */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full items-stretch mt-40 sm:mt-36 lg:mt-38">
        
        {/* Document 1: Rule Book */}
        <div className="card-3d bg-white p-5 sm:p-6 rounded-2xl min-h-65 sm:min-h-70 flex flex-col justify-between space-y-5  transition-all duration-300">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-ochre/15 text-ochre flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-ink pt-1.5">
                Rule Book
              </h2>
            </div>
            <p className="text-ink/75 text-xs sm:text-sm leading-relaxed">
              The official constitution and governance rules outlining membership, board responsibilities, and operational guidelines under CATSI Act regulation.
            </p>
          </div>

         <a
            href="https://www.pikawiyahealth.org.au/wp-content/uploads/2024/09/PWHS-Rule-Book-2024.pdf"
            download
            target="_blank"
            rel="noopener noreferrer"
            className="text-white inline-flex items-center justify-center w-full py-3 px-4 bg-ochre hover:bg-ochre-dark text-xs sm:text-sm font-semibold rounded-xl transition shadow-md hover:shadow-lg gap-2 text-center"
          >
            <Download className="w-4 h-4 shrink-0" />Rule Book</a>
      </div>

        {/* Document 2: Annual Report */}
        <div className="card-3d bg-white p-5 sm:p-6 rounded-2xl min-h-65 sm:min-h-70 flex flex-col justify-between space-y-5  transition-all duration-300">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-ochre/15 text-ochre flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-ink pt-1.5">
                Annual Report
              </h2>
            </div>
            <p className="text-ink/75 text-xs sm:text-sm leading-relaxed">
              Comprehensive summary of financial statements, community achievements, clinical program outcomes, and service delivery highlights from the past year.
            </p>
          </div>

            <a
              href="https://www.pikawiyahealth.org.au/wp-content/uploads/2025/01/PWHSAC-Annual-Report-2023-2024.pdf"
              download
              target="_blank"
              rel="noopener noreferrer"
              className="text-white inline-flex items-center justify-center w-full py-3 px-4 bg-navy hover:bg-navy/90 text-xs sm:text-sm font-semibold rounded-xl transition shadow-md hover:shadow-lg gap-2 text-center"
            >
              <Download className="w-4 h-4 shrink-0" />Annual Report  </a>
          </div>

        </div>
      </div>
    </main>
  </div>

  {/* Footer Section */}
  <div className="relative z-10 bg-navy">
    <PartnersTicker />
    <Footer />
  </div>
</div>
  );
}