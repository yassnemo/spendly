'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Moon,
  Sun,
  Monitor,
  Download,
  Upload,
  Trash2,
  Shield,
  Bell,
  Globe,
  ChevronRight,
  Check,
  Palette,
  Key,
  LogOut,
  Mail,
  Database,
  Smartphone,
  Eye,
  Calendar,
  Zap,
  HelpCircle,
  ExternalLink,
  Copy,
  FileJson,
} from 'lucide-react';
import { useStore } from '@/store';
import { useTheme } from '@/components/theme-provider';
import { Card, Button, Input, Avatar, Badge, Switch, Select, Divider } from '@/components/ui';
import { Modal, ConfirmDialog } from '@/components/ui/modal';
import { CURRENCIES } from '@/lib/constants';
import { exportToCSV, cn } from '@/lib/utils';
import type { AccentColor, UserPreferences } from '@/types';

// Section Component
interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ title, description, children }) => (
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

const SettingsItem: React.FC<SettingsItemProps> = ({
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

// Theme Selector
const ThemeSelector: React.FC = () => {
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
const AccentColorSelector: React.FC = () => {
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

// Currency Selector Modal
interface CurrencySelectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentCurrency: string;
  onSelect: (currency: string) => void;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
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

const EditProfileModal: React.FC<EditProfileProps> = ({ isOpen, onClose }) => {
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

const APIKeysModal: React.FC<APIKeysModalProps> = ({ isOpen, onClose }) => {
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

const DataExportModal: React.FC<DataExportModalProps> = ({ isOpen, onClose }) => {
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

// Main Settings Page
export const SettingsPage: React.FC = () => {
  const profile = useStore((state) => state.profile);
  const setProfile = useStore((state) => state.setProfile);

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showCurrencySelector, setShowCurrencySelector] = useState(false);
  const [showClearDataConfirm, setShowClearDataConfirm] = useState(false);
  const [showAPIKeys, setShowAPIKeys] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Preference states
  const [compactMode, setCompactMode] = useState(false);
  const [showAnimations, setShowAnimations] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);

  const handleClearData = () => {
    if (typeof window !== 'undefined') {
      indexedDB.deleteDatabase('smart_budget_db');
      localStorage.clear();
      window.location.reload();
    }
  };

  const currentCurrency = CURRENCIES.find((c) => c.code === profile?.currency) || CURRENCIES[0];

  return (
    <div className="p-4 lg:p-8 max-w-2xl mx-auto pb-24 lg:pb-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Settings</h1>
        <p className="text-surface-500 mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile Section */}
      <SettingsSection title="Profile">
        <div className="p-5">
          <div className="flex items-center gap-4 mb-5">
            <Avatar
              src={profile?.photoURL}
              name={profile?.name || 'User'}
              size="xl"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
                {profile?.name || 'Guest User'}
              </h3>
              <p className="text-sm text-surface-500">
                {profile?.email || 'No email set'}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowEditProfile(true)}
            leftIcon={<User className="w-4 h-4" />}
          >
            Edit Profile
          </Button>
        </div>
      </SettingsSection>

      {/* Appearance */}
      <SettingsSection title="Appearance" description="Customize how the app looks">
        <div className="p-5">
          <p className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-3">Theme</p>
          <ThemeSelector />
        </div>
        <Divider className="my-0" />
        <div className="p-5">
          <p className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-3">Accent Color</p>
          <AccentColorSelector />
        </div>
        <Divider className="my-0" />
        <div className="p-5 space-y-4">
          <Switch
            checked={compactMode}
            onChange={setCompactMode}
            label="Compact Mode"
            description="Use smaller spacing and fonts"
          />
          <Switch
            checked={showAnimations}
            onChange={setShowAnimations}
            label="Animations"
            description="Enable smooth transitions"
          />
        </div>
      </SettingsSection>

      {/* Preferences */}
      <SettingsSection title="Preferences" description="Configure app behavior">
        <SettingsItem
          icon={<Globe className="w-5 h-5" />}
          title="Currency"
          description={`${currentCurrency.name} (${currentCurrency.symbol})`}
          onClick={() => setShowCurrencySelector(true)}
        />
        <SettingsItem
          icon={<Calendar className="w-5 h-5" />}
          title="Week Starts On"
          action={
            <Select
              value="monday"
              onChange={() => {}}
              options={[
                { value: 'sunday', label: 'Sunday' },
                { value: 'monday', label: 'Monday' },
                { value: 'saturday', label: 'Saturday' },
              ]}
              className="w-32"
            />
          }
        />
        <SettingsItem
          icon={<Eye className="w-5 h-5" />}
          title="Default View"
          action={
            <Select
              value="dashboard"
              onChange={() => {}}
              options={[
                { value: 'dashboard', label: 'Dashboard' },
                { value: 'expenses', label: 'Expenses' },
                { value: 'budget', label: 'Budget' },
              ]}
              className="w-32"
            />
          }
        />
      </SettingsSection>

      {/* Notifications */}
      <SettingsSection title="Notifications" description="Control when we notify you">
        <div className="p-5 space-y-4">
          <Switch
            checked={budgetAlerts}
            onChange={setBudgetAlerts}
            label="Budget Alerts"
            description="Get notified when approaching budget limits"
          />
          <Switch
            checked={weeklyReports}
            onChange={setWeeklyReports}
            label="Weekly Reports"
            description="Receive weekly spending summaries"
          />
        </div>
      </SettingsSection>

      {/* AI & Integrations */}
      <SettingsSection title="AI & Integrations" description="Configure AI features">
        <SettingsItem
          icon={<Key className="w-5 h-5" />}
          iconColor="bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400"
          title="API Keys"
          description="Configure Google AI and other services"
          onClick={() => setShowAPIKeys(true)}
        />
        <SettingsItem
          icon={<Zap className="w-5 h-5" />}
          iconColor="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
          title="AI Features"
          badge="Beta"
          badgeVariant="warning"
          description="Smart categorization and insights"
          action={<Switch checked={true} onChange={() => {}} />}
        />
      </SettingsSection>

      {/* Data */}
      <SettingsSection title="Data" description="Manage your financial data">
        <SettingsItem
          icon={<Download className="w-5 h-5" />}
          iconColor="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
          title="Export Data"
          description="Download your data as CSV or JSON"
          onClick={() => setShowExportModal(true)}
        />
        <SettingsItem
          icon={<Upload className="w-5 h-5" />}
          iconColor="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
          title="Import Data"
          description="Restore from a backup file"
          badge="Coming Soon"
          badgeVariant="info"
        />
        <SettingsItem
          icon={<Trash2 className="w-5 h-5" />}
          iconColor="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
          title="Clear All Data"
          description="Permanently delete everything"
          onClick={() => setShowClearDataConfirm(true)}
        />
      </SettingsSection>

      {/* About */}
      <SettingsSection title="About">
        <SettingsItem
          icon={<Shield className="w-5 h-5" />}
          iconColor="bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400"
          title="Privacy"
          description="Your data stays on your device"
        />
        <SettingsItem
          icon={<HelpCircle className="w-5 h-5" />}
          title="Help & Support"
          description="Get help using SmartBudget"
          onClick={() => window.open('https://github.com', '_blank')}
        />
        <div className="p-5 text-center">
          <p className="text-sm text-surface-500">SmartBudget v1.0.0</p>
          <p className="text-xs text-surface-400 mt-1">Built with care for better financial health</p>
        </div>
      </SettingsSection>

      {/* Modals */}
      <EditProfileModal
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
      />

      <CurrencySelector
        isOpen={showCurrencySelector}
        onClose={() => setShowCurrencySelector(false)}
        currentCurrency={profile?.currency || 'USD'}
        onSelect={(currency) => setProfile({ currency })}
      />

      <APIKeysModal
        isOpen={showAPIKeys}
        onClose={() => setShowAPIKeys(false)}
      />

      <DataExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />

      <ConfirmDialog
        isOpen={showClearDataConfirm}
        onClose={() => setShowClearDataConfirm(false)}
        onConfirm={handleClearData}
        title="Clear All Data?"
        description="This will permanently delete all your expenses, budgets, goals, and settings. This action cannot be undone."
        confirmText="Delete Everything"
        variant="danger"
      />
    </div>
  );
};
