import React from "react";
import {
  Slider,
  TextField,
  FormControl,
  FormControlLabel,
  Checkbox,
  Card,
  CardMedia,
  CardContent,
  Switch,
  Select,
  MenuItem,
  InputLabel,
  Grid,
} from "@mui/material";
import { useBackgroundSettings } from "../../hooks/useSettings";
import { IMAGE_LIST } from "../../constants/Background";
import "./BackgroundSettings.css";

const BackgroundSettingsPanel: React.FC = () => {
  const { backgroundSettings, updateBackgroundSettings } = useBackgroundSettings();
  const handleImageToggle = (imagePath: string) => {
    const currentSelected = [...backgroundSettings.selectedImages];

    if (currentSelected.includes(imagePath)) {
      const filtered = currentSelected.filter((path) => path !== imagePath);
      updateBackgroundSettings({
        selectedImages: filtered.length > 0 ? filtered : [imagePath],
      });
    } else {
      updateBackgroundSettings({
        selectedImages: [...currentSelected, imagePath],
      });
    }
  };

  const handleCustomUrlChange = (url: string) => {
    if (url.trim()) {
      updateBackgroundSettings({
        customUrl: url,
        currentImage: url,
      });
    } else {
      updateBackgroundSettings({
        customUrl: "",
        currentImage: "",
      });
    }
  };

  return (
    <div className="background-settings">
      <div className="setting-item">
        <label htmlFor="brightness">Brightness</label>
        <Slider
          id="brightness"
          value={backgroundSettings.brightness}
          onChange={(_, value) => updateBackgroundSettings({ brightness: value as number })}
          min={0.1}
          max={1}
          step={0.1}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
          sx={{ width: "150px" }}
        />
      </div>

      <div className="setting-item">
        <FormControlLabel
          control={
            <Switch
              checked={backgroundSettings.enableGyro}
              onChange={(e) => updateBackgroundSettings({ enableGyro: e.target.checked })}
            />
          }
          label="Enable Parallax Effect"
        />
      </div>

      {backgroundSettings.enableGyro && (
        <div className="setting-item">
          <label htmlFor="gyro-sensitivity">Parallax Sensitivity</label>
          <Slider
            id="gyro-sensitivity"
            value={backgroundSettings.gyroSensitivity}
            onChange={(_, value) => updateBackgroundSettings({ gyroSensitivity: value as number })}
            min={1}
            max={10}
            step={1}
            valueLabelDisplay="auto"
            sx={{ width: "150px" }}
          />
        </div>
      )}

      <div className="setting-item content-type-selector">
        <FormControl fullWidth size="small">
          <InputLabel id="content-type-label">Content Type</InputLabel>
          <Select
            labelId="content-type-label"
            id="content-type"
            value={backgroundSettings.contentType}
            label="Content Type"
            onChange={(e) =>
              updateBackgroundSettings({
                contentType: e.target.value as "image" | "video",
                // Reset customUrl and currentImage when changing content type
                customUrl: "",
                currentImage: "",
              })
            }
          >
            <MenuItem value="image">Image</MenuItem>
            <MenuItem value="video">Video</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div className="setting-item">
        <TextField
          id="custom-url"
          label={`Custom ${backgroundSettings.contentType === "image" ? "Image" : "Video"} URL`}
          value={backgroundSettings.customUrl}
          onChange={(e) => handleCustomUrlChange(e.target.value)}
          placeholder={`Enter ${
            backgroundSettings.contentType === "image" ? "image" : "video"
          } URL`}
          size="small"
          fullWidth
        />
      </div>

      {backgroundSettings.contentType === "image" && (
        <>
          <div className="setting-label">Available Images</div>
          <div className="image-gallery">
            <Grid container spacing={2}>
              {IMAGE_LIST.map((image, index) => (
                <Grid item xs={4} key={index}>
                  <Card
                    className={`image-card ${
                      backgroundSettings.selectedImages.includes(image) ? "selected" : ""
                    } ${backgroundSettings.currentImage === image ? "current" : ""}`}
                  >
                    <CardMedia
                      component="img"
                      height="80"
                      image={image}
                      alt={`Background ${index + 1}`}
                    />
                    <CardContent className="image-card-content">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={backgroundSettings.selectedImages.includes(image)}
                            onChange={() => handleImageToggle(image)}
                            size="small"
                          />
                        }
                        label={`BG ${index + 1}`}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </div>
        </>
      )}
    </div>
  );
};

export default BackgroundSettingsPanel;
