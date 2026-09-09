import Navbar from "@/components/Navbar";
import { FileText, ShieldCheck } from "lucide-react";

export default function GovernancePage() {
  return (
    <div className="min-h-screen bg-sand text-earth">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-4">Governance & Rule Book</h1>
        <p className="text-earth/80 mb-12">
          Pika Wiya Health Service is governed by an Aboriginal Board of Directors, ensuring our operations adhere to our constitution and serve community priorities.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-8 rounded-xl border border-earth/10 shadow-sm">
            <ShieldCheck className="w-10 h-10 text-ochre mb-4" />
            <h2 className="text-2xl font-bold mb-2">Community Leadership</h2>
            <p className="text-sm text-earth/70">
              Our Board of Directors is elected by community members to maintain cultural integrity, financial accountability, and strategic oversight.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl border border-earth/10 shadow-sm flex flex-col justify-between">
            <div>
              <FileText className="w-10 h-10 text-ochre mb-4" />
              <h2 className="text-2xl font-bold mb-2">PWHS Rule Book 2024</h2>
              <p className="text-sm text-earth/70 mb-6">
                Download the official governing document outlining membership, board elections, and corporate structure.
              </p>
            </div>
            <a
              href="/wp-content/uploads/2024/09/PWHS-Rule-Book-2024.pdf"
              target="_blank"
              className="inline-block px-5 py-3 bg-ochre hover:bg-ochre-dark text-white font-medium rounded-md text-sm text-center transition"
            >
              Download Rule Book (PDF)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}