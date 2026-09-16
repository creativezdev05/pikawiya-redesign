import React from 'react';

interface WavyBackgroundProps {
  /** Primary wave color (Hex, HSL, or Tailwind class via currentcolor) */
  primaryColor?: string;
  /** Secondary wave color for depth */
  secondaryColor?: string;
  /** Background fill color behind the waves */
  backgroundColor?: string;
  /** Optional custom CSS classes for sizing or positioning */
  className?: string;
  /** Optional children if you want to overlay text/content directly inside */
  children?: React.ReactNode;
}

export const WavyBackground: React.FC<WavyBackgroundProps> = ({
  primaryColor = '#4f46e5',   // Default Indigo-600
  secondaryColor = '#818cf8', // Default Indigo-400
  backgroundColor = '#ffffff', // Default White
  className = '',
  children
}) => {
  return (
    <div 
      className={`relative w-full min-h-screen overflow-hidden ${className}`}
      style={{ backgroundColor }}
    >
      {/* Abstract Curved Wavy Lines SVG Layer */}
      <svg
        className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
        xmlns="http://w3.org"
        viewBox="0 0 1440 800"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Smooth gradient transition for the wavy paths */}
          <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={primaryColor} />
            <stop offset="100%" stopColor={secondaryColor} />
          </linearGradient>
        </defs>

        {/* Wave Line 1 */}
        <path
          d="M0,200 C360,400 720,100 1080,300 C1260,400 1380,350 1440,300"
          fill="none"
          stroke="url(#wave-gradient)"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Wave Line 2 (Offset for depth) */}
        <path
          d="M0,350 C400,150 650,450 1000,250 C1200,150 1350,250 1440,320"
          fill="none"
          stroke="url(#wave-gradient)"
          strokeWidth="4"
          strokeDasharray="4 8" // Creates a stylized dashed wave
          strokeLinecap="round"
          opacity="0.7"
        />

        {/* Wave Line 3 (Thinner accent line) */}
        <path
          d="M0,500 C300,650 800,400 1100,550 C1250,620 1370,580 1440,550"
          fill="none"
          stroke={secondaryColor}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>

      {/* Main Content Container Layer */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default WavyBackground;
