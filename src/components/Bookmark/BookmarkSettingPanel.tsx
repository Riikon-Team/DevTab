import { Switch, Slider, FormControl, Select, MenuItem, Box, Typography, Divider, Collapse, Alert } from "@mui/material";
import { useBookmarkSettings } from "../../hooks/useSettings";
import SettingsIcon from "@mui/icons-material/Settings";
import IconButton from "@mui/material/IconButton";
import { useSaveNotification } from "../../hooks/useSaveNotification";

declare const chrome: any;
declare const browser: any;

const BookmarkSettingPanel = () => {
  const { bookmarkSettings, updateBookmarkSettings } = useBookmarkSettings();
  const [saveNotification, showSaveNotification] = useSaveNotification();
  const openBookmarkManager = () => {
    const browserAPI =
      typeof chrome !== "undefined" ? chrome : typeof browser !== "undefined" ? browser : null;

    if (browserAPI?.tabs) {
      browserAPI.tabs.create({ url: "chrome://bookmarks/" });
    } else {
      window.open("chrome://bookmarks/", "_blank");
    }
  };
  const handleSwitch = (key: keyof typeof bookmarkSettings) => (e: React.ChangeEvent<HTMLInputElement>) => {
    updateBookmarkSettings({ [key]: e.target.checked });
    showSaveNotification();
  };
  const handleSlider = (key: keyof typeof bookmarkSettings) => (_: any, value: number | number[]) => {
    updateBookmarkSettings({ [key]: value as number });
    showSaveNotification();
  };
  const handleSelect = (key: keyof typeof bookmarkSettings) => (e: any) => {
    updateBookmarkSettings({ [key]: e.target.value });
    showSaveNotification();
  };
  return (
    <Box sx={{ p: 2, width: '100%' }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Bookmark Settings
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Collapse in={saveNotification}>
        <Alert severity="success" sx={{ mb: 2 }}>
          Settings saved!
        </Alert>
      </Collapse>
      <div className="settings-content">
        <div className="setting-item">
          <label htmlFor="enable-bookmarks">Enable Bookmarks</label>
          <Switch
            id="enable-bookmarks"
            checked={bookmarkSettings.enable}
            onChange={handleSwitch('enable')}
          />
        </div>
        {bookmarkSettings.enable && (
          <>
            <div className="setting-item">
              <label htmlFor="bookmark-show-labels">Show Labels</label>
              <Switch
                id="bookmark-show-labels"
                checked={bookmarkSettings.showLabels}
                onChange={handleSwitch('showLabels')}
              />
            </div>
            <div className="setting-item">
              <label htmlFor="bookmark-show-icons">Show Icons</label>
              <Switch
                id="bookmark-show-icons"
                checked={bookmarkSettings.showIcons}
                onChange={handleSwitch('showIcons')}
              />
            </div>
            <div className="setting-item">
              <label htmlFor="bookmark-show-folders">Show Folders</label>
              <Switch
                id="bookmark-show-folders"
                checked={bookmarkSettings.showFolders}
                onChange={handleSwitch('showFolders')}
              />
            </div>
            <div className="setting-item">
              <label htmlFor="bookmark-transparent-bg">Transparent Background</label>
              <Switch
                id="bookmark-transparent-bg"
                checked={bookmarkSettings.backgroundTransparent}
                onChange={handleSwitch('backgroundTransparent')}
              />
            </div>
            <div className="setting-item">
              <label htmlFor="bookmark-blur">Background Blur</label>
              <Slider
                id="bookmark-blur"
                value={bookmarkSettings.blur}
                onChange={handleSlider('blur')}
                min={0}
                max={20}
                step={1}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}px`}
                sx={{ width: "150px" }}
              />
            </div>
            <div className="setting-item">
              <label htmlFor="bookmark-labels-position">Labels Position</label>
              <FormControl sx={{ width: "150px" }} size="small">
                <Select
                  id="bookmark-labels-position"
                  value={bookmarkSettings.labelsPosition || "bottom"}
                  onChange={handleSelect('labelsPosition')}
                >
                  <MenuItem value="bottom">Bottom</MenuItem>
                  <MenuItem value="right">Right</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="setting-item">
              <label htmlFor="bookmark-icon-size">Icon Size</label>
              <Slider
                id="bookmark-icon-size"
                value={bookmarkSettings.iconSize || 12}
                onChange={handleSlider('iconSize')}
                min={8}
                max={24}
                step={2}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}px`}
                sx={{ width: "150px" }}
              />
            </div>
            <div className="setting-item">
              <label htmlFor="bookmark-manager">Bookmark manager</label>
              <IconButton
                id="bookmark-manager"
                className="manager-button"
                onClick={openBookmarkManager}
                size="small"
                color="inherit"
              >
                <SettingsIcon />
              </IconButton>
            </div>
          </>
        )}
      </div>
    </Box>
  );
};

export default BookmarkSettingPanel;
