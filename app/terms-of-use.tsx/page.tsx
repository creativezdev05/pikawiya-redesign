import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTitle from "@/components/PageTitle";
import PatternField from "@/components/PatternField";
import PartnersTicker from "@/components/PartnersTicker";
import FramerMouseGradient from "@/components/FramerMouseGradient";

export default function TermsOfUsePage() {
  return (
    <div className="relative min-h-screen bg-page text-ink flex flex-col justify-between overflow-hidden">
      <FramerMouseGradient/>
      <div 
          className="absolute inset-[-20%] z-0 opacity-20 pointer-events-none animate-drift"
          style={{ 
            backgroundImage: "url('/assets/background-pattern.png')",
            backgroundSize: "contain",
            filter: "brightness(0) saturate(100%) invert(47%) sepia(2%) saturate(210%) hue-rotate(349deg) brightness(93%) contrast(82%)"
          }}
        />
      <PatternField variant="twirl" logoMotion="tilt" logoPlacement="br" />
      <div className="relative z-10">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-16 space-y-6">
          <PageTitle className="text-4xl font-bold">Terms of Use</PageTitle>
          <p className="text-ink/80 leading-relaxed">
            Welcome to the Pika Wiya Health Service website. By accessing or using this website, you agree to comply with and be bound by the following terms and conditions.
          </p>
          <div className="bg-surface p-6 rounded-2xl border border-border space-y-4 text-sm text-ink/80">
            <h2 className="text-lg font-semibold text-ink">Medical Disclaimer</h2>
            <p>
              The content provided on this website is for general informational purposes only and is not intended as medical advice. Always consult a qualified healthcare professional for medical concerns.
            </p>
          </div>
        </main>
      </div>
      <div className="relative z-10">
        <PartnersTicker />
        <Footer />
      </div>
    </div>
  );
}