import React from "react";
import { TextField, Switch } from "@mui/material";
import { useSearchSettings } from "../../hooks/useSettings";

const SearchSettingPanel: React.FC = () => {
  const { searchSettings, updateSearchSettings } = useSearchSettings();

  return (
    <div className="settings-content">
      <div className="setting-item">
        <label htmlFor="enable-search">Enable Search</label>
        <Switch
          id="enable-search"
          checked={searchSettings.enable}
          onChange={(e) => updateSearchSettings({ enable: e.target.checked })}
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
              onChange={(e) => updateSearchSettings({ defaultEngine: Number(e.target.value) })}
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
              onChange={(e) => updateSearchSettings({ backgroundTransparent: e.target.checked })}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default SearchSettingPanel;
