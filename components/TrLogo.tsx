import Image from "next/image";

export type TrLogoMotion =
  | "float"
  | "pulse"
  | "sway"
  | "drift"
  | "glow"
  | "breathe"
  | "bob"
  | "shimmer"
  | "tilt"
  | "orbit"
  | "wave";

export type TrLogoPlacement = "tr" | "tl" | "br" | "bl";

export default function TrLogo({
  motion,
  placement = "tr",
  className = "",
}: {
  motion: TrLogoMotion;
  placement?: TrLogoPlacement;
  className?: string;
}) {
  return (
    <div
      className={`tr-logo tr-logo--${motion} tr-logo--${placement} ${className}`}
      aria-hidden="true"
    >
      <Image
        src="/assets/tr-logo.png"
        alt=""
        fill
        unoptimized
        sizes="360px"
        className="tr-logo__img"
      />
    </div>
  );
}
