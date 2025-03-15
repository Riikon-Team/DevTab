export interface WeatherData {
    location: string,
    weather: string,
    tempature: string,
    humidity: string,
    updatedAt: string
}

export interface WeatherContent {
    detail: WeatherData[]
}

export interface WeatherStorage {
    location: string,
    data: WeatherContent[],
    updatedTime: Date,
    tempatureScale: string
}