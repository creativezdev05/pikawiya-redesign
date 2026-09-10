type CulturalPatternProps = {
  className?: string;
  variant?: "about" | "vision" | "values" | "services" | "heritage" | "contact" | "footer";
};

export default function CulturalPattern({ className = "", variant = "about" }: CulturalPatternProps) {
  const motifs = [
    "dots", "triangle", "spiral", "dots secondary", "triangle secondary", "spiral secondary",
    "dots tertiary", "triangle tertiary", "spiral tertiary", "dots fourth", "triangle fourth", "spiral fourth",
  ];

  return (
    <div aria-hidden="true" className={`cultural-pattern cultural-pattern--${variant} ${className}`}>
      <svg className="cultural-pattern__definitions" aria-hidden="true">
        <defs>
          <g id="cultural-dots" fill="currentColor">
            <circle cx="24" cy="28" r="3" /><circle cx="50" cy="28" r="3" /><circle cx="76" cy="28" r="3" />
            <circle cx="37" cy="51" r="3" /><circle cx="63" cy="51" r="3" /><circle cx="89" cy="51" r="3" />
            <circle cx="24" cy="74" r="3" /><circle cx="50" cy="74" r="3" /><circle cx="76" cy="74" r="3" />
            <circle cx="37" cy="97" r="3" /><circle cx="63" cy="97" r="3" /><circle cx="89" cy="97" r="3" />
          </g>
          <g id="cultural-triangle" fill="none" stroke="currentColor">
            <path d="M120 28 208 188H32L120 28Z" strokeWidth="3" />
            <path d="m120 68 48 88H72l48-88Z" strokeWidth="2" />
          </g>
          <g id="cultural-spiral" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <path d="M120 120c0-12 19-18 29-5 13 16-2 39-24 39-32 0-49-37-29-62 27-34 81-20 93 21 14 49-29 94-78 82-61-14-82-88-38-131 49-48 133-23 153 43" />
          </g>
        </defs>
      </svg>
      {motifs.map((motif, index) => {
        const [type, variant] = motif.split(" ");
        return (
          <svg key={`${motif}-${index}`} className={`cultural-pattern__motif cultural-pattern__motif--${type} ${variant ? `cultural-pattern__motif--${variant}` : ""}`} viewBox={type === "dots" ? "0 0 220 220" : "0 0 240 240"}>
            <use href={`#cultural-${type}`} />
          </svg>
        );
      })}
    </div>
  );
}