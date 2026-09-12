import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTitle from "@/components/PageTitle";
import PatternField from "@/components/PatternField";
import { FileText, Download, BookOpen, ShieldCheck, Parasol } from "lucide-react";
import PartnersTicker from "@/components/PartnersTicker";

export default function CorporateDocumentsPage() {
  return (
    <div className="relative min-h-screen bg-page text-ink overflow-hidden">
      {/* <PatternField variant="wave" logoMotion="breathe" logoPlacement="br" /> */}
      <PatternField variant="inward" logoMotion="bob"  />
      <Navbar />
      
      <main className="relative z-10 max-w-5xl mx-auto px-4 py-16 space-y-12">
        {/* Header Section */}
        <div className="space-y-4">
          <span className="text-ochre font-semibold uppercase text-xs tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Governance & Transparency
          </span>
          <PageTitle className="text-4xl md:text-5xl font-bold tracking-tight">
            Corporate Documents
          </PageTitle>
          <p className="text-ink/70 text-lg max-w-2xl leading-relaxed">
            Access key governance publications, operational rulebooks, and annual performance reports for Pika Wiya Health Service Aboriginal Corporation.
          </p>
        </div>

        {/* Documents Grid */}
        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          
          {/* Document 1: Rule Book */}
          <div className="bg-surface p-8 rounded-2xl border border-border shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md transition">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-ochre/10 text-ochre flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-ink">
                  Rule Book
                </h2>
                <p className="text-ink/70 text-sm leading-relaxed">
                  The official constitution and governance rules outlining membership, board responsibilities, and operational guidelines under CATSI Act regulation.
                </p>
              </div>
            </div>

            <a
              href="https://www.pikawiyahealth.org.au/wp-content/uploads/2024/09/PWHS-Rule-Book-2024.pdf"
              download
              target="_blank"
              className="text-white inline-flex items-center justify-center w-full py-3.5 px-5 bg-ochre hover:bg-ochre-dark  text-sm font-semibold rounded-xl transition shadow-sm hover:shadow gap-2 text-center"
            >
              <Download className="w-4 h-4" /> Download Rule Book (PDF)
            </a>
          </div>

          {/* Document 2: Annual Report */}
          <div className="bg-surface p-8 rounded-2xl border border-border shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md transition">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-ochre/10 text-ochre flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-ink">
                  Annual Report
                </h2>
                <p className="text-ink/70 text-sm leading-relaxed">
                  Comprehensive summary of financial statements, community achievements, clinical program outcomes, and service delivery highlights from the past year.
                </p>
              </div>
            </div>

            <a
              href="https://www.pikawiyahealth.org.au/wp-content/uploads/2025/01/PWHSAC-Annual-Report-2023-2024.pdf"
              download
              target="_blank"
              className="text-white inline-flex items-center justify-center w-full py-3.5 px-5 bg-navy hover:bg-earth-light text-sm font-semibold rounded-xl transition shadow-sm hover:shadow gap-2 text-center"
            >
              <Download className="w-4 h-4" /> Download Annual Report (PDF)
            </a>
          </div>
        </div>
      </main>
      <div className="relative z-10">
        <PartnersTicker />
        <Footer />
      </div>
    </div>
  );
}