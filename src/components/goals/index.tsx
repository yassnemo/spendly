'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Target,
  Edit2,
  Trash2,
  Check,
  X,
  Calendar,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useStore } from '@/store';
import { Card, Button, Input, Progress, Badge, EmptyState } from '@/components/ui';
import { Modal, ConfirmDialog } from '@/components/ui/modal';
import { DynamicIcon } from '@/components/category-icon';
import { cn, formatCurrency, formatDate, calculatePercentage } from '@/lib/utils';
import { GOAL_ICONS, GOAL_COLORS } from '@/lib/constants';
import { SavingsGoal } from '@/types';

// Goal Form Component
interface GoalFormProps {
  goal?: SavingsGoal;
  onClose: () => void;
}

const GoalForm: React.FC<GoalFormProps> = ({ goal, onClose }) => {
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

const AddFundsModal: React.FC<AddFundsProps> = ({ goal, onClose }) => {
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

// Goal Card Component
interface GoalCardProps {
  goal: SavingsGoal;
  onEdit: () => void;
  onDelete: () => void;
  onAddFunds: () => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onEdit, onDelete, onAddFunds }) => {
  const profile = useStore((state) => state.profile);
  const percentage = calculatePercentage(goal.currentAmount, goal.targetAmount);
  const isCompleted = goal.currentAmount >= goal.targetAmount;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        'p-6 rounded-3xl border transition-all',
        isCompleted
          ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800'
          : 'bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800'
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: `${goal.color}20` }}
          >
            <DynamicIcon name={goal.icon} size={24} className="text-neutral-700 dark:text-neutral-300" />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-white">{goal.name}</h3>
            {goal.deadline && (
              <p className="text-sm text-neutral-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(goal.deadline, 'MMM d, yyyy')}
              </p>
            )}
          </div>
        </div>

        {isCompleted ? (
          <Badge variant="success" className="flex items-center gap-1">
            <Check className="w-3 h-3" />
            Completed!
          </Badge>
        ) : (
          <div className="flex items-center gap-1">
            <button
              onClick={onEdit}
              className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <Edit2 className="w-4 h-4 text-neutral-400" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </button>
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-semibold text-neutral-900 dark:text-white">
            {formatCurrency(goal.currentAmount, profile?.currency)}
          </span>
          <span className="text-neutral-500">
            {formatCurrency(goal.targetAmount, profile?.currency)}
          </span>
        </div>
        <div className="h-3 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: goal.color }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, percentage)}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-center text-sm text-neutral-500 mt-2">{percentage}% complete</p>
      </div>

      {!isCompleted && (
        <Button
          variant="ghost"
          className="w-full"
          onClick={onAddFunds}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Funds
        </Button>
      )}
    </motion.div>
  );
};

// Main Goals Page
export const GoalsPage: React.FC = () => {
  const goals = useStore((state) => state.goals);
  const deleteGoal = useStore((state) => state.deleteGoal);
  const profile = useStore((state) => state.profile);

  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | undefined>();
  const [addFundsGoal, setAddFundsGoal] = useState<SavingsGoal | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const completedGoals = goals.filter((g) => g.currentAmount >= g.targetAmount).length;

  const handleEdit = (goal: SavingsGoal) => {
    setEditingGoal(goal);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteGoal(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Savings Goals
          </h1>
          <p className="text-neutral-500">Track your progress towards financial goals</p>
        </div>
        <Button leftIcon={<Plus className="w-5 h-5" />} onClick={() => setShowForm(true)}>
          New Goal
        </Button>
      </div>

      {/* Summary Cards */}
      {goals.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card className="text-center">
            <p className="text-sm text-neutral-500 mb-1">Total Saved</p>
            <p className="text-2xl font-bold gradient-text">
              {formatCurrency(totalSaved, profile?.currency)}
            </p>
          </Card>
          <Card className="text-center">
            <p className="text-sm text-neutral-500 mb-1">Total Target</p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">
              {formatCurrency(totalTarget, profile?.currency)}
            </p>
          </Card>
          <Card className="text-center">
            <p className="text-sm text-neutral-500 mb-1">Goals Completed</p>
            <p className="text-2xl font-bold text-green-500">
              {completedGoals} / {goals.length}
            </p>
          </Card>
        </div>
      )}

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <Card className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
            No Goals Yet
          </h2>
          <p className="text-neutral-500 mb-6 max-w-sm mx-auto">
            Set your first savings goal and start building towards your financial dreams.
          </p>
          <Button onClick={() => setShowForm(true)} leftIcon={<Plus className="w-5 h-5" />}>
            Create Your First Goal
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={() => handleEdit(goal)}
                onDelete={() => setDeleteId(goal.id)}
                onAddFunds={() => setAddFundsGoal(goal)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingGoal(undefined);
        }}
        title={editingGoal ? 'Edit Goal' : 'Create New Goal'}
        size="md"
      >
        <GoalForm
          goal={editingGoal}
          onClose={() => {
            setShowForm(false);
            setEditingGoal(undefined);
          }}
        />
      </Modal>

      {/* Add Funds Modal */}
      <Modal
        isOpen={!!addFundsGoal}
        onClose={() => setAddFundsGoal(undefined)}
        title={`Add to ${addFundsGoal?.name}`}
        size="sm"
      >
        {addFundsGoal && (
          <AddFundsModal goal={addFundsGoal} onClose={() => setAddFundsGoal(undefined)} />
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Goal?"
        description="This will permanently delete this savings goal."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};
