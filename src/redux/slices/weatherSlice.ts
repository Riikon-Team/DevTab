import { WeatherData, WeatherStorage } from "@/constants/Weather";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WeatherSlice {
    weatherData: WeatherData | null,
    weatherStorage: WeatherStorage | null,
    currentHourlyIndex: number,
    currentDay: number
}

const initialState: WeatherSlice = {
    weatherData: null,
    weatherStorage: null,
    currentHourlyIndex: 0,
    currentDay: 0
}

const weatherSlice = createSlice({
    name: 'weather',
    initialState,
    reducers: {
        setWeatherData: (state, action: PayloadAction<WeatherData>) => {
            state.weatherData = action.payload
        },
        setWeatherStorage: (state, action: PayloadAction<WeatherStorage>) => {
            state.weatherStorage = action.payload
        },
        setHourlyIndex: (state, action: PayloadAction<number>) => {
            state.currentHourlyIndex = action.payload
        },
        setCurrentDay: (state, action: PayloadAction<number>) => {
            state.currentDay = action.payload
        },
    }
})

export const { setWeatherData, setWeatherStorage, setCurrentDay, setHourlyIndex } = weatherSlice.actions
export default weatherSlice.reducer