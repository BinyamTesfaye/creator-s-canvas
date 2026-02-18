import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Loader2, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === "PASSWORD_RECOVERY") {
          setIsRecovery(true);
        }
      }
    );

    // Check hash for recovery token
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setIsRecovery(true);
    }

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Password updated successfully!");
        navigate("/admin/login");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isRecovery) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md text-center"
        >
          <div className="bg-card rounded-2xl shadow-large border border-border p-8">
            <h1 className="font-display text-2xl font-semibold mb-2">Invalid Link</h1>
            <p className="text-muted-foreground mb-6">
              This password reset link is invalid or has expired.
            </p>
            <a href="/admin/login">
              <Button>Back to Login</Button>
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-card rounded-2xl shadow-large border border-border p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <KeyRound className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-display text-2xl font-semibold">Set New Password</h1>
            <p className="text-muted-foreground mt-2">Enter your new password below</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Password"}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
