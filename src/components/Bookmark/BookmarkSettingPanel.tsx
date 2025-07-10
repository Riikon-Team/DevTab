import { Switch, Slider, FormControl, Select, MenuItem } from "@mui/material";
import { useBookmarkSettings } from "../../hooks/useSettings";
import SettingsIcon from "@mui/icons-material/Settings";
import IconButton from "@mui/material/IconButton";

const BookmarkSettingPanel = () => {
  const { bookmarkSettings, updateBookmarkSettings } = useBookmarkSettings();
  const openBookmarkManager = () => {
    const browserAPI =
      typeof chrome !== "undefined" ? chrome : typeof browser !== "undefined" ? browser : null;

    if (browserAPI?.tabs) {
      browserAPI.tabs.create({ url: "chrome://bookmarks/" });
    } else {
      window.open("chrome://bookmarks/", "_blank");
    }
  };
  return (
    <div className="settings-content">
      <div className="setting-item">
        <label htmlFor="enable-bookmarks">Enable Bookmarks</label>
        <Switch
          id="enable-bookmarks"
          checked={bookmarkSettings.enable}
          onChange={(e) => updateBookmarkSettings({ enable: e.target.checked })}
        />
      </div>
      {bookmarkSettings.enable && (
        <>
          <div className="setting-item">
            <label htmlFor="bookmark-show-labels">Show Labels</label>
            <Switch
              id="bookmark-show-labels"
              checked={bookmarkSettings.showLabels}
              onChange={(e) => updateBookmarkSettings({ showLabels: e.target.checked })}
            />
          </div>
          <div className="setting-item">
            <label htmlFor="bookmark-show-icons">Show Icons</label>
            <Switch
              id="bookmark-show-icons"
              checked={bookmarkSettings.showIcons}
              onChange={(e) => updateBookmarkSettings({ showIcons: e.target.checked })}
            />
          </div>
          <div className="setting-item">
            <label htmlFor="bookmark-show-folders">Show Folders</label>
            <Switch
              id="bookmark-show-folders"
              checked={bookmarkSettings.showFolders}
              onChange={(e) => updateBookmarkSettings({ showFolders: e.target.checked })}
            />
          </div>
          <div className="setting-item">
            <label htmlFor="bookmark-transparent-bg">Transparent Background</label>
            <Switch
              id="bookmark-transparent-bg"
              checked={bookmarkSettings.backgroundTransparent}
              onChange={(e) => updateBookmarkSettings({ backgroundTransparent: e.target.checked })}
            />
          </div>
          <div className="setting-item">
            <label htmlFor="bookmark-blur">Background Blur</label>
            <Slider
              id="bookmark-blur"
              value={bookmarkSettings.blur}
              onChange={(_, value) => updateBookmarkSettings({ blur: value as number })}
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
                onChange={(e) =>
                  updateBookmarkSettings({ labelsPosition: e.target.value as "right" | "bottom" })
                }
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
              onChange={(_, value) => updateBookmarkSettings({ iconSize: value as number })}
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
  );
};

export default BookmarkSettingPanel;
