import { Drawer, Switch, TextField, Box, Tab, Tabs, Typography } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { useState } from "react";
import "./Setting.css";
import { useThemeSettings } from "../../hooks/useSettings";
import ClockSettingPanel from "../Clock/ClockSettingPanel";
import SearchSettingPanel from "../SearchEngine/SearchSettingPanel";
import BookmarkSettingPanel from "../Bookmark/BookmarkSettingPanel";
import BackgroundSettingsPanel from "../Background/BackgroundSettingPanel";
import Githubv2SettingPanel from "../Github/Githubv2SettingPanel";
import WeatherSettingPanel from "../Weather/WeatherSettingPanel";
import NotesSettingPanel from "../Notes/NotesSettingPanel";

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

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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
              <BackgroundSettingsPanel />
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
        </Box>
      </Drawer>
    </div>
  );
};

export default Setting;
