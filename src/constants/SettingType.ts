import { IMAGE_LIST } from "./Background";

export type BackgroundType = "image" | "video";

export type SettingsType = {
  general: {
    notifications: boolean;
    language: string;
    explanded?: boolean;
    enableNewsFeed?: boolean;
    enablePomodoro?: boolean;
  };

  background: {
    brightness: number;
    selectedImages: string[];
    currentImage?: string;
    contentType: BackgroundType;
    customUrl: string;
    enableGyro: boolean;
    gyroSensitivity: number;
  };

  clock: {
    enable: boolean;
    timezone: number;
    locateCode: string;
    hour12: boolean;
    showSeconds: boolean;
    showWeekdays: boolean;
    transparentBackground: boolean;
  };

  search: {
    enable: boolean;
    defaultEngine: number;
    backgroundTransparent: boolean;
  };

  theme: {
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
    darkMode: boolean;
  };

  github: {
    enable: boolean;
    username: string;
    showProfile: boolean;
    showRepos: boolean;
    showUserInfo: boolean;
    showLanguageStats: boolean;
    showStats: boolean;
    showCommitActivity: boolean;
    cacheDurationMinutes: number;
    excludedLanguages: string[];
    fontSize: number;
    compactMode: boolean;
    chartSize: number;
    blur: number;
    backgroundTransparent: boolean;
  };

  bookmark: {
    enable: boolean;
    showLabels: boolean;
    showIcons: boolean;
    labelsPosition?: "right" | "bottom";
    showFolders: boolean;
    backgroundTransparent: boolean;
    blur: number;
    iconSize?: number;
  };
  weather: {
    enable: boolean;
    location: string;
    tempScale: "C" | "F";
    refreshInterval: number;
    backgroundTransparent: boolean;
    fontSize: number;
  };
  notes: {
    enable: boolean;
    backgroundTransparent: boolean;
    blur: number;
    fontSize: number;
    expandedView: boolean;
    showDeadline: boolean;
    sortBy: 'createdAt' | 'deadline' | 'title';
    sortDirection: 'asc' | 'desc';
  };
};

export const defaultSettings: SettingsType = {
  general: {
    notifications: true,
    language: "vi-VN",
    explanded: false,
    enableNewsFeed: true,
    enablePomodoro: true,
  },
  background: {
    brightness: 0.5,
    selectedImages: IMAGE_LIST,
    currentImage: "",
    contentType: "image",
    customUrl: "",
    enableGyro: false,
    gyroSensitivity: 5,
  },
  clock: {
    enable: true,
    timezone: 7,
    locateCode: "vi-VN",
    hour12: false,
    showSeconds: true,
    showWeekdays: false,
    transparentBackground: true,
  },
  search: {
    enable: true,
    defaultEngine: 0,
    backgroundTransparent: true,
  },
  theme: {
    primaryColor: "#646cff",
    backgroundColor: "#242424",
    textColor: "#ffffff",
    darkMode: true,
  },
  github: {
    enable: true,
    username: "",
    showProfile: false,
    showRepos: false,
    showUserInfo: true,
    showLanguageStats: true,
    showStats: true,
    showCommitActivity: true,
    cacheDurationMinutes: 10,
    excludedLanguages: [],
    fontSize: 14,
    compactMode: false,
    chartSize: 300,
    blur: 10,
    backgroundTransparent: true,
  },
  bookmark: {
    enable: true,
    showLabels: true,
    showIcons: true,
    showFolders: true,
    backgroundTransparent: true,
    blur: 10,
    labelsPosition: "right",
    iconSize: 12,
  },
  weather: {
    enable: true,
    location: "Ho Chi Minh City",
    tempScale: "C",
    refreshInterval: 10,
    backgroundTransparent: true,
    fontSize: 14,
  },
  notes: {
    enable: true,
    backgroundTransparent: true,
    blur: 10,
    fontSize: 14,
    expandedView: false,
    showDeadline: true,
    sortBy: 'createdAt',
    sortDirection: 'asc',
  },
};
