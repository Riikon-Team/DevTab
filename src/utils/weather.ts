import type { WeatherData } from "@/constants/weather"

export default function getForecastData(location: string, index: number, hourlyIndex: number) {
    return fetch(`https://wttr.in/${location}?format=j1&`)
        .then(data => data.json())
        .then(data => {
            const result: WeatherData[] = []
            for (const element of data['weather'][index]['hourly']) {
                result.push({
                    location: data['nearest_area'][index]['areaName'][0]['value'],
                    weather: element['weatherDesc'][0]['value'],
                    tempature: element["tempC"] + "°C",
                    humidity: element["humidity"] + "%",
                    updatedAt: (hourlyIndex * 3) + ":00"
                })
            }
            return result
        })
}