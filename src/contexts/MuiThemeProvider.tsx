import React, { useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { useThemeSettings } from '../hooks/useSettings';
import { DARK_THEME_COLORS, LIGHT_THEME_COLORS, createThemeColors } from '../constants/ThemeColors';

const MuiThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { themeSettings } = useThemeSettings();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeSettings.darkMode ? 'dark' : 'light');
  }, [themeSettings.darkMode]);

  const baseColors = themeSettings.darkMode ? DARK_THEME_COLORS : LIGHT_THEME_COLORS;
  
  const themeColors = createThemeColors(baseColors, themeSettings.primaryColor);

  const theme = createTheme({
    palette: {
      mode: themeSettings.darkMode ? 'dark' : 'light',
      primary: {
        main: themeColors.primary.main,
        light: themeColors.primary.light,
        dark: themeColors.primary.dark,
      },
      secondary: {
        main: themeColors.secondary.main,
        light: themeColors.secondary.light,
        dark: themeColors.secondary.dark,
      },
      background: {
        default: themeColors.background.default,
        paper: themeColors.background.paper,
      },
      text: {
        primary: themeColors.text.primary,
        secondary: themeColors.text.secondary,
        disabled: themeColors.text.disabled,
      },
      divider: themeColors.divider,
      success: {
        main: themeColors.success.main,
      },
      error: {
        main: themeColors.error.main,
      },
      warning: {
        main: themeColors.warning.main,
      },
      info: {
        main: themeColors.info.main,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: themeColors.background.default,
            color: themeColors.text.primary,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: themeColors.background.transparentDark,
            color: themeColors.text.primary,
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            color: themeColors.text.secondary,
            '&.Mui-selected': {
              color: themeColors.primary.main,
            },
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: {
            backgroundColor: themeColors.primary.main,
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          switchBase: {
            '&.Mui-checked': {
              color: themeColors.primary.main,
              '& + .MuiSwitch-track': {
                backgroundColor: themeColors.primary.main,
                opacity: 0.5,
              },
            },
          },
        },
      },
      MuiSlider: {
        styleOverrides: {
          thumb: {
            backgroundColor: themeColors.primary.main,
          },
          track: {
            backgroundColor: themeColors.primary.main,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              color: themeColors.text.primary,
              '& fieldset': {
                borderColor: themeColors.divider,
              },
              '&:hover fieldset': {
                borderColor: themeColors.primary.main,
              },
              '&.Mui-focused fieldset': {
                borderColor: themeColors.primary.main,
              },
            },
            '& .MuiInputLabel-root': {
              color: themeColors.text.secondary,
              '&.Mui-focused': {
                color: themeColors.primary.main,
              },
            },
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default MuiThemeProvider;