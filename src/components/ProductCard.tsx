import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Product } from "@/hooks/useProducts";
import { OrderModal } from "./OrderModal";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [showOrderModal, setShowOrderModal] = useState(false);

  const categoryLabels: Record<string, string> = {
    sketchbooks: "Sketchbook",
    sketches: "Sketch",
    crafts: "Craft",
    gifts: "Gift",
    other: "Other",
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -4 }}
        className="group bg-card rounded-2xl overflow-hidden border border-border/50 shadow-soft hover:shadow-medium transition-all duration-300"
      >
        {/* Image */}
        <div className="aspect-square overflow-hidden bg-muted">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <ShoppingBag className="w-12 h-12" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 md:p-5 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-xs text-primary font-medium uppercase tracking-wider">
                {categoryLabels[product.category]}
              </span>
              <h3 className="font-display text-lg font-semibold mt-1 line-clamp-1">
                {product.name}
              </h3>
            </div>
            <span className="text-lg font-semibold text-primary whitespace-nowrap">
              ${product.price.toFixed(2)}
            </span>
          </div>

          {product.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
          )}

          <Button
            onClick={() => setShowOrderModal(true)}
            className="w-full gap-2"
            disabled={!product.is_available || product.stock_quantity <= 0}
          >
            <ShoppingBag className="w-4 h-4" />
            {product.stock_quantity <= 0 ? "Out of Stock" : "Order Now"}
          </Button>
        </div>
      </motion.div>

      <OrderModal
        product={product}
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
      />
    </>
  );
}
