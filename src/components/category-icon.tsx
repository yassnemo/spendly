'use client';

import React from 'react';
import {
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Zap,
  Gamepad2,
  Heart,
  GraduationCap,
  Plane,
  CreditCard,
  MoreHorizontal,
  Wallet,
  Home,
  Gift,
  Smartphone,
  Laptop,
  Star,
  LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CategoryType } from '@/types';
import { getCategoryById } from '@/lib/constants';

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Zap,
  Gamepad2,
  Heart,
  GraduationCap,
  Plane,
  CreditCard,
  MoreHorizontal,
  Wallet,
  Home,
  Gift,
  Smartphone,
  Laptop,
  Star,
};

interface CategoryIconProps {
  category: CategoryType;
  size?: 'sm' | 'md' | 'lg';
  showBackground?: boolean;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  category,
  size = 'md',
  showBackground = true,
  className,
}) => {
  const categoryInfo = getCategoryById(category);
  const Icon = iconMap[categoryInfo.icon] || MoreHorizontal;

  const sizes = {
    sm: { wrapper: 'w-8 h-8', icon: 'w-4 h-4' },
    md: { wrapper: 'w-10 h-10', icon: 'w-5 h-5' },
    lg: { wrapper: 'w-12 h-12', icon: 'w-6 h-6' },
  };

  if (showBackground) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-xl',
          `bg-gradient-to-br ${categoryInfo.gradient}`,
          sizes[size].wrapper,
          className
        )}
      >
        <Icon className={cn('text-white', sizes[size].icon)} />
      </div>
    );
  }

  return (
    <Icon
      className={cn(sizes[size].icon, className)}
      style={{ color: categoryInfo.color }}
    />
  );
};

// Dynamic icon component
interface DynamicIconProps {
  name: string;
  size?: number;
  className?: string;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({
  name,
  size = 24,
  className,
}) => {
  const Icon = iconMap[name] || Star;
  return <Icon size={size} className={className} />;
};
