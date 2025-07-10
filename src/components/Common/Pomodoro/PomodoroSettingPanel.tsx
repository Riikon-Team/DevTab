import React from 'react';
import { Switch, FormControlLabel, Box, Typography, Divider } from '@mui/material';

interface PomodoroSettingPanelProps {
  enable: boolean;
  onChange: (enable: boolean) => void;
}

const PomodoroSettingPanel: React.FC<PomodoroSettingPanelProps> = ({ enable, onChange }) => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Pomodoro Settings
      </Typography>
      <Divider sx={{ my: 2 }} />
      <FormControlLabel
        control={<Switch checked={enable} onChange={e => onChange(e.target.checked)} />}
        label="Enable Pomodoro"
      />
    </Box>
  );
};

export default PomodoroSettingPanel; 