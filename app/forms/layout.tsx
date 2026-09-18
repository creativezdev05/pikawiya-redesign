import Footer from "@/components/Footer";
import PartnersTicker from "@/components/PartnersTicker";
import PatternField from "@/components/PatternField";

export default function FormsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-page">
      
      <div className="relative z-10">
        <div 
          className="absolute inset-[-20%] z-0 opacity-20 pointer-events-none animate-drift"
          style={{ 
            backgroundImage: "url('/assets/background-pattern.png')",
            backgroundSize: "cover",
            filter: "brightness(0) saturate(100%) invert(47%) sepia(2%) saturate(210%) hue-rotate(349deg) brightness(93%) contrast(82%)"
          }}
        />
        {children}
        <PartnersTicker />
        <Footer />
      </div>
    </div>
  );
}
