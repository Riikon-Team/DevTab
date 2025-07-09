import { Drawer, Switch } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

import { useState } from "react";
import "./Setting.css";

const Setting = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
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
        slotProps={{ paper: { className: "settings-drawer" } }}
      >
        <div className="settings-header">
          <h2>Settings</h2>
          <p>Here you can adjust your settings.</p>
        </div>
        <div className="settings-content">
          <div className="setting-item">
            <label htmlFor="dark-mode">Dark Mode</label>
            <Switch id="dark-mode" />
          </div>
          <div className="setting-item">
            <label htmlFor="notifications">Notifications</label>
            <Switch id="notifications" />
          </div>
        </div>
      </Drawer>
    </div>
  );
};
export default Setting;
