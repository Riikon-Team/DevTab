import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Switch, 
  FormControlLabel, 
  Box, 
  Button, 
  Typography,
  Chip,
  Slider,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import FormatSizeIcon from '@mui/icons-material/FormatSize';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import BlurOnIcon from '@mui/icons-material/BlurOn';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useGithubSettings } from '../../hooks/useSettings';

const Githubv2SettingPanel: React.FC = () => {
  const { githubSettings, updateGithubSettings } = useGithubSettings();
  
  // Adjust default values
  const settings = {
    username: githubSettings?.username ?? "",
    showUserInfo: githubSettings?.showUserInfo ?? true,
    showLanguageStats: githubSettings?.showLanguageStats ?? true,
    showStats: githubSettings?.showStats ?? true,
    showCommitActivity: githubSettings?.showCommitActivity ?? true,
    cacheDurationMinutes: githubSettings?.cacheDurationMinutes ?? 10,
    excludedLanguages: githubSettings?.excludedLanguages ?? [],
    fontSize: githubSettings?.fontSize ?? 15,
    compactMode: githubSettings?.compactMode ?? false,
    chartSize: githubSettings?.chartSize ?? 260, 
    blur: githubSettings?.blur ?? 10,
    backgroundTransparent: githubSettings?.backgroundTransparent ?? true
  };
  
  const [newLanguage, setNewLanguage] = useState('');
  const [newUsername, setNewUsername] = useState(settings.username);
  const [showSuccess, setShowSuccess] = useState(false);
  
  useEffect(() => {
    if (!settings.username) {
      const storedUsername = localStorage.getItem('github_username');
      if (storedUsername) {
        setNewUsername(storedUsername);
      }
    } else {
      setNewUsername(settings.username);
    }
  }, [settings.username]);
  
  useEffect(() => {
    if (settings.username && settings.username !== newUsername) {
      setNewUsername(settings.username);
    }
  }, [githubSettings, settings.username, newUsername]);
  
  const handleAddExcludedLanguage = () => {
    if (newLanguage.trim() && !settings.excludedLanguages.includes(newLanguage.trim())) {
      updateGithubSettings({ 
        excludedLanguages: [...settings.excludedLanguages, newLanguage.trim()] 
      });
      setNewLanguage('');
    }
  };
  
  const handleRemoveExcludedLanguage = (language: string) => {
    updateGithubSettings({
      excludedLanguages: settings.excludedLanguages.filter(lang => lang !== language)
    });
  };
  
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddExcludedLanguage();
    }
  };
  
  const handleUsernameUpdate = () => {
    if (newUsername.trim() !== settings.username) {
      updateGithubSettings({ username: newUsername.trim() });
      localStorage.setItem('github_username', newUsername.trim());
      
      if (settings.username) {
        localStorage.removeItem(`github_data_${settings.username}`);
      }
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };
  
  const handleClearCache = () => {
    if (settings.username) {
      localStorage.removeItem(`github_data_${settings.username}`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };
  
  return (
    <div className="settings-content">
      <Box className="github-settings-grid" >
        <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 2, backgroundColor: 'transparent' }}>
          <Typography variant="h6" gutterBottom>User Configuration</Typography>
          <Divider sx={{ mb: 2 }} />
          
          {showSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Changes saved successfully! Refresh to see updates.
            </Alert>
          )}

          <Box sx={{ mb: 2 }}>
            <Switch
              checked={githubSettings?.enable ?? false}
              onChange={(e) => updateGithubSettings({ enable: e.target.checked })}
              color="primary"
              size="small"
              id='enable-github-integration'
            />
            <label htmlFor='enable-github-integration'>
              Enable GitHub Integration
            </label>
          </Box>

          <Box sx={{ mb: 3 }}>
            <TextField
              label="GitHub Username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              fullWidth
              size="small"
              margin="normal"
              helperText="Enter your GitHub username"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleUsernameUpdate}
                      disabled={!newUsername.trim() || newUsername.trim() === settings.username}
                    >
                      Update
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
            
            {!settings.username && (
              <Alert severity="info" sx={{ mt: 1 }}>
                Please set a GitHub username to view statistics
              </Alert>
            )}
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography gutterBottom>Cache Duration (minutes)</Typography>
            <Slider
              value={settings.cacheDurationMinutes}
              onChange={(_, value) => 
                updateGithubSettings({ cacheDurationMinutes: Math.max(1, value as number) })
              }
              min={1}
              max={60}
              step={1}
              marks={[
                { value: 1, label: '1m' },
                { value: 10, label: '10m' },
                { value: 30, label: '30m' },
                { value: 60, label: '60m' },
              ]}
              valueLabelDisplay="auto"
            />
            
            <Button
              variant="outlined"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={handleClearCache}
              sx={{ mt: 1 }}
            >
              Clear Cache
            </Button>
          </Box>
        </Paper>
        
        {/* Appearance Settings */}
        <Paper elevation={0} sx={{ 
          p: 2, 
          mb: 3, 
          borderRadius: 2,
          backgroundColor: 'transparent',
        }}>
          <Typography variant="h6" gutterBottom>Appearance</Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom display="flex" alignItems="center">
              <FormatSizeIcon fontSize="small" sx={{ mr: 1 }} />
              Font Size
            </Typography>
            <Slider
              value={settings.fontSize}
              onChange={(_, value) => 
                updateGithubSettings({ fontSize: value as number })
              }
              min={12}
              max={18}
              step={1}
              marks={[
                { value: 12, label: 'S' },
                { value: 14, label: 'M' },
                { value: 16, label: 'L' },
                { value: 18, label: 'XL' },
              ]}
              valueLabelDisplay="auto"
            />
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom display="flex" alignItems="center">
              <AspectRatioIcon fontSize="small" sx={{ mr: 1 }} />
              Chart Size
            </Typography>
            <Slider
              value={settings.chartSize}
              onChange={(_, value) => 
                updateGithubSettings({ chartSize: value as number })
              }
              min={180}
              max={350}
              step={10}
              marks={[
                { value: 180, label: 'XS' },
                { value: 220, label: 'S' },
                { value: 250, label: 'M' },
                { value: 300, label: 'L' },
                { value: 350, label: 'XL' },
              ]}
              valueLabelDisplay="auto"
            />
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.compactMode}
                  onChange={(e) => updateGithubSettings({ compactMode: e.target.checked })}
                />
              }
              label="Compact Mode"
            />
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.backgroundTransparent}
                  onChange={(e) => updateGithubSettings({ backgroundTransparent: e.target.checked })}
                />
              }
              label="Transparent Background"
            />
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom display="flex" alignItems="center">
              <BlurOnIcon fontSize="small" sx={{ mr: 1 }} />
              Background Blur
            </Typography>
            <Slider
              value={settings.blur}
              onChange={(_, value) => 
                updateGithubSettings({ blur: value as number })
              }
              disabled={!settings.backgroundTransparent}
              min={0}
              max={20}
              step={1}
              marks={[
                { value: 0, label: '0' },
                { value: 10, label: '10' },
                { value: 20, label: '20' },
              ]}
              valueLabelDisplay="auto"
            />
          </Box>
        </Paper>
        
        {/* Display Components */}
        <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 2, backgroundColor: 'transparent' }}>
          <Typography variant="h6" gutterBottom display="flex" alignItems="center">
            <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
            Component Visibility
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <FormControlLabel
            control={
              <Switch
                checked={settings.showUserInfo}
                onChange={(e) => updateGithubSettings({ showUserInfo: e.target.checked })}
              />
            }
            label="Show User Information"
          />
          
          <FormControlLabel
            control={
              <Switch
                checked={settings.showLanguageStats}
                onChange={(e) => updateGithubSettings({ showLanguageStats: e.target.checked })}
              />
            }
            label="Show Language Statistics"
          />
          
          <FormControlLabel
            control={
              <Switch
                checked={settings.showStats}
                onChange={(e) => updateGithubSettings({ showStats: e.target.checked })}
              />
            }
            label="Show GitHub Statistics"
          />
          
          <FormControlLabel
            control={
              <Switch
                checked={settings.showCommitActivity}
                onChange={(e) => updateGithubSettings({ showCommitActivity: e.target.checked })}
              />
            }
            label="Show Commit Activity"
          />
        </Paper>
        
        {/* Language Filters */}
        <Paper elevation={0} sx={{ p: 2, borderRadius: 2, backgroundColor: 'transparent' }}>
          <Typography variant="h6" gutterBottom>Language Filters</Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Add languages you want to exclude from the language statistics
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <TextField
              label="Exclude Language"
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              size="small"
              fullWidth
              onKeyDown={handleKeyDown}
              helperText="Press Enter to add"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={handleAddExcludedLanguage}
                      disabled={!newLanguage.trim()}
                    >
                      <AddIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {settings.excludedLanguages.map((language) => (
              <Chip
                key={language}
                label={language}
                onDelete={() => handleRemoveExcludedLanguage(language)}
                deleteIcon={<DeleteIcon />}
                size="small"
              />
            ))}
            
            {settings.excludedLanguages.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                No excluded languages
              </Typography>
            )}
          </Box>
        </Paper>
      </Box>
    </div>
  );
};

export default Githubv2SettingPanel;