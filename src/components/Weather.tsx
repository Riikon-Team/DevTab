import { defineComponent, onMounted, ref } from "vue";

interface WeatherData {
    location: string,
    weather: string,
    tempature: string,
    humidity: string,
    updatedAt: string
}

export default defineComponent({
    name: 'WeatherWidget',
    setup() {
        const weatherData = ref<WeatherData | null>(null)
        const hourlyIndex = ref<number>(0)
        const loading = ref(true);

        const fetchWeatherData = async (location: string) => {
            return fetch(`https://wttr.in/${location}?format=j1&`)
                .then(data => data.json())
                .then(data => data)
        }
                
        const getForecastData = (location: string, index: number) => {
            return fetchWeatherData(location)
                .then(data => {
                    const result: WeatherData[] = []
                    hourlyIndex.value = Math.trunc(new Date().getHours() / 3)
                    for (const element of data['weather'][index]['hourly']) {
                        result.push({
                            location: data['nearest_area'][index]['areaName'][0]['value'],
                            weather: element['weatherDesc'][0]['value'],
                            tempature: element["tempC"] + "°C",
                            humidity: element["humidity"] + "%",
                            updatedAt: (hourlyIndex.value * 3) + ":00"
                        })
                    }
                    return result
                })
        }

        onMounted(async () => {
            //Default value just for testing
            const currentWeatherDetail: WeatherData[] = await getForecastData('Hồ Chí Minh', 0).finally(() => loading.value = false)
            weatherData.value = currentWeatherDetail[hourlyIndex.value]
        })

        return () => (
            <div class="text-white">
                {loading.value ? (
                    <div class="text-center">
                        <div class="spinner-border text-light" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : weatherData.value ? (
                    <div class="p-3 rounded bg-transparent position-relative">
                        <h4 class="mb-3">Weather detail</h4>
                        <div>
                            <p class="mb-1">Location: <span class="fw-semibold">{weatherData.value.location}</span></p>
                            <p class="mb-1">Weather: <span class="fw-semibold">{weatherData.value.weather}</span></p>
                            <p class="mb-1">Tempature: <span class="fw-semibold">{weatherData.value.tempature}</span></p>
                            <p class="mb-1">Humidity: <span class="fw-semibold">{weatherData.value.humidity}</span></p>
                        </div>
                        <div>
                            <p style={{ fontSize: '12px' }} class="text-end">Updated at: {weatherData.value.updatedAt}</p>
                        </div>
                    </div>
                ) : <p class="text-danger">Error when getting weather data.</p>}
            </div>
        )
    }
})