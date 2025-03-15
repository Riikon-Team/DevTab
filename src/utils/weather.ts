import type { WeatherData, WeatherContent } from "@/constants/weather"

async function fetchForecastData(location: string, hourlyIndex: number, scale: string) {
    const data = localStorage.getItem('weatherData')
    const jsonData = data ? JSON.parse(data) : null

    if (!jsonData || new Date(jsonData.updatedTime).getDate() !== new Date().getDate() || location !== jsonData.location || jsonData.tempatureScale !== scale) {
        return fetch(`https://wttr.in/${location}?format=j1&`)
            .then(data => data.json())
            .then(data => {
                let result: WeatherData[] = []
                //Temporary code
                const jsonContent = {
                    'location': location,
                    'data': [] as WeatherContent[],
                    'updatedTime': new Date(),
                    'tempatureScale': scale
                }
                for (const detail of data['weather']) {
                    result = []
                    for (const element of detail['hourly']) {
                        result.push({
                            location: data['nearest_area'][0]['areaName'][0]['value'],
                            weather: element['weatherDesc'][0]['value'],
                            tempature: element[scale === 'C' ? "tempC": "tempF"] + (scale === 'C' ? "°C" :  "°F"),
                            humidity: element["humidity"] + "%",
                            updatedAt: (hourlyIndex * 3) + ":00"
                        })
                    }
                    jsonContent.data.push({ detail: result })
                }
                localStorage.setItem('weatherData', JSON.stringify(jsonContent))

                return jsonContent
            })
    }
    else return await jsonData
}

// Get only forecast data by index
export default async function getForecastData(location: string, index: number, hourlyIndex: number, scale: string) {
    const jsonData = await fetchForecastData(location, hourlyIndex, scale)
    return jsonData['data'][index]['detail']
}

// Get the whole forecast detail
export async function getFullForecastData(location: string, hourlyIndex: number, scale: string) {
    return await fetchForecastData(location, hourlyIndex, scale)
}


// Get emoji by weather to display on web
export function getEmojiByWeather(weather: string): string {
    if (!weather) return '❓'

    const weatherPattern = [
        { 'pattern': 'CLEAR', 'emoji': '☀️' },
        { 'pattern': 'SUNNY', 'emoji': '☀️' },
        { 'pattern': 'CLOUD', 'emoji': '☁️' },
        { 'pattern': 'OVERCAST', 'emoji': '☁️' },
        { 'pattern': 'RAIN', 'emoji': '🌧️' },
        { 'pattern': 'HEAVY RAIN', 'emoji': '⛈️' },
        { 'pattern': 'STORM', 'emoji': '🌀' },
        { 'pattern': 'SNOW', 'emoji': '❄️' },
        { 'pattern': 'BLIZZARD', 'emoji': '❄️' },
        { 'pattern': 'MIST', 'emoji': '🌫️' },
        { 'pattern': 'FOG', 'emoji': '🌫️' },
        { 'pattern': 'DRIZZLE', 'emoji': '🌦️' }
    ]

    const mapConverter = new Map()
    weatherPattern.forEach(element => {
        mapConverter.set(weather.indexOf(element.pattern) !== -1, element.emoji)
    })

    return mapConverter.get(true) || '❓'
}