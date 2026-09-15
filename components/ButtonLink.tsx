import { ReactNode } from "react";
import { motion, Variants, HTMLMotionProps } from "framer-motion";

interface ButtonLinkProps extends HTMLMotionProps<"a"> {
  children: ReactNode;
  icon?: ReactNode;
}

const buttonVariants : Variants = {
  initial: { backgroundColor: "#e85d26", scale: 1 },
  hover: { 
    backgroundColor: "#b83d0e", 
    scale: 1.04,
    transition: { type: "spring", stiffness: 400, damping: 25, staggerChildren: 0.08 } 
  },
  tap: { scale: 0.98 }
};

const flashVariants : Variants = {
  initial: { left: "-100%" },
  hover: { 
    left: "200%", 
    transition: { duration: 0.6, ease: "easeOut" } 
  }
};

// Simplified to purely handle smooth inline shifts without stacking
const contentVariants : Variants = {
  initial: { x: 0 },
  hover: { x: 1 } 
};

export default function ButtonLink({ children, icon, className = "", ...props }: ButtonLinkProps) {
  return (
    <motion.a
      variants={buttonVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      // Added relative, overflow-hidden, and inline-flex baseline defaults
      className={`relative overflow-hidden inline-flex items-center justify-center vertical-baseline ${className}`}
      {...props}
    >
      {/* Flashlight Line Layer */}
      <motion.span
        variants={flashVariants}
        className="absolute top-0 bottom-0 w-1/3 skew-x-12 opacity-30 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 100%)",
        }}
      />

      {/* Main Single-line Content Container */}
      <motion.span 
        variants={contentVariants} 
        className="relative z-10 flex items-center justify-center gap-inherit w-full h-full"
      >
        {children}
        {icon}
      </motion.span>
    </motion.a>
  );
}
