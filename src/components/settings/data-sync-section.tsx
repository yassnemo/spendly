'use client';

import React, { useState } from 'react';
import {
  Download,
  Upload,
  Trash2,
  Cloud,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { useStore } from '@/store';
import { useAuth } from '@/components/auth/auth-provider';
import { Button, Divider } from '@/components/ui';
import { ConfirmDialog } from '@/components/ui/modal';
import { SettingsSection, SettingsItem } from './settings-section';
import { DataExportModal } from './settings-modals';

export const DataSyncSection: React.FC = () => {
  const sync = useStore((state) => state.sync);
  const syncToCloud = useStore((state) => state.syncToCloud);
  const syncFromCloud = useStore((state) => state.syncFromCloud);
  const clearSyncError = useStore((state) => state.clearSyncError);
  const { user } = useAuth();

  const [showClearDataConfirm, setShowClearDataConfirm] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [syncMessage, setSyncMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleClearData = () => {
    if (typeof window !== 'undefined') {
      indexedDB.deleteDatabase('smart_budget_db');
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleSyncToCloud = async () => {
    clearSyncError();
    setSyncMessage(null);
    const result = await syncToCloud();
    if (result.success) {
      setSyncMessage({ type: 'success', text: 'Data uploaded to cloud successfully!' });
    } else {
      setSyncMessage({ type: 'error', text: result.error || 'Failed to sync to cloud' });
    }
    setTimeout(() => setSyncMessage(null), 5000);
  };

  const handleSyncFromCloud = async () => {
    clearSyncError();
    setSyncMessage(null);
    const result = await syncFromCloud();
    if (result.success) {
      setSyncMessage({ type: 'success', text: 'Data downloaded from cloud successfully!' });
    } else {
      setSyncMessage({ type: 'error', text: result.error || 'Failed to sync from cloud' });
    }
    setTimeout(() => setSyncMessage(null), 5000);
  };

  const formatLastSyncTime = (isoString: string | null) => {
    if (!isoString) return 'Never synced';
    const date = new Date(isoString);
    return `Last synced: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <>
      <SettingsSection title="Data & Sync" description="Manage your financial data and cloud sync">
        {/* Sync Status Message */}
        {syncMessage && (
          <div className={`mx-5 mt-4 p-3 rounded-lg flex items-center gap-2 ${
            syncMessage.type === 'success' 
              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
          }`}>
            {syncMessage.type === 'success' ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span className="text-sm">{syncMessage.text}</span>
          </div>
        )}
        
        {/* Sync Error from Store */}
        {sync.syncError && !syncMessage && (
          <div className="mx-5 mt-4 p-3 rounded-lg flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{sync.syncError}</span>
          </div>
        )}

        {/* Cloud Sync Section */}
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent-100 dark:bg-accent-900/30">
                <Cloud className="w-5 h-5 text-accent-600 dark:text-accent-400" />
              </div>
              <div>
                <p className="font-medium text-surface-900 dark:text-white">Cloud Sync</p>
                <p className="text-sm text-surface-500">
                  {formatLastSyncTime(sync.lastSyncTime)}
                </p>
              </div>
            </div>
            {sync.isSyncing && (
              <div className="flex items-center gap-2 text-accent-600 dark:text-accent-400">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="text-sm">Syncing...</span>
              </div>
            )}
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSyncToCloud}
              disabled={sync.isSyncing || !user}
              leftIcon={<Upload className="w-4 h-4" />}
              className="flex-1"
            >
              Upload to Cloud
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSyncFromCloud}
              disabled={sync.isSyncing || !user}
              leftIcon={<Download className="w-4 h-4" />}
              className="flex-1"
            >
              Download from Cloud
            </Button>
          </div>
          
          {!user && (
            <p className="text-xs text-surface-500 text-center">
              Sign in to enable cloud sync
            </p>
          )}
        </div>
        
        <Divider className="my-0" />
        
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
    </>
  );
};
