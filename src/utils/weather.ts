import type { WeatherData } from "@/constants/weather"

export default function getForecastData(location: string, index: number, hourlyIndex: number) {
    return fetch(`https://wttr.in/${location}?format=j1&`)
        .then(data => data.json())
        .then(data => {
            const result: WeatherData[] = []
            for (const element of data['weather'][index]['hourly']) {
                result.push({
                    location: data['nearest_area'][0]['areaName'][0]['value'],
                    weather: element['weatherDesc'][0]['value'],
                    tempature: element["tempC"] + "°C",
                    humidity: element["humidity"] + "%",
                    updatedAt: (hourlyIndex * 3) + ":00"
                })
            }
            return result
        })
}

export function getEmojiByWeather(weather: string): string {
    const weatherPattern = [
        {'pattern': 'CLEAR', 'emoji': '☀️'},
        {'pattern': 'SUNNY', 'emoji': '☀️'},
        {'pattern': 'CLOUD', 'emoji': '☁️'},
        {'pattern': 'RAIN', 'emoji': '🌧️'},
        {'pattern': 'HEAVY RAIN', 'emoji': '⛈️'},
        {'pattern': 'STORM', 'emoji': '🌀'},
        {'pattern': 'SNOW', 'emoji': '❄️'},
        {'pattern': 'BLIZZARD', 'emoji': '❄️'},
        {'pattern': 'MIST', 'emoji': '🌫️'},
        {'pattern': 'FOG', 'emoji': '🌫️'},
    ]

    const mapConverter = new Map()
    weatherPattern.forEach(element => {
        mapConverter.set(weather.indexOf(element.pattern) !== -1, element.emoji)
    })

    return mapConverter.get(true) || '❓'
}