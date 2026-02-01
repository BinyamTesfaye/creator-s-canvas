import { motion } from "framer-motion";
import { ArrowRight, Palette, Brush, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import heroBg from "@/assets/hero-bg.jpg";

// Floating decorative shapes
const FloatingShape = ({ 
  className, 
  delay = 0,
  duration = 6,
}: { 
  className: string; 
  delay?: number;
  duration?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ 
      opacity: [0.3, 0.6, 0.3],
      scale: [1, 1.1, 1],
      y: [0, -20, 0],
    }}
    transition={{ 
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    className={className}
  />
);

// Paint splatter decoration
const PaintSplatter = ({ className }: { className: string }) => (
  <motion.svg
    viewBox="0 0 200 200"
    className={className}
    initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
    animate={{ opacity: 0.15, scale: 1, rotate: 0 }}
    transition={{ duration: 1.2, ease: "easeOut" }}
  >
    <path
      d="M100,10 Q130,30 140,70 Q150,110 120,140 Q90,170 50,150 Q10,130 20,90 Q30,50 60,30 Q90,10 100,10"
      fill="currentColor"
    />
  </motion.svg>
);

export function HeroSection() {
  const { data: settings, isLoading } = useSiteSettings();

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
      </div>

      {/* Artistic Decorations */}
      <div className="absolute inset-0 z-5 pointer-events-none overflow-hidden">
        {/* Floating circles */}
        <FloatingShape 
          className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl"
          delay={0}
        />
        <FloatingShape 
          className="absolute bottom-1/3 right-1/3 w-48 h-48 rounded-full bg-accent/15 blur-2xl"
          delay={2}
        />
        <FloatingShape 
          className="absolute top-1/2 right-10 w-32 h-32 rounded-full bg-gold/10 blur-xl"
          delay={1}
          duration={8}
        />
        
        {/* Paint splatters */}
        <PaintSplatter className="absolute top-20 right-20 w-40 h-40 text-primary" />
        <PaintSplatter className="absolute bottom-40 right-1/4 w-32 h-32 text-accent rotate-45" />
        
        {/* Brush stroke lines */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="absolute top-1/3 right-0 w-1/3 h-1 bg-gradient-to-l from-primary/30 to-transparent origin-right"
        />
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.8 }}
          className="absolute top-1/3 right-0 mt-4 w-1/4 h-0.5 bg-gradient-to-l from-accent/20 to-transparent origin-right"
        />
      </div>

      <div className="artistic-container relative z-10">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Artistic badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Handcrafted with Love</span>
            </motion.div>

            {/* Profile Image with artistic frame */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="relative w-32 h-32 md:w-40 md:h-40"
            >
              {/* Decorative rings */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-3 rounded-full border-2 border-dashed border-primary/20"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-6 rounded-full border border-accent/10"
              />
              
              {/* Main image container */}
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-primary/30 shadow-large bg-secondary">
                {settings?.profile_image_url ? (
                  <img
                    src={settings.profile_image_url}
                    alt={settings.artist_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 via-accent/20 to-gold/20">
                    <Palette className="w-12 h-12 text-primary" />
                  </div>
                )}
              </div>
              
              {/* Floating icons */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -right-2 top-0 p-2 rounded-full bg-card shadow-medium border border-border"
              >
                <Brush className="w-4 h-4 text-primary" />
              </motion.div>
            </motion.div>

            {/* Name & Tagline with artistic typography */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold text-foreground leading-tight"
              >
                <span className="relative">
                  {isLoading ? "..." : settings?.artist_name || "Artist Name"}
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1, duration: 0.6 }}
                    className="absolute -bottom-2 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-accent to-gold rounded-full origin-left"
                  />
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-xl md:text-2xl text-muted-foreground font-light italic font-display"
              >
                "{isLoading ? "..." : settings?.tagline || "Creating beauty from imagination"}"
              </motion.p>
            </div>

            {/* Bio with decorative quote */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="relative pl-6 border-l-2 border-primary/30"
            >
              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                {isLoading ? "..." : settings?.bio || "Welcome to my creative space where imagination meets craftsmanship."}
              </p>
            </motion.div>

            {/* CTAs with artistic styling */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <Link to="/portfolio">
                <Button 
                  size="lg" 
                  className="gap-2 shadow-medium hover:shadow-large transition-all hover:scale-105 bg-gradient-to-r from-primary to-primary/90"
                >
                  View Portfolio
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/shop">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="gap-2 hover:bg-primary/5 transition-all hover:scale-105 border-primary/30"
                >
                  <Palette className="w-4 h-4" />
                  Shop Creations
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Decorative scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-muted-foreground uppercase tracking-[0.3em] font-medium">Discover</span>
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center pt-2">
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1.5 h-3 rounded-full bg-primary"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Artistic corner decorations */}
      <div className="absolute bottom-0 left-0 w-64 h-64 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 0.1, x: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-0 left-0 w-full h-full"
        >
          <svg viewBox="0 0 200 200" className="w-full h-full text-primary">
            <circle cx="0" cy="200" r="150" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="0" cy="200" r="100" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="0" cy="200" r="50" fill="none" stroke="currentColor" strokeWidth="1" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
