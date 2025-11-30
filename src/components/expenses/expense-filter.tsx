'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui';
import { CATEGORIES } from '@/lib/constants';
import { CategoryType } from '@/types';
import { cn } from '@/lib/utils';

// Filter Component
export interface FilterState {
  category: CategoryType | 'all';
  dateRange: 'week' | 'month' | 'year' | 'all';
  sortBy: 'date' | 'amount';
  sortOrder: 'asc' | 'desc';
}

interface FilterDropdownProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClose: () => void;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({ filters, onFilterChange, onClose }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApply = () => {
    onFilterChange(localFilters);
    onClose();
  };

  return (
    <div className="space-y-6">
      {/* Category filter */}
      <div>
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-3">
          Category
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setLocalFilters({ ...localFilters, category: 'all' })}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
              localFilters.category === 'all'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                : 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400'
            )}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setLocalFilters({ ...localFilters, category: cat.id })}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                localFilters.category === cat.id
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                  : 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400'
              )}
            >
              {cat.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Date range */}
      <div>
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-3">
          Date Range
        </label>
        <div className="flex gap-2">
          {(['week', 'month', 'year', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setLocalFilters({ ...localFilters, dateRange: range })}
              className={cn(
                'flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                localFilters.dateRange === range
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                  : 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400'
              )}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-3">
          Sort By
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setLocalFilters({ ...localFilters, sortBy: 'date' })}
            className={cn(
              'flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              localFilters.sortBy === 'date'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                : 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400'
            )}
          >
            Date
          </button>
          <button
            onClick={() => setLocalFilters({ ...localFilters, sortBy: 'amount' })}
            className={cn(
              'flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              localFilters.sortBy === 'amount'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                : 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400'
            )}
          >
            Amount
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          variant="ghost"
          className="flex-1"
          onClick={() => {
            setLocalFilters({
              category: 'all',
              dateRange: 'month',
              sortBy: 'date',
              sortOrder: 'desc',
            });
          }}
        >
          Reset
        </Button>
        <Button className="flex-1" onClick={handleApply}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
};
