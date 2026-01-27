import { motion } from "framer-motion";
import { useState } from "react";
import { usePortfolio } from "@/hooks/usePortfolio";
import { PortfolioCard } from "./PortfolioCard";

export function PortfolioGrid() {
  const { data: items, isLoading } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = items
    ? ["all", ...Array.from(new Set(items.map((item) => item.category)))]
    : ["all"];

  const filteredItems =
    selectedCategory === "all"
      ? items
      : items?.filter((item) => item.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-muted rounded-2xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">
          Portfolio items coming soon...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              selectedCategory === category
                ? "bg-primary text-primary-foreground shadow-medium"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
      >
        {filteredItems?.map((item, index) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: index * 0.05 }}
          >
            <PortfolioCard item={item} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
