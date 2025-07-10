import { useEffect, useRef } from 'react';
import { type SettingsType } from '../constants/SettingType';
import {
  DARK_THEME_COLORS,
  LIGHT_THEME_COLORS,
  CSS_VARIABLES,
  createThemeColors,
} from '../constants/ThemeColors';
import { defaultSettings } from '../constants/SettingType';

type ThemeSettings = SettingsType['theme'];

const getNestedValue = (obj: unknown, path: string): string => {
  const keys = path.split('.');
  return keys.reduce<unknown>((result, key) =>
    result && typeof result === 'object' ? (result as Record<string, unknown>)[key] : '', obj) as string;
};

const THEME_DEBOUNCE_DELAY = 300;

export const useThemeEffect = (theme: ThemeSettings) => {
  const themeDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (themeDebounceRef.current) {
      clearTimeout(themeDebounceRef.current);
    }
    
    themeDebounceRef.current = setTimeout(() => {
      applyTheme(theme);
    }, THEME_DEBOUNCE_DELAY);

    return () => {
      if (themeDebounceRef.current) {
        clearTimeout(themeDebounceRef.current);
      }
    };
  }, [theme]);

  const applyTheme = (theme: ThemeSettings) => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme.darkMode ? 'dark' : 'light');
    
    const baseColors = theme.darkMode ? DARK_THEME_COLORS : LIGHT_THEME_COLORS;
    const themeColors = createThemeColors(baseColors, theme.primaryColor);
    
    Object.entries(CSS_VARIABLES).forEach(([cssVar, colorPath]) => {
      const colorValue = getNestedValue(themeColors, colorPath);
      if (colorValue) {
        root.style.setProperty(cssVar, colorValue);
      }
    });
    
    if (theme.backgroundColor !== defaultSettings.theme.backgroundColor) {
      root.style.setProperty('--background-default', theme.backgroundColor);
    }
    
    if (theme.textColor !== defaultSettings.theme.textColor) {
      root.style.setProperty('--text-primary', theme.textColor);
    }
  };
};