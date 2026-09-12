import Image from "next/image";

type Partner = {
  name: string;
  logo: string;
};

const PARTNERS: Partner[] = [
  { name: "Marnbi – Connected Beginnings Education", logo: "/assets/partners/connected.png" },
  { name: "Healthy Dreaming", logo: "/assets/partners/healthy-dreaming.png" },
  { name: "Idnya Service", logo: "/assets/partners/idnya.png" },
  { name: "RDFS ", logo: "/assets/partners/rfds.png" },
  { name: "Wami Kata", logo: "/assets/partners/wamikata.png" },
];

export default function PartnersTicker() {
  // Duplicating the array guarantees a seamless infinite loop without gaps
  const tickerItems = [...PARTNERS, ...PARTNERS, ...PARTNERS];

  return (
  <section className="relative w-full bg-surface border-t border-border py-10 md:py-14 overflow-hidden z-10">
    {/* Edge Gradient Shadows for Smooth Fade Effect */}
    <div className="absolute top-0 bottom-0 left-0 w-20 md:w-40 bg-gradient-to-r from-page to-transparent z-10 pointer-events-none" />
    <div className="absolute top-0 bottom-0 right-0 w-20 md:w-40 bg-gradient-to-l from-page to-transparent z-10 pointer-events-none" />

    <div className="max-w-7xl mx-auto px-4 mb-8 text-center">
  <span className="inline-flex items-center gap-3 md:gap-4 text-ochre text-xl md:text-3xl font-extrabold uppercase tracking-[0.14em]">
    <span className="h-0.5 w-12 md:w-16 bg-ochre" /> 
    Our Partners 
    <span className="h-0.5 w-12 md:w-16 bg-ochre" />
  </span>
</div>

    {/* Infinite Scrolling Track */}
    <div className="flex w-full overflow-hidden select-none">
      <div className="flex shrink-0 items-center gap-16 md:gap-24 animate-ticker hover:[animation-play-state:paused] py-2">
        {tickerItems.map((partner, index) => (
          <div
            key={`${partner.name}-${index}`}
            className="flex items-center gap-4 shrink-0 opacity-80 hover:opacity-100 transition-opacity cursor-pointer group"
          >
            {/* Prominent Logo Container */}
            <div className="relative w-16 h-16 md:w-20 md:h-20 shrink-0">
              <Image
                src={partner.logo}
                alt={partner.name}
                fill
                className="object-contain filter group-hover:grayscale-0 transition-all duration-300"
              />
            </div>
            <span className="text-base md:text-lg font-semibold text-ink whitespace-nowrap">
              {partner.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  </section>
  );
}