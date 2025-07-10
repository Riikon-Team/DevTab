import React, { useState, useEffect, useMemo } from 'react';
import { 
  Box, 
  TextField, 
  Typography, 
  Switch, 
  FormControlLabel, 
  Slider, 
  InputAdornment,
  RadioGroup,
  Radio,
  FormControl,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  Button,
  Collapse
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import TimerIcon from '@mui/icons-material/Timer';
import FormatSizeIcon from '@mui/icons-material/FormatSize';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useWeatherSettings } from '../../hooks/useSettings';

// List of common cities
const POPULAR_CITIES = [
  "Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Huế", "Nha Trang",
  "London", "New York", "Tokyo", "Paris", "Sydney"
];

const WeatherSettingPanel: React.FC = () => {
  const { weatherSettings, updateWeatherSettings } = useWeatherSettings();
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [saveNotification, setSaveNotification] = useState(false);
  
  // Fallback to default values if settings don't exist
  const defaultSettings = useMemo(() => ({
    enable: weatherSettings?.enable !== undefined ? weatherSettings.enable : true,
    location: weatherSettings?.location || localStorage.getItem('weatherLocation') || "Hồ Chí Minh",
    tempScale: (weatherSettings?.tempScale || localStorage.getItem('tempatureScale') || "C") as 'C' | 'F',
    refreshInterval: weatherSettings?.refreshInterval || 30,
    backgroundTransparent: true, // Default is transparent
    fontSize: weatherSettings?.fontSize || 14
  }), [weatherSettings]);
  
  // Handle getting current location
  const handleGetCurrentLocation = () => {
    setIsGettingLocation(true);
    setLocationError(null);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = `${position.coords.latitude},${position.coords.longitude}`;
          updateWeatherSettings({ location: coords });
          setIsGettingLocation(false);
          showSaveNotification();
        },
        (error) => {
          setLocationError(`Error getting location: ${error.message}`);
          setIsGettingLocation(false);
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser');
      setIsGettingLocation(false);
    }
  };
  
  // Handle city selection
  const handleCitySelect = (city: string) => {
    updateWeatherSettings({ location: city });
    showSaveNotification();
  };
  
  // Show save notification briefly
  const showSaveNotification = () => {
    setSaveNotification(true);
    setTimeout(() => setSaveNotification(false), 2000);
  };
  
  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h6" gutterBottom fontWeight="500">
        Weather Settings
      </Typography>
      
      <Divider sx={{ mb: 3 }} />
      
      <Collapse in={saveNotification}>
        <Alert 
          severity="success" 
          sx={{ mb: 2 }}
          onClose={() => setSaveNotification(false)}
        >
          Settings saved!
        </Alert>
      </Collapse>
      
      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom display="flex" alignItems="center" fontWeight="500">
          <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
          Display Settings
        </Typography>
        
        <FormControlLabel
          control={
            <Switch
              checked={defaultSettings.enable}
              onChange={(e) => updateWeatherSettings({ enable: e.target.checked })}
            />
          }
          label="Enable"
        />
      </Box>
      
      <Collapse in={defaultSettings.enable}>
        <Box sx={{ mb: 3 }}>
          <Typography gutterBottom display="flex" alignItems="center" fontWeight="500">
            <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
            Location
          </Typography>
          
          <TextField
            fullWidth
            value={defaultSettings.location}
            onChange={(e) => {
              updateWeatherSettings({ location: e.target.value });
            }}
            onBlur={showSaveNotification}
            placeholder="Enter city name or coordinates"
            size="small"
            margin="dense"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton 
                    onClick={handleGetCurrentLocation}
                    disabled={isGettingLocation}
                    size="small"
                    color="primary"
                  >
                    {isGettingLocation ? (
                      <CircularProgress size={20} />
                    ) : (
                      <MyLocationIcon fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          {locationError && (
            <Alert severity="error" sx={{ mt: 1 }} onClose={() => setLocationError(null)}>
              {locationError}
            </Alert>
          )}
          
          {/* Popular Cities */}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 0.5 }}>
            Popular cities:
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
            {POPULAR_CITIES.map((city) => (
              <Button 
                key={city} 
                size="small" 
                variant={defaultSettings.location === city ? "contained" : "outlined"}
                onClick={() => handleCitySelect(city)}
                sx={{ 
                  borderRadius: 5, 
                  textTransform: 'none', 
                  fontSize: '0.75rem',
                  minWidth: 'auto'
                }}
              >
                {city}
              </Button>
            ))}
          </Box>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography gutterBottom display="flex" alignItems="center" fontWeight="500">
            <FormatSizeIcon fontSize="small" sx={{ mr: 1 }} />
            Font Size
          </Typography>
          
          <Box sx={{ px: 1 }}>
            <Slider
              value={defaultSettings.fontSize}
              onChange={(_, value) => {
                updateWeatherSettings({ fontSize: value as number });
                showSaveNotification();
              }}
              min={10}
              max={18}
              step={1}
              marks={[
                { value: 10, label: 'Small' },
                { value: 14, label: 'Medium' },
                { value: 18, label: 'Large' },
              ]}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${value}px`}
            />
          </Box>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography gutterBottom display="flex" alignItems="center" fontWeight="500">
            <WbSunnyIcon fontSize="small" sx={{ mr: 1 }} />
            Temperature Scale
          </Typography>
          
          <FormControl component="fieldset">
            <RadioGroup
              row
              value={defaultSettings.tempScale}
              onChange={(e) => {
                updateWeatherSettings({ tempScale: e.target.value as 'C' | 'F' });
                showSaveNotification();
              }}
            >
              <FormControlLabel value="C" control={<Radio />} label="Celsius (°C)" />
              <FormControlLabel value="F" control={<Radio />} label="Fahrenheit (°F)" />
            </RadioGroup>
          </FormControl>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography gutterBottom display="flex" alignItems="center" fontWeight="500">
            <TimerIcon fontSize="small" sx={{ mr: 1 }} />
            Refresh Interval
          </Typography>
          
          <Box sx={{ px: 1 }}>
            <Slider
              value={defaultSettings.refreshInterval}
              onChange={(_, value) => {
                updateWeatherSettings({ refreshInterval: value as number });
                showSaveNotification();
              }}
              min={15}
              max={120}
              step={15}
              marks={[
                { value: 15, label: '15m' },
                { value: 30, label: '30m' },
                { value: 60, label: '1h' },
                { value: 120, label: '2h' },
              ]}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${value} min`}
            />
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

export default WeatherSettingPanel;