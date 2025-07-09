import React, { createContext, useContext, useEffect, useState } from "react";
import { defaultSettings } from "../constants/SettingType";
import type { SettingsType } from "../constants/SettingType";

type SettingsContextType = {
  settings: SettingsType;
  updateSettings: <T extends keyof SettingsType>(
    section: T,
    updates: Partial<SettingsType[T]>
  ) => void;
  updateSetting: <T extends keyof SettingsType, K extends keyof SettingsType[T]>(
    section: T,
    key: K,
    value: SettingsType[T][K]
  ) => void;
  resetSettings: () => void;
  resetSection: <T extends keyof SettingsType>(section: T) => void;
  exportSettings: () => string;
  importSettings: (settingsJson: string) => boolean;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SettingsType>(defaultSettings);

  useEffect(() => {
    const savedSettings = localStorage.getItem("devtab-settings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error("Error parsing saved settings:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("devtab-settings", JSON.stringify(settings));
    
    applyTheme(settings.theme);
  }, [settings]);

  const applyTheme = (theme: SettingsType['theme']) => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.primaryColor);
    root.style.setProperty('--bg-primary', theme.backgroundColor);
    root.style.setProperty('--text-primary', theme.textColor);
    
    if (theme.darkMode) {
      root.style.setProperty('--bg-card', '#2d2d2d');
      root.style.setProperty('--text-secondary', 'rgba(255, 255, 255, 0.6)');
    } else {
      root.style.setProperty('--bg-card', '#f5f5f5');
      root.style.setProperty('--text-secondary', 'rgba(0, 0, 0, 0.6)');
    }
  };

  const updateSettings = <T extends keyof SettingsType>(
    section: T,
    updates: Partial<SettingsType[T]>
  ) => {
    setSettings(prev => ({
      ...prev,
      [section]: { ...prev[section], ...updates }
    }));
  };

  const updateSetting = <T extends keyof SettingsType, K extends keyof SettingsType[T]>(
    section: T,
    key: K,
    value: SettingsType[T][K]
  ) => {
    setSettings(prev => ({
      ...prev,
      [section]: { ...prev[section], [key]: value }
    }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  const resetSection = <T extends keyof SettingsType>(section: T) => {
    setSettings(prev => ({
      ...prev,
      [section]: defaultSettings[section]
    }));
  };

  const exportSettings = () => {
    return JSON.stringify(settings, null, 2);
  };

  const importSettings = (settingsJson: string): boolean => {
    try {
      const parsed = JSON.parse(settingsJson);
      setSettings({ ...defaultSettings, ...parsed });
      return true;
    } catch (error) {
      console.error("Error importing settings:", error);
      return false;
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        updateSetting,
        resetSettings,
        resetSection,
        exportSettings,
        importSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

export const useBackgroundSettings = () => {
  const { settings, updateSettings } = useSettings();
  return {
    backgroundSettings: settings.background,
    updateBackgroundSettings: (updates: Partial<SettingsType['background']>) =>
      updateSettings('background', updates),
  };
};

export const useClockSettings = () => {
  const { settings, updateSettings } = useSettings();
  return {
    clockSettings: settings.clock,
    updateClockSettings: (updates: Partial<SettingsType['clock']>) =>
      updateSettings('clock', updates),
  };
};

export const useSearchSettings = () => {
  const { settings, updateSettings } = useSettings();
  return {
    searchSettings: settings.search,
    updateSearchSettings: (updates: Partial<SettingsType['search']>) =>
      updateSettings('search', updates),
  };
};

export const useThemeSettings = () => {
  const { settings, updateSettings } = useSettings();
  return {
    themeSettings: settings.theme,
    updateThemeSettings: (updates: Partial<SettingsType['theme']>) =>
      updateSettings('theme', updates),
  };
};

export const useGithubSettings = () => {
  const { settings, updateSettings } = useSettings();
  return {
    githubSettings: settings.github,
    updateGithubSettings: (updates: Partial<SettingsType['github']>) =>
      updateSettings('github', updates),
  };
};