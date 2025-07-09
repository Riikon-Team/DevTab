import { Drawer, Switch, Slider, TextField, Box, Tab, Tabs, Typography } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { useState } from "react";
import "./Setting.css";
import { 
  useThemeSettings, 
  useBackgroundSettings, 
  useClockSettings, 
  useSearchSettings, 
  useGithubSettings 
} from "../../contexts/SettingsContext";

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
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const Setting = () => {
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  
  const { themeSettings, updateThemeSettings } = useThemeSettings();
  const { backgroundSettings, updateBackgroundSettings } = useBackgroundSettings();
  const { clockSettings, updateClockSettings } = useClockSettings();
  const { searchSettings, updateSearchSettings } = useSearchSettings();
  const { githubSettings, updateGithubSettings } = useGithubSettings();

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
        PaperProps={{
          sx: {
            width: '650px',
            maxWidth: '80vw',
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
          }
        }}
      >
        <div className="settings-header">
          <h2>Settings</h2>
          <p>Configure your DevTab experience</p>
        </div>

        <Box sx={{ flexGrow: 1, display: 'flex', height: '100%' }}>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={tabValue}
            onChange={handleTabChange}
            aria-label="Settings tabs"
            sx={{ borderRight: 1, borderColor: 'divider', minWidth: '120px' }}
          >
            <Tab label="Theme" {...a11yProps(0)} />
            <Tab label="Background" {...a11yProps(1)} />
            <Tab label="Clock" {...a11yProps(2)} />
            <Tab label="Search" {...a11yProps(3)} />
            <Tab label="GitHub" {...a11yProps(4)} />
            
          </Tabs>

          {/* Theme Settings */}
          <TabPanel value={tabValue} index={0}>
            <div className="settings-content">
              <div className="setting-item">
                <label htmlFor="dark-mode">Dark Mode</label>
                <Switch
                  id="dark-mode"
                  checked={themeSettings.darkMode}
                  onChange={(e) =>
                    updateThemeSettings({ darkMode: e.target.checked })
                  }
                />
              </div>
              
              <div className="setting-item">
                <label htmlFor="primary-color">Primary Color</label>
                <TextField
                  id="primary-color"
                  type="color"
                  value={themeSettings.primaryColor}
                  onChange={(e) =>
                    updateThemeSettings({ primaryColor: e.target.value })
                  }
                  size="small"
                  sx={{ width: '80px' }}
                />
              </div>

              <div className="setting-item">
                <label htmlFor="bg-color">Background Color</label>
                <TextField
                  id="bg-color"
                  type="color"
                  value={themeSettings.backgroundColor}
                  onChange={(e) =>
                    updateThemeSettings({ backgroundColor: e.target.value })
                  }
                  size="small"
                  sx={{ width: '80px' }}
                />
              </div>

              <div className="setting-item">
                <label htmlFor="text-color">Text Color</label>
                <TextField
                  id="text-color"
                  type="color"
                  value={themeSettings.textColor}
                  onChange={(e) =>
                    updateThemeSettings({ textColor: e.target.value })
                  }
                  size="small"
                  sx={{ width: '80px' }}
                />
              </div>
            </div>
          </TabPanel>

          {/* Background Settings */}
          <TabPanel value={tabValue} index={1}>
            <div className="settings-content">
              <div className="setting-item">
                <label htmlFor="brightness">Brightness</label>
                <Slider
                  id="brightness"
                  value={backgroundSettings.brightness}
                  onChange={(_, value) =>
                    updateBackgroundSettings({ brightness: value as number })
                  }
                  min={0.1}
                  max={1}
                  step={0.1}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
                  sx={{ width: '150px' }}
                />
              </div>

              <div className="setting-item">
                <label htmlFor="current-image">Current Image</label>
                <TextField
                  id="current-image"
                  value={backgroundSettings.currentImage || ''}
                  onChange={(e) =>
                    updateBackgroundSettings({ currentImage: e.target.value })
                  }
                  placeholder="Image URL"
                  size="small"
                  fullWidth
                />
              </div>
            </div>
          </TabPanel>

          {/* Clock Settings */}
          <TabPanel value={tabValue} index={2}>
            <div className="settings-content">
              <div className="setting-item">
                <label htmlFor="timezone">Timezone (UTC offset)</label>
                <TextField
                  id="timezone"
                  type="number"
                  value={clockSettings.timezone}
                  onChange={(e) =>
                    updateClockSettings({ timezone: Number(e.target.value) })
                  }
                  size="small"
                  sx={{ width: '80px' }}
                  inputProps={{ min: -12, max: 12 }}
                />
              </div>

              <div className="setting-item">
                <label htmlFor="hour12">12-hour format</label>
                <Switch
                  id="hour12"
                  checked={clockSettings.hour12}
                  onChange={(e) =>
                    updateClockSettings({ hour12: e.target.checked })
                  }
                />
              </div>

              <div className="setting-item">
                <label htmlFor="show-seconds">Show seconds</label>
                <Switch
                  id="show-seconds"
                  checked={clockSettings.showSeconds}
                  onChange={(e) =>
                    updateClockSettings({ showSeconds: e.target.checked })
                  }
                />
              </div>

              <div className="setting-item">
                <label htmlFor="show-weekdays">Show weekdays in date</label>
                <Switch
                  id="show-weekdays"
                  checked={clockSettings.showWeekdays}
                  onChange={(e) =>
                    updateClockSettings({ showWeekdays: e.target.checked })
                  }
                />
              </div>

              <div className="setting-item">
                <label htmlFor="transparent-bg">Transparent background</label>
                <Switch
                  id="transparent-bg"
                  checked={clockSettings.transparentBackground}
                  onChange={(e) =>
                    updateClockSettings({ transparentBackground: e.target.checked })
                  }
                />
              </div>

              <div className="setting-item">
                <label htmlFor="locale-code">Locale</label>
                <TextField
                  id="locale-code"
                  value={clockSettings.locateCode}
                  onChange={(e) =>
                    updateClockSettings({ locateCode: e.target.value })
                  }
                  placeholder="vi-VN"
                  size="small"
                  sx={{ width: '100px' }}
                />
              </div>
            </div>
          </TabPanel>

          {/* Search Settings */}
          <TabPanel value={tabValue} index={3}>
            <div className="settings-content">
              <div className="setting-item">
                <label htmlFor="default-engine">Default Search Engine</label>
                <TextField
                  id="default-engine"
                  select
                  value={searchSettings.defaultEngine}
                  onChange={(e) =>
                    updateSearchSettings({ defaultEngine: Number(e.target.value) })
                  }
                  size="small"
                  sx={{ width: '120px' }}
                  SelectProps={{ native: true }}
                >
                  <option value={0}>Google</option>
                  <option value={1}>Bing</option>
                  <option value={2}>DuckDuckGo</option>
                </TextField>
              </div>

              <div className="setting-item">
                <label htmlFor="search-transparent">Transparent background</label>
                <Switch
                  id="search-transparent"
                  checked={searchSettings.backgroundTransparent}
                  onChange={(e) =>
                    updateSearchSettings({ backgroundTransparent: e.target.checked })
                  }
                />
              </div>
            </div>
          </TabPanel>

          {/* GitHub Settings */}
          <TabPanel value={tabValue} index={4}>
            <div className="settings-content">
              <div className="setting-item">
                <label htmlFor="github-username">GitHub Username</label>
                <TextField
                  id="github-username"
                  value={githubSettings.username}
                  onChange={(e) =>
                    updateGithubSettings({ username: e.target.value })
                  }
                  placeholder="your-username"
                  size="small"
                  fullWidth
                />
              </div>

              <div className="setting-item">
                <label htmlFor="show-profile">Show profile</label>
                <Switch
                  id="show-profile"
                  checked={githubSettings.showProfile}
                  onChange={(e) =>
                    updateGithubSettings({ showProfile: e.target.checked })
                  }
                />
              </div>

              <div className="setting-item">
                <label htmlFor="show-repos">Show repositories</label>
                <Switch
                  id="show-repos"
                  checked={githubSettings.showRepos}
                  onChange={(e) =>
                    updateGithubSettings({ showRepos: e.target.checked })
                  }
                />
              </div>
            </div>
          </TabPanel>

          
        </Box>
      </Drawer>
    </div>
  );
};

export default Setting;