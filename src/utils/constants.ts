export const CONSTANTS = {
  API: {
    DEFAULT_PAGE_SIZE: 40,
    MAX_PAGE_SIZE: 100,
    DEFAULT_ORDER_BY: 2,
    CACHE_DURATION: 30 * 60 * 1000, // 30 minutes
  },
  GRID: {
    MIN_COLUMNS: 2,
    MAX_COLUMNS: 4,
    DEFAULT_COLUMNS: 2,
    ITEM_SPACING: 4,
  },
  VIEWER: {
    DOUBLE_TAP_DELAY: 300,
    ZOOM_DURATION: 250,
    MIN_ZOOM: 1,
    MAX_ZOOM: 3,
  },
  STORAGE: {
    FAVORITES_KEY: 'favorites',
    SETTINGS_KEY: 'settings',
    CACHE_KEY_PREFIX: 'image_cache_',
  },
} as const;

export const THEME = {
  COLORS: {
    PRIMARY: '#007AFF',
    SECONDARY: '#5856D6',
    SUCCESS: '#34C759',
    WARNING: '#FF9500',
    ERROR: '#FF3B30',
    
    // Light theme
    LIGHT: {
      BACKGROUND: '#FFFFFF',
      SURFACE: '#F2F2F7',
      TEXT_PRIMARY: '#000000',
      TEXT_SECONDARY: '#8E8E93',
      BORDER: '#C6C6C8',
    },
    
    // Dark theme
    DARK: {
      BACKGROUND: '#000000',
      SURFACE: '#1C1C1E',
      TEXT_PRIMARY: '#FFFFFF',
      TEXT_SECONDARY: '#8E8E93',
      BORDER: '#38383A',
    },
  },
  SPACING: {
    XS: 4,
    SM: 8,
    MD: 16,
    LG: 24,
    XL: 32,
  },
  BORDER_RADIUS: {
    SM: 8,
    MD: 12,
    LG: 16,
  },
} as const;