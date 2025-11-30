'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

// Card Component
interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'elevated' | 'interactive' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', children, ...props }, ref) => {
    const variants = {
      default: 'bg-white dark:bg-surface-900 border border-surface-200/60 dark:border-surface-800/60 shadow-soft',
      elevated: 'bg-white dark:bg-surface-900 border border-surface-200/60 dark:border-surface-800/60 shadow-soft-md hover:shadow-soft-lg',
      interactive: 'bg-white dark:bg-surface-900 border border-surface-200/60 dark:border-surface-800/60 shadow-soft-md hover:shadow-soft-lg cursor-pointer',
      glass: 'bg-white/70 dark:bg-surface-900/70 backdrop-blur-xl border border-white/20 dark:border-surface-700/30 shadow-soft',
    };

    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          'rounded-2xl transition-all duration-300',
          variants[variant],
          paddings[padding],
          className
        )}
        whileHover={variant === 'interactive' ? { y: -2 } : undefined}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
Card.displayName = 'Card';
