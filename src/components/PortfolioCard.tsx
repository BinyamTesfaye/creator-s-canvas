import { motion } from "framer-motion";
import { useState } from "react";
import { PortfolioItem } from "@/hooks/usePortfolio";
import { X } from "lucide-react";

interface PortfolioCardProps {
  item: PortfolioItem;
}

export function PortfolioCard({ item }: PortfolioCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.div
        whileHover={{ y: -4 }}
        onClick={() => setIsOpen(true)}
        className="group cursor-pointer"
      >
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted shadow-soft hover:shadow-medium transition-all duration-300">
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <span className="text-xs text-primary-foreground/80 font-medium uppercase tracking-wider">
              {item.category}
            </span>
            <h3 className="font-display text-lg text-primary-foreground font-semibold mt-1">
              {item.title}
            </h3>
          </div>
        </div>
      </motion.div>

      {/* Lightbox */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/90 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative max-w-4xl w-full max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-12 right-0 p-2 text-background hover:text-primary transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-full object-contain rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-foreground/80 to-transparent rounded-b-lg">
              <span className="text-xs text-primary-foreground/80 font-medium uppercase tracking-wider">
                {item.category}
              </span>
              <h3 className="font-display text-2xl text-primary-foreground font-semibold mt-1">
                {item.title}
              </h3>
              {item.description && (
                <p className="text-primary-foreground/80 mt-2">
                  {item.description}
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
