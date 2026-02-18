import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function SubscribeSection() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("subscribers")
        .insert({ email: email.trim(), name: name.trim() || null });

      if (error) {
        if (error.code === "23505") {
          toast.info("You're already subscribed!");
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      } else {
        setIsSubscribed(true);
        toast.success("Subscribed successfully!");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="artistic-container text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <CheckCircle className="w-12 h-12 text-primary" />
            <h3 className="font-display text-2xl font-semibold">You're subscribed!</h3>
            <p className="text-muted-foreground">
              We'll notify you when new products and journal posts are published.
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="artistic-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto text-center"
        >
          <Mail className="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 className="font-display text-2xl md:text-3xl font-semibold mb-2">
            Stay Updated
          </h2>
          <p className="text-muted-foreground mb-8">
            Get notified when new products arrive or new journal entries are published.
          </p>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
            <Input
              type="text"
              placeholder="Your name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1"
            />
            <Input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading} className="sm:w-auto">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Subscribe"}
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
