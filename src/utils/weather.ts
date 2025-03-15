import type { WeatherData } from "@/constants/weather"

interface WeatherContent {
    detail: WeatherData[]
}

export default async function getForecastData(location: string, index: number, hourlyIndex: number) {
    const data = localStorage.getItem('weatherData')
    const jsonData = data ? JSON.parse(data) : null
    
    if (!jsonData || new Date(jsonData.updatedTime).getDate() !== new Date().getDate()) {
        return fetch(`https://wttr.in/${location}?format=j1&`)
            .then(data => data.json())
            .then(data => {
                let result: WeatherData[] = []
                //Temporary code
                const jsonContent = {
                    'data': [] as WeatherContent[],
                    'updatedTime': new Date()
                }
                for (const detail of data['weather']) {
                    result = []
                    for (const element of detail['hourly']) {
                        result.push({
                            location: data['nearest_area'][0]['areaName'][0]['value'],
                            weather: element['weatherDesc'][0]['value'],
                            tempature: element["tempC"] + "°C",
                            humidity: element["humidity"] + "%",
                            updatedAt: (hourlyIndex * 3) + ":00"
                        })
                    }
                    jsonContent.data.push({detail: result})
                }
                localStorage.setItem('weatherData', JSON.stringify(jsonContent))

                return result
            })
    }
    else return await jsonData['data'][index]['detail']
}

export function getEmojiByWeather(weather: string): string {
    if (!weather) return '❓'

    const weatherPattern = [
        { 'pattern': 'CLEAR', 'emoji': '☀️' },
        { 'pattern': 'SUNNY', 'emoji': '☀️' },
        { 'pattern': 'CLOUD', 'emoji': '☁️' },
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