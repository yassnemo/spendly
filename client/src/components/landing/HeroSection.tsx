import { memo } from "react";
import { motion } from "framer-motion";
import { StarBorder } from "@/components/ui/StarBorder";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { CheckCircle } from "lucide-react";
import { FinanceSVG } from "@/components/FinanceSVG";
import { ScrollIndicator } from "@/components/ui/scroll-indicator";

interface HeroSectionProps {
  onSignUp: () => void;
  onSignIn: () => void;
}

export const HeroSection = memo(({
  onSignUp,
  onSignIn
}: HeroSectionProps) => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-6">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <motion.div 
            className="space-y-5"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-3">
              <h1 className="text-5xl lg:text-6xl font-black leading-tight">
                Take Control of Your{" "}
                <span className="text-teal">
                  Financial Future
                </span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Smart budgeting • Expense tracking • AI-powered insights
              </p>
              <p className="text-lg text-gray-400">
                Upload your bank statements and let our AI categorize your expenses, 
                track your budgets, and help you save more money.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-1">
              <StarBorder 
                color="cyan"
                speed="4s"
                thickness={0.5}
                className="inline-block"
                onClick={onSignUp}
              >
                Get Started Free
              </StarBorder>
              <motion.button
                onClick={onSignIn}
                className="px-8 py-4 rounded-full text-lg font-semibold border border-teal text-white bg-transparent hover:bg-gradient-to-r hover:from-coral hover:to-teal hover:border-transparent transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Sign In
              </motion.button>
            </div>
            
            <div className="flex items-center space-x-6 pt-1">
              <div className="text-sm text-gray-400 flex items-center">
                <CheckCircle className="w-4 h-4 text-mint mr-2" />
                No credit card required
              </div>
              <div className="text-sm text-gray-400 flex items-center">
                <CheckCircle className="w-4 h-4 text-mint mr-2" />
                Bank-grade security
              </div>
              <div className="text-sm text-gray-400 flex items-center">
                <CheckCircle className="w-4 h-4 text-mint mr-2" />
                30-day free trial
              </div>
            </div>
          </motion.div>
          
          <motion.div
            className="flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <FinanceSVG className="w-full max-w-xl h-auto object-contain" />
          </motion.div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <ScrollIndicator />
    </section>
  );
});

HeroSection.displayName = "HeroSection";