'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

// Section Component
interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({ title, description, children }) => (
  <div className="mb-8">
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-surface-900 dark:text-white">{title}</h2>
      {description && (
        <p className="text-sm text-surface-500 mt-1">{description}</p>
      )}
    </div>
    <Card padding="none" className="divide-y divide-surface-100 dark:divide-surface-800">
      {children}
    </Card>
  </div>
);

// Settings Item Component
interface SettingsItemProps {
  icon: React.ReactNode;
  iconColor?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  onClick?: () => void;
  badge?: string;
  badgeVariant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

export const SettingsItem: React.FC<SettingsItemProps> = ({
  icon,
  iconColor = 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400',
  title,
  description,
  action,
  onClick,
  badge,
  badgeVariant = 'default',
}) => (
  <div
    className={cn(
      'flex items-center justify-between p-4',
      onClick && 'cursor-pointer hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors'
    )}
    onClick={onClick}
  >
    <div className="flex items-center gap-4">
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', iconColor)}>
        {icon}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <p className="font-medium text-surface-900 dark:text-white">{title}</p>
          {badge && <Badge variant={badgeVariant} size="sm">{badge}</Badge>}
        </div>
        {description && (
          <p className="text-sm text-surface-500 mt-0.5">{description}</p>
        )}
      </div>
    </div>
    {action || (onClick && <ChevronRight className="w-5 h-5 text-surface-400" />)}
  </div>
);
