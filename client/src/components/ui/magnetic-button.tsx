import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  type?: "button" | "submit";
}

export const MagneticButton = ({ 
  children, 
  className = "", 
  onClick,
  variant = "primary",
  disabled = false,
  type = "button"
}: MagneticButtonProps) => {
  const baseClasses = "relative overflow-hidden font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-coral to-teal text-white shadow-lg hover:shadow-coral/40",
    secondary: "bg-white/10 border border-white/20 text-white hover:bg-white/20"
  };

  return (
    <motion.button
      type={type}
      className={cn(baseClasses, variantClasses[variant], className)}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-500" />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};
