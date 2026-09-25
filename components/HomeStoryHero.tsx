"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import {
  ArrowRight,
  Baby,
  Globe2,
  HeartPulse,
  Landmark,
  Stethoscope,
  Sun,
  Users,
  type LucideIcon,
} from "lucide-react";

type StoryItem = {
  id: number;
  year: string;
  title: string;
  imageSrc: string;
  alt: string;
  icon: LucideIcon;
  /** Colour of the dotted wave band at the foot of the card. */
  accent: string;
};

export const CAROUSEL_ITEMS: StoryItem[] = [
  { id: 1, year: "1970", title: "The Women Went Themselves", imageSrc: "/assets/story/1970.png", alt: "Hero image 1", icon: Users, accent: "#d9622b" },
  { id: 2, year: "1974", title: "Geneva Said Yes", imageSrc: "/assets/story/1974.png", alt: "Hero image 2", icon: Globe2, accent: "#4f8a3c" },
  { id: 3, year: "1983", title: "A Generation of Health Workers", imageSrc: "/assets/story/1983.png", alt: "Hero image 3", icon: Stethoscope, accent: "#e0782f" },
  { id: 4, year: "1984", title: "Pika Wiya Incorporated", imageSrc: "/assets/story/1984.png", alt: "Hero image 4", icon: Landmark, accent: "#2f7fb5" },
  { id: 5, year: "2004", title: "Anangu Bibi Begins", imageSrc: "/assets/story/2004.png", alt: "Hero image 5", icon: Baby, accent: "#3a6fb0" },
  { id: 6, year: "2011", title: "Fully Community Controlled", imageSrc: "/assets/story/2011.png", alt: "Hero image 6", icon: HeartPulse, accent: "#7b4fa8" },
  { id: 7, year: "2026", title: "Still Ours", imageSrc: "/assets/story/2026.png", alt: "Hero image 7", icon: Sun, accent: "#c25324" },
];

// Slide rhythm: card settles → its photo blooms over the hero → holds → fades back → next card.
const SLIDE_MS = 6000;
const BLOOM_DELAY_MS = 1000;
const BLOOM_HOLD_MS = 3600;

// Scale of a card by its distance from the active one (0 = active).
const SCALES = [1, 0.72, 0.58, 0.48];
// How far each ring sits behind the active card (px, translateZ) — pushes the active card forward.
const DEPTHS = [60, -60, -130, -200];
const EASE_OUT = [0.22, 1, 0.36, 1] as const;
// Long, overshoot-free glide for the deck.
const DECK_EASE = [0.32, 0.72, 0, 1] as const;
const DECK_TRANSITION = { duration: 0.95, ease: DECK_EASE };

type Bloom = { key: number; index: number; clipFrom: string };

type HomeStoryHeroProps = {
  eyebrow: string;
  title: string;
  titleHighlight?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  imageSrc: string;
  imageAlt: string;
};

export default function HomeStoryHero({
  eyebrow,
  title,
  titleHighlight,
  description,
  ctaLabel,
  ctaHref,
  imageSrc,
  imageAlt,
}: HomeStoryHeroProps) {
  const count = CAROUSEL_ITEMS.length;
  const reduceMotion = useReducedMotion();

  const sectionRef = useRef<HTMLElement | null>(null);
  const deckRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const panningRef = useRef(false);

  // `prev` lets a card that wraps from one end of the deck to the other jump instead of flying across.
  const [slide, setSlide] = useState({ active: 0, prev: 0 });
  const [bloom, setBloom] = useState<Bloom | null>(null);
  const [size, setSize] = useState({ width: 0, viewportWidth: 1440, viewportHeight: 900 });
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);

  const { active, prev } = slide;
  const paused = hovered || focused || !inView || !pageVisible;

  const goTo = useCallback(
    (index: number) => {
      const next = ((index % count) + count) % count;
      setBloom(null);
      setSlide((s) => (s.active === next ? s : { active: next, prev: s.active }));
    },
    [count]
  );

  // ── Measurements ──
  useEffect(() => {
    const el = deckRef.current;
    if (!el) return;
    const measure = () =>
      setSize({
        width: el.getBoundingClientRect().width,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
      });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // ── Pause when off-screen or the tab is hidden ──
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.25,
    });
    observer.observe(el);
    const onVisibility = () => setPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // ── Bloom: grow the active card's photo from the card's rect to the full hero ──
  useEffect(() => {
    if (reduceMotion) return;
    const start = setTimeout(() => {
      const card = cardRefs.current[active];
      const section = sectionRef.current;
      if (!card || !section) return;
      const c = card.getBoundingClientRect();
      const s = section.getBoundingClientRect();
      const top = c.top - s.top;
      const left = c.left - s.left;
      const right = s.right - c.right;
      const bottom = s.bottom - c.bottom;
      setBloom({
        key: Date.now(),
        index: active,
        clipFrom: `inset(${top}px ${right}px ${bottom}px ${left}px round 26px)`,
      });
    }, BLOOM_DELAY_MS);
    const end = setTimeout(() => setBloom(null), BLOOM_DELAY_MS + BLOOM_HOLD_MS);
    return () => {
      clearTimeout(start);
      clearTimeout(end);
    };
  }, [active, reduceMotion]);

  // Once the glide has finished, forget `prev` so a wrapped card isn't treated as wrapping again on re-render.
  useEffect(() => {
    const timer = setTimeout(
      () => setSlide((s) => (s.prev === s.active ? s : { ...s, prev: s.active })),
      DECK_TRANSITION.duration * 1000
    );
    return () => clearTimeout(timer);
  }, [active]);

  // ── Autoplay ──
  useEffect(() => {
    if (reduceMotion || paused) return;
    const timer = setTimeout(() => goTo(active + 1), SLIDE_MS);
    return () => clearTimeout(timer);
  }, [active, paused, reduceMotion, goTo]);

  // ── Deck geometry ──
  const compact = size.width > 0 && size.width < 560;
  const cardWidth = Math.round(
    Math.min(360, Math.max(190, size.width * (compact ? 0.58 : 0.32) || 280))
  );
  const cardHeight = Math.round(
    // Below lg the deck sits under the copy, so it gets a smaller share of the screen height.
    Math.min(cardWidth * (compact ? 1.45 : 2.05), size.viewportHeight * (size.viewportWidth < 1024 ? 0.4 : 0.7))
  );
  const visibleRange = size.width >= 820 ? 3 : 2;

  // Centre-to-centre distance for each ring, slightly overlapping, then compressed to fit the deck.
  const rawPositions = [0];
  for (let k = 1; k <= 3; k++) {
    rawPositions[k] =
      rawPositions[k - 1] + 0.9 * ((cardWidth * SCALES[k - 1]) / 2 + (cardWidth * SCALES[k]) / 2);
  }
  const outer = rawPositions[visibleRange];
  const available = size.width / 2 - (cardWidth * SCALES[visibleRange]) / 2 - 8;
  const squeeze = compact || !size.width ? 1 : Math.min(1, available / outer);
  const positions = rawPositions.map((p) => p * squeeze);

  // Shortest signed distance on the loop, in [-3, 3] for 7 items.
  const circular = (i: number, from: number) => {
    const half = Math.floor(count / 2);
    return ((((i - from + half) % count) + count) % count) - half;
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") goTo(active + 1);
    if (e.key === "ArrowLeft") goTo(active - 1);
  };

  const titleNode = renderTitle(title, titleHighlight);
  const bloomItem = bloom ? CAROUSEL_ITEMS[bloom.index] : null;
  const upcoming = CAROUSEL_ITEMS[(active + 1) % count];

  return (
    <section
      ref={sectionRef}
      className="relative z-10 flex min-h-dvh w-full items-center overflow-hidden"
    >
      {/* Base landscape */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[60%_center] lg:object-center"
        />
      </div>

      {/* Bloom layer: the active story photo expanding out of its card */}
      <AnimatePresence>
        {bloom && bloomItem && (
          <motion.div
            key={bloom.key}
            className="pointer-events-none absolute inset-0 z-[1]"
            initial={{ clipPath: bloom.clipFrom, opacity: 0.35 }}
            animate={{ clipPath: "inset(0px 0px 0px 0px round 0px)", opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.2, ease: "easeInOut" } }}
            transition={{ duration: 1.5, ease: EASE_OUT }}
            aria-hidden="true"
          >
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1.12, y: 36 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ duration: 1.8, ease: EASE_OUT }}
            >
              <Image src={bloomItem.imageSrc} alt="" fill sizes="100vw" className="object-cover" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preload the next bloom so it never expands into an empty frame */}
      <div className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0" aria-hidden="true">
        <Image src={upcoming.imageSrc} alt="" fill sizes="100vw" loading="eager" />
      </div>

      {/* Warm haze behind the copy — keeps the dark headline legible over any bloom */}
      <div
        className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-b from-[#fff8ef]/90 via-[#fff8ef]/55 via-40% to-transparent to-65% lg:hidden"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 z-[2] hidden bg-gradient-to-r from-[#fff8ef]/90 via-[#fff8ef]/55 via-30% to-transparent to-55% lg:block"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto grid w-full max-w-[1600px] grid-cols-1 items-center gap-4 px-5 pt-24 pb-4 sm:gap-6 sm:px-8 sm:pt-28 lg:grid-cols-12 lg:gap-4 lg:px-12 lg:pt-32 lg:pb-10">
        <div className="max-w-xl lg:col-span-5 xl:col-span-4">
          <span className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-ochre">
            {eyebrow}
            <span className="h-px w-12 bg-ochre" aria-hidden="true" />
          </span>
          <h1 className="mb-4 max-w-[11ch] text-[clamp(2rem,8.5vw,3.5rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.02em] text-[#10233a] lg:text-[clamp(2.75rem,4.6vw,5rem)]">
            {titleNode}
          </h1>
          {description ? (
            <p className="max-w-sm text-base leading-relaxed text-[#1f2a36]/85 md:text-lg">
              {description}
            </p>
          ) : null}
          {ctaLabel && ctaHref ? (
            <Link
              href={ctaHref}
              className="mt-5 inline-flex min-h-12 items-center gap-4 rounded-full bg-ochre py-2 pl-6 pr-2 text-sm font-semibold text-white shadow-lg shadow-ochre/30 ring-2 ring-white/60 transition hover:bg-ochre-dark md:text-base"
            >
              {ctaLabel}
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-ochre">
                <ArrowRight className="h-5 w-5" />
              </span>
            </Link>
          ) : null}
        </div>

        <div className="-mx-5 sm:-mx-8 lg:col-span-7 lg:mx-0 xl:col-span-8">
          <div
            role="region"
            aria-roledescription="carousel"
            aria-label="Our story timeline"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
            onPointerLeave={() => setHovered(false)}
            onFocus={() => setFocused(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
            }}
            className="rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-ochre/60"
          >
            <motion.div
              ref={deckRef}
              className="relative w-full touch-pan-y"
              style={{ height: cardHeight + 48, perspective: 1600 }}
              onPanStart={() => {
                panningRef.current = true;
              }}
              onPanEnd={(_, info) => {
                // Include velocity so a quick flick counts as a swipe.
                const swipe = info.offset.x + info.velocity.x * 0.2;
                if (swipe < -50) goTo(active + 1);
                else if (swipe > 50) goTo(active - 1);
                // Let the click that follows pointerup see the pan flag before clearing it.
                setTimeout(() => {
                  panningRef.current = false;
                }, 0);
              }}
            >
              {CAROUSEL_ITEMS.map((item, idx) => {
                const offset = circular(idx, active);
                const distance = Math.abs(offset);
                const wrapped = Math.abs(offset - circular(idx, prev)) > count / 2;
                const hidden = distance > visibleRange;
                const isActive = distance === 0;
                const Icon = item.icon;
                const ring = Math.min(distance, 3);

                return (
                  <motion.button
                    key={item.id}
                    ref={(el) => {
                      cardRefs.current[idx] = el;
                    }}
                    type="button"
                    onClick={() => {
                      if (!panningRef.current) goTo(idx);
                    }}
                    aria-label={`Show ${item.year}: ${item.title}`}
                    aria-current={isActive}
                    tabIndex={isActive ? 0 : -1}
                    initial={false}
                    animate={{
                      x: Math.sign(offset) * positions[ring],
                      y: isActive ? -16 : 0,
                      z: DEPTHS[ring],
                      scale: SCALES[ring],
                      rotateY: offset * 9,
                      // A card wrapping round the loop jumps ends while invisible, then fades in.
                      opacity: hidden ? 0 : wrapped ? [0, 1] : 1,
                      // Animated (not set) so a card leaving the centre doesn't snap behind its neighbours mid-glide.
                      zIndex: 10 - distance,
                    }}
                    transition={
                      wrapped
                        ? { default: { duration: 0 }, opacity: { duration: 0.6, ease: "easeOut" } }
                        : DECK_TRANSITION
                    }
                    style={{
                      width: cardWidth,
                      height: cardHeight,
                      marginLeft: -cardWidth / 2,
                      transformOrigin: "50% 100%",
                      pointerEvents: hidden ? "none" : "auto",
                    }}
                    className={`absolute bottom-0 left-1/2 select-none overflow-hidden rounded-[26px] border-2 text-left transition-shadow duration-700 ${
                      isActive
                        ? "border-white shadow-[0_0_60px_rgba(255,170,95,0.85),0_30px_60px_rgba(0,0,0,0.35)]"
                        : "border-white/60 shadow-[0_18px_40px_rgba(0,0,0,0.35)]"
                    }`}
                  >
                    <Image
                      src={item.imageSrc}
                      alt={item.alt}
                      fill
                      sizes="300px"
                      draggable={false}
                      className="pointer-events-none object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 via-45% to-transparent" />
                    <div
                      className={`pointer-events-none absolute inset-0 bg-black transition-opacity duration-700 ${
                        isActive ? "opacity-0" : "opacity-25"
                      }`}
                    />

                    <span className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/85 text-ochre shadow-md">
                      <Icon className="h-5 w-5" />
                    </span>

                    <div className="absolute bottom-14 left-4 right-4 z-10">
                      <p className="text-2xl font-semibold text-[#ffb27a] drop-shadow-md">{item.year}</p>
                      <p className="line-clamp-2 text-base font-semibold leading-tight text-white drop-shadow-md sm:text-lg">
                        {item.title}
                      </p>
                    </div>

                    <DotWave color={item.accent} />
                  </motion.button>
                );
              })}
            </motion.div>

            {/* Dots double as 44px-tall touch targets */}
            <div className="mt-2 flex justify-center">
              {CAROUSEL_ITEMS.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => goTo(idx)}
                  aria-label={`Show ${item.year}: ${item.title}`}
                  aria-current={idx === active}
                  className="flex h-11 w-9 items-center justify-center"
                >
                  <span
                    className={`block h-2 rounded-full shadow-sm transition-all duration-300 ${
                      idx === active ? "w-6 bg-ochre" : "w-2 bg-white/90 ring-1 ring-black/25"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function renderTitle(title: string, highlight?: string) {
  if (!highlight) return title;
  const at = title.indexOf(highlight);
  if (at === -1) {
    return (
      <>
        {title}
        <span className="block text-ochre">{highlight}</span>
      </>
    );
  }
  return (
    <>
      {title.slice(0, at)}
      <span className="block whitespace-nowrap text-ochre">{highlight}</span>
      {title.slice(at + highlight.length)}
    </>
  );
}

/** Dotted wave band at the foot of each card, echoing the dot-painting motif. */
function DotWave({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 300 44"
      preserveAspectRatio="xMidYMax slice"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-11 w-full"
      aria-hidden="true"
    >
      <path d="M0 16 C 45 2, 95 2, 150 14 S 255 28, 300 10 V44 H0Z" fill={color} />
      {Array.from({ length: 27 }, (_, i) => (
        <circle key={`a${i}`} cx={6 + i * 11} cy={29} r={2.4} fill="#fff" opacity={0.9} />
      ))}
      {Array.from({ length: 37 }, (_, i) => (
        <circle key={`b${i}`} cx={4 + i * 8} cy={38} r={1.5} fill="#ffd7a8" opacity={0.85} />
      ))}
    </svg>
  );
}
