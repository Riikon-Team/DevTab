import type { WeatherData, WeatherContent, WeatherStorage } from '../constants/Weather';

// Fetch weather data
export const fetchForecastData = async (location: string, hourlyIndex: number, scale: string): Promise<WeatherStorage> => {
  const data = localStorage.getItem('weatherData');
  const jsonData = data ? JSON.parse(data) as WeatherStorage : null;

  if (!jsonData || 
      new Date(jsonData.updatedTime).getDate() !== new Date().getDate() || 
      location !== jsonData.location || 
      jsonData.tempatureScale !== scale) {
    
    try {
      const response = await fetch(`https://wttr.in/${location}?format=j1&`);
      const data = await response.json();
      
      let result: WeatherData[] = [];
      const jsonContent: WeatherStorage = {
        'location': location,
        'data': [] as WeatherContent[],
        'updatedTime': new Date(),
        'tempatureScale': scale
      };
      
      for (const detail of data['weather']) {
        result = [];
        for (const element of detail['hourly']) {
          result.push({
            location: data['nearest_area'][0]['areaName'][0]['value'],
            weather: element['weatherDesc'][0]['value'],
            tempature: element[scale === 'C' ? "tempC": "tempF"] + (scale === 'C' ? "°C" : "°F"),
            humidity: element["humidity"] + "%",
            updatedAt: (Math.floor(parseInt(element["time"]) / 100) || hourlyIndex * 3) + ":00"
          });
        }
        jsonContent.data.push({ detail: result });
      }
      
      localStorage.setItem('weatherData', JSON.stringify(jsonContent));
      return jsonContent;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  } else {
    return jsonData;
  }
};

// Get full forecast data
export const getFullForecastData = async (location: string, hourlyIndex: number, scale: string): Promise<WeatherStorage> => {
  return await fetchForecastData(location, hourlyIndex, scale);
};

// Get emoji by weather condition
export const getEmojiByWeather = (weather: string): string => {
  if (!weather) return '❓';

  const weatherPattern = [
    { pattern: 'CLEAR', emoji: '☀️' },
    { pattern: 'SUNNY', emoji: '☀️' },
    { pattern: 'CLOUD', emoji: '☁️' },
    { pattern: 'OVERCAST', emoji: '☁️' },
    { pattern: 'RAIN', emoji: '🌧️' },
    { pattern: 'HEAVY RAIN', emoji: '⛈️' },
    { pattern: 'STORM', emoji: '🌀' },
    { pattern: 'SNOW', emoji: '❄️' },
    { pattern: 'BLIZZARD', emoji: '❄️' },
    { pattern: 'MIST', emoji: '🌫️' },
    { pattern: 'FOG', emoji: '🌫️' },
    { pattern: 'DRIZZLE', emoji: '🌦️' }
  ];

  for (const item of weatherPattern) {
    if (weather.toUpperCase().includes(item.pattern)) {
      return item.emoji;
    }
  }
  
  return '❓';
};