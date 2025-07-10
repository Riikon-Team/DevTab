import React, { useState } from 'react';
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Slider,
  Alert,
  Collapse,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useNotesSettings } from '../../hooks/useSettings';

const NotesSettingPanel: React.FC = () => {
  const { notesSettings, updateNotesSettings } = useNotesSettings();
  const [saveNotification, setSaveNotification] = useState(false);
  
  // Đảm bảo settings có giá trị mặc định
  const settings = {
    enable: notesSettings?.enable ?? true,
    backgroundTransparent: notesSettings?.backgroundTransparent ?? true,
    blur: notesSettings?.blur ?? 10,
    fontSize: notesSettings?.fontSize ?? 14,
    expandedView: notesSettings?.expandedView ?? false,
    showDeadline: notesSettings?.showDeadline ?? true,
    sortBy: notesSettings?.sortBy ?? 'createdAt',
    sortDirection: notesSettings?.sortDirection ?? 'desc',
  };
  
  const showSaveNotification = () => {
    setSaveNotification(true);
    setTimeout(() => {
      setSaveNotification(false);
    }, 3000);
  };
  
  const handleSettingChange = <K extends keyof typeof settings>(
    key: K, 
    value: typeof settings[K]
  ) => {
    updateNotesSettings({ [key]: value });
    showSaveNotification();
  };
  
  return (
    <Box sx={{ width: '100%', padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Cài đặt ghi chú
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={settings.enable}
              onChange={(e) => handleSettingChange('enable', e.target.checked)}
            />
          }
          label="Hiển thị ghi chú"
        />
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="subtitle1" gutterBottom>
        Giao diện
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={settings.backgroundTransparent}
              onChange={(e) => handleSettingChange('backgroundTransparent', e.target.checked)}
            />
          }
          label="Nền trong suốt"
        />
      </Box>
      
      {settings.backgroundTransparent && (
        <Box sx={{ mb: 2 }}>
          <Typography id="blur-slider" gutterBottom>
            Hiệu ứng mờ: {settings.blur}px
          </Typography>
          <Slider
            value={settings.blur}
            onChange={(_, newValue) => handleSettingChange('blur', newValue as number)}
            aria-labelledby="blur-slider"
            min={0}
            max={20}
            step={1}
            marks
            valueLabelDisplay="auto"
          />
        </Box>
      )}
      
      <Box sx={{ mb: 2 }}>
        <Typography id="font-size-slider" gutterBottom>
          Cỡ chữ: {settings.fontSize}px
        </Typography>
        <Slider
          value={settings.fontSize}
          onChange={(_, newValue) => handleSettingChange('fontSize', newValue as number)}
          aria-labelledby="font-size-slider"
          min={12}
          max={18}
          step={1}
          marks
          valueLabelDisplay="auto"
        />
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={settings.expandedView}
              onChange={(e) => handleSettingChange('expandedView', e.target.checked)}
            />
          }
          label="Chế độ xem mở rộng (mặc định)"
        />
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 2 }}>
          Hiển thị chi tiết hơn cho mỗi ghi chú
        </Typography>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="subtitle1" gutterBottom>
        Hiển thị và sắp xếp
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={settings.showDeadline}
              onChange={(e) => handleSettingChange('showDeadline', e.target.checked)}
            />
          }
          label="Hiển thị deadline"
        />
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <FormControl fullWidth size="small">
          <InputLabel id="sort-by-label">Sắp xếp theo</InputLabel>
          <Select
            labelId="sort-by-label"
            value={settings.sortBy}
            label="Sắp xếp theo"
            onChange={(e) => handleSettingChange('sortBy', e.target.value as typeof settings.sortBy)}
          >
            <MenuItem value="createdAt">Ngày tạo</MenuItem>
            <MenuItem value="deadline">Deadline</MenuItem>
            <MenuItem value="title">Tiêu đề</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <FormControl fullWidth size="small">
          <InputLabel id="sort-direction-label">Thứ tự sắp xếp</InputLabel>
          <Select
            labelId="sort-direction-label"
            value={settings.sortDirection}
            label="Thứ tự sắp xếp"
            onChange={(e) => handleSettingChange('sortDirection', e.target.value as typeof settings.sortDirection)}
          >
            <MenuItem value="asc">Tăng dần</MenuItem>
            <MenuItem value="desc">Giảm dần</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      <Collapse in={saveNotification}>
        <Alert severity="success" sx={{ mt: 2 }}>
          Cài đặt đã được lưu!
        </Alert>
      </Collapse>
    </Box>
  );
};

export default NotesSettingPanel;