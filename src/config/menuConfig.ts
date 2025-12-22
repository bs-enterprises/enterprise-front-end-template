/**
 * Menu Configuration
 * 
 * This file defines all available menu items and their categories for the AppShell component.
 * Customize this file to match your application's navigation structure.
 */

import {
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  Settings,
  HelpCircle,
  User,
  ShoppingCart,
  BarChart3,
  Package,
  Inbox,
  FolderOpen,
  ListTodo,
  MessageSquare,
  Layers,
} from 'lucide-react';
import type { AppShellMenuItem } from '@/components/AppShell';
import type { MenuPickerCategory } from '@/components/AppShell/MenuPickerDialog';

/**
 * All available menu items in the application
 * Each item should have:
 * - id: unique identifier
 * - to: navigation path/route
 * - icon: Lucide icon component
 * - label: display text
 * - category: for grouping in menu picker
 * - permission: optional function to check if user can see this menu
 */
export const getAllMenuItems = (): AppShellMenuItem[] => [
  // Overview
  {
    id: 'dashboard',
    to: '/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
    category: 'overview',
  },
  {
    id: 'analytics',
    to: '/analytics',
    icon: BarChart3,
    label: 'Analytics',
    category: 'overview',
  },
  {
    id: 'reports',
    to: '/reports',
    icon: FileText,
    label: 'Reports',
    category: 'overview',
  },

  // Content Management
  {
    id: 'items',
    to: '/items',
    icon: Package,
    label: 'Items',
    category: 'content',
  },
  {
    id: 'projects',
    to: '/projects',
    icon: FolderOpen,
    label: 'Projects',
    category: 'content',
  },
  {
    id: 'tasks',
    to: '/tasks',
    icon: ListTodo,
    label: 'Tasks',
    category: 'content',
  },
  {
    id: 'calendar',
    to: '/calendar',
    icon: Calendar,
    label: 'Calendar',
    category: 'content',
  },

  // Collaboration
  {
    id: 'messages',
    to: '/messages',
    icon: MessageSquare,
    label: 'Messages',
    category: 'collaboration',
  },
  {
    id: 'team',
    to: '/team',
    icon: Users,
    label: 'Team',
    category: 'collaboration',
  },

  // Commerce
  {
    id: 'orders',
    to: '/orders',
    icon: ShoppingCart,
    label: 'Orders',
    category: 'commerce',
  },
  {
    id: 'inbox',
    to: '/inbox',
    icon: Inbox,
    label: 'Inbox',
    category: 'commerce',
  },

  // System
  {
    id: 'settings',
    to: '/settings',
    icon: Settings,
    label: 'Settings',
    category: 'system',
  },
  {
    id: 'integrations',
    to: '/integrations',
    icon: Layers,
    label: 'Integrations',
    category: 'system',
  },

  // Support
  {
    id: 'support',
    to: '/support',
    icon: HelpCircle,
    label: 'Support',
    category: 'support',
  },

  // Account
  {
    id: 'profile',
    to: '/account/profile',
    icon: User,
    label: 'My Profile',
    category: 'account',
  },
];

/**
 * Menu categories for organizing items in the menu picker dialog
 */
export const menuCategories: MenuPickerCategory[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: LayoutDashboard,
  },
  {
    id: 'content',
    label: 'Content Management',
    icon: FolderOpen,
  },
  {
    id: 'collaboration',
    label: 'Collaboration',
    icon: Users,
  },
  {
    id: 'commerce',
    label: 'Commerce',
    icon: ShoppingCart,
  },
  {
    id: 'system',
    label: 'System',
    icon: Settings,
  },
  {
    id: 'support',
    label: 'Support',
    icon: HelpCircle,
  },
  {
    id: 'account',
    label: 'My Account',
    icon: User,
  },
];
