import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PartnersTicker from "@/components/PartnersTicker";
import PageTitle from "@/components/PageTitle";
import PageHero from "@/components/PageHero";
import PatternField from "@/components/PatternField";
import TrLogo from "@/components/TrLogo";
import ImageCarousel from "@/components/ImageCarousel";
import { 
  Heart, 
  Lightbulb, 
  Flame, 
  Users, 
  Compass, 
  Award, 
  CheckCircle2 
} from "lucide-react";
import FramerMouseGradient from "@/components/FramerMouseGradient";
import CulturalPattern from "@/components/CulturalPattern";
import NextImage from 'next/image';

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
      <div className="absolute inset-0 z-0 landing-ink-veil--soft" />
      
      <Navbar />
       {/* Page background: fixed to the viewport so it sits behind the whole page while scrolling */}
            <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
              <NextImage
                src="/assets/home/main_page_2nd_bg.png"
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover object-center"
              />
            </div>
      
            <div 
                className="absolute inset-[0%] z-0 opacity-20 pointer-events-none animate-drift"
                style={{ 
                  backgroundImage: "url('/assets/background-pattern-new1.png')",
                  backgroundSize: "contain",
                  opacity: 0.15,
                  filter: "brightness(0) saturate(100%) invert(96%) sepia(94%) saturate(122%) hue-rotate(32deg) brightness(116%) contrast(98%)"
                }}
              />
      <ImageCarousel
        rounded={false}
        heightClassName="h-[100dvh]"
        autoPlayInterval={5000}
        slides={[
          {
            src: "/assets/about/1.png",
            alt: "Aboriginal waterhole and songline dot painting",
            year: "Building Stronger Communities",
            title: "Thriving in Culture",
            subtitle: "Grassroots mobilization for self-determination",
            description:
              "Driven by profound courage and a commitment to community wellbeing, local leaders took direct action to secure self-determined health services, laying the vital groundwork for Pika Wiya Health Service.",
            tag: "Heritage",
          },
          {
            src: "/assets/about/2.png",
            alt: "Aboriginal waterhole and songline dot painting",
            year: "Building Stronger Communities",
            title: "Thriving in Culture",
            subtitle: "International recognition & regional advocacy",
            description:
              "A pivotal moment when community advocacy gained international acknowledgment at the World Health Organization in Geneva, validating community-led primary health care models.",
            tag: "Growth",
          },
          {
            src: "/assets/about/3.png",
            alt: "Aboriginal waterhole and songline dot painting",
            year: "Building Stronger Communities",
            title: "Thriving in Culture",
            subtitle: "Empowering regional workforce and tradition",
            description:
              "Embedding traditional knowledge, elder wisdom, and holistic wellbeing practices into professional pathways, fostering a dedicated generation of regional health practitioners.",
            tag: "Culture",
          },
          {
            src: "/assets/about/4.png",
            alt: "Aboriginal waterhole and songline dot painting",
            year: "Building Stronger Communities",
            title: "Thriving in Culture",
            subtitle: "Formal structure for regional care",
            description:
              "Achieving formal incorporation to expand clinical infrastructure, secure sustainable funding streams, and broaden comprehensive outreach programs across the regional footprint.",
            tag: "Milestone",
          },
          {
            src: "/assets/about/5.png",
            alt: "Aboriginal waterhole and songline dot painting",
             year: "Building Stronger Communities",
            title: "Thriving in Culture",
            subtitle: "Specialized maternal and child health focus",
            description:
              "The launch of the Anangu Bibi program, dedicated to providing culturally secure, family-centered support for mothers, babies, and young children throughout their developmental journey.",
            tag: "Care",
          },
          {
            src: "/assets/about/6.png",
            alt: "Aboriginal waterhole and songline dot painting",
            year: "Building Stronger Communities",
            title: "Thriving in Culture",
            subtitle: "Absolute self-determination in governance",
            description:
              "Reaching complete community control, ensuring that regional governance, cultural authority, and community voices directly drive every clinical and operational decision.",
            tag: "Empowerment",
          },
          {
            src: "/assets/about/7.png",
            alt: "Aboriginal waterhole and songline dot painting",
            year: "Building Stronger Communities",
            title: "Thriving in Culture",
            description:
              "Remaining fiercely independent, community-owned, and dedicated to delivering holistic, doctor-led clinical and cultural healthcare services for generations to come.",
            tag: "Future",
          },
          {
            src: "/assets/about/8.png",
            alt: "Aboriginal waterhole and songline dot painting",
            year: "Building Stronger Communities",
            title: "Thriving in Culture",
          },
          {
            src: "/assets/about/9.png",
            alt: "Aboriginal waterhole and songline dot painting",
            year: "Building Stronger Communities",
            title: "Thriving in Culture",
          },
          {
            src: "/assets/about/10.png",
            alt: "Aboriginal waterhole and songline dot painting",
            year: "Building Stronger Communities",
            title: "Thriving in Culture",
          },
          {
            src: "/assets/about/11.png",
            alt: "Aboriginal waterhole and songline dot painting",
            year: "Building Stronger Communities",
            title: "Thriving in Culture",
          },
          {
            src: "/assets/about/12.png",
            alt: "Aboriginal waterhole and songline dot painting",
            year: "Building Stronger Communities",
            title: "Thriving in Culture",
          },
          {
            src: "/assets/about/13.png",
            alt: "Aboriginal waterhole and songline dot painting",
            year: "Building Stronger Communities",
            title: "Thriving in Culture",
          },
          {
            src: "/assets/about/14.png",
            alt: "Aboriginal waterhole and songline dot painting",
            year: "Building Stronger Communities",
            title: "Thriving in Culture",
          },
          {
            src: "/assets/about/15.jpeg",
            alt: "Aboriginal waterhole and songline dot painting",
            year: "Building Stronger Communities",
            title: "Thriving in Culture",
          },
          {
            src: "/assets/about/16.png",
            alt: "Aboriginal waterhole and songline dot painting",
            year: "Building Stronger Communities",
            title: "Thriving in Culture",
          },
          {
            src: "/assets/about/17.png",
            alt: "Aboriginal waterhole and songline dot painting",
            year: "Building Stronger Communities",
            title: "Thriving in Culture",
          },
        ]}
      />
      {/* <PageHero
        eyebrow="About Pika Wiya"
        title="Thriving in Culture, Built for Community"
        description="Pika Wiya Health Service is an Aboriginal Community Controlled Health Organisation (ACCHO) committed to delivering high-quality, culturally safe healthcare across Port Augusta and regional South Australia."
        imageSrc="/assets/aboutus.png"
        imageMobileSrc="/assets/aboutus-mobile.png"
        imageAlt="Aboriginal waterhole and songline dot painting"
        pageName="about"
      /> */}

      {/* Wrapper container for the rest of the page with the background pattern locked inside */}
      <div className="relative overflow-hidden">
         <CulturalPattern
            dashedOrbitsConfig={[{ x: 200, y: 5, pathHeight:300, pathWidth:300, speed:10, radius: 25 }, { x: 300, y: 25, pathHeight:400, pathWidth:420, speed:11, radius: 25 } , { x: 150, y: 50, pathHeight:500, pathWidth:700, speed:12, radius: 25 }]}
          />
        <FramerMouseGradient/>
        {/* Animated Background Pattern spanning behind all main content sections */}
        <div 
          className="absolute inset-[-20%] z-0 opacity-20 pointer-events-none animate-drift"
          style={{ 
            backgroundImage: "url('/assets/background-pattern.png')",
            backgroundSize: "contain",
            filter: "brightness(0) saturate(100%) invert(47%) sepia(2%) saturate(210%) hue-rotate(349deg) brightness(93%) contrast(82%)"
          }}
        />

        <main className="relative z-10 max-w-7xl mx-auto px-4 py-16 space-y-16 md:space-y-24">
         
          {/* Culture & Artwork Banner */}
          <div className="grid md:grid-cols-2 gap-12 items-center bg-surface text-ochre p-8 md:p-12 rounded-2xl shadow-lg border border-border">
            <div className="relative h-80 md:h-96 rounded-xl overflow-hidden border border-ochre/30">
              <Image
                src="/assets/cultural-heritage.jpg"
                alt="Aboriginal Dot Painting Artwork"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-6 ">
              <h2  className="text-3xl font-bold">
                Our Cultural Heritage
              </h2>
              <p className="text-ink/80 leading-relaxed text-justify">
                Our name and emblem reflect deep roots within the community. We work closely with Traditional Owners, Elders, and local families to ensure health services honor connection to land, culture, and traditional healing principles.
              </p>
              <p className="text-ink/80 leading-relaxed text-justify">
                From our main facility in Port Augusta to outreach health programs, every aspect of our care is designed to offer a safe, respectful environment for Aboriginal people.
              </p>
              <div className="pt-2">
                <Link
                  href="/corporate-documents"
                  className="inline-block px-6 py-3 bg-ochre hover:bg-ochre-dark text-white font-medium rounded-md text-sm transition"
                >
                  View Governance &amp; Rule Book
                </Link>
              </div>
            </div>
          </div>

          {/* Mission Statement Split Section Card */}
          <div className="grid md:grid-cols-2 gap-12 items-center bg-surface text-ink p-8 md:p-12 rounded-2xl shadow-lg border border-border">
            <div className="space-y-6">
              <span className="text-ochre font-bold uppercase text-lg tracking-wider">
                Who We Are
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-ochre">
                A Service Built for Aboriginal &amp; Torres Strait Islander People
              </h2>
              <p className="text-ink/80 text-lg leading-relaxed text-justify">
                Pika Wiya Health Service Aboriginal Corporation is an Aboriginal Community Controlled Health Service which offers comprehensive primary health, social and emotional wellbeing support to Aboriginal people in Port Augusta, with clinics located in Port Augusta, Davenport Community, Copley and Nepabunna. Pika Wiya Health Service Aboriginal Corporation employs staff made up of mixed disciplines that includes General Practitioners, Nursing, Allied Health, Aboriginal Health Practitioners, Reception, Finance and Administration staff.
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

          {/* Regional & History Connection Card */}
          <div className="grid md:grid-cols-2 gap-12 items-center bg-surface text-ink p-8 md:p-12 rounded-2xl shadow-lg border border-border">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-ochre">
                History of Pika Wiya Health Service
              </h2>
              <div className="space-y-4 text-ink/75 leading-relaxed text-base">
                <p className="text-justify">
                  In the early 1970s, a group of Aboriginal women meeting in Port Augusta heard word of a sick man in the sandhills outside town. One of the women was a nurse, and together the group travelled to where the man lay, too weak to move, and did what they could. In the days and weeks that followed the women learned of others suffering from injuries and illnesses, and decided that Port Augusta needed a Health Service specifically for the Aboriginal community.
                </p>
                <p className="text-justify">
                  State and Federal government were not interested, but the women were undeterred. They wrote to the World Council of Churches in Geneva, Switzerland to explain their plight and ask for help. The Council were moved by the request and granted enough funding to establish the Aboriginal Medical Service, Port Augusta.
                </p>
                <p className="text-justify">
                  The Aboriginal Medical Service in Redfern, New South Wales offered assistance in spite of that service’s own struggles. A doctor was loaned to Port Augusta and was able to travel from Redfern intermittently. Resources were scarce; when visiting, the doctor slept on the floor of the clinic, and bandages were washed and reused. Years passed, but the persistence shown by those first women remained. The service grew, and was incorporated in December 1984 as Pika Wiya Health Service Inc.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/contact"
                  className="inline-block px-6 py-3 bg-ochre hover:bg-ochre-dark text-white font-medium rounded-md text-sm transition"
                >
                  Get in Touch with Our Team
                </Link>
              </div>
            </div>
            <div className="relative h-80 md:h-96 rounded-xl overflow-hidden border border-border shadow-md">
              <Image
                src="/assets/about-us-02.jpeg"
                alt="Flinders Ranges Mountain Landscape and Outreach Region"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </main>

        <div className="relative z-10">
          <PartnersTicker />       
          <Footer />
        </div>
      </div>
    </div>
  );
}