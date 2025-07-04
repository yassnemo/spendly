import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const GlassCard = ({ 
  children, 
  className = "", 
  hover = true,
  onClick 
}: GlassCardProps) => {
  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl transition-all duration-300",
        hover && "hover:bg-white/8 hover:border-white/20 hover:shadow-2xl hover:-translate-y-1",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      whileHover={hover ? { scale: 1.02 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};
