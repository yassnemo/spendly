'use client';

import React, { useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import type { AccentColor } from '@/types';

// Theme Selector
export const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: 'light' as const, label: 'Light', icon: Sun },
    { value: 'dark' as const, label: 'Dark', icon: Moon },
    { value: 'system' as const, label: 'System', icon: Monitor },
  ];

  return (
    <div className="flex gap-2 p-1 bg-surface-100 dark:bg-surface-800 rounded-xl">
      {themes.map((t) => (
        <button
          key={t.value}
          onClick={() => setTheme(t.value)}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all',
            theme === t.value
              ? 'bg-white dark:bg-surface-700 shadow-soft-sm text-surface-900 dark:text-white'
              : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
          )}
        >
          <t.icon className="w-4 h-4" />
          {t.label}
        </button>
      ))}
    </div>
  );
};

// Accent Color Selector
export const AccentColorSelector: React.FC = () => {
  const [selected, setSelected] = useState<AccentColor>('coral');

  const colors: { value: AccentColor; label: string; class: string }[] = [
    { value: 'coral', label: 'Coral', class: 'bg-primary-500' },
    { value: 'purple', label: 'Purple', class: 'bg-secondary-500' },
    { value: 'teal', label: 'Teal', class: 'bg-accent-500' },
    { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
    { value: 'green', label: 'Green', class: 'bg-emerald-500' },
    { value: 'amber', label: 'Amber', class: 'bg-amber-500' },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {colors.map((color) => (
        <button
          key={color.value}
          onClick={() => setSelected(color.value)}
          className={cn(
            'w-10 h-10 rounded-full transition-all',
            color.class,
            selected === color.value
              ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-surface-900 ring-surface-900 dark:ring-white scale-110'
              : 'hover:scale-105'
          )}
          title={color.label}
        />
      ))}
    </div>
  );
};
