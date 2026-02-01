import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Palette, Brush, Sparkles, Star, PenTool } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import heroBg from "@/assets/hero-bg.jpg";
import { 
  PaintDrip, 
  InkSplatter, 
  HandDrawnCircle, 
  BrushUnderline,
  FloatingOrb,
  FrameCorner,
  DottedPattern 
} from "./decorative/ArtisticElements";

export function HeroSection() {
  const { data: settings, isLoading } = useSiteSettings();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Parallax Background */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y: backgroundY }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center scale-110"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        {/* Artistic gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background" />
        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }} />
      </motion.div>

      {/* Paint Drips - Top edge */}
      <div className="absolute top-0 left-0 right-0 flex justify-around pointer-events-none z-20">
        <PaintDrip className="w-6 h-24 text-primary/20 -mt-2" delay={0.5} />
        <PaintDrip className="w-4 h-16 text-accent/15 -mt-1 ml-32" delay={0.8} />
        <PaintDrip className="w-5 h-20 text-primary/15 -mt-2 mr-20" delay={1.1} />
      </div>

      {/* Ink Splatters */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <InkSplatter className="absolute top-20 right-16 w-32 h-32 text-primary/10" variant={1} />
        <InkSplatter className="absolute bottom-32 right-1/4 w-24 h-24 text-accent/10" variant={2} />
        <InkSplatter className="absolute top-1/3 right-1/3 w-20 h-20 text-gold/10" variant={3} />
      </div>

      {/* Floating Orbs with Glow */}
      <div className="absolute inset-0 pointer-events-none z-5">
        <FloatingOrb 
          className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full bg-gradient-radial from-primary/20 via-primary/5 to-transparent blur-3xl"
          delay={0}
          duration={8}
        />
        <FloatingOrb 
          className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full bg-gradient-radial from-accent/15 via-accent/5 to-transparent blur-2xl"
          delay={2}
          duration={10}
        />
        <FloatingOrb 
          className="absolute top-1/2 right-10 w-40 h-40 rounded-full bg-gradient-radial from-gold/20 via-gold/5 to-transparent blur-xl"
          delay={1}
          duration={6}
        />
      </div>

      {/* Dotted Pattern Accent */}
      <DottedPattern className="absolute top-32 right-20 w-48 h-48 text-primary rotate-12" />

      {/* Main Content */}
      <div className="artistic-container relative z-30">
        <motion.div 
          className="max-w-3xl"
          style={{ y: textY }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
            {/* Artistic badge with hand-drawn feel */}
            <motion.div
              initial={{ opacity: 0, x: -30, rotate: -5 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-primary/10 border-2 border-dashed border-primary/30 relative"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5 text-primary" />
              </motion.div>
              <span className="text-sm text-primary font-display font-medium tracking-wide">
                Handcrafted with Love & Soul
              </span>
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ delay: i * 0.2, duration: 1.5, repeat: Infinity }}
                  >
                    <Star className="w-3 h-3 text-gold fill-gold" />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Profile with dramatic artistic frame */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
              className="relative w-36 h-36 md:w-44 md:h-44"
            >
              {/* Hand-drawn circle frame */}
              <HandDrawnCircle className="absolute -inset-4 text-primary/40" delay={0.5} />
              
              {/* Multiple orbiting rings */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-6 rounded-full border-2 border-dashed border-primary/20"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary shadow-glow" />
              </motion.div>
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-10 rounded-full border border-accent/15"
              >
                <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-accent" />
              </motion.div>
              
              {/* Main image with artistic border */}
              <div className="relative w-full h-full rounded-full overflow-hidden shadow-large">
                <div className="absolute inset-0 rounded-full border-4 border-primary/30 z-10" />
                {settings?.profile_image_url ? (
                  <img
                    src={settings.profile_image_url}
                    alt={settings.artist_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/30 via-accent/20 to-gold/30">
                    <Palette className="w-14 h-14 text-primary" />
                  </div>
                )}
              </div>
              
              {/* Floating tool icons */}
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -right-4 top-2 p-3 rounded-2xl bg-card shadow-medium border border-border/50 backdrop-blur-sm"
              >
                <Brush className="w-5 h-5 text-primary" />
              </motion.div>
              <motion.div
                animate={{ y: [0, -8, 0], rotate: [0, -10, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
                className="absolute -left-2 bottom-4 p-2.5 rounded-xl bg-card shadow-medium border border-border/50 backdrop-blur-sm"
              >
                <PenTool className="w-4 h-4 text-accent" />
              </motion.div>
            </motion.div>

            {/* Dramatic Typography */}
            <div className="space-y-4 relative">
              {/* Frame corners */}
              <FrameCorner position="tl" className="absolute -top-6 -left-6 w-12 h-12 text-primary/30" />
              <FrameCorner position="br" className="absolute -bottom-6 -right-6 w-12 h-12 text-primary/30 hidden md:block" />
              
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-foreground leading-[0.9] tracking-tight"
              >
                <span className="relative inline-block">
                  {isLoading ? "..." : settings?.artist_name || "Artist Name"}
                  <BrushUnderline 
                    className="absolute -bottom-2 left-0 w-full h-4 text-primary" 
                    delay={1}
                  />
                </span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-2xl md:text-3xl text-muted-foreground font-display italic relative pl-8"
              >
                <span className="absolute left-0 top-0 text-5xl text-primary/30 font-serif">"</span>
                {isLoading ? "..." : settings?.tagline || "Creating beauty from imagination"}
                <span className="text-5xl text-primary/30 font-serif leading-none">"</span>
              </motion.p>
            </div>

            {/* Bio with artistic styling */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="relative max-w-xl"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-accent to-gold rounded-full" />
              <p className="pl-6 text-lg text-muted-foreground leading-relaxed">
                {isLoading ? "..." : settings?.bio || "Welcome to my creative space where imagination meets craftsmanship."}
              </p>
            </motion.div>

            {/* CTAs with creative styling */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <Link to="/portfolio">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    size="lg" 
                    className="gap-3 shadow-large hover:shadow-glow transition-all text-lg px-8 py-6 bg-gradient-to-r from-primary via-primary to-terracotta-dark"
                  >
                    <span>View Portfolio</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </Button>
                </motion.div>
              </Link>
              <Link to="/shop">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="gap-3 border-2 border-primary/40 hover:bg-primary/10 hover:border-primary transition-all text-lg px-8 py-6"
                  >
                    <Palette className="w-5 h-5" />
                    Shop Creations
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Creative Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-30"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="flex flex-col items-center gap-3"
        >
          <span className="text-xs text-muted-foreground uppercase tracking-[0.4em] font-medium">
            Explore
          </span>
          <div className="relative">
            <div className="w-7 h-12 rounded-full border-2 border-muted-foreground/40 flex items-start justify-center pt-2">
              <motion.div
                animate={{ y: [0, 16, 0], opacity: [1, 0.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                className="w-2 h-3 rounded-full bg-primary"
              />
            </div>
            {/* Decorative dots */}
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 flex flex-col gap-1">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ delay: i * 0.2, duration: 1.5, repeat: Infinity }}
                  className="w-1 h-1 rounded-full bg-primary/50"
                />
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Artistic corner decorations */}
      <div className="absolute bottom-0 left-0 w-80 h-80 pointer-events-none z-20">
        <motion.svg
          viewBox="0 0 200 200"
          className="w-full h-full text-primary/10"
          initial={{ opacity: 0, rotate: -10 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ delay: 1, duration: 1.5 }}
        >
          <motion.circle
            cx="0" cy="200" r="180"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 1 }}
          />
          <motion.circle
            cx="0" cy="200" r="130"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 1.3 }}
          />
          <motion.circle
            cx="0" cy="200" r="80"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 1.6 }}
          />
        </motion.svg>
      </div>

      {/* Top-right artistic accent */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 0.1, x: 0 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="absolute top-32 right-0 pointer-events-none z-10"
      >
        <svg width="200" height="300" viewBox="0 0 200 300" className="text-primary">
          <motion.path
            d="M200,0 L200,300 M180,0 L180,280 M160,20 L160,260"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 1 }}
          />
        </svg>
      </motion.div>
    </section>
  );
}
