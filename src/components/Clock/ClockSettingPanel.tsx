import { TextField, Switch } from "@mui/material";
import { useClockSettings } from "../../hooks/useSettings";
import React, { useState, useEffect } from "react";

const ClockSettingPanel = () => {
  const { clockSettings, updateClockSettings } = useClockSettings();
  const [timezone, setTimezone] = useState(clockSettings.timezone);

  useEffect(() => {
    setTimezone(clockSettings.timezone);
  }, [clockSettings.timezone]);

  const handleTimezoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setTimezone(value);
  };

  const handleTimezoneBlur = () => {
    updateClockSettings({ timezone });
  };

  return (
    <div className="settings-content">
      <div className="setting-item">
        <label htmlFor="enable-clock">Enable Clock</label>
        <Switch
          id="enable-clock"
          checked={clockSettings.enable}
          onChange={(e) => updateClockSettings({ enable: e.target.checked })}
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
              onChange={(e) => updateClockSettings({ hour12: e.target.checked })}
            />
          </div>

          <div className="setting-item">
            <label htmlFor="show-seconds">Show seconds</label>
            <Switch
              id="show-seconds"
              checked={clockSettings.showSeconds}
              onChange={(e) => updateClockSettings({ showSeconds: e.target.checked })}
            />
          </div>

          <div className="setting-item">
            <label htmlFor="show-weekdays">Show weekdays in date</label>
            <Switch
              id="show-weekdays"
              checked={clockSettings.showWeekdays}
              onChange={(e) => updateClockSettings({ showWeekdays: e.target.checked })}
            />
          </div>

          <div className="setting-item">
            <label htmlFor="transparent-bg">Transparent background</label>
            <Switch
              id="transparent-bg"
              checked={clockSettings.transparentBackground}
              onChange={(e) => updateClockSettings({ transparentBackground: e.target.checked })}
            />
          </div>

          <div className="setting-item">
            <label htmlFor="locale-code">Locale</label>
            <TextField
              id="locale-code"
              value={clockSettings.locateCode}
              onChange={(e) => updateClockSettings({ locateCode: e.target.value })}
              placeholder="vi-VN"
              size="small"
              sx={{ width: "100px" }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ClockSettingPanel;
