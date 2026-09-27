import { ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface FlashlightContainerProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
}

export default function FlashlightContainer({ children, className = "", ...props }: FlashlightContainerProps) {
  return (
    <motion.div
      // We keep the parent simple so it doesn't force a reverse cascade
      whileHover="hover"
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      {/* The Flashlight Line element overlay */}
      <motion.span
        className="absolute top-1/2 -translate-y-1/2 h-150 w-1/3 skew-x-6 opacity-25 pointer-events-none z-20"
        style={{
          left: "-100%", // Static starting position
          background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 100%)",
        }}
        // Using an explicit keyframe array completely prevents reverse play styles
        variants={{
          hover: {
            left: ["-100%", "210%"],
            transition: { 
              duration: 1.2, 
              ease: "easeInOut" 
            }
          }
        }}
      />

      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </motion.div>
  );
}
