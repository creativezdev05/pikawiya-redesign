import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTitle from "@/components/PageTitle";
import PageHero from "@/components/PageHero";
import PatternField from "@/components/PatternField";
import { 
  Heart, 
  Lightbulb, 
  Flame, 
  Users, 
  Compass, 
  Award, 
  CheckCircle2 
} from "lucide-react";

export default function AboutPage() {
  const values = [
    { 
      name: "Believe", 
      icon: Heart, 
      desc: "We are making a difference together." 
    },
    { 
      name: "Initiative", 
      icon: Lightbulb, 
      desc: "We develop new programs and services in response to unmet needs." 
    },
    { 
      name: "Persistence", 
      icon: Flame, 
      desc: "Where others give up, we reach out." 
    },
    { 
      name: "Respect", 
      icon: Users, 
      desc: "We treat others in the community and workplace with respect." 
    },
    { 
      name: "Consultation", 
      icon: Compass, 
      desc: "We engage our community to understand your needs." 
    },
    { 
      name: "Honour", 
      icon: Award, 
      desc: "Our service/our history reflect upon the past, learn from it and promote change." 
    },
  ];

  const visionPoints = [
    "We provide holistic health care services that set a benchmark for other ACCHOs.",
    "We are embraced by our workers, external bodies and the wider community.",
    "We foster an environment of diversity and harmony.",
    "We support the living preferences of our people wherever they live.",
    "We aspire to be part of an Aboriginal community that is healthy at all ages and across generation.",
    "We demonstrate good governance, and exceed the expectations of our funding bodies.",
    "We are fiscally responsible, with sustainable growth and revenue to ensure that we have the right staff to deliver our services."
  ];

  return (
    <div className="relative min-h-screen bg-page text-ink overflow-hidden">
      <PatternField variant="rise" />
      <Navbar />
      <PageHero
        eyebrow="About Pika Wiya"
        title="Grounded in Culture, Driven by Community"
        description="Pika Wiya Health Service is an Aboriginal Community Controlled Health Organisation (ACCHO) committed to delivering high-quality, culturally safe healthcare across Port Augusta and regional South Australia."
        imageSrc="/assets/patterns/pat1.jpg"
        imageAlt="Aboriginal waterhole and songline dot painting"
        trLogo="float"
      />

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-16 space-y-16 md:space-y-24">
        {/* Purpose Highlight Banner */}
        <div className="bg-ochre/10 border border-ochre/30 rounded-2xl p-8 md:p-10 text-center max-w-4xl mx-auto">
          <span className="text-ochre font-semibold uppercase text-xs tracking-wider">
            Our Purpose
          </span>
          <p className="text-2xl md:text-3xl font-bold text-ink mt-2 leading-snug">
            “To provide health care our way to our people so our community is healthy at every age.”
          </p>
        </div>

        {/* Culture & Artwork Banner (Original Content) */}
        <div className="contrast-card grid md:grid-cols-2 gap-12 items-center bg-earth text-sand p-8 md:p-12 rounded-2xl shadow-xl border border-transparent">
          <div className="relative h-80 md:h-96 rounded-xl overflow-hidden border border-ochre/30">
            <Image
              src="/assets/5+98 (1).jpeg"
              alt="Aboriginal Dot Painting Artwork"
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-6">
            <PageTitle as="h2" onDark className="text-3xl font-bold">
              Our Cultural Heritage
            </PageTitle>
            <p className="text-sand/80 leading-relaxed">
              Our name and emblem reflect deep roots within the community. We work closely with Traditional Owners, Elders, and local families to ensure health services honor connection to land, culture, and traditional healing principles.
            </p>
            <p className="text-sand/80 leading-relaxed">
              From our main facility in Port Augusta to outreach health programs, every aspect of our care is designed to offer a safe, respectful environment for Aboriginal people.
            </p>
            <div className="pt-2">
              <Link
                href="/governance"
                className="inline-block px-6 py-3 bg-ochre hover:bg-ochre-dark text-white font-medium rounded-md text-sm transition"
              >
                View Governance & Rule Book
              </Link>
            </div>
          </div>
        </div>

        {/* Mission Statement Split Section (Using about-us-01.png) */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-ochre font-semibold uppercase text-xs tracking-wider">
              Who We Are
            </span>
            <PageTitle as="h2" className="text-3xl md:text-4xl font-bold">
              A Service Built for Aboriginal & Torres Strait Islander People
            </PageTitle>
            <p className="text-ink/80 text-lg leading-relaxed">
              Pika Wiya Health Service Aboriginal Corporation is an Aboriginal Community Controlled Health Service which offers comprehensive primary health, social and emotional wellbeing support to Aboriginal people in Port Augusta, with clinics located in Port Augusta, Davenport Community, Copley and Nepabunna.Pika Wiya Health Service Aboriginal Corporation employs staff made up of mixed disciplines that includes General Practitioners, Nursing, Allied Health, Aboriginal Health Practitioners, Reception, Finance and Administration staff.
            </p>
          </div>
          <div className="relative h-80 md:h-96 rounded-xl overflow-hidden border border-border shadow-md">
            <Image
              src="/assets/about-us-01.png"
              alt="Pika Wiya Health Community Facility"
              fill
              className="object-cover"
            />
          </div>
        </div>
        {/* Regional & Landscape Connection (Original Content with about-us-02.png) */}
        <div className="grid md:grid-cols-2 gap-12 items-center border-t border-border pt-16">
          <div className="space-y-6">
            
            <PageTitle as="h2" className="text-3xl font-bold">
              History of Pika Wiya Health Service
            </PageTitle>
            <p className="text-ink/70 leading-relaxed">
              In the early 1970s, a group of Aboriginal women meeting
              in Port Augusta heard word of a sick man in the sandhills
              outside town. One of the women was a nurse, and
              together the group travelled to where the man lay, too
              weak to move, and did what they could. In the days
              and weeks that followed the women learned of others
              suffering from injuries and illnesses, and decided that
              Port Augusta needed a Health Service specifically for the
              Aboriginal community.

              State and Federal government were not interested, but
              the women were undeterred. They wrote to the World
              Council of Churches in Geneva, Switzerland to explain
              their plight and ask for help. The Council were moved by
              the request and granted enough funding to establish the
              Aboriginal Medical Service, Port Augusta.

              The Aboriginal Medical Service in Redfern, New South
              Wales offered assistance in spite of that service’s own
              struggles. A doctor was loaned to Port Augusta and was
              able to travel from Redfern intermittently. Resources were
              scarce; when visiting, the doctor slept on the floor of the
              clinic, and bandages were washed and reused.
              Years passed, but the persistence shown by those first
              women remained. The service grew, and grew, and was
              incorporated in December 1984 as Pika Wiya Health
              Service Inc.
            </p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-block px-6 py-3 bg-earth hover:bg-earth-light text-white font-medium rounded-md text-sm transition"
              >
                Get in Touch with Our Team
              </Link>
            </div>
          </div>
          <div className="relative h-80 md:h-96 rounded-xl overflow-hidden border border-border shadow-md">
            <Image
              src="/assets/about-us-02.png"
              alt="Flinders Ranges Mountain Landscape and Outreach Region"
              fill
              className="object-cover"
            />
          </div>
        </div>

      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}