import { createContext } from "react";
import type { SettingsType } from "../constants/SettingType";

export type SettingsContextType = {
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

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);