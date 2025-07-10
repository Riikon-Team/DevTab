import { TextField, Switch, Box, Typography, Divider, Collapse, Alert } from "@mui/material";
import { useClockSettings } from "../../hooks/useSettings";
import React, { useState, useEffect } from "react";
import { useSaveNotification } from "../../hooks/useSaveNotification";

const ClockSettingPanel = () => {
  const { clockSettings, updateClockSettings } = useClockSettings();
  const [timezone, setTimezone] = useState(clockSettings.timezone);
  const [saveNotification, showSaveNotification] = useSaveNotification();

  useEffect(() => {
    setTimezone(clockSettings.timezone);
  }, [clockSettings.timezone]);

  const handleTimezoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setTimezone(value);
  };

  const handleTimezoneBlur = () => {
    updateClockSettings({ timezone });
    showSaveNotification();
  };

  const handleSwitch = (key: keyof typeof clockSettings) => (e: React.ChangeEvent<HTMLInputElement>) => {
    updateClockSettings({ [key]: e.target.checked });
    showSaveNotification();
  };

  const handleLocaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateClockSettings({ locateCode: e.target.value });
    showSaveNotification();
  };

  return (
    <Box sx={{ p: 2, width: '100%' }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Clock Settings
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Collapse in={saveNotification}>
        <Alert severity="success" sx={{ mb: 2 }}>
          Settings saved!
        </Alert>
      </Collapse>
      <Box className="settings-content">
        <div className="setting-item">
          <label htmlFor="enable-clock">Enable Clock</label>
          <Switch
            id="enable-clock"
            checked={clockSettings.enable}
            onChange={handleSwitch('enable')}
          />
        </div>
        {clockSettings.enable && (
          <>
            <div className="setting-item">
              <label htmlFor="timezone">Timezone (UTC offset)</label>
              <TextField
                id="timezone"
                type="number"
                value={timezone}
                onChange={handleTimezoneChange}
                onBlur={handleTimezoneBlur}
                size="small"
                sx={{ width: "80px" }}
                inputProps={{ min: -12, max: 12 }}
              />
            </div>

            <div className="setting-item">
              <label htmlFor="hour12">12-hour format</label>
              <Switch
                id="hour12"
                checked={clockSettings.hour12}
                onChange={handleSwitch('hour12')}
              />
            </div>

            <div className="setting-item">
              <label htmlFor="show-seconds">Show seconds</label>
              <Switch
                id="show-seconds"
                checked={clockSettings.showSeconds}
                onChange={handleSwitch('showSeconds')}
              />
            </div>

            <div className="setting-item">
              <label htmlFor="show-weekdays">Show weekdays in date</label>
              <Switch
                id="show-weekdays"
                checked={clockSettings.showWeekdays}
                onChange={handleSwitch('showWeekdays')}
              />
            </div>

            <div className="setting-item">
              <label htmlFor="transparent-bg">Transparent background</label>
              <Switch
                id="transparent-bg"
                checked={clockSettings.transparentBackground}
                onChange={handleSwitch('transparentBackground')}
              />
            </div>

            <div className="setting-item">
              <label htmlFor="locale-code">Locale</label>
              <TextField
                id="locale-code"
                value={clockSettings.locateCode}
                onChange={handleLocaleChange}
                placeholder="vi-VN"
                size="small"
                sx={{ width: "100px" }}
              />
            </div>
          </>
        )}
      </Box>
    </Box>
  );
};

export default ClockSettingPanel;
