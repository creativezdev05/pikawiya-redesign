import Navbar from "@/components/Navbar";

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-sand text-earth flex flex-col justify-between">
      <div>
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-16 space-y-6">
          <h1 className="text-4xl font-bold">Terms of Use</h1>
          <p className="text-earth/80 leading-relaxed">
            Welcome to the Pika Wiya Health Service website. By accessing or using this website, you agree to comply with and be bound by the following terms and conditions.
          </p>
          <div className="bg-white p-6 rounded-2xl border border-earth/10 space-y-4 text-sm text-earth/80">
            <h2 className="text-lg font-semibold text-earth">Medical Disclaimer</h2>
            <p>
              The content provided on this website is for general informational purposes only and is not intended as medical advice. Always consult a qualified healthcare professional for medical concerns.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}