/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback } from "react";
import { SettingsContext } from "./SettingsContext";
import { type SettingsType, defaultSettings } from "../constants/SettingType";
import { useSettingsPersistence } from "../hooks/useSettingsPersistence";
import { useThemeEffect } from "../hooks/useThemeEffect";

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [settings, setSettings] = useState<SettingsType>(defaultSettings);
  
  // Apply settings persistence (load/save to localStorage)
  useSettingsPersistence(settings, setSettings);
  
  // Apply theme effect when theme changes
  useThemeEffect(settings.theme);
  
  // Update a whole section of settings
  const updateSettings = useCallback(<T extends keyof SettingsType>(
    section: T,
    updates: Partial<SettingsType[T]>
  ) => {
    setSettings(prevSettings => {
      const newSettings = {
        ...prevSettings,
        [section]: {
          ...prevSettings[section],
          ...updates
        }
      };
      console.log("Settings updated:", section, updates, newSettings);
      return newSettings;
    });
  }, []);
  
  // Update a specific setting
  const updateSetting = useCallback(<
    T extends keyof SettingsType,
    K extends keyof SettingsType[T]
  >(
    section: T,
    key: K,
    value: SettingsType[T][K]
  ) => {
    updateSettings(section, { [key]: value } as unknown as Partial<SettingsType[T]>);
  }, [updateSettings]);
  
  // Reset all settings
  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
  }, []);
  
  // Reset a specific section
  const resetSection = useCallback(<T extends keyof SettingsType>(section: T) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [section]: { ...defaultSettings[section] }
    }));
  }, []);
  
  // Export settings as JSON string
  const exportSettings = useCallback(() => {
    return JSON.stringify(settings, null, 2);
  }, [settings]);
  
  // Import settings from JSON string
  const importSettings = useCallback((settingsJson: string) => {
    try {
      const parsedSettings = JSON.parse(settingsJson) as SettingsType;
      setSettings(parsedSettings);
      return true;
    } catch (error) {
      console.error("Error importing settings:", error);
      return false;
    }
  }, []);
  
  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        updateSetting,
        resetSettings,
        resetSection,
        exportSettings,
        importSettings
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};