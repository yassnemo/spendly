'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

// Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftElement, rightElement, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {leftElement && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none">
              {leftElement}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full px-4 py-3 rounded-xl text-sm',
              'bg-surface-50 dark:bg-surface-900',
              'border border-surface-200 dark:border-surface-700',
              'text-surface-900 dark:text-surface-100',
              'placeholder:text-surface-400 dark:placeholder:text-surface-500',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500',
              leftElement && 'pl-12',
              rightElement && 'pr-12',
              error && 'border-red-500 focus:ring-red-500/30 focus:border-red-500',
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400">
              {rightElement}
            </div>
          )}
        </div>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        {hint && !error && <p className="mt-2 text-sm text-surface-500">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

// TextArea Component
interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'w-full px-4 py-3 rounded-xl text-sm min-h-[120px] resize-none',
            'bg-surface-50 dark:bg-surface-900',
            'border border-surface-200 dark:border-surface-700',
            'text-surface-900 dark:text-surface-100',
            'placeholder:text-surface-400 dark:placeholder:text-surface-500',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500',
            error && 'border-red-500 focus:ring-red-500/30 focus:border-red-500',
            className
          )}
          {...props}
        />
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);
TextArea.displayName = 'TextArea';

// Select Component
interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  label,
  placeholder = 'Select an option',
  className,
}) => {
  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'w-full px-4 py-3 rounded-xl text-sm appearance-none cursor-pointer',
          'bg-surface-50 dark:bg-surface-900',
          'border border-surface-200 dark:border-surface-700',
          'text-surface-900 dark:text-surface-100',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500',
          'bg-[url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2371717a\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")]',
          'bg-no-repeat bg-[right_1rem_center] bg-[length:1rem]'
        )}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
