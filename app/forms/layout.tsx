import Footer from "@/components/Footer";
import PatternField from "@/components/PatternField";

export default function FormsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-page">
      <PatternField variant="pulse" logoMotion="orbit" logoPlacement="tl" />
      <div className="relative z-10">
        {children}
        <Footer />
      </div>
    </div>
  );
}
