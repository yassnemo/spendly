import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const LoadingScreen = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds loading

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 bg-deep-space z-50 flex items-center justify-center"
        >
          <div className="flex flex-col items-center space-y-8">
            {/* Logo/Brand area */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <h1 className="text-4xl font-black text-white mb-2">
                Spend<span className="text-teal">ly</span>
              </h1>
              <p className="text-gray-400 text-sm">Smart Money Management</p>
            </motion.div>

            {/* Creative loading animation */}
            <div className="relative">
              {/* Outer ring */}
              <motion.div
                className="w-16 h-16 border-2 border-gray-700 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Progress arc */}
              <motion.div
                className="absolute inset-0 w-16 h-16 border-2 border-transparent border-t-teal rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Inner pulse */}
              <motion.div
                className="absolute inset-3 w-10 h-10 bg-teal/20 rounded-full"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3] 
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
              
              {/* Center dot */}
              <div className="absolute inset-6 w-4 h-4 bg-teal rounded-full shadow-lg" />
            </div>

            {/* Subtle progress dots */}
            <div className="flex space-x-2">
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  className="w-2 h-2 bg-gray-600 rounded-full"
                  animate={{ 
                    backgroundColor: ["#4B5563", "#14B8A6", "#4B5563"],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: index * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};