import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PortfolioGrid } from "@/components/PortfolioGrid";

const Portfolio = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 md:pt-32 pb-20">
        <div className="artistic-container">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12 md:mb-16"
          >
            <span className="text-primary font-medium text-sm uppercase tracking-widest">
              Gallery
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold mt-3">
              My Portfolio
            </h1>
            <p className="text-muted-foreground text-lg mt-4 max-w-2xl mx-auto">
              A collection of my artistic journey, from sketches to finished pieces.
            </p>
          </motion.div>

          {/* Portfolio Grid */}
          <PortfolioGrid />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Portfolio;
