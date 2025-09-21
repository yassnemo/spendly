import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const viewportHeight = window.innerHeight;
      
      // Show button after scrolling past one viewport height
      setIsVisible(scrolled > viewportHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="w-12 h-12 bg-gradient-to-r from-coral to-teal rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm border border-white/10"
            animate={{ 
              boxShadow: [
                "0 4px 20px rgba(255, 107, 107, 0.3)",
                "0 4px 30px rgba(94, 234, 212, 0.4)",
                "0 4px 20px rgba(255, 107, 107, 0.3)"
              ]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <ArrowUp className="w-5 h-5 text-white" />
          </motion.div>
          
          {/* Tooltip */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            whileHover={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-deep-space/90 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-lg border border-white/10 whitespace-nowrap"
          >
            Back to top
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};