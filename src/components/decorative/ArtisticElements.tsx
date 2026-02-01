import { motion } from "framer-motion";

// Paint drip decoration
export const PaintDrip = ({ className, delay = 0 }: { className?: string; delay?: number }) => (
  <motion.svg
    viewBox="0 0 40 200"
    className={className}
    initial={{ scaleY: 0, opacity: 0 }}
    animate={{ scaleY: 1, opacity: 1 }}
    transition={{ duration: 1.5, delay, ease: [0.22, 1, 0.36, 1] }}
    style={{ originY: 0 }}
  >
    <path
      d="M20,0 L20,160 Q20,180 10,190 Q0,200 20,200 Q40,200 30,190 Q20,180 20,160"
      fill="currentColor"
    />
  </motion.svg>
);

// Ink splatter effect
export const InkSplatter = ({ className, variant = 1 }: { className?: string; variant?: number }) => {
  const paths = [
    "M50,50 Q30,20 60,10 Q90,0 80,30 Q70,60 100,50 Q120,45 110,70 Q100,95 70,90 Q40,85 30,70 Q20,55 50,50",
    "M60,40 Q80,10 100,30 Q120,50 90,70 Q60,90 40,70 Q20,50 40,30 Q60,10 60,40",
    "M40,60 Q20,40 50,20 Q80,0 100,40 Q120,80 80,100 Q40,120 20,80 Q0,40 40,60",
  ];
  
  return (
    <motion.svg
      viewBox="0 0 120 120"
      className={className}
      initial={{ scale: 0, rotate: -30, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 0.6 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <path d={paths[variant % paths.length]} fill="currentColor" />
    </motion.svg>
  );
};

// Torn paper edge
export const TornEdge = ({ className, direction = "top" }: { className?: string; direction?: "top" | "bottom" }) => (
  <svg
    viewBox="0 0 1200 60"
    preserveAspectRatio="none"
    className={className}
    style={{ transform: direction === "bottom" ? "scaleY(-1)" : undefined }}
  >
    <path
      d="M0,40 Q50,30 100,45 T200,35 T300,50 T400,30 T500,45 T600,35 T700,50 T800,30 T900,45 T1000,35 T1100,50 T1200,40 L1200,60 L0,60 Z"
      fill="currentColor"
    />
  </svg>
);

// Hand-drawn circle
export const HandDrawnCircle = ({ className, delay = 0 }: { className?: string; delay?: number }) => (
  <motion.svg
    viewBox="0 0 100 100"
    className={className}
    initial={{ pathLength: 0, opacity: 0 }}
    animate={{ pathLength: 1, opacity: 1 }}
    transition={{ duration: 2, delay, ease: "easeInOut" }}
  >
    <motion.path
      d="M50,5 Q95,10 95,50 Q95,95 50,95 Q5,95 5,50 Q5,5 50,5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, delay, ease: "easeInOut" }}
    />
  </motion.svg>
);

// Brush stroke underline
export const BrushUnderline = ({ className, delay = 0 }: { className?: string; delay?: number }) => (
  <motion.svg
    viewBox="0 0 200 20"
    className={className}
    preserveAspectRatio="none"
  >
    <motion.path
      d="M0,15 Q20,5 50,12 T100,8 T150,14 T200,10"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, delay, ease: "easeOut" }}
    />
  </motion.svg>
);

// Floating orb with glow
export const FloatingOrb = ({ 
  className, 
  delay = 0,
  duration = 6 
}: { 
  className?: string; 
  delay?: number;
  duration?: number;
}) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ 
      opacity: [0.2, 0.5, 0.2],
      scale: [1, 1.2, 1],
      y: [0, -30, 0],
      x: [0, 10, 0],
    }}
    transition={{ 
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />
);

// Artistic frame corner
export const FrameCorner = ({ 
  position,
  className 
}: { 
  position: "tl" | "tr" | "bl" | "br";
  className?: string;
}) => {
  const rotation = {
    tl: 0,
    tr: 90,
    bl: 270,
    br: 180,
  };
  
  return (
    <motion.svg
      viewBox="0 0 60 60"
      className={className}
      style={{ transform: `rotate(${rotation[position]}deg)` }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <path
        d="M5,55 L5,20 Q5,5 20,5 L55,5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="55" cy="5" r="3" fill="currentColor" />
    </motion.svg>
  );
};

// Signature scribble
export const Scribble = ({ className, delay = 0 }: { className?: string; delay?: number }) => (
  <motion.svg
    viewBox="0 0 150 40"
    className={className}
  >
    <motion.path
      d="M5,20 Q15,5 30,20 T60,20 T90,15 T120,25 T145,18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.5, delay, ease: "easeOut" }}
    />
  </motion.svg>
);

// Dotted decoration
export const DottedPattern = ({ className }: { className?: string }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0 }}
    animate={{ opacity: 0.3 }}
    transition={{ duration: 1 }}
    style={{
      backgroundImage: `radial-gradient(circle, currentColor 1.5px, transparent 1.5px)`,
      backgroundSize: '12px 12px',
    }}
  />
);
