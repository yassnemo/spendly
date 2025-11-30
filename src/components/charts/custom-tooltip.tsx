'use client';

import React from 'react';
import { formatCurrency } from '@/lib/utils';

// Custom tooltip component
export const CustomTooltip: React.FC<{
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
  currency?: string;
}> = ({ active, payload, label, currency = 'USD' }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white dark:bg-neutral-800 p-3 rounded-xl shadow-lg border border-neutral-100 dark:border-neutral-700">
      <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
        {label}
      </p>
      {payload.map((item, index) => (
        <p key={index} className="text-sm font-semibold" style={{ color: item.color }}>
          {formatCurrency(item.value, currency)}
        </p>
      ))}
    </div>
  );
};
