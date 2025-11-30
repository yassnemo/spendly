'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const variants = {
      primary: 'bg-primary-500 text-white hover:bg-primary-600 shadow-soft-sm hover:shadow-soft focus-visible:ring-primary-500',
      secondary: 'bg-secondary-500 text-white hover:bg-secondary-600 shadow-soft-sm hover:shadow-soft focus-visible:ring-secondary-500',
      accent: 'bg-accent-500 text-white hover:bg-accent-600 shadow-soft-sm hover:shadow-soft focus-visible:ring-accent-500',
      ghost: 'bg-transparent text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800',
      outline: 'bg-transparent border-2 border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800',
      danger: 'bg-red-500 text-white hover:bg-red-600 shadow-soft-sm hover:shadow-soft focus-visible:ring-red-500',
    };

    const sizes = {
      xs: 'px-2.5 py-1.5 text-xs rounded-lg gap-1',
      sm: 'px-3.5 py-2 text-sm rounded-xl gap-1.5',
      md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
      lg: 'px-6 py-3 text-base rounded-2xl gap-2',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium',
          'transition-all duration-200 ease-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:pointer-events-none',
          'hover:-translate-y-px active:translate-y-0',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);
Button.displayName = 'Button';
