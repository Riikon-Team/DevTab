import React from "react";
import { TextField, Switch, Box, Typography, Divider, Collapse, Alert } from "@mui/material";
import { useSearchSettings } from "../../hooks/useSettings";
import { useSaveNotification } from "../../hooks/useSaveNotification";

const SearchSettingPanel: React.FC = () => {
  const { searchSettings, updateSearchSettings } = useSearchSettings();
  const [saveNotification, showSaveNotification] = useSaveNotification();

  const handleSwitch = (key: keyof typeof searchSettings) => (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSearchSettings({ [key]: e.target.checked });
    showSaveNotification();
  };

  const handleEngineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSearchSettings({ defaultEngine: Number(e.target.value) });
    showSaveNotification();
  };

  return (
    <Box sx={{ p: 2, width: '100%' }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Search Settings
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Collapse in={saveNotification}>
        <Alert severity="success" sx={{ mb: 2 }}>
          Settings saved!
        </Alert>
      </Collapse>
      <div className="settings-content">
        <div className="setting-item">
          <label htmlFor="enable-search">Enable Search</label>
          <Switch
            id="enable-search"
            checked={searchSettings.enable}
            onChange={handleSwitch('enable')}
          />
        </div>
        {searchSettings.enable && (
          <>
            <div className="setting-item">
              <label htmlFor="default-engine">Default Search Engine</label>
              <TextField
                id="default-engine"
                select
                value={searchSettings.defaultEngine}
                onChange={handleEngineChange}
                size="small"
                sx={{ width: "120px" }}
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
                onChange={handleSwitch('backgroundTransparent')}
              />
            </div>
          </>
        )}
      </div>
    </Box>
  );
};

export default SearchSettingPanel;
