import {
  LayoutDashboard,
  Receipt,
  Wallet,
  Target,
  Sparkles,
  Settings,
} from 'lucide-react';

// Navigation items
export const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/expenses', label: 'Expenses', icon: Receipt },
  { href: '/budget', label: 'Budget', icon: Wallet },
  { href: '/goals', label: 'Goals', icon: Target },
  { href: '/insights', label: 'Insights', icon: Sparkles },
  { href: '/settings', label: 'Settings', icon: Settings },
];
