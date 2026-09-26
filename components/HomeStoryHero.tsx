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
import CulturalPattern from "./CulturalPattern";

type StoryItem = {
  id: number;
  year: string;
  title: string;
  imageSrc: string;
  alt: string;
  icon: LucideIcon;
  /** Card accent: tints the slab edge and the glow behind the card. */
  accent: string;
};

export const CAROUSEL_ITEMS: StoryItem[] = [
  { id: 1, year: "1970", title: "The Women Went Themselves", imageSrc: "/assets/story/1970.png", alt: "Hero image 1", icon: Users, accent: "#d9622b" },
  { id: 2, year: "1974", title: "Geneva Said Yes", imageSrc: "/assets/story/1974.png", alt: "Hero image 2", icon: Globe2, accent: "#4f8a3c" },
  { id: 3, year: "1983", title: "A Generation of Health Workers", imageSrc: "/assets/story/1983.png", alt: "Hero image 3", icon: Stethoscope, accent: "#e0782f" },
  { id: 4, year: "1984", title: "Pika Wiya Incorporated", imageSrc: "/assets/story/1984.png", alt: "Hero image 4", icon: Landmark, accent: "#2f7fb5" },
  { id: 5, year: "2004", title: "Anangu Bibi Begins", imageSrc: "/assets/story/2004.png", alt: "Hero image 5", icon: Baby, accent: "#3a6fb0" },
  // { id: 6, year: "2011", title: "Fully Community Controlled", imageSrc: "/assets/story/2011.png", alt: "Hero image 6", icon: HeartPulse, accent: "#7b4fa8" },
  // { id: 7, year: "2026", title: "Still Ours", imageSrc: "/assets/story/2026.png", alt: "Hero image 7", icon: Sun, accent: "#c25324" },
];

// Slide rhythm: card glides in level with the deck → pops forward → its photo blooms over the hero →
// holds → fades → card eases back → next card.
const SLIDE_MS = 6000;
// Bloom waits for the pop to settle, so it measures the card at its popped size.
const BLOOM_DELAY_MS = 1900;
const BLOOM_HOLD_MS = 2900;

// Scale of a card by its distance from the active one (0 = active). Heights step down from the centre,
// so the whole deck forms a triangle / pyramid.
const SCALES = [1.07, 0.84, 0.72, 0.62];
// How far each ring sits behind the active card (px, translateZ). Kept shallow so every card stays readable.
const DEPTHS = [120, -40, -80, -120];
// Resting Y-turn (deg) shared by every card in the stack — including the centre one — so each shows its
// left slab edge. Only the popped card turns to face the viewer (0deg); nothing turns while sliding.
const STACK_TILT = 14;
// Card proportions (height ÷ width) and the spacing between neighbours (fraction of card width).
// Slightly negative = the cards just overlap, so no gaps show at rest or while sliding.
const CARD_ASPECT = 1.95;
const CARD_GAP = -0.03;
// Brightness per ring — distance haze.
const BRIGHTNESS = [1, 0.88, 0.76, 0.66];
// Strength of the light spilling round each ring's edges — brightest behind the main card, fading outwards.
const BACKLIGHT = [1, 0.7, 0.45, 0.28];
const PERSPECTIVE = 1400;
// Extra stretch for the popped card only (on top of SCALES[0]). Kept out of the deck sizing, so raising
// these makes the popped card bigger without shrinking the rest of the deck.
const POP_BOOST = { width: 1.12, height: 1.16 };
// Where the active card eases back to just before the deck moves on.
const RECEDE = { scale: 1, z: 30, y: 0 };
// How long before the next slide the active card starts easing back.
const RECEDE_MS = 1200;
// How far each ring sits above the centre card's baseline (fraction of card height): cards further back
// stand slightly higher, as if on a floor receding from the viewer.
const FLOOR_RISE = [0, 0.02, 0.035, 0.05];
// Card slab thickness (px) and how many stacked layers draw its rounded edge.
const SLAB_DEPTH = 18;
const SLAB_LAYERS = 10;
const EASE_OUT = [0.22, 1, 0.36, 1] as const;
// Long, overshoot-free glide for the deck.
const DECK_EASE = [0.32, 0.72, 0, 1] as const;
const DECK_TRANSITION = { duration: 0.95, ease: DECK_EASE };
// Spring for the card arriving at the centre — slow and under-damped, so it overshoots forward a touch
// and settles back: the pop.
const POP_SPRING = { type: "spring", stiffness: 90, damping: 12, mass: 1 } as const;
// Slow, soft ease for the active card drifting back before the next slide.
const RECEDE_TRANSITION = { duration: RECEDE_MS / 1000, ease: [0.45, 0, 0.55, 1] as const };

/**
 * Dot orbit centred exactly on the section's bottom-right corner: only the upper-left quarter of a
 * larger rotating circle is on screen, so it reads as an arc drifting past the edge.
 */
export const CORNER_DOTS = [{ x: "100%", y: "100%", rings: 7, startR: 26, gap: 22, speed: 60 }];

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
  // True only while the carousel has keyboard focus — so keyboard users can read a card. Mouse clicks
  // and hover don't pause: after a click the chosen card pops, eases back and the deck moves on as usual.
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);

  // Index of the card currently easing back before autoplay moves on (derived, so no reset is needed).
  const [recedeFor, setRecedeFor] = useState<number | null>(null);
  // False for a beat after mount, so the first card also plays its pop instead of starting popped.
  const [introDone, setIntroDone] = useState(false);

  const { active, prev } = slide;
  const paused = focused || !inView || !pageVisible;
  // Pausing (hover/focus) mid-recede springs the card forward again.
  const receding = recedeFor === active && !paused;

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

  useEffect(() => {
    const timer = setTimeout(() => setIntroDone(true), 450);
    return () => clearTimeout(timer);
  }, []);

  // ── Autoplay ──
  // Shortly before advancing, the active card eases back from its pop so the hand-off is gentle.
  useEffect(() => {
    if (reduceMotion || paused) return;
    const recede = setTimeout(() => setRecedeFor(active), SLIDE_MS - RECEDE_MS);
    const timer = setTimeout(() => goTo(active + 1), SLIDE_MS);
    return () => {
      clearTimeout(recede);
      clearTimeout(timer);
    };
  }, [active, paused, reduceMotion, goTo]);

  // ── Deck geometry ──
  // Cards stand edge to edge in the stack. Widths are worked out on screen — scale × the perspective
  // magnification of the card's depth × the narrowing from the stack tilt — so the spacing holds exactly.
  const project = (depth: number) => PERSPECTIVE / (PERSPECTIVE - depth);
  const tiltWidth = Math.cos((STACK_TILT * Math.PI) / 180);
  // The centre card is spaced at its resting (un-popped) size; when it pops it grows over its neighbours.
  const restScale = SCALES.map((sc, k) =>
    k === 0 ? RECEDE.scale * project(RECEDE.z) * tiltWidth : sc * project(DEPTHS[k]) * tiltWidth
  );
  // On-screen size of the popped card (facing the viewer, fully forward).
  const popSize = SCALES[0] * project(DEPTHS[0]);
  // All seven on wide decks; phones show the centre card with one or two neighbours each side.
  const visibleRange = size.width >= 820 ? 3 : size.width >= 520 ? 2 : 1;

  // Total deck width in card widths: the centre plus each visible ring on both sides.
  let units = restScale[0];
  for (let k = 1; k <= visibleRange; k++) units += 2 * (restScale[k] + CARD_GAP);
  // Popped centre card height stays within a share of the screen (smaller below lg, where it sits under the copy).
  const heightCap = (size.viewportHeight * (size.viewportWidth < 1024 ? 0.62 : 0.95)) / popSize;
  const cardWidth = Math.round(
    Math.max(140, Math.min(size.width ? (size.width * 1.18) / units : 260, heightCap / CARD_ASPECT, 500))
  );
  const cardHeight = Math.round(cardWidth * CARD_ASPECT);

  // Centre-to-centre spacing on screen, converted back to each card's own depth plane (perspective pulls
  // deeper cards towards the centre, so they need a slightly larger x to land where intended).
  const screenPositions = [0];
  for (let k = 1; k <= 3; k++) {
    screenPositions[k] =
      screenPositions[k - 1] + cardWidth * (restScale[k - 1] / 2 + restScale[k] / 2 + CARD_GAP);
  }
  const positions = screenPositions.map((p, k) => p / project(DEPTHS[k]));

  // Shortest signed distance on the loop, in [-3, 3] for 7 items.
  const circular = (i: number, from: number) => {
    const half = Math.floor(count / 2);
    return ((((i - from + half) % count) + count) % count) - half;
  };
  // Direction the deck is travelling: +1 = on to the next card, -1 = back. 0 once the glide has settled.
  const travel = Math.sign(circular(active, prev));
  // The active card only pops once the glide has settled (travel back to 0), so its arrival and its pop
  // read as two beats instead of one blended move — and it's not already forward when it lands.
  const popped = introDone && travel === 0 && !receding;

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
      // lg: content stretches to the full screen height — the deck stays vertically centred, the copy pins to the top.
      className="relative z-10 flex min-h-dvh w-full items-center overflow-hidden lg:items-stretch"
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

      {/* Corner dot arc — above the bloom, behind the copy and deck */}
      <CulturalPattern variant="about" fit="fill" className="z-[3]" dotsConfig={CORNER_DOTS} />

      {/* Content */}
      <div className="relative z-10 mx-auto grid w-full max-w-[1600px] grid-cols-1 items-center gap-4 px-5 pt-24 pb-4 sm:gap-6 sm:px-8 sm:pt-28 lg:grid-cols-12 lg:gap-4 lg:pl-5 lg:pr-12 lg:pt-24 lg:pb-1 pt-0.5 xl:pl-4 2xl:pl-3">
        {/* From lg the copy sits at the top of the row instead of centring on the (taller) deck.
            pt-24 (96px) still clears the ~80px fixed header, so it never slides under the nav. */}
        <div className="relative z-20 max-w-lg lg:col-span-4 lg:self-start min-[1600px]:ml-[calc((1600px-100vw)/3)]">
          <span className="mb-3 flex items-center gap-3 text-[0.6875rem] font-semibold uppercase tracking-[0.28em] text-ochre">
            {eyebrow}
          </span>
          {/* Heading: zooms gently into place on load, and zooms a touch on hover */}
          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={reduceMotion ? undefined : { scale: 1.03 }}
            transition={{ duration: 0.9, ease: EASE_OUT }}
            style={{ transformOrigin: "0% 50%" }}
            className="mb-3 max-w-[11ch] text-[clamp(1.625rem,6.5vw,2.5rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.02em] text-[#10233a] lg:text-[clamp(2rem,3.2vw,3.4rem)]"
          >
            {titleNode}
          </motion.h1>
          {description ? (
            <p className="max-w-sm text-sm leading-relaxed text-[#1f2a36]/85 md:text-[0.9375rem]">
              {description}
            </p>
          ) : null}
          {ctaLabel && ctaHref ? (
            <motion.div
              className="mt-4 inline-block"
              whileHover={reduceMotion ? undefined : { y: -3, scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 320, damping: 20 }}
            >
              <Link
                href={ctaHref}
                className="group relative inline-flex min-h-11 items-center gap-3 overflow-hidden rounded-full bg-ochre py-1.5 pl-5 pr-1.5 text-[0.8125rem] font-semibold text-white shadow-lg shadow-ochre/30 ring-2 ring-white/60 transition-[background-color,box-shadow] duration-300 hover:bg-ochre-dark hover:shadow-xl hover:shadow-ochre/50"
              >
                {/* Light sweep across the pill on hover */}
                <span
                  className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/45 to-transparent opacity-0 transition-[left,opacity] duration-700 ease-out group-hover:left-[120%] group-hover:opacity-100 motion-reduce:hidden"
                  aria-hidden="true"
                />
                <span className="relative">{ctaLabel}</span>
                {/* Arrow nudges right on hover */}
                <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white text-ochre transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none">
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-45 motion-reduce:transition-none" />
                </span>
              </Link>
            </motion.div>
          ) : null}
        </div>

        {/* lg: deck on the right, taking the grid's right padding and a little of the gutter beside the copy so
            the cards can be larger; it sits in the lower part of the hero. */}
        <div className="-mx-5 sm:-mx-8 lg:col-span-8 lg:-ml-32 lg:-mr-12 lg:self-end">
          <div
            role="region"
            aria-roledescription="carousel"
            aria-label="Our story timeline"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            // Pause only for keyboard focus (:focus-visible), not the focus a mouse click leaves behind.
            onFocus={(e) => setFocused(e.target.matches(":focus-visible"))}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
            }}
            className="rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-ochre/60"
          >
            <motion.div
              ref={deckRef}
              className="relative w-full touch-pan-y"
              // Headroom for the popped-up active card (scale + lift).
              style={{
                height: Math.round(cardHeight * (popSize * POP_BOOST.height + FLOOR_RISE[3])) + 40,
                perspective: PERSPECTIVE,
              }}
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
              <div
                className="pointer-events-none absolute inset-x-[4%] -bottom-3 h-10 rounded-[50%] bg-black/30 blur-2xl"
                aria-hidden="true"
              />
              {CAROUSEL_ITEMS.map((item, idx) => {
                const offset = circular(idx, active);
                const distance = Math.abs(offset);
                const wrapped = Math.abs(offset - circular(idx, prev)) > count / 2;
                const hidden = distance > visibleRange;
                const isActive = distance === 0;
                const Icon = item.icon;
                const ring = Math.min(distance, 3);

                // Every card keeps the stack tilt, including while sliding. Only the settled, popped centre
                // card turns to face the viewer — and turns back as it recedes.
                const rotateTarget = isActive && popped ? 0 : STACK_TILT;
                const zTarget = isActive ? (popped ? DEPTHS[0] : RECEDE.z) : DEPTHS[ring];
                // Edge glow from the slab's back: a tight bright rim plus a wide soft bloom, strongest on the main
                // card and fading ring by ring; drop shadows underneath keep the cards grounded.
                const g = BACKLIGHT[ring];
                const edgeGlow = [
                  "0 2px 4px rgba(0,0,0,0.18)",
                  "0 22px 44px -10px rgba(0,0,0,0.4)",
                  `0 0 ${Math.round(14 + 14 * g)}px rgba(255,206,140,${(0.5 * g).toFixed(2)})`,
                  `0 0 ${Math.round(40 + 40 * g)}px rgba(255,150,60,${(0.4 * g).toFixed(2)})`,
                ].join(", ");
                // Soft warm light round the face's edges (kept subtle — the box outline carries the edge now).
                const faceGlow = [
                  `0 0 ${Math.round(4 + 4 * g)}px rgba(255,200,120,${(0.4 + 0.5 * g).toFixed(2)})`,
                  `0 0 ${Math.round(12 + 14 * g)}px rgba(255,160,70,${(0.25 + 0.4 * g).toFixed(2)})`,
                  `0 0 ${Math.round(30 + 26 * g)}px rgba(255,130,50,${(0.12 + 0.2 * g).toFixed(2)})`,
                ].join(", ");
                // Bevelled frame inside the front edges: light catches the top-left, shade falls bottom-right,
                // with a second fine line inset — reads as a raised, box-like frame round the picture.
                const bevel = [
                  // Outer lit line
                  `inset 0 0 0 2px rgba(255,214,150,${(0.75 + 0.25 * g).toFixed(2)})`,
                  // Raised bevel: warm highlight top-left, shade bottom-right
                  "inset 4px 4px 0 rgba(255,236,190,0.6)",
                  "inset -4px -4px 0 rgba(60,25,5,0.45)",
                  // Frame band and a second, inner lit line
                  "inset 0 0 0 9px rgba(255,190,110,0.14)",
                  `inset 0 0 0 10px rgba(255,200,130,${(0.35 + 0.35 * g).toFixed(2)})`,
                  "inset 11px 11px 0 -1px rgba(255,240,210,0.3)",
                  "inset -11px -11px 0 -1px rgba(40,15,0,0.3)",
                  // Warm light glowing inward off the frame
                  `inset 0 0 ${Math.round(16 + 14 * g)}px rgba(255,150,60,${(0.35 + 0.35 * g).toFixed(2)})`,
                ].join(", ");
                const yTarget = -Math.round(cardHeight * FLOOR_RISE[ring]) - (isActive && popped ? 14 : 0);
                // Active card: glides in level with the deck, then springs forward (slight overshoot) once
                // settled, and eases slowly back before the next slide.
                const activeMotion = !isActive
                  ? undefined
                  : receding
                    ? RECEDE_TRANSITION
                    : !popped || reduceMotion
                      ? DECK_TRANSITION
                      : POP_SPRING;

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
                      y: yTarget,
                      z: zTarget,
                      scale: isActive && !popped ? RECEDE.scale : SCALES[ring],
                      scaleX: isActive && popped ? POP_BOOST.width : 1,
                      scaleY: isActive && popped ? POP_BOOST.height : 1,
                      rotateY: rotateTarget,
                      // A card wrapping round the loop jumps ends while invisible, then fades in.
                      opacity: hidden ? 0 : wrapped ? [0, 1] : 1,
                      // Animated (not set) so a card leaving the centre doesn't snap behind its neighbours mid-glide.
                      zIndex: 10 - distance,
                    }}
                    transition={
                      wrapped
                        ? { default: { duration: 0 }, opacity: { duration: 0.6, ease: "easeOut" } }
                        : {
                            ...DECK_TRANSITION,
                            rotateY: activeMotion ?? DECK_TRANSITION,
                            z: activeMotion ?? DECK_TRANSITION,
                            scale: activeMotion ?? DECK_TRANSITION,
                            scaleX: activeMotion ?? DECK_TRANSITION,
                            scaleY: activeMotion ?? DECK_TRANSITION,
                            y: activeMotion ?? DECK_TRANSITION,
                          }
                    }
                    style={{
                      width: cardWidth,
                      height: cardHeight,
                      marginLeft: -cardWidth / 2,
                      transformOrigin: "50% 100%",
                      transformStyle: "preserve-3d",
                      pointerEvents: hidden ? "none" : "auto",
                    }}
                    // No overflow/filter here: either would flatten the slab's 3D layers.
                    className="group absolute bottom-0 left-1/2 select-none text-left"
                  >
                    {/* Back glow: a blurred halo behind the slab that leaks round its edges. Warm-white and strongest on
                        the main card, fading (and taking more of the card's accent) towards the outer cards. */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -inset-[12%] rounded-[48px] blur-2xl transition-opacity duration-700"
                      style={{
                        opacity: BACKLIGHT[ring] * 0.55,
                        transform: `translateZ(${-SLAB_DEPTH - 2}px)`,
                        background: `radial-gradient(closest-side, color-mix(in srgb, ${item.accent} ${
                          15 + ring * 12
                        }%, #ffcf8f) 35%, transparent)`,
                      }}
                    />

                    {/* Slab body: stacked rounded layers behind the face form a solid edge that shows as the card turns.
                        The deepest one is the back and carries the drop shadow. */}
                    {Array.from({ length: SLAB_LAYERS }, (_, l) => {
                      const depth = ((l + 1) / SLAB_LAYERS) * SLAB_DEPTH;
                      const isBack = l === SLAB_LAYERS - 1;
                      const isFront = l === 0;
                      return (
                        <span
                          key={l}
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 rounded-[26px] transition-shadow duration-700"
                          style={{
                            boxShadow: isBack
                              ? edgeGlow
                              : isFront
                                ? `0 0 ${Math.round(8 + 8 * g)}px rgba(255,170,80,${(0.35 + 0.35 * g).toFixed(2)})`
                                : undefined,
                            // Box outline: light edge lines where the side faces meet the front and back.
                            border: isFront
                              ? "2.5px solid rgba(255,206,140,0.95)"
                              : isBack
                                ? "2px solid rgba(255,180,110,0.7)"
                                : undefined,
                            transform: `translateZ(${-depth}px)`,
                            // Warm, lit edge near the face (tinted by the card's accent), darkening towards the back.
                            background: `color-mix(in srgb, ${item.accent} ${Math.round(30 + l * 7)}%, ${
                              l < SLAB_LAYERS / 2 ? "#ffc98a" : "#3a2114"
                            })`,
                          }}
                        />
                      );
                    })}

                    {/* Front face */}
                    <span
                      // @container: text and icon size from the card's own width, so narrow outer cards stay tidy.
                      className="@container absolute inset-0 overflow-hidden rounded-[26px] border transition-[box-shadow,border-color] duration-700"
                      style={{
                        transform: "translateZ(0.5px)",
                        borderColor: `rgba(255,205,140,${(0.8 + 0.2 * g).toFixed(2)})`,
                        borderWidth: 2,
                        boxShadow: faceGlow,
                      }}
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
                      {/* Distance shade: darker the further a card sits from the centre */}
                      <div
                        className="pointer-events-none absolute inset-0 bg-black transition-opacity duration-700"
                        style={{ opacity: isActive ? 0 : Math.min(0.6, 0.2 + (1 - BRIGHTNESS[ring])) }}
                      />

                      <span className="absolute left-[7cqw] top-[7cqw] flex size-[clamp(1.75rem,17cqw,2.75rem)] items-center justify-center rounded-full bg-white/85 text-ochre shadow-md">
                        <Icon className="size-[55%]" />
                      </span>

                      <div className="absolute bottom-[8cqw] left-[7cqw] right-[7cqw] z-10">
                        <p className="text-[clamp(1rem,11cqw,1.5rem)] font-semibold text-[#ffb27a] drop-shadow-md">{item.year}</p>
                        <p className="line-clamp-3 text-[clamp(0.75rem,7.5cqw,1.125rem)] font-semibold leading-tight text-white drop-shadow-md">
                          {item.title}
                        </p>
                      </div>

                      {/* Glass edge: gradient sheen + inset highlight/shade give the card a lit, bevelled rim */}
                      <span
                        className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-br from-white/20 via-white/0 via-35% to-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.5),inset_1px_0_0_rgba(255,255,255,0.18),inset_0_0_0_1px_rgba(255,255,255,0.08),inset_0_-18px_32px_-12px_rgba(0,0,0,0.35)]"
                        aria-hidden="true"
                      />
                      {/* Bevelled 3D frame just inside the front edges */}
                      <span
                        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-shadow duration-700"
                        style={{ boxShadow: bevel }}
                        aria-hidden="true"
                      />
                    </span>
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
