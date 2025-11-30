'use client';

import React, { useState } from 'react';
import { useStore } from '@/store';
import { Button, Input } from '@/components/ui';
import { DynamicIcon } from '@/components/category-icon';
import { cn, formatCurrency } from '@/lib/utils';
import { GOAL_ICONS, GOAL_COLORS } from '@/lib/constants';
import { SavingsGoal } from '@/types';

// Goal Form Component
interface GoalFormProps {
  goal?: SavingsGoal;
  onClose: () => void;
}

export const GoalForm: React.FC<GoalFormProps> = ({ goal, onClose }) => {
  const addGoal = useStore((state) => state.addGoal);
  const updateGoal = useStore((state) => state.updateGoal);

  const [name, setName] = useState(goal?.name || '');
  const [targetAmount, setTargetAmount] = useState(goal?.targetAmount?.toString() || '');
  const [currentAmount, setCurrentAmount] = useState(goal?.currentAmount?.toString() || '0');
  const [deadline, setDeadline] = useState(goal?.deadline?.split('T')[0] || '');
  const [selectedIcon, setSelectedIcon] = useState(goal?.icon || 'Wallet');
  const [selectedColor, setSelectedColor] = useState(goal?.color || GOAL_COLORS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetAmount) return;

    setIsSubmitting(true);
    try {
      const goalData = {
        name,
        targetAmount: parseFloat(targetAmount),
        currentAmount: parseFloat(currentAmount) || 0,
        deadline: deadline ? new Date(deadline).toISOString() : undefined,
        icon: selectedIcon,
        color: selectedColor,
      };

      if (goal) {
        await updateGoal(goal.id, goalData);
      } else {
        await addGoal(goalData);
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Goal Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g., Emergency Fund, New Car, Vacation"
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          type="number"
          label="Target Amount"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          placeholder="0.00"
          leftElement={<span className="text-lg">$</span>}
          required
        />
        <Input
          type="number"
          label="Current Saved"
          value={currentAmount}
          onChange={(e) => setCurrentAmount(e.target.value)}
          placeholder="0.00"
          leftElement={<span className="text-lg">$</span>}
        />
      </div>

      <Input
        type="date"
        label="Target Date (optional)"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />

      {/* Icon Selection */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          Icon
        </label>
        <div className="flex flex-wrap gap-2">
          {GOAL_ICONS.map((icon) => (
            <button
              key={icon}
              type="button"
              onClick={() => setSelectedIcon(icon)}
              className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center transition-all',
                selectedIcon === icon
                  ? 'bg-primary-100 dark:bg-primary-900/30 ring-2 ring-primary-500'
                  : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              )}
            >
              <DynamicIcon name={icon} size={20} />
            </button>
          ))}
        </div>
      </div>

      {/* Color Selection */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          Color
        </label>
        <div className="flex flex-wrap gap-2">
          {GOAL_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setSelectedColor(color)}
              className={cn(
                'w-10 h-10 rounded-full transition-all',
                selectedColor === color && 'ring-2 ring-offset-2 ring-primary-500'
              )}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" className="flex-1" isLoading={isSubmitting}>
          {goal ? 'Update' : 'Create'} Goal
        </Button>
      </div>
    </form>
  );
};

// Add Funds Modal
interface AddFundsProps {
  goal: SavingsGoal;
  onClose: () => void;
}

export const AddFundsModal: React.FC<AddFundsProps> = ({ goal, onClose }) => {
  const addToGoal = useStore((state) => state.addToGoal);
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const remaining = goal.targetAmount - goal.currentAmount;
  const quickAmounts = [25, 50, 100, remaining].filter((a) => a > 0 && a <= remaining);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    setIsSubmitting(true);
    try {
      await addToGoal(goal.id, parseFloat(amount));
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center p-4 bg-neutral-50 dark:bg-neutral-800 rounded-2xl">
        <p className="text-sm text-neutral-500 mb-1">Remaining to reach goal</p>
        <p className="text-2xl font-bold text-neutral-900 dark:text-white">
          {formatCurrency(remaining)}
        </p>
      </div>

      <Input
        type="number"
        label="Amount to Add"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="0.00"
        leftElement={<span className="text-lg">$</span>}
        required
      />

      <div className="flex flex-wrap gap-2">
        {quickAmounts.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setAmount(value.toString())}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium transition-colors',
              amount === value.toString()
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30'
                : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800'
            )}
          >
            {value === remaining ? 'Complete Goal' : formatCurrency(value)}
          </button>
        ))}
      </div>

      <Button type="submit" className="w-full" isLoading={isSubmitting}>
        Add Funds
      </Button>
    </form>
  );
};
