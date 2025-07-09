export type SettingsType = {
  // Background settings
  background: {
    brightness: number;
    selectedImages: string[];
    currentImage?: string;
  };
  
  // Clock settings
  clock: {
    timezone: number;
    locateCode: string;
    hour12: boolean;
    showSeconds: boolean;
    showWeekdays: boolean;
    transparentBackground: boolean;
  };
  
  // Search settings
  search: {
    defaultEngine: number;
    backgroundTransparent: boolean;
  };
  
  // Theme settings
  theme: {
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
    darkMode: boolean;
  };
  
  // GitHub settings
  github: {
    username: string;
    showProfile: boolean;
    showRepos: boolean;
  };
  
  // General settings
  general: {
    notifications: boolean;
    language: string;
  };
};


export const defaultSettings: SettingsType = {
  background: {
    brightness: 0.5,
    selectedImages: [],
  },
  clock: {
    timezone: 7,
    locateCode: "vi-VN",
    hour12: false,
    showSeconds: true,
    showWeekdays: false,
    transparentBackground: true,
  },
  search: {
    defaultEngine: 0,
    backgroundTransparent: true,
  },
  theme: {
    primaryColor: "#646cff",
    backgroundColor: "#242424",
    textColor: "rgba(255, 255, 255, 0.87)",
    darkMode: true,
  },
  github: {
    username: "",
    showProfile: false,
    showRepos: false,
  },
  general: {
    notifications: true,
    language: "vi-VN",
  },
};
