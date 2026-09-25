"use client"
import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const ITEMS = [
  { id: 1, text: "The Women Went Themselves", color: "bg-emerald-500" },
  { id: 2, text: "Slide B", color: "bg-pink-500" },
  { id: 3, text: "Slide C", color: "bg-indigo-500" },
  { id: 4, text: "Slide D", color: "bg-orange-500" },
  { id: 5, text: "Slide E", color: "bg-cyan-500" },
];

export default function ScrollCarousel() {
  const [width, setWidth] = useState(0);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (carouselRef.current) {
      // Calculate how far left the carousel is allowed to be dragged
      setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
    }
  }, []);

  return (
    <div className="w-full bg-neutral-100 py-20 overflow-hidden">
      <motion.div 
        ref={carouselRef} 
        className="cursor-grab active:cursor-grabbing max-w-7xl mx-auto px-4"
      >
        <motion.div
          drag="x"
          dragConstraints={{ right: 0, left: -width }}
          className="flex gap-6 w-max"
        >
          {ITEMS.map((item) => (
            <motion.div
              key={item.id}
              className={`h-[300px] w-[350px] rounded-3xl shrink-0 flex items-center justify-center text-white text-2xl font-semibold shadow-md ${item.color}`}
              whileTap={{ scale: 0.95 }}
            >
              {item.text}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
