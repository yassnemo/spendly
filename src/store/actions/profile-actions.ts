import { UserProfile } from '@/types';
import { profileDB } from '@/lib/db';
import { generateId } from '@/lib/utils';
import { StoreSet, StoreGet } from '../types';

export const createProfileActions = (set: StoreSet, get: StoreGet) => ({
  setProfile: async (profileData: Partial<UserProfile>) => {
    const existing = get().profile;
    const now = new Date().toISOString();

    const profile: UserProfile = {
      id: existing?.id || generateId(),
      name: profileData.name || existing?.name || '',
      email: profileData.email || existing?.email,
      monthlyIncome: profileData.monthlyIncome ?? existing?.monthlyIncome ?? 0,
      currency: profileData.currency || existing?.currency || 'USD',
      onboardingCompleted:
        profileData.onboardingCompleted ?? existing?.onboardingCompleted ?? false,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    };

    await profileDB.set(profile);
    set({ profile });
  },

  completeOnboarding: async () => {
    const profile = get().profile;
    if (profile) {
      await get().setProfile({ ...profile, onboardingCompleted: true });
    }
    set({ isOnboarded: true });
  },
});
