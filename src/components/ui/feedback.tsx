'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

// Skeleton Component
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  width,
  height,
}) => {
  const variants = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  };

  return (
    <div
      className={cn(
        'bg-surface-200 dark:bg-surface-800 animate-pulse',
        variants[variant],
        className
      )}
      style={{ width, height }}
    />
  );
};

// Empty State Component
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
    >
      {icon && (
        <div className="mb-4 text-surface-300 dark:text-surface-600">{icon}</div>
      )}
      <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-surface-500 max-w-sm mb-6">{description}</p>
      )}
      {action}
    </motion.div>
  );
};

// Divider Component
interface DividerProps {
  className?: string;
  label?: string;
}

export const Divider: React.FC<DividerProps> = ({ className, label }) => {
  if (label) {
    return (
      <div className={cn('flex items-center gap-4 my-6', className)}>
        <div className="flex-1 h-px bg-surface-200 dark:bg-surface-800" />
        <span className="text-sm text-surface-400 font-medium">{label}</span>
        <div className="flex-1 h-px bg-surface-200 dark:bg-surface-800" />
      </div>
    );
  }

  return (
    <div className={cn('h-px bg-surface-200 dark:bg-surface-800 my-4', className)} />
  );
};

// Switch/Toggle Component
interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className,
}) => {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      {(label || description) && (
        <div className="flex-1">
          {label && (
            <span className="block text-sm font-medium text-surface-900 dark:text-white">
              {label}
            </span>
          )}
          {description && (
            <span className="block text-sm text-surface-500 mt-0.5">
              {description}
            </span>
          )}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
          checked ? 'bg-primary-500' : 'bg-surface-200 dark:bg-surface-700',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <span
          className={cn(
            'inline-block h-5 w-5 transform rounded-full bg-white shadow-soft-sm transition-transform duration-200',
            checked ? 'translate-x-5' : 'translate-x-0.5'
          )}
        />
      </button>
    </div>
  );
};

// Tooltip Component
interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
}) => {
  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative group inline-block">
      {children}
      <div
        className={cn(
          'absolute z-50 px-3 py-1.5 text-xs font-medium text-white',
          'bg-surface-900 dark:bg-surface-700 rounded-lg shadow-soft-lg',
          'opacity-0 invisible group-hover:opacity-100 group-hover:visible',
          'transition-all duration-200 whitespace-nowrap pointer-events-none',
          positions[position]
        )}
      >
        {content}
      </div>
    </div>
  );
};
