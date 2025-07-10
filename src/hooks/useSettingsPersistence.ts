import { useEffect } from 'react';
import type { SettingsType } from '../constants/SettingType';

export const useSettingsPersistence = (
  settings: SettingsType, 
  setSettings: (settings: SettingsType) => void
) => {
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("devtab-settings");
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("devtab-settings", JSON.stringify(settings));
  }, [settings]);
};