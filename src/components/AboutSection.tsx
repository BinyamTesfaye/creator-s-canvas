import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Heart, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { usePublicSiteSettings } from "@/hooks/useSiteSettings";

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

export function AboutSection() {
  const { data: settings } = usePublicSiteSettings();

  return (
    <section className="py-20 md:py-32 bg-secondary/30">
      <div className="artistic-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left: About Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <span className="text-primary font-medium text-sm uppercase tracking-widest">
              About Me
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold">
              Creating Art That <span className="text-primary">Inspires</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {settings?.about_text ||
                "I am a passionate artist dedicated to creating unique handmade pieces. Each creation tells a story and is crafted with love and attention to detail. From delicate sketches to handcrafted gifts, every item carries a piece of my heart."}
            </p>
            <Link to="/portfolio">
              <Button variant="outline" size="lg" className="gap-2 mt-4">
                Explore My Work
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>

          {/* Right: Features */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex gap-4 p-6 rounded-2xl bg-card/50 border border-border/50 hover-lift"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
