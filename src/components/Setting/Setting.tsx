import { Drawer, Switch, TextField, Box, Tab, Tabs, Typography } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { useState } from "react";
import "./Setting.css";
import { useThemeSettings } from "../../hooks/useSettings";
import { useGenaralSettings } from "../../hooks/useSettings";
import ClockSettingPanel from "../Clock/ClockSettingPanel";
import SearchSettingPanel from "../SearchEngine/SearchSettingPanel";
import BookmarkSettingPanel from "../Bookmark/BookmarkSettingPanel";
import BackgroundSettingsPanel from "../Background/BackgroundSettingPanel";
import Githubv2SettingPanel from "../Github/Githubv2SettingPanel";
import WeatherSettingPanel from "../Weather/WeatherSettingPanel";
import NotesSettingPanel from "../Notes/NotesSettingPanel";
import { useSettings } from "../../hooks/useSettings";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      style={{ width: "100%", height: "100%", overflow: "auto" }}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3, width: "100%" }}>
          <Typography component="div" sx={{ width: "100%" }}>
            {children}
          </Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const Setting = () => {
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const { themeSettings, updateThemeSettings } = useThemeSettings();
  const { generalSettings, updateGeneralSettings } = useGenaralSettings();
  const { settings, updateAllSettings } = useSettings();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Handler export
  const handleExport = () => {
    const data = JSON.stringify(settings, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'devtab-settings.json';
    a.click();
    URL.revokeObjectURL(url);
  };
  // Handler import
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const json = JSON.parse(evt.target?.result as string);
        if (json && typeof json === 'object' && json.general && json.background) {
          updateAllSettings(json);
          alert('Import settings thành công!');
        } else {
          alert('File không hợp lệ!');
        }
      } catch {
        alert('File không hợp lệ!');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <div onClick={toggleDrawer} className="btn">
        <SettingsIcon className="settings-icon" />
      </div>
      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer}
        slotProps={{
          paper: {
            sx: {
              width: "650px",
              maxWidth: "80vw",
            },
          },
        }}
        className="settings-drawer"
      >
        <div className="settings-header">
          <h2>Settings</h2>
          <p>Configure your DevTab experience</p>
        </div>

        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            height: "100%",
            width: "100%",
            overflow: "hidden",
          }}
        >
          {/* Vertical Tabs */}
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={tabValue}
            onChange={handleTabChange}
            aria-label="Settings tabs"
            sx={{
              borderRight: 1,
              borderColor: "divider",
              minWidth: "120px",
            }}
          >
            <Tab label="General" {...a11yProps(0)} />
            <Tab label="Clock" {...a11yProps(1)} />
            <Tab label="Search" {...a11yProps(2)} />
            <Tab label="GitHub" {...a11yProps(3)} />
            <Tab label="Bookmark" {...a11yProps(4)} />
            <Tab label="Weather" {...a11yProps(5)} />
            <Tab label="Notes" {...a11yProps(6)} />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <div className="settings-content">
              <div className="setting-item">
                <label htmlFor="dark-mode">Dark Mode</label>
                <Switch
                  id="dark-mode"
                  checked={themeSettings.darkMode}
                  onChange={(e) => updateThemeSettings({ darkMode: e.target.checked })}
                />
              </div>

              <div className="setting-item">
                <label htmlFor="primary-color">Primary Color</label>
                <TextField
                  id="primary-color"
                  type="color"
                  value={themeSettings.primaryColor}
                  onChange={(e) =>
                    updateThemeSettings({
                      primaryColor: e.target.value,
                    })
                  }
                  size="small"
                  sx={{ width: "80px" }}
                />
              </div>
              <div className="setting-item">
                <label htmlFor="enable-newsfeed">Enable News Feed</label>
                <Switch
                  id="enable-newsfeed"
                  checked={!!generalSettings.enableNewsFeed}
                  onChange={e => updateGeneralSettings({ enableNewsFeed: e.target.checked })}
                />
              </div>
              <div className="setting-item">
                <label htmlFor="enable-pomodoro">Enable Pomodoro</label>
                <Switch
                  id="enable-pomodoro"
                  checked={!!generalSettings.enablePomodoro}
                  onChange={e => updateGeneralSettings({ enablePomodoro: e.target.checked })}
                />
              </div>
              <BackgroundSettingsPanel />
              <div style={{ display: 'flex', gap: 12, margin: '16px 0' }}>
                <button onClick={handleExport}>Export Settings</button>
                <label style={{ display: 'inline-block' }}>
                  <input type="file" accept="application/json" style={{ display: 'none' }} onChange={handleImport} />
                  <button type="button">Import Settings</button>
                </label>
              </div>
            </div>
          </TabPanel>

          {/* Clock Settings */}
          <TabPanel value={tabValue} index={1}>
            <ClockSettingPanel />
          </TabPanel>

          {/* Search Settings */}
          <TabPanel value={tabValue} index={2}>
            <SearchSettingPanel />
          </TabPanel>

          {/* GitHub Settings */}
          <TabPanel value={tabValue} index={3}>
            <Githubv2SettingPanel />
          </TabPanel>

          {/* Bookmark Settings */}
          <TabPanel value={tabValue} index={4}>
            <BookmarkSettingPanel />
          </TabPanel>

          {/* Weather Settings */}
          <TabPanel value={tabValue} index={5}>
            <WeatherSettingPanel />
          </TabPanel>

          {/* Notes Settings */}
          <TabPanel value={tabValue} index={6}>
            <NotesSettingPanel />
          </TabPanel>

          <TabPanel value={tabValue} index={99}>
            <div className="settings-content">
              <h3>About DevTab</h3>
              <p>DevTab is a simple and elegant browser extension that helps you manage your browser settings and customize your browser experience.</p>
              <p>Version: 1.0.0</p>
              <p>Author: Riikon Team</p>
              <p>Contact: <a href="mailto:riikon04@gmail.com">riikon04@gmail.com</a></p>
              <p>Website: <a href="https://riikonteam.io.vn">https://riikonteam.io.vn</a></p>
              <p>GitHub: <a href="https://github.com/Riikon-Team">https://github.com/Riikon-Team</a></p>
              <p>License: MIT</p>
              <p>Copyright © 2025 Riikon Team</p>
            </div>
          </TabPanel>
        </Box>
      </Drawer>
    </div>
  );
};

export default Setting;
