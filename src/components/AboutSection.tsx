import { motion, useInView } from "framer-motion";
import { ArrowRight, Sparkles, Heart, Package, Palette, Star, Feather, Gem } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { TornEdge, Scribble, InkSplatter, FrameCorner } from "./decorative/ArtisticElements";

const features = [
  {
    icon: Sparkles,
    title: "Handcrafted with Love",
    description: "Each piece is carefully made by hand with attention to every detail.",
    accent: "primary",
  },
  {
    icon: Heart,
    title: "Unique & Personal",
    description: "Every creation tells its own story and carries a piece of my soul.",
    accent: "accent",
  },
  {
    icon: Package,
    title: "Thoughtfully Packaged",
    description: "Your treasures arrive beautifully wrapped and ready to cherish.",
    accent: "gold",
  },
];

export function AboutSection() {
  const { data: settings } = useSiteSettings();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="relative py-28 md:py-40 overflow-hidden">
      {/* Torn paper edge effect at top */}
      <TornEdge className="absolute top-0 left-0 right-0 h-16 text-background -translate-y-1" direction="bottom" />
      
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/40 via-secondary/20 to-background" />
      
      {/* Artistic background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Large floating shapes */}
        <motion.div
          animate={isInView ? { 
            y: [0, -40, 0], 
            rotate: [0, 5, 0],
            scale: [1, 1.1, 1]
          } : {}}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl"
        />
        <motion.div
          animate={isInView ? { 
            y: [0, 30, 0], 
            rotate: [0, -5, 0] 
          } : {}}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl"
        />
        
        {/* Ink splatters */}
        <InkSplatter className="absolute top-40 right-10 w-20 h-20 text-primary/5 rotate-45" variant={1} />
        <InkSplatter className="absolute bottom-40 left-10 w-16 h-16 text-accent/5 -rotate-12" variant={2} />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="artistic-container relative z-10">
        {/* Section header with artistic flair */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={isInView ? { scale: 1, rotate: 0 } : {}}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Feather className="w-5 h-5 text-primary" />
            </motion.div>
            <span className="text-primary font-display font-medium text-sm uppercase tracking-[0.25em]">
              The Story
            </span>
            <motion.div
              animate={{ rotate: [0, -360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Feather className="w-5 h-5 text-primary scale-x-[-1]" />
            </motion.div>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left: About Content with artistic frame */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Decorative frame */}
            <FrameCorner position="tl" className="absolute -left-4 -top-4 w-16 h-16 text-primary/30" />
            <FrameCorner position="br" className="absolute -right-4 -bottom-4 w-16 h-16 text-primary/30" />
            
            <div className="space-y-8 p-6">
              <div className="space-y-5">
                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1]">
                  Creating Art That
                  <span className="relative block mt-2">
                    <span className="text-gradient bg-gradient-to-r from-primary via-accent to-gold bg-clip-text text-transparent">
                      Inspires
                    </span>
                    <Scribble className="absolute -bottom-2 left-0 w-40 h-6 text-primary/40" delay={0.8} />
                  </span>
                </h2>
              </div>
              
              <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
                {settings?.about_text ||
                  "I am a passionate artist dedicated to creating unique handmade pieces. Each creation tells a story and is crafted with love and attention to detail. From delicate sketches to handcrafted gifts, every item carries a piece of my heart."}
              </p>
              
              {/* Artistic quote with dramatic styling */}
              <motion.blockquote
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="relative my-8"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-accent to-gold rounded-full" />
                <div className="pl-6 py-4 bg-gradient-to-r from-primary/5 to-transparent rounded-r-xl">
                  <Gem className="absolute -left-3 top-4 w-6 h-6 text-primary bg-background rounded-full p-1 shadow-medium" />
                  <p className="text-foreground/90 italic font-display text-xl md:text-2xl leading-relaxed">
                    "Art is not what you see, but what you make others see."
                  </p>
                  <span className="text-sm text-muted-foreground mt-2 block">— Edgar Degas</span>
                </div>
              </motion.blockquote>
              
              <Link to="/portfolio">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="gap-3 mt-4 group border-2 border-primary/40 hover:bg-primary/10 hover:border-primary text-lg px-8"
                  >
                    Explore My Work
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-5 h-5 text-primary" />
                    </motion.div>
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>

          {/* Right: Features with artistic cards */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: 50, rotate: 2 }}
                animate={isInView ? { opacity: 1, x: 0, rotate: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.15 }}
                className="group relative"
              >
                {/* Hover glow effect */}
                <motion.div 
                  className="absolute -inset-2 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                  style={{
                    background: feature.accent === "primary" 
                      ? "linear-gradient(135deg, hsl(var(--primary) / 0.2), transparent)"
                      : feature.accent === "accent"
                      ? "linear-gradient(135deg, hsl(var(--accent) / 0.2), transparent)"
                      : "linear-gradient(135deg, hsl(var(--gold) / 0.2), transparent)"
                  }}
                />
                
                <div className="relative flex gap-6 p-6 md:p-8 rounded-3xl bg-card/80 backdrop-blur-sm border-2 border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-large group-hover:-translate-y-1">
                  {/* Icon with artistic container */}
                  <div className="relative flex-shrink-0">
                    <motion.div
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      className="w-16 h-16 md:w-18 md:h-18 rounded-2xl flex items-center justify-center shadow-medium relative overflow-hidden"
                      style={{
                        background: feature.accent === "primary" 
                          ? "linear-gradient(135deg, hsl(var(--primary) / 0.2), hsl(var(--primary) / 0.05))"
                          : feature.accent === "accent"
                          ? "linear-gradient(135deg, hsl(var(--accent) / 0.2), hsl(var(--accent) / 0.05))"
                          : "linear-gradient(135deg, hsl(var(--gold) / 0.2), hsl(var(--gold) / 0.05))"
                      }}
                    >
                      <feature.icon className={`w-7 h-7 ${
                        feature.accent === "primary" ? "text-primary" :
                        feature.accent === "accent" ? "text-accent" : "text-gold"
                      }`} />
                    </motion.div>
                    {/* Decorative dot */}
                    <motion.div 
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${
                        feature.accent === "primary" ? "bg-primary/50" :
                        feature.accent === "accent" ? "bg-accent/50" : "bg-gold/50"
                      }`} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Decorative flourish */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex justify-center pt-8"
            >
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ scaleX: [0, 1] }}
                  transition={{ delay: 1, duration: 0.8 }}
                  className="w-20 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-primary/50 rounded-full origin-left"
                />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-6 h-6 text-primary" />
                </motion.div>
                <motion.div
                  animate={{ scaleX: [0, 1] }}
                  transition={{ delay: 1, duration: 0.8 }}
                  className="w-20 h-0.5 bg-gradient-to-l from-transparent via-primary/30 to-primary/50 rounded-full origin-right"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Torn paper edge effect at bottom */}
      <TornEdge className="absolute bottom-0 left-0 right-0 h-16 text-background translate-y-1" direction="top" />
    </section>
  );
}
