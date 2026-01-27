import { Link } from "react-router-dom";
import { Instagram, Twitter, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary/50 border-t border-border/50">
      <div className="artistic-container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-display text-xl font-semibold">Artisan</h3>
            <p className="text-muted-foreground text-sm max-w-xs">
              Handcrafted with love. Each piece tells a unique story.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm uppercase tracking-wider text-muted-foreground">
              Quick Links
            </h4>
            <nav className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/portfolio" className="text-sm text-foreground hover:text-primary transition-colors">
                Portfolio
              </Link>
              <Link to="/shop" className="text-sm text-foreground hover:text-primary transition-colors">
                Shop
              </Link>
            </nav>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm uppercase tracking-wider text-muted-foreground">
              Connect
            </h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="p-2 rounded-full bg-card hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-card hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="mailto:hello@example.com"
                className="p-2 rounded-full bg-card hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Artisan. All rights reserved.
          </p>
          <Link
            to="/admin/login"
            className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
          >
            Admin Access
          </Link>
        </div>
      </div>
    </footer>
  );
}
