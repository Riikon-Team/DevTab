import { useContext, useEffect, useState } from "react";
import { SettingsContext, type SettingsContextType } from "../contexts/SettingsContext";
import type { SettingsType } from "../constants/SettingType";

export const useSettings = (): SettingsContextType => {
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

export const useBookmarkSettings = () => {
  const { settings, updateSettings } = useSettings();
  return {
    bookmarkSettings: settings.bookmark,
    updateBookmarkSettings: (updates: Partial<SettingsType['bookmark']>) =>
      updateSettings('bookmark', updates),
  };
};

export const useWeatherSettings = () => {
  const { settings, updateSettings } = useSettings();
  return {
    weatherSettings: settings.weather,
    updateWeatherSettings: (updates: Partial<SettingsType['weather']>) =>
      updateSettings('weather', updates),
  };
};

export const useGenaralSettings = () => {
  const { settings, updateSettings } = useSettings();
  return {
    generalSettings: settings.general,
    updateGeneralSettings: (updates: Partial<SettingsType['general']>) =>
      updateSettings('general', updates),
  };
};

export const useNotesSettings = () => {
  const { settings, updateSettings } = useSettings();
  return {
    notesSettings: settings.notes,
    updateNotesSettings: (updates: Partial<SettingsType['notes']>) =>
      updateSettings('notes', updates),
  };
};
