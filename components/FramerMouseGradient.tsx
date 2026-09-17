'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useEffect } from 'react';

export default function FramerMouseGradient() {
  // 1. Initialize smooth motion values for coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    // 2. Track mouse position globally
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // 3. Map coordinates directly into a dynamic CSS string
  const background = useTransform(
    [mouseX, mouseY],
    ([x, y]) => `radial-gradient(300px circle at ${x}px ${y}px, rgba(242, 189, 15, 0.15), transparent 30%)`
  );

  return (
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ background }}
      />
  );
}
