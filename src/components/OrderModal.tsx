import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Product } from "@/hooks/useProducts";
import { useCreateOrder } from "@/hooks/useOrders";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

interface OrderModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const orderSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name too long"),
  contact: z.string().trim().min(1, "Contact is required").max(255, "Contact too long"),
  message: z.string().max(1000, "Message too long").optional(),
});

export function OrderModal({ product, isOpen, onClose }: OrderModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSending, setIsSending] = useState(false);
  const createOrder = useCreateOrder();

  const totalPrice = product.price * quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate inputs
    const result = orderSchema.safeParse({ name, contact, message });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSending(true);

    try {
      // Create order in database
      const order = await createOrder.mutateAsync({
        customer_name: result.data.name,
        customer_contact: result.data.contact,
        message: result.data.message || null,
        product_id: product.id,
        product_name: product.name,
        quantity,
        total_price: totalPrice,
      });

      // Send to Telegram
      try {
        await supabase.functions.invoke("send-telegram-order", {
          body: { orderId: order.id },
        });
      } catch (telegramError) {
        console.error("Telegram notification failed:", telegramError);
        // Don't fail the order if Telegram fails
      }

      toast.success("Order placed successfully! We'll be in touch soon.");
      onClose();
      resetForm();
    } catch (error) {
      console.error("Order creation failed:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const resetForm = () => {
    setQuantity(1);
    setName("");
    setContact("");
    setMessage("");
    setErrors({});
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-background rounded-2xl shadow-large max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-display text-xl font-semibold">Place Order</h2>
              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Product Info */}
            <div className="p-6 border-b border-border bg-secondary/30">
              <div className="flex gap-4">
                {product.image_url && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-semibold truncate">
                    {product.name}
                  </h3>
                  <p className="text-primary font-semibold mt-1">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-muted-foreground">Quantity:</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 rounded-lg bg-background border border-border hover:bg-muted transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-semibold w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    className="p-2 rounded-lg bg-background border border-border hover:bg-muted transition-colors"
                    disabled={quantity >= product.stock_quantity}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
                <span className="font-medium">Total:</span>
                <span className="text-xl font-semibold text-primary">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Order Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">Contact (Phone/Email/Telegram) *</Label>
                <Input
                  id="contact"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="How can we reach you?"
                  className={errors.contact ? "border-destructive" : ""}
                />
                {errors.contact && (
                  <p className="text-sm text-destructive">{errors.contact}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Any special requests or notes?"
                  rows={3}
                  className={errors.message ? "border-destructive" : ""}
                />
                {errors.message && (
                  <p className="text-sm text-destructive">{errors.message}</p>
                )}
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full gap-2"
                disabled={isSending}
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Order
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                No payment required now. We'll contact you to confirm your order.
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
