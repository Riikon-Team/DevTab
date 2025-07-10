import { generatePrimaryColors } from '../utils/colorUtils';

export type ColorPalette = {
  primary: {
    main: string;
    light: string;
    dark: string;
  };
  secondary: {
    main: string;
    light: string;
    dark: string;
  };
  background: {
    default: string;
    paper: string;
    surface: string;
    transparentDark?: string; 
    transparentLight?: string;
    transparent?: string; 
  };
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
  divider: string;
  success: { main: string };
  error: { main: string };
  warning: { main: string };
  info: { main: string };
};

const basePrimaryColors = generatePrimaryColors('#646cff');

export const DARK_THEME_COLORS: ColorPalette = {
  primary: basePrimaryColors,
  secondary: {
    main: '#f50057',
    light: '#ff5983',
    dark: '#bb002f',
  },
  background: {
    default: '#242424',
    paper: '#2d2d2d',
    surface: '#1a1a1a',
    transparentDark: '#1a1a1a80',
    transparentLight: '#ffffff80',
    transparent: '#1a1a1a80',
  },
  text: {
    primary: '#ffffff',
    secondary: '#b3b3b3',
    disabled: '#666666',
  },
  divider: '#000000', 
  success: { main: '#22c55e' },
  error: { main: '#ef4444' },
  warning: { main: '#f59e0b' },
  info: { main: '#3b82f6' },
};

export const LIGHT_THEME_COLORS: ColorPalette = {
  primary: basePrimaryColors,
  secondary: {
    main: '#f50057',
    light: '#ff5983',
    dark: '#bb002f',
  },
  background: {
    default: '#ffffff',
    paper: '#f5f5f5',
    surface: '#f9f9f9',
    transparentDark: '#1a1a1a80',
    transparentLight: '#ffffff80',
    transparent: '#ffffff80', 
  },
  text: {
    primary: '#213547',
    secondary: '#666666',
    disabled: '#999999',
  },
  divider: '#ddddddff',
  success: { main: '#22c55e' },
  error: { main: '#ef4444' },
  warning: { main: '#f59e0b' },
  info: { main: '#3b82f6' },
};

export const createThemeColors = (baseColors: ColorPalette, primaryColor: string): ColorPalette => {
  return {
    ...baseColors,
    primary: generatePrimaryColors(primaryColor),
  };
};

export const CSS_VARIABLES = {
  '--primary-main': 'primary.main',
  '--primary-light': 'primary.light',
  '--primary-dark': 'primary.dark',
  
  '--secondary-main': 'secondary.main',
  '--secondary-light': 'secondary.light',
  '--secondary-dark': 'secondary.dark',
  
  '--background-default': 'background.default',
  '--background-paper': 'background.paper',
  '--background-surface': 'background.surface',
  
  '--text-primary': 'text.primary',
  '--text-secondary': 'text.secondary',
  '--text-disabled': 'text.disabled',
  
  '--divider': 'divider',
  '--success-main': 'success.main',
  '--error-main': 'error.main',
  '--warning-main': 'warning.main',
  '--info-main': 'info.main',
} as const;