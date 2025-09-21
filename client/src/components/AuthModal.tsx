import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: "signin" | "signup";
}

export const AuthModal = ({ isOpen, onClose, defaultMode = "signin" }: AuthModalProps) => {
  const [mode, setMode] = useState<"signin" | "signup" | "reset">(defaultMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "signin") {
        await signIn(email, password);
        toast({ title: "Welcome back!", description: "You've been signed in successfully." });
      } else if (mode === "signup") {
        if (password !== confirmPassword) {
          throw new Error("Passwords don't match");
        }
        await signUp(email, password, name);
        toast({ title: "Account created!", description: "Welcome to Spendly!" });
      } else if (mode === "reset") {
        await resetPassword(email);
        toast({ title: "Reset email sent!", description: "Check your inbox for password reset instructions." });
        setMode("signin");
      }
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      console.log("Starting Google sign-in...");
      await signInWithGoogle();
      console.log("Google sign-in completed successfully");
    } catch (error: any) {
      console.error("Google sign-in failed:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to sign in with Google.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-deep-space/95 backdrop-blur-md border-white/10">
        <DialogHeader className="relative">
          <DialogTitle className="text-2xl font-bold text-center">
            {mode === "signin" && "Welcome Back"}
            {mode === "signup" && "Create Account"}
            {mode === "reset" && "Reset Password"}
          </DialogTitle>
          <p className="text-gray-400 text-center mt-2">
            {mode === "signin" && "Sign in to your account"}
            {mode === "signup" && "Start your financial journey"}
            {mode === "reset" && "Enter your email to reset your password"}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="bg-white/10 border-gray-600 focus:border-coral"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/10 border-gray-600 focus:border-coral"
                />
              </div>

              {mode !== "reset" && (
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-white/10 border-gray-600 focus:border-coral"
                  />
                </div>
              )}

              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="bg-white/10 border-gray-600 focus:border-coral"
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-coral to-teal hover:from-coral/80 hover:to-teal/80"
            disabled={loading}
          >
            {loading ? "Loading..." : (
              mode === "signin" ? "Sign In" : 
              mode === "signup" ? "Create Account" : 
              "Send Reset Email"
            )}
          </Button>
        </form>

        {mode !== "reset" && (
          <>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-deep-space text-gray-400">Or continue with</span>
              </div>
            </div>

            <Button
              onClick={handleGoogleSignIn}
              variant="outline"
              className="w-full bg-white/10 border-gray-600 hover:bg-white/20"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>
          </>
        )}

        <div className="text-center text-sm">
          {mode === "signin" && (
            <div className="space-y-2">
              <p className="text-gray-400">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="text-coral hover:text-coral/80 font-medium"
                >
                  Sign Up
                </button>
              </p>
              <button
                type="button"
                onClick={() => setMode("reset")}
                className="text-gray-400 hover:text-gray-300"
              >
                Forgot your password?
              </button>
            </div>
          )}
          {mode === "signup" && (
            <p className="text-gray-400">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("signin")}
                className="text-coral hover:text-coral/80 font-medium"
              >
                Sign In
              </button>
            </p>
          )}
          {mode === "reset" && (
            <p className="text-gray-400">
              Remember your password?{" "}
              <button
                type="button"
                onClick={() => setMode("signin")}
                className="text-coral hover:text-coral/80 font-medium"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
