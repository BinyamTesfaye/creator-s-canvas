import { motion, useInView } from "framer-motion";
import { ArrowRight, ShoppingBag, Sparkles, Star, Gem, Palette } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "./ProductCard";
import { TornEdge, InkSplatter, HandDrawnCircle, Scribble } from "./decorative/ArtisticElements";

export function FeaturedProducts() {
  const { data: products, isLoading } = useProducts();
  const featuredProducts = products?.slice(0, 4) || [];
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  if (isLoading) {
    return (
      <section className="py-28 md:py-40 relative overflow-hidden">
        <div className="artistic-container">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block"
            >
              <Sparkles className="w-10 h-10 text-primary" />
            </motion.div>
            <p className="text-muted-foreground mt-6 text-lg font-display italic">
              Loading treasures...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <section ref={sectionRef} className="relative py-28 md:py-40 overflow-hidden">
      {/* Artistic background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient orbs */}
        <motion.div
          animate={isInView ? { 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          } : {}}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2"
        />
        <motion.div
          animate={isInView ? { 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          } : {}}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl translate-y-1/2"
        />
        
        {/* Ink splatters */}
        <InkSplatter className="absolute top-32 right-20 w-24 h-24 text-primary/5" variant={1} />
        <InkSplatter className="absolute bottom-32 left-16 w-20 h-20 text-accent/5" variant={3} />
        
        {/* Decorative lines */}
        <motion.svg 
          className="absolute top-20 left-0 w-full h-24 opacity-5" 
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0,60 Q300,20 600,60 T1200,60 T1800,60 T2400,60"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-primary"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{ duration: 3 }}
          />
        </motion.svg>
      </div>

      <div className="artistic-container relative z-10">
        {/* Header with artistic elements */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          {/* Decorative badge */}
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={isInView ? { scale: 1, rotate: 0 } : {}}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 via-accent/10 to-gold/10 border-2 border-dashed border-primary/20 mb-8 relative"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <ShoppingBag className="w-5 h-5 text-primary" />
            </motion.div>
            <span className="text-primary font-display font-medium text-sm uppercase tracking-[0.2em]">
              Shop
            </span>
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.4, 1], rotate: [0, 180, 360] }}
                  transition={{ delay: i * 0.15, duration: 2, repeat: Infinity }}
                >
                  <Star className="w-3.5 h-3.5 text-gold fill-gold" />
                </motion.div>
              ))}
            </div>
            
            {/* Hand-drawn circle around badge */}
            <HandDrawnCircle className="absolute -inset-4 text-primary/20" delay={0.5} />
          </motion.div>
          
          <h2 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold relative inline-block">
            <span className="relative">
              Featured
              <Scribble className="absolute -bottom-2 left-0 w-full h-5 text-primary/30" delay={0.8} />
            </span>
            {" "}
            <span className="text-gradient bg-gradient-to-r from-primary via-accent to-gold bg-clip-text text-transparent">
              Creations
            </span>
          </h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground text-lg md:text-xl mt-6 max-w-2xl mx-auto leading-relaxed font-display italic"
          >
            Discover unique handmade pieces, each crafted with love, passion, and attention to every detail.
          </motion.p>
        </motion.div>

        {/* Product Grid with dramatic stagger */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50, rotate: -3 }}
              animate={isInView ? { opacity: 1, y: 0, rotate: 0 } : {}}
              transition={{ 
                delay: 0.2 + index * 0.12,
                type: "spring",
                stiffness: 80,
                damping: 15
              }}
              className="group relative"
            >
              {/* Featured badge for first item */}
              {index === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0, rotate: -20 }}
                  animate={isInView ? { opacity: 1, scale: 1, rotate: -6 } : {}}
                  transition={{ delay: 0.6, type: "spring" }}
                  className="absolute -top-4 -left-4 z-20"
                >
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-terracotta-dark text-primary-foreground text-xs font-bold rounded-full shadow-large">
                    <Gem className="w-3.5 h-3.5" />
                    Featured
                  </div>
                </motion.div>
              )}
              
              {/* Hover glow effect */}
              <motion.div 
                className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
              />
              
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {/* View All with artistic styling */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-20"
        >
          <div className="inline-flex flex-col items-center gap-8">
            {/* Decorative divider */}
            <div className="flex items-center gap-5">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="w-24 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-primary/50 rounded-full origin-left"
              />
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="w-7 h-7 text-primary" />
              </motion.div>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="w-24 h-0.5 bg-gradient-to-l from-transparent via-primary/30 to-primary/50 rounded-full origin-right"
              />
            </div>
            
            <Link to="/shop">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  size="lg" 
                  className="gap-4 group text-lg px-10 py-7 bg-gradient-to-r from-primary via-primary to-terracotta-dark shadow-large hover:shadow-glow transition-all"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>View All Creations</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </Button>
              </motion.div>
            </Link>
            
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Palette className="w-4 h-4 text-primary" />
              <span className="font-display italic">
                {products?.length || 0} unique pieces available
              </span>
            </p>
          </div>
        </motion.div>
      </div>
      
      {/* Bottom decorative wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none">
        <TornEdge className="w-full h-20 text-secondary/40" direction="top" />
      </div>
    </section>
  );
}
