import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Heart, Package, Palette, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const features = [
  {
    icon: Sparkles,
    title: "Handcrafted with Love",
    description: "Each piece is carefully made by hand with attention to every detail.",
  },
  {
    icon: Heart,
    title: "Unique & Personal",
    description: "Every creation tells its own story and carries a piece of my soul.",
  },
  {
    icon: Package,
    title: "Thoughtfully Packaged",
    description: "Your treasures arrive beautifully wrapped and ready to cherish.",
  },
];

// Decorative brush stroke
const BrushStroke = ({ className }: { className: string }) => (
  <svg viewBox="0 0 200 20" className={className}>
    <path
      d="M0,10 Q30,5 60,10 T120,10 T180,8 L200,10"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

export function AboutSection() {
  const { data: settings } = useSiteSettings();

  return (
    <section className="relative py-24 md:py-36 bg-gradient-to-b from-secondary/30 via-secondary/20 to-background overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating shapes */}
        <motion.div
          animate={{ y: [0, -30, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-20 w-24 h-24 rounded-full bg-primary/5 blur-2xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-20 left-20 w-32 h-32 rounded-full bg-accent/5 blur-2xl"
        />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="artistic-container relative z-10">
        {/* Section header with artistic styling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <Star className="w-4 h-4 text-accent fill-accent" />
            <span className="text-primary font-medium text-sm uppercase tracking-[0.2em]">
              About Me
            </span>
            <Star className="w-4 h-4 text-accent fill-accent" />
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left: About Content with artistic frame */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Decorative frame */}
            <div className="absolute -left-4 -top-4 w-20 h-20 border-l-2 border-t-2 border-primary/20 rounded-tl-3xl" />
            <div className="absolute -right-4 -bottom-4 w-20 h-20 border-r-2 border-b-2 border-primary/20 rounded-br-3xl" />
            
            <div className="space-y-8 p-4">
              <div className="space-y-4">
                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight">
                  Creating Art That
                  <span className="relative inline-block ml-3">
                    <span className="text-primary">Inspires</span>
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                      className="absolute -bottom-1 left-0 w-full"
                    >
                      <BrushStroke className="w-full h-3 text-primary/30" />
                    </motion.div>
                  </span>
                </h2>
              </div>
              
              <p className="text-muted-foreground text-lg leading-relaxed">
                {settings?.about_text ||
                  "I am a passionate artist dedicated to creating unique handmade pieces. Each creation tells a story and is crafted with love and attention to detail. From delicate sketches to handcrafted gifts, every item carries a piece of my heart."}
              </p>
              
              {/* Artistic quote */}
              <motion.blockquote
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="relative pl-6 py-4 border-l-4 border-gradient-to-b from-primary to-accent bg-primary/5 rounded-r-lg"
              >
                <Palette className="absolute -left-3 -top-3 w-6 h-6 text-primary bg-background rounded-full p-1" />
                <p className="text-foreground/80 italic font-display text-lg">
                  "Art is not what you see, but what you make others see."
                </p>
              </motion.blockquote>
              
              <Link to="/portfolio">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="gap-2 mt-2 group border-primary/30 hover:bg-primary/5"
                >
                  Explore My Work
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right: Features with artistic cards */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="group relative"
              >
                {/* Hover effect background */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative flex gap-5 p-6 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-medium">
                  {/* Icon with artistic styling */}
                  <div className="relative flex-shrink-0">
                    <motion.div
                      whileHover={{ rotate: 5, scale: 1.05 }}
                      className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center shadow-soft"
                    >
                      <feature.icon className="w-6 h-6 text-primary" />
                    </motion.div>
                    {/* Decorative dot */}
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-accent/50" />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="font-display text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Decorative element */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="flex justify-center pt-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-px bg-gradient-to-r from-transparent to-primary/30" />
                <Sparkles className="w-5 h-5 text-primary/50" />
                <div className="w-12 h-px bg-gradient-to-l from-transparent to-primary/30" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
