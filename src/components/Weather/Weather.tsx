import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  useTheme,
  Tabs,
  Tab,
  Tooltip,
  Collapse,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import RefreshIcon from "@mui/icons-material/Refresh";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useWeatherSettings } from "../../hooks/useSettings";
import { fetchForecastData, getEmojiByWeather } from "../../utils/weatherUtils";
import { type WeatherData, type WeatherStorage } from "../../constants/Weather";
import "./Weather.css";

const Weather: React.FC = React.memo(() => {
  const theme = useTheme();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<WeatherStorage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDay, setCurrentDay] = useState(0);
  const [currentHourlyIndex, setCurrentHourlyIndex] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expanded, setExpanded] = useState(false); 
  const { weatherSettings } = useWeatherSettings();

  const settings = useMemo(
    () => ({
      enable: weatherSettings?.enable !== undefined ? weatherSettings.enable : true,
      location:
        weatherSettings?.location || localStorage.getItem("weatherLocation") || "Hồ Chí Minh",
      tempScale: weatherSettings?.tempScale || localStorage.getItem("tempatureScale") || "C",
      refreshInterval: weatherSettings?.refreshInterval || 30,
      fontSize: weatherSettings?.fontSize || 14,
    }),
    [weatherSettings]
  );

  const fontSizes = useMemo(
    () => ({
      location: settings.fontSize,
      date: settings.fontSize - 2,
      emoji: `${settings.fontSize * 2.5}px`,
      temperature: settings.fontSize + 6,
      weather: settings.fontSize - 1,
      humidity: settings.fontSize - 2,
      tabLabel: settings.fontSize - 4,
      hourTime: settings.fontSize - 4,
      hourTemp: settings.fontSize - 3,
      caption: settings.fontSize - 5,
    }),
    [settings.fontSize]
  );

  const weatherBackgroundStyle = useMemo(() => ({
    background: "transparent",
    backdropFilter: "blur(10px)",
    backgroundColor: "transparent"
  }), []);

  const formatDate = useCallback((date: Date) => {
    return date.toLocaleDateString("vi-VN", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
    });
  }, []);

  const fetchWeather = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const hourIndex = Math.trunc(new Date().getHours() / 3);

      const data = await fetchForecastData(settings.location, hourIndex, settings.tempScale);

      if (!data || !data.data || data.data.length === 0 || !data.data[0].detail) {
        throw new Error("Invalid weather data received");
      }

      setForecastData(data);
      setWeatherData(data.data[0].detail[hourIndex]);
      setCurrentHourlyIndex(hourIndex);
      setCurrentDay(0);
      setError(null);
    } catch (err: any) {
      setError(`Failed to fetch weather data: ${err.message || "Unknown error"}`);
      console.error("Error fetching weather data:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [settings.location, settings.tempScale]);

  const updateWeatherData = useCallback((day: number, hourIndex: number) => {
    if (forecastData && forecastData.data[day] && forecastData.data[day].detail[hourIndex]) {
      setWeatherData(forecastData.data[day].detail[hourIndex]);
    }
  }, [forecastData]);

  useEffect(() => {
    if (settings.enable) {
      fetchWeather();
      const intervalId = setInterval(fetchWeather, settings.refreshInterval * 60 * 1000);
      return () => clearInterval(intervalId);
    }
  }, [settings.enable, settings.refreshInterval, fetchWeather]);

  if (!settings.enable) {
    return null;
  }

  return (
    <Card
      className="weather-widget"
      sx={{
        borderRadius: 2,
        width: "100%",
        boxShadow: 2,
        height: "100%",
        maxHeight: expanded ? "600px" : "190px", 
        minHeight: expanded ? "400px" : "190px",
        ...weatherBackgroundStyle,
      }}
    >
      <CardContent
        sx={{
          p: expanded ? 1.5 : 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          opacity: isRefreshing && !loading ? 0.7 : 1,
          transition: "opacity 0.3s ease, max-height 0.3s ease, padding 0.3s ease",
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress color="primary" size={36} />
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: fontSizes.date }}>
              Loading weather data...
            </Typography>
          </Box>
        ) : error ? (
          <Alert
            severity="error"
            sx={{ width: "100%" }}
            action={
              <IconButton color="inherit" size="small" onClick={fetchWeather}>
                <RefreshIcon fontSize="small" />
              </IconButton>
            }
          >
            {error}
          </Alert>
        ) : weatherData && forecastData ? (
          <>
            <Box
              sx={{ 
                display: "flex", 
                justifyContent: "space-between", 
                mb: expanded ? 1 : 0.5, 
                alignItems: "center"
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <LocationOnIcon fontSize="small" sx={{ mr: 0.5, fontSize: fontSizes.location }} />
                <Typography
                  variant="subtitle1"
                  fontWeight="medium"
                  noWrap
                  sx={{ maxWidth: "180px", fontSize: fontSizes.location }}
                  title={weatherData.location}
                >
                  {weatherData.location}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                {expanded && (
                  <Tooltip title="Refresh weather data">
                    <IconButton
                      size="small"
                      onClick={fetchWeather}
                      aria-label="refresh"
                      className={isRefreshing ? "rotating" : ""}
                      disabled={isRefreshing}
                      sx={{ padding: 0.5, mr: 0.5 }}
                    >
                      <RefreshIcon sx={{ fontSize: fontSizes.location }} />
                    </IconButton>
                  </Tooltip>
                )}
                
                <Tooltip title={expanded ? "Collapse" : "Show more"}>
                  <IconButton
                    size="small"
                    onClick={() => setExpanded(!expanded)}
                    aria-label={expanded ? "collapse" : "expand"}
                    sx={{ padding: 0.5 }}
                  >
                    {expanded ? (
                      <ExpandLessIcon sx={{ fontSize: fontSizes.location }} />
                    ) : (
                      <ExpandMoreIcon sx={{ fontSize: fontSizes.location }} />
                    )}
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {expanded && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1, fontSize: fontSizes.date }}
              >
                {formatDate(new Date(forecastData.updatedTime))}
              </Typography>
            )}

            <Box
              sx={{
                textAlign: "center",
                py: expanded ? 1.5 : 0.75,
                mb: expanded ? 1.5 : 0,
                borderRadius: 2,
                backgroundColor: expanded 
                  ? (theme.palette.mode === "dark" ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)")
                  : "transparent",
                boxShadow: expanded ? "inset 0 0 10px rgba(0,0,0,0.05)" : "none",
              }}
            >
              <Typography sx={{ fontSize: fontSizes.emoji, lineHeight: 1.2, mb: 0.5 }}>
                {getEmojiByWeather(weatherData.weather)}
              </Typography>

              <Typography fontWeight="bold" sx={{ fontSize: fontSizes.temperature, mb: 0.5 }}>
                {weatherData.tempature}
              </Typography>

              <Typography sx={{ mb: 0.5, fontSize: fontSizes.weather }}>
                {weatherData.weather}
              </Typography>

              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <WaterDropIcon sx={{ mr: 0.5, fontSize: fontSizes.humidity }} />
                  <Typography sx={{ fontSize: fontSizes.humidity }}>
                    {weatherData.humidity}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Collapse in={expanded} sx={{ flexGrow: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  overflowX: "auto",
                  pb: 0.5,
                  mt: 1.5,
                  "&::-webkit-scrollbar": {
                    height: 4,
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "rgba(0,0,0,0.2)",
                    borderRadius: 2,
                  },
                  flexGrow: 0,
                  mb: 1
                }}
              >
                <Box sx={{ display: "flex", gap: 0.5, minWidth: "max-content" }}>
                  {forecastData.data[0].detail.map((hourData, index) => (
                    <Box
                      key={index}
                      onClick={() => {
                        setCurrentHourlyIndex(index);
                        updateWeatherData(0, index);
                      }}
                      sx={{
                        p: 0.5,
                        textAlign: "center",
                        borderRadius: 1,
                        cursor: "pointer",
                        backgroundColor: 
                          (index === currentHourlyIndex && currentDay === 0)
                            ? theme.palette.primary.main + "33" 
                            : "transparent",
                        "&:hover": {
                          backgroundColor: theme.palette.action.hover,
                          transform: "translateY(-2px)",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        },
                        transition: "all 0.2s ease",
                        minWidth: 60,
                        flexShrink: 0,
                      }}
                    >
                      <Typography fontWeight="medium" sx={{ fontSize: fontSizes.hourTime }}>
                        {hourData.updatedAt}
                      </Typography>

                      <Typography sx={{ my: 0.5, fontSize: fontSizes.emoji }}>
                        {getEmojiByWeather(hourData.weather)}
                      </Typography>

                      <Typography fontWeight="bold" sx={{ fontSize: fontSizes.hourTemp }}>
                        {hourData.tempature}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          mt: 0.3,
                        }}
                      >
                        <WaterDropIcon sx={{ mr: 0.25, fontSize: fontSizes.caption }} />
                        <Typography sx={{ fontSize: fontSizes.caption }}>
                          {hourData.humidity}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 0.5,
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => {
                    if (currentDay > 0) {
                      const newDay = currentDay - 1;
                      setCurrentDay(newDay);
                      updateWeatherData(newDay, currentHourlyIndex);
                    }
                  }}
                  disabled={currentDay === 0}
                  sx={{ padding: 0.3 }}
                >
                  <ArrowBackIosIcon sx={{ fontSize: fontSizes.humidity }} />
                </IconButton>

                <IconButton
                  size="small"
                  onClick={() => {
                    if (forecastData && currentDay < forecastData.data.length - 1) {
                      const newDay = currentDay + 1;
                      setCurrentDay(newDay);
                      updateWeatherData(newDay, currentHourlyIndex);
                    }
                  }}
                  disabled={!forecastData || currentDay >= forecastData.data.length - 1}
                  sx={{ padding: 0.3 }}
                >
                  <ArrowForwardIosIcon sx={{ fontSize: fontSizes.humidity }} />
                </IconButton>
              </Box>

              <Tabs
                value={currentDay}
                onChange={(_, newValue) => {
                  setCurrentDay(newValue);
                  updateWeatherData(newValue, currentHourlyIndex);
                }}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  mb: 1,
                  minHeight: 28,
                  "& .MuiTab-root": {
                    minHeight: 28,
                    py: 0.3,
                    minWidth: 60,
                  },
                }}
              >
                {forecastData.data.map((_, index) => {
                  const date = new Date(forecastData.updatedTime);
                  date.setDate(date.getDate() + index);

                  return (
                    <Tab
                      key={index}
                      label={index === 0 ? "Today" : formatDate(date)}
                      sx={{ fontSize: fontSizes.tabLabel }}
                    />
                  );
                })}
              </Tabs>

              {currentDay > 0 && (
                              <Box
                sx={{
                  display: "flex",
                  overflowX: "auto",
                  pb: 0.5,
                  "&::-webkit-scrollbar": {
                    height: 4,
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "rgba(0,0,0,0.2)",
                    borderRadius: 2,
                  },
                }}
              >
                <Box sx={{ display: "flex", gap: 0.5, minWidth: "max-content" }}>
                  {forecastData.data[currentDay].detail.map((hourData, index) => (
                    <Box
                      key={index}
                      onClick={() => {
                        setCurrentHourlyIndex(index);
                        updateWeatherData(currentDay, index);
                      }}
                      sx={{
                        p: 0.5,
                        textAlign: "center",
                        borderRadius: 1,
                        cursor: "pointer",
                        backgroundColor:
                          index === currentHourlyIndex
                            ? theme.palette.primary.main + "33" // 20% opacity
                            : "transparent",
                        "&:hover": {
                          backgroundColor: theme.palette.action.hover,
                          transform: "translateY(-2px)",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        },
                        transition: "all 0.2s ease",
                        minWidth: 60,
                        flexShrink: 0,
                      }}
                    >
                      <Typography fontWeight="medium" sx={{ fontSize: fontSizes.hourTime }}>
                        {hourData.updatedAt}
                      </Typography>

                      <Typography sx={{ my: 0.5, fontSize: fontSizes.emoji }}>
                        {getEmojiByWeather(hourData.weather)}
                      </Typography>

                      <Typography fontWeight="bold" sx={{ fontSize: fontSizes.hourTemp }}>
                        {hourData.tempature}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          mt: 0.3,
                        }}
                      >
                        <WaterDropIcon sx={{ mr: 0.25, fontSize: fontSizes.caption }} />
                        <Typography sx={{ fontSize: fontSizes.caption }}>
                          {hourData.humidity}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
              )}
              
              <Box sx={{ mt: "auto", pt: 0.5, textAlign: "right" }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: fontSizes.caption }}
                >
                  Updated: {new Date(forecastData.updatedTime).toLocaleTimeString("vi-VN")}
                </Typography>
              </Box>
            </Collapse>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
});

export default Weather;