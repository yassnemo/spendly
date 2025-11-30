'use client';

import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Plus, Target } from 'lucide-react';
import { useStore } from '@/store';
import { Card, Button } from '@/components/ui';
import { Modal, ConfirmDialog } from '@/components/ui/modal';
import { formatCurrency } from '@/lib/utils';
import { SavingsGoal } from '@/types';
import { GoalCard } from './goal-card';
import { GoalForm, AddFundsModal } from './goal-form';

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
