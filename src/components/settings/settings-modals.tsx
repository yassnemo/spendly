'use client';

import React, { useState } from 'react';
import { Check, Eye, ExternalLink, FileJson, Database, Shield } from 'lucide-react';
import { useStore } from '@/store';
import { Button, Input, Divider } from '@/components/ui';
import { Modal } from '@/components/ui/modal';
import { CURRENCIES } from '@/lib/constants';
import { exportToCSV, cn } from '@/lib/utils';

// Currency Selector Modal
interface CurrencySelectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentCurrency: string;
  onSelect: (currency: string) => void;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  isOpen,
  onClose,
  currentCurrency,
  onSelect,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Currency" size="sm">
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {CURRENCIES.map((currency) => (
          <button
            key={currency.code}
            onClick={() => {
              onSelect(currency.code);
              onClose();
            }}
            className={cn(
              'w-full flex items-center justify-between p-4 rounded-xl transition-colors',
              currentCurrency === currency.code
                ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                : 'hover:bg-surface-50 dark:hover:bg-surface-800'
            )}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl font-medium w-8">{currency.symbol}</span>
              <div className="text-left">
                <p className="font-medium text-surface-900 dark:text-white">{currency.code}</p>
                <p className="text-sm text-surface-500">{currency.name}</p>
              </div>
            </div>
            {currentCurrency === currency.code && (
              <Check className="w-5 h-5 text-primary-500" />
            )}
          </button>
        ))}
      </div>
    </Modal>
  );
};

// Edit Profile Modal
interface EditProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileProps> = ({ isOpen, onClose }) => {
  const profile = useStore((state) => state.profile);
  const setProfile = useStore((state) => state.setProfile);

  const [name, setName] = useState(profile?.name || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [monthlyIncome, setMonthlyIncome] = useState(profile?.monthlyIncome?.toString() || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await setProfile({
        name,
        email,
        monthlyIncome: parseFloat(monthlyIncome) || 0,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile" size="md">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
        />
        <Input
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          hint="Used for account recovery"
        />
        <Input
          type="number"
          label="Monthly Income"
          value={monthlyIncome}
          onChange={(e) => setMonthlyIncome(e.target.value)}
          placeholder="0.00"
          leftElement={<span className="text-base">$</span>}
        />
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="flex-1" isLoading={isSubmitting}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// API Keys Modal
interface APIKeysModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const APIKeysModal: React.FC<APIKeysModalProps> = ({ isOpen, onClose }) => {
  const [geminiKey, setGeminiKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  const handleSave = () => {
    if (geminiKey) {
      localStorage.setItem('gemini_api_key', geminiKey);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="API Configuration" size="md">
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Google AI (Gemini) API Key
          </label>
          <div className="relative">
            <Input
              type={showKey ? 'text' : 'password'}
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="Enter your Gemini API key"
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="text-surface-400 hover:text-surface-600"
                >
                  <Eye className="w-4 h-4" />
                </button>
              }
            />
          </div>
          <p className="text-sm text-surface-500 mt-2">
            Get your free API key from{' '}
            <a
              href="https://makersuite.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-500 hover:underline inline-flex items-center gap-1"
            >
              Google AI Studio <ExternalLink className="w-3 h-3" />
            </a>
          </p>
        </div>

        <Divider />

        <div className="bg-surface-50 dark:bg-surface-800 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-accent-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-surface-900 dark:text-white">
                Your keys are stored locally
              </p>
              <p className="text-sm text-surface-500 mt-1">
                API keys are saved in your browser and never sent to our servers.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1">
            Save Keys
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Data Export Modal
interface DataExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataExportModal: React.FC<DataExportModalProps> = ({ isOpen, onClose }) => {
  const expenses = useStore((state) => state.expenses);
  const incomes = useStore((state) => state.incomes);
  const budgets = useStore((state) => state.budgets);
  const goals = useStore((state) => state.goals);
  const profile = useStore((state) => state.profile);

  const handleExportCSV = () => {
    const data = expenses.map((e) => ({
      date: e.date,
      type: 'expense',
      description: e.description,
      category: e.category,
      amount: -e.amount,
    }));
    exportToCSV(data, `smartbudget-expenses-${new Date().toISOString().split('T')[0]}`);
  };

  const handleExportJSON = () => {
    const exportData = {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      profile,
      expenses,
      incomes,
      budgets,
      goals,
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smartbudget-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export Data" size="sm">
      <div className="space-y-4">
        <button
          onClick={handleExportCSV}
          className="w-full flex items-center gap-4 p-4 rounded-xl bg-surface-50 dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <FileJson className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-left">
            <p className="font-medium text-surface-900 dark:text-white">Export as CSV</p>
            <p className="text-sm text-surface-500">Spreadsheet-compatible format</p>
          </div>
        </button>

        <button
          onClick={handleExportJSON}
          className="w-full flex items-center gap-4 p-4 rounded-xl bg-surface-50 dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Database className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-left">
            <p className="font-medium text-surface-900 dark:text-white">Full Backup (JSON)</p>
            <p className="text-sm text-surface-500">Complete data with all settings</p>
          </div>
        </button>

        <Divider />

        <p className="text-xs text-surface-400 text-center">
          {expenses.length} expenses, {incomes.length} incomes, {goals.length} goals
        </p>
      </div>
    </Modal>
  );
};
