'use client';

import React, { useState } from 'react';
import {
  User,
  Shield,
  Globe,
  Key,
  Calendar,
  Zap,
  HelpCircle,
  Eye,
  Mail,
  CheckCircle,
  UserX,
} from 'lucide-react';
import { useStore } from '@/store';
import { useAuth } from '@/components/auth/auth-provider';
import { Button, Avatar, Switch, Select, Divider } from '@/components/ui';
import { ConfirmDialog } from '@/components/ui/modal';
import { CURRENCIES } from '@/lib/constants';
import { SettingsSection, SettingsItem } from './settings-section';
import { ThemeSelector, AccentColorSelector } from './theme-selectors';
import { DataSyncSection } from './data-sync-section';
import { 
  CurrencySelector, 
  EditProfileModal, 
  APIKeysModal,
} from './settings-modals';

// Main Settings Page
export const SettingsPage: React.FC = () => {
  const profile = useStore((state) => state.profile);
  const setProfile = useStore((state) => state.setProfile);
  const { user, sendVerificationEmail, deleteAccount } = useAuth();

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showCurrencySelector, setShowCurrencySelector] = useState(false);
  const [showDeleteAccountConfirm, setShowDeleteAccountConfirm] = useState(false);
  const [showAPIKeys, setShowAPIKeys] = useState(false);

  // Preference states
  const [compactMode, setCompactMode] = useState(false);
  const [showAnimations, setShowAnimations] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      if (typeof window !== 'undefined') {
        indexedDB.deleteDatabase('smart_budget_db');
        localStorage.clear();
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Failed to delete account:', error);
    }
  };

  const handleSendVerification = async () => {
    try {
      await sendVerificationEmail();
      setVerificationSent(true);
      setTimeout(() => setVerificationSent(false), 5000);
    } catch (error) {
      console.error('Failed to send verification email:', error);
    }
  };

  const currentCurrency = CURRENCIES.find((c) => c.code === profile?.currency) || CURRENCIES[0];

  return (
    <div className="p-4 lg:p-8 max-w-2xl mx-auto pb-24 lg:pb-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Settings</h1>
        <p className="text-surface-500 mt-1">Manage your account and preferences</p>
      </div>

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

      {/* Account & Security */}
      <SettingsSection title="Account & Security" description="Manage your account security">
        <SettingsItem
          icon={user?.emailVerified ? <CheckCircle className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
          iconColor={user?.emailVerified 
            ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
            : "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
          }
          title="Email Verification"
          description={user?.emailVerified ? "Your email is verified" : "Verify your email address"}
          badge={user?.emailVerified ? "Verified" : "Not Verified"}
          badgeVariant={user?.emailVerified ? "success" : "warning"}
          action={!user?.emailVerified && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleSendVerification}
              disabled={verificationSent}
            >
              {verificationSent ? "Email Sent!" : "Send Link"}
            </Button>
          )}
        />
        <SettingsItem
          icon={<UserX className="w-5 h-5" />}
          iconColor="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
          title="Delete Account"
          description="Permanently delete your account and data"
          onClick={() => setShowDeleteAccountConfirm(true)}
        />
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

      {/* Data & Sync */}
      <DataSyncSection />

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
          description="Get help using Spendly"
          onClick={() => window.open('https://github.com', '_blank')}
        />
        <div className="p-5 text-center">
          <p className="text-sm text-surface-500">Spendly v1.0.0</p>
          <p className="text-xs text-surface-400 mt-1">Built with care for better financial health</p>
        </div>
      </SettingsSection>

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

      <ConfirmDialog
        isOpen={showDeleteAccountConfirm}
        onClose={() => setShowDeleteAccountConfirm(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account?"
        description="This will permanently delete your account and all associated data. You will be logged out immediately. This action cannot be undone."
        confirmText="Delete Account"
        variant="danger"
      />
    </div>
  );
};
