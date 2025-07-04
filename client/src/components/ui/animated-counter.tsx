import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

export const AnimatedCounter = ({ 
  value, 
  prefix = "", 
  suffix = "", 
  duration = 2000,
  className = ""
}: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const start = performance.now();
    
    const animate = (timestamp: number) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(value * easeOutQuart);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <motion.span 
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {prefix}{Math.round(count).toLocaleString()}{suffix}
    </motion.span>
  );
};
