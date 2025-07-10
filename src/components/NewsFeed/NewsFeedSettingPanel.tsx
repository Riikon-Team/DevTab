import React from 'react';
import { Switch, FormControlLabel, Box, Typography, Divider } from '@mui/material';

interface NewsFeedSettingPanelProps {
  enable: boolean;
  onChange: (enable: boolean) => void;
}

const NewsFeedSettingPanel: React.FC<NewsFeedSettingPanelProps> = ({ enable, onChange }) => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        News Feed Settings
      </Typography>
      <Divider sx={{ my: 2 }} />
      <FormControlLabel
        control={<Switch checked={enable} onChange={e => onChange(e.target.checked)} />}
        label="Enable News Feed"
      />
    </Box>
  );
};

export default NewsFeedSettingPanel; 