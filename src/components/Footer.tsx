import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Instagram, Twitter, Mail, Heart, Sparkles, ArrowUp } from "lucide-react";
import { Scribble, InkSplatter } from "./decorative/ArtisticElements";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-gradient-to-b from-secondary/30 via-secondary/50 to-secondary/70 border-t border-border/30 overflow-hidden">
      {/* Artistic background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <InkSplatter className="absolute top-10 right-20 w-32 h-32 text-primary/5" variant={1} />
        <InkSplatter className="absolute bottom-20 left-10 w-24 h-24 text-accent/5" variant={2} />
        
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '30px 30px'
        }} />
      </div>

      <div className="artistic-container py-16 md:py-20 relative z-10">
        {/* Scroll to top button */}
        <motion.button
          onClick={scrollToTop}
          whileHover={{ scale: 1.1, y: -5 }}
          whileTap={{ scale: 0.95 }}
          className="absolute -top-6 left-1/2 -translate-x-1/2 p-4 rounded-full bg-primary text-primary-foreground shadow-large hover:shadow-glow transition-all"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {/* Brand with artistic flair */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-5"
          >
            <div className="relative inline-block">
              <h3 className="font-display text-3xl font-bold text-foreground">Artisan</h3>
              <Scribble className="absolute -bottom-1 left-0 w-24 h-3 text-primary/40" />
            </div>
            <p className="text-muted-foreground leading-relaxed max-w-xs">
              Handcrafted with love. Each piece tells a unique story, carrying a piece of the artist's soul.
            </p>
            <motion.div 
              className="flex items-center gap-2 text-sm text-muted-foreground"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span>Made with</span>
              <Heart className="w-4 h-4 text-primary fill-primary" />
              <span>& creativity</span>
            </motion.div>
          </motion.div>

          {/* Quick Links with hover effects */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-5"
          >
            <h4 className="font-display font-semibold text-sm uppercase tracking-[0.2em] text-primary">
              Quick Links
            </h4>
            <nav className="flex flex-col gap-3">
              {[
                { to: "/", label: "Home" },
                { to: "/portfolio", label: "Portfolio" },
                { to: "/shop", label: "Shop" },
              ].map((link) => (
                <Link 
                  key={link.to}
                  to={link.to} 
                  className="group relative text-foreground hover:text-primary transition-colors w-fit"
                >
                  <span className="relative z-10">{link.label}</span>
                  <motion.span 
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary rounded-full group-hover:w-full transition-all duration-300"
                  />
                </Link>
              ))}
            </nav>
          </motion.div>

          {/* Social Links with artistic styling */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-5"
          >
            <h4 className="font-display font-semibold text-sm uppercase tracking-[0.2em] text-primary">
              Connect
            </h4>
            <div className="flex gap-3">
              {[
                { icon: Instagram, label: "Instagram", href: "#" },
                { icon: Twitter, label: "Twitter", href: "#" },
                { icon: Mail, label: "Email", href: "mailto:hello@example.com" },
              ].map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-2xl bg-card/80 border border-border/50 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 shadow-soft hover:shadow-medium"
                  aria-label={social.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
            
            {/* Newsletter hint */}
            <p className="text-sm text-muted-foreground italic font-display">
              Follow for new creations ✨
            </p>
          </motion.div>
        </div>

        {/* Bottom bar with artistic divider */}
        <div className="mt-16 pt-8 relative">
          {/* Artistic divider */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center gap-4">
            <div className="w-20 h-px bg-gradient-to-r from-transparent to-border" />
            <Sparkles className="w-4 h-4 text-primary/50" />
            <div className="w-20 h-px bg-gradient-to-l from-transparent to-border" />
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground font-display">
              © {currentYear} Artisan. All rights reserved.
            </p>
            <Link
              to="/admin/login"
              className="text-xs text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
