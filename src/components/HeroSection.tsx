import { motion, useMotionValue, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { usePublicSiteSettings } from "@/hooks/useSiteSettings";
import heroBg from "@/assets/hero-bg.jpg";
import { useMemo, useEffect, useState } from "react";
import { usePublicProfile } from "@/hooks/usePublicProfile";

// A more artistic doodle collection: gradients, sketchy filters, parallax, draw animations
const doodleShapes = [
  { id: "star", path: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" },
  { id: "squiggle", path: "M2 12c2-4 4 4 6 0s4 4 6 0s4 4 6 0" },
  { id: "mount", path: "M12 2L22 20H2L12 2z" },
  { id: "circle", path: "M12 2a10 10 0 110 20 10 10 0 010-20z" },
  { id: "plus", path: "M12 2v20M2 12h20" },
  { id: "diamond", path: "M12 2l8 10-8 10-8-10z" },
  { id: "heart", path: "M12 21C12 21 3 13.5 3 8.5 3 5.4 5.4 3 8.5 3c1.7 0 3.4.8 3.5 2.1C12.1 3.8 13.8 3 15.5 3 18.6 3 21 5.4 21 8.5 21 13.5 12 21 12 21z" },
  { id: "badge", path: "M2 6c3 0 3 6 6 6s3-6 6-6 3 6 6 6" },
];

function ArtisticDoodles() {
  // motion values for subtle parallax following cursor
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const offsetX = useTransform(mouseX, (v) => (v - window.innerWidth / 2) / 40);
  const offsetY = useTransform(mouseY, (v) => (v - window.innerHeight / 2) / 40);

  useEffect(() => {
    function move(e: MouseEvent) {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    }
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [mouseX, mouseY]);

  const doodles = useMemo(() => {
    return Array.from({ length: 16 }, (_, i) => {
      const shape = doodleShapes[i % doodleShapes.length];
      const size = 14 + (i % 5) * 6;
      const left = 6 + (i * 11) % 86;
      const top = 6 + ((i * 17 + 9) % 80);
      return {
        id: `${shape.id}-${i}`,
        path: shape.path,
        left: `${left}%`,
        top: `${top}%`,
        size,
        rotate: (i * 47) % 360,
        delay: parseFloat(((i * 0.15) % 2).toFixed(2)),
        duration: 5 + (i % 4) * 1.2,
        strokeWidth: 1 + (i % 3) * 0.8,
        opacity: 0.06 + (i % 4) * 0.06,
        paletteIndex: i % 5,
      };
    });
  }, []);

  // color palette for playful lines (tweakable)
  const palette = ["#ff7a7a", "#ffd56b", "#8ad6ff", "#a78bfa", "#6ee7b7"];

  return (
    <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="doodleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff7a7a" />
            <stop offset="50%" stopColor="#ffd56b" />
            <stop offset="100%" stopColor="#8ad6ff" />
          </linearGradient>

          {/* sketchy filter made with turbulence + displacement for a handmade feel */}
          <filter id="sketchy" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence baseFrequency="0.8" numOctaves="1" stitchTiles="stitch" result="t" />
            <feDisplacementMap in="SourceGraphic" in2="t" scale="3" />
          </filter>
        </defs>
      </svg>

      {doodles.map((d, idx) => (
        <motion.svg
          key={d.id}
          viewBox="0 0 24 24"
          width={d.size}
          height={d.size}
          className="absolute mix-blend-multiply"
          style={{ left: d.left, top: d.top, opacity: d.opacity, rotate: `${d.rotate}deg` }}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{
            y: [0, -10 - (idx % 3) * 6, 0],
            x: [0, 6 - (idx % 4) * 3, 0],
            rotate: [d.rotate, d.rotate + 25, d.rotate - 10, d.rotate],
            scale: [0.85, 1.02, 0.95, 1],
            opacity: [0, d.opacity, d.opacity * 0.9],
          }}
          transition={{
            duration: d.duration,
            ease: "easeInOut",
            repeat: Infinity,
            delay: d.delay,
          }}
        >
          {/* background soft blob for depth */}
          <motion.circle
            cx="12"
            cy="12"
            r="11"
            initial={{ scale: 0.7, opacity: 0.06 }}
            animate={{ scale: [0.7, 0.95, 0.8], opacity: [0.03, 0.08, 0.05] }}
            transition={{ duration: d.duration, repeat: Infinity, delay: d.delay }}
            fill={palette[d.paletteIndex % palette.length]}
            style={{ mixBlendMode: "screen" }}
          />

          {/* the main path with 'hand-drawn' feel */}
          <motion.path
            d={d.path}
            fill="none"
            stroke={`url(#doodleGradient)`}
            strokeWidth={d.strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#sketchy)"
            initial={{ pathLength: 0, strokeDashoffset: 10 }}
            animate={{ pathLength: [0, 1, 0.9], strokeDashoffset: [10, 0, 5] }}
            transition={{ duration: 3 + (idx % 3) * 1.2, ease: "easeInOut", repeat: Infinity, delay: d.delay }}
          />

          {/* a sketchy fill stroke behind for extra depth */}
          <motion.path
            d={d.path}
            fill="none"
            stroke={palette[(d.paletteIndex + 2) % palette.length]}
            strokeWidth={Math.max(0.8, d.strokeWidth - 0.6)}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ opacity: 0.12 }}
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: d.duration * 1.3, repeat: Infinity, delay: d.delay }}
          />
        </motion.svg>
      ))}

      {/* subtle paper grain overlay to make it feel hand-made */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.015) 1px, transparent 1px)", backgroundSize: "6px 6px", mixBlendMode: "overlay" }}
      />
    </div>
  );
}

export function HeroSection() {
  // site-wide settings (kept as fallback)
  const { data: settings, isLoading: siteLoading } = usePublicSiteSettings();
  // main profile (preferred source for hero content)
  const { data: profile, isLoading: profileLoading } = usePublicProfile();

  const loading = siteLoading || profileLoading;

  // choose profile first, fall back to site settings if profile fields are missing
  const imageUrl = profile?.profile_image_url ?? settings?.profile_image_url;
  const name = profile?.artist_name ?? settings?.artist_name ?? "Artist Name";
  const tagline = profile?.tagline ?? settings?.tagline ?? "Creating beauty from imagination";
  const bio = profile?.bio ?? settings?.bio ?? "Welcome to my creative space.";

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

      {/* Floating Doodles (artistic) */}
      <ArtisticDoodles />

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
              {imageUrl ? (
                <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                  <span className="font-display text-3xl md:text-4xl text-primary font-semibold">
                    {name.charAt(0) || "A"}
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
                {loading ? "..." : name}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl md:text-2xl text-muted-foreground font-light"
              >
                {loading ? "..." : tagline}
              </motion.p>
            </div>

            {/* Bio */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-muted-foreground max-w-lg"
            >
              {loading ? "..." : bio}
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
