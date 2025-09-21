import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export const ScrollIndicator = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      
      // Hide the indicator the moment user starts scrolling
      setIsVisible(scrolled === 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToNext = () => {
    const nextSection = document.getElementById('how-it-works');
    if (nextSection) {
      nextSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ 
            duration: 0.2, 
            delay: 0.05,
            exit: { duration: 0.2 } // Fast exit animation
          }}
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40"
        >
          <motion.button
            onClick={scrollToNext}
            className="flex flex-col items-center cursor-pointer"
          >
            {/* Animated line */}
            <motion.div
              className="w-px bg-gradient-to-b from-transparent via-teal to-transparent mb-2"
              initial={{ height: 0 }}
              animate={{ height: 32 }}
              transition={{ duration: 1, delay: 2.2 }}
            />
            
            {/* Static chevron with subtle bounce */}
            <motion.div
              className="w-10 h-10 border-2 border-teal rounded-full flex items-center justify-center bg-deep-space/80 backdrop-blur-sm"
              animate={{ 
                y: [0, 8, 0],
                boxShadow: [
                  "0 0 20px rgba(94, 234, 212, 0.3)",
                  "0 0 30px rgba(94, 234, 212, 0.5)",
                  "0 0 20px rgba(94, 234, 212, 0.3)"
                ]
              }}
              transition={{ 
                y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
                boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <ChevronDown className="w-5 h-5 text-teal" />
            </motion.div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};