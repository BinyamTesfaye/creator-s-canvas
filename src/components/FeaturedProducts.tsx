import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Sparkles, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "./ProductCard";

export function FeaturedProducts() {
  const { data: products, isLoading } = useProducts();
  const featuredProducts = products?.slice(0, 4) || [];

  if (isLoading) {
    return (
      <section className="py-24 md:py-36 relative overflow-hidden">
        <div className="artistic-container">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-block"
            >
              <Sparkles className="w-8 h-8 text-primary" />
            </motion.div>
            <p className="text-muted-foreground mt-4">Loading creations...</p>
          </div>
        </div>
      </section>
    );
  }

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <section className="relative py-24 md:py-36 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        
        {/* Decorative lines */}
        <svg className="absolute top-20 left-0 w-full h-20 opacity-10" preserveAspectRatio="none">
          <motion.path
            d="M0,50 Q250,20 500,50 T1000,50 T1500,50 T2000,50"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-primary"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2 }}
          />
        </svg>
      </div>

      <div className="artistic-container relative z-10">
        {/* Header with artistic elements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-20"
        >
          {/* Decorative badge */}
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <ShoppingBag className="w-4 h-4 text-primary" />
            <span className="text-primary font-medium text-sm uppercase tracking-[0.15em]">
              Shop
            </span>
            <div className="flex gap-0.5">
              {[...Array(3)].map((_, i) => (
                <Star key={i} className="w-3 h-3 text-accent fill-accent" />
              ))}
            </div>
          </motion.div>
          
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold">
            <span className="relative inline-block">
              Featured
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-primary via-accent to-gold rounded-full"
              />
            </span>
            {" "}
            <span className="text-primary">Creations</span>
          </h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground text-lg mt-6 max-w-2xl mx-auto leading-relaxed"
          >
            Discover unique handmade pieces, each crafted with love, passion, and attention to every detail.
          </motion.p>
        </motion.div>

        {/* Product Grid with staggered animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30, rotate: -2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              className="group"
            >
              <div className="relative">
                {/* Decorative corner */}
                {index === 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="absolute -top-3 -left-3 z-10"
                  >
                    <div className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full shadow-medium">
                      ✨ Featured
                    </div>
                  </motion.div>
                )}
                <ProductCard product={product} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All with artistic styling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="inline-flex flex-col items-center gap-6">
            {/* Decorative divider */}
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                className="w-16 h-px bg-gradient-to-r from-transparent to-border"
              />
              <Sparkles className="w-5 h-5 text-primary/50" />
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                className="w-16 h-px bg-gradient-to-l from-transparent to-border"
              />
            </div>
            
            <Link to="/shop">
              <Button 
                size="lg" 
                className="gap-3 group bg-gradient-to-r from-primary to-primary/90 hover:shadow-large transition-all hover:scale-105"
              >
                <ShoppingBag className="w-5 h-5" />
                View All Creations
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            
            <p className="text-sm text-muted-foreground">
              {products?.length || 0} unique pieces available
            </p>
          </div>
        </motion.div>
      </div>
      
      {/* Bottom decorative wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-16 text-secondary/30"
        >
          <path
            d="M0,60 C200,100 400,20 600,60 C800,100 1000,20 1200,60 L1200,120 L0,120 Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </section>
  );
}
