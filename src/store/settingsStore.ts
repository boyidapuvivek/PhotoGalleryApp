import { create } from 'zustand';
import { GallerySettings } from '@/types/gallery';
import { storage } from '@/services/storage/mmkvStorage';
import { CONSTANTS } from '@/utils/constants';
import { Appearance } from 'react-native';

interface SettingsStore extends GallerySettings {
  // Actions
  loadSettings: () => Promise<void>;
  updateTheme: (theme: 'light' | 'dark' | 'system') => Promise<void>;
  updateGridColumns: (columns: number) => Promise<void>;
  updateAutoCache: (enabled: boolean) => Promise<void>;
  updateSortOrder: (order: GallerySettings['sortOrder']) => Promise<void>;
  resetSettings: () => Promise<void>;
  
  // Computed
  effectiveTheme: 'light' | 'dark';
}

const defaultSettings: GallerySettings = {
  theme: 'system',
  gridColumns: CONSTANTS.GRID.DEFAULT_COLUMNS,
  autoCache: true,
  sortOrder: 'date_desc',
};

const getEffectiveTheme = (theme: 'light' | 'dark' | 'system'): 'light' | 'dark' => {
  if (theme === 'system') {
    return Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
  }
  return theme;
};

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  ...defaultSettings,
  effectiveTheme: getEffectiveTheme(defaultSettings.theme),

  loadSettings: async () => {
    try {
      const savedSettings = await storage.get<GallerySettings>(CONSTANTS.STORAGE.SETTINGS_KEY);
      const settings = { ...defaultSettings, ...savedSettings };
      
      set({
        ...settings,
        effectiveTheme: getEffectiveTheme(settings.theme),
      });
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  },

  updateTheme: async (theme: 'light' | 'dark' | 'system') => {
    const newSettings = { ...get(), theme, effectiveTheme: getEffectiveTheme(theme) };
    
    try {
      await storage.set(CONSTANTS.STORAGE.SETTINGS_KEY, newSettings);
      set({ theme, effectiveTheme: newSettings.effectiveTheme });
    } catch (error) {
      console.error('Failed to update theme:', error);
    }
  },

  updateGridColumns: async (gridColumns: number) => {
    const clampedColumns = Math.max(
      CONSTANTS.GRID.MIN_COLUMNS,
      Math.min(CONSTANTS.GRID.MAX_COLUMNS, gridColumns)
    );
    
    const newSettings = { ...get(), gridColumns: clampedColumns };
    
    try {
      await storage.set(CONSTANTS.STORAGE.SETTINGS_KEY, newSettings);
      set({ gridColumns: clampedColumns });
    } catch (error) {
      console.error('Failed to update grid columns:', error);
    }
  },

  updateAutoCache: async (autoCache: boolean) => {
    const newSettings = { ...get(), autoCache };
    
    try {
      await storage.set(CONSTANTS.STORAGE.SETTINGS_KEY, newSettings);
      set({ autoCache });
    } catch (error) {
      console.error('Failed to update auto cache:', error);
    }
  },

  updateSortOrder: async (sortOrder: GallerySettings['sortOrder']) => {
    const newSettings = { ...get(), sortOrder };
    
    try {
      await storage.set(CONSTANTS.STORAGE.SETTINGS_KEY, newSettings);
      set({ sortOrder });
    } catch (error) {
      console.error('Failed to update sort order:', error);
    }
  },

  resetSettings: async () => {
    try {
      await storage.set(CONSTANTS.STORAGE.SETTINGS_KEY, defaultSettings);
      set({
        ...defaultSettings,
        effectiveTheme: getEffectiveTheme(defaultSettings.theme),
      });
    } catch (error) {
      console.error('Failed to reset settings:', error);
    }
  },
}));

// Listen to system theme changes
Appearance.addChangeListener(({ colorScheme }) => {
  const state = useSettingsStore.getState();
  if (state.theme === 'system') {
    useSettingsStore.setState({
      effectiveTheme: colorScheme === 'dark' ? 'dark' : 'light',
    });
  }
});