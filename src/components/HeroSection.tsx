import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import heroBg from "@/assets/hero-bg.jpg";
import { useMemo } from "react";

const doodlePaths = [
  // Star
  "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  // Spiral
  "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c1.5 0 3-.3 4.3-.9",
  // Squiggle
  "M2 12c2-4 4 4 6 0s4 4 6 0s4 4 6 0",
  // Triangle
  "M12 2L22 20H2L12 2z",
  // Circle
  "M12 2a10 10 0 110 20 10 10 0 010-20z",
  // Cross
  "M12 2v20M2 12h20",
  // Diamond
  "M12 2l8 10-8 10-8-10z",
  // Zigzag
  "M2 8l4 8 4-8 4 8 4-8 4 8",
  // Heart
  "M12 21C12 21 3 13.5 3 8.5 3 5.4 5.4 3 8.5 3c1.7 0 3.4.8 3.5 2.1C12.1 3.8 13.8 3 15.5 3 18.6 3 21 5.4 21 8.5 21 13.5 12 21 12 21z",
  // Wave
  "M2 6c3 0 3 6 6 6s3-6 6-6 3 6 6 6",
];

function FloatingDoodles() {
  const doodles = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => ({
      id: i,
      path: doodlePaths[i % doodlePaths.length],
      x: `${5 + (i * 7) % 90}%`,
      y: `${5 + ((i * 13 + 7) % 85)}%`,
      size: 18 + (i % 4) * 8,
      rotation: (i * 37) % 360,
      duration: 4 + (i % 5) * 1.5,
      delay: (i * 0.3) % 3,
      opacity: 0.08 + (i % 3) * 0.04,
    }));
  }, []);

  return (
    <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
      {doodles.map((d) => (
        <motion.svg
          key={d.id}
          width={d.size}
          height={d.size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute text-primary"
          style={{ left: d.x, top: d.y, opacity: d.opacity }}
          initial={{ rotate: d.rotation, scale: 0.8 }}
          animate={{
            y: [0, -20, 0, 15, 0],
            x: [0, 10, -10, 5, 0],
            rotate: [d.rotation, d.rotation + 30, d.rotation - 20, d.rotation + 10, d.rotation],
            scale: [0.8, 1, 0.9, 1.05, 0.8],
          }}
          transition={{
            duration: d.duration,
            repeat: Infinity,
            delay: d.delay,
            ease: "easeInOut",
          }}
        >
          <path d={d.path} />
        </motion.svg>
      ))}
    </div>
  );
}

export function HeroSection() {
  const { data: settings, isLoading } = useSiteSettings();

  return (
    <section className="relative min-h-screen flex items-center pt-20">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
      </div>

      {/* Floating Doodles */}
      <FloatingDoodles />

      <div className="artistic-container relative z-10">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Profile Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-primary/20 shadow-large bg-secondary"
            >
              {settings?.profile_image_url ? (
                <img
                  src={settings.profile_image_url}
                  alt={settings.artist_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                  <span className="font-display text-3xl md:text-4xl text-primary font-semibold">
                    {settings?.artist_name?.charAt(0) || "A"}
                  </span>
                </div>
              )}
            </motion.div>

            {/* Name & Tagline */}
            <div className="space-y-3">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-display text-4xl md:text-6xl lg:text-7xl font-semibold text-foreground"
              >
                {isLoading ? "..." : settings?.artist_name || "Artist Name"}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl md:text-2xl text-muted-foreground font-light"
              >
                {isLoading ? "..." : settings?.tagline || "Creating beauty from imagination"}
              </motion.p>
            </div>

            {/* Bio */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-muted-foreground max-w-lg"
            >
              {isLoading ? "..." : settings?.bio || "Welcome to my creative space."}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <Link to="/portfolio">
                <Button size="lg" className="gap-2 shadow-medium hover:shadow-large transition-shadow">
                  View Portfolio
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/shop">
                <Button size="lg" variant="outline" className="gap-2">
                  Shop Now
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-muted-foreground uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-5 h-8 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center pt-1"
        >
          <div className="w-1 h-2 rounded-full bg-primary" />
        </motion.div>
      </motion.div>
    </section>
  );
}
