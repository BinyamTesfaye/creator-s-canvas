import { useEffect, useState } from "react";
import { useNavigate, Outlet, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  Image,
  ShoppingCart,
  Settings,
  LogOut,
  Home,
  BookOpen,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const sidebarLinks = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard, exact: true },
  { name: "Products", path: "/admin/products", icon: Package },
  { name: "Portfolio", path: "/admin/portfolio", icon: Image },
  { name: "Orders", path: "/admin/orders", icon: ShoppingCart },
  { name: "Journal", path: "/admin/journal", icon: BookOpen },
  { name: "Settings", path: "/admin/settings", icon: Settings },
];

const AdminLayout = () => {
  const { isAuthenticated, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, loading, navigate]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Close on Escape key for accessibility
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar (visible md+) */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="hidden md:flex md:w-64 bg-card border-r border-border fixed h-full flex-col"
        aria-hidden={mobileOpen ? true : false}
        id="admin-sidebar"
      >
        <div className="p-6 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display text-xl font-semibold">Dagisho</span>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
              Admin
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1" role="navigation" aria-label="Admin">
          {sidebarLinks.map((link) => {
            const isActive = link.exact
              ? location.pathname === link.path
              : location.pathname.startsWith(link.path);

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <link.icon className="w-5 h-5" />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <Link to="/">
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Home className="w-5 h-5" />
              View Website
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleSignOut}
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </Button>
        </div>
      </motion.aside>

      {/* Mobile top bar (visible < md) */}
      <header className="fixed top-0 left-0 right-0 z-40 md:hidden bg-card border-b border-border flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <button
            aria-label="Open menu"
            aria-controls="mobile-sidebar"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-md hover:bg-muted"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/" className="flex items-center gap-2">
            <span className="font-display text-lg font-semibold">Dagisho</span>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
              Admin
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/" className="hidden sm:inline-block">
            <Button variant="ghost" size="sm" className="gap-2">
              <Home className="w-4 h-4" />
              Site
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-4 h-4" />
            <span className="sr-only sm:not-sr-only">Sign Out</span>
          </Button>
        </div>
      </header>

      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer panel */}
            <motion.aside
              id="mobile-sidebar"
              role="dialog"
              aria-modal="true"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-72 max-w-full h-full bg-card border-r border-border flex flex-col p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
                  <span className="font-display text-lg font-semibold">Dagisho</span>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    Admin
                  </span>
                </Link>
                <button
                  aria-label="Close menu"
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-md hover:bg-muted"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto space-y-1" role="navigation" aria-label="Admin">
                {sidebarLinks.map((link) => {
                  const isActive = link.exact
                    ? location.pathname === link.path
                    : location.pathname.startsWith(link.path);

                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-soft"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <link.icon className="w-5 h-5" />
                      {link.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-border space-y-2">
                <Link to="/" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-3">
                    <Home className="w-5 h-5" />
                    View Website
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => {
                    setMobileOpen(false);
                    handleSignOut();
                  }}
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </Button>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-0">
        <div className="p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;