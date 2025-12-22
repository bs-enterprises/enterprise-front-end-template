/**
 * Menu Preferences Storage
 * 
 * Manages user's menu preferences (pinned menus) using localStorage.
 * This allows users to customize their sidebar with their most-used menus.
 */

const STORAGE_KEY = 'app-menu-preferences';

export interface MenuPreferences {
  pinnedMenuIds: string[];
}

/**
 * Default pinned menus (shown on first load)
 */
const DEFAULT_PINNED_MENUS: string[] = [
  'dashboard',
  'items',
  'projects',
  'tasks',
  'settings',
  'support',
];

/**
 * Get menu preferences from localStorage
 */
export function getMenuPreferences(): MenuPreferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        pinnedMenuIds: Array.isArray(parsed.pinnedMenuIds) 
          ? parsed.pinnedMenuIds 
          : DEFAULT_PINNED_MENUS,
      };
    }
  } catch (error) {
    console.error('Error reading menu preferences:', error);
  }
  
  return {
    pinnedMenuIds: DEFAULT_PINNED_MENUS,
  };
}

/**
 * Save menu preferences to localStorage
 */
export function saveMenuPreferences(preferences: MenuPreferences): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error('Error saving menu preferences:', error);
  }
}

/**
 * Add a menu to pinned list
 */
export function addPinnedMenu(menuId: string): void {
  const prefs = getMenuPreferences();
  if (!prefs.pinnedMenuIds.includes(menuId)) {
    prefs.pinnedMenuIds.push(menuId);
    saveMenuPreferences(prefs);
  }
}

/**
 * Remove a menu from pinned list
 */
export function removePinnedMenu(menuId: string): void {
  const prefs = getMenuPreferences();
  prefs.pinnedMenuIds = prefs.pinnedMenuIds.filter((id) => id !== menuId);
  saveMenuPreferences(prefs);
}

/**
 * Reset to default pinned menus
 */
export function resetMenuPreferences(): void {
  saveMenuPreferences({
    pinnedMenuIds: DEFAULT_PINNED_MENUS,
  });
}

/**
 * Clear all menu preferences
 */
export function clearMenuPreferences(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing menu preferences:', error);
  }
}
