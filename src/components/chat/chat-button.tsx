'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

// Floating Chat Button
interface ChatButtonProps {
  onClick: () => void;
}

export const ChatButton: React.FC<ChatButtonProps> = ({ onClick }) => {
  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        'fixed bottom-20 right-4 z-40 lg:bottom-4',
        'w-14 h-14 rounded-full',
        'bg-gradient-to-br from-primary-500 to-secondary-500',
        'text-white shadow-soft-lg',
        'flex items-center justify-center',
        'hover:shadow-glow-primary transition-shadow'
      )}
    >
      <Sparkles className="w-6 h-6" />
    </motion.button>
  );
};
