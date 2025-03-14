import type { WeatherData } from "@/constants/weather";
import getForecastData from "@/utils/weather";
import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
    name: 'WeatherWidget',
    setup() {
        const weatherData = ref<WeatherData | null>(null)
        const loading = ref(true);

        

        onMounted(async () => {
            //Default value just for testing
            const hourIndex = Math.trunc(new Date().getHours() / 3)
            const currentWeatherDetail: WeatherData[] = await getForecastData('Hồ Chí Minh', 0, hourIndex).finally(() => loading.value = false)
            weatherData.value = currentWeatherDetail[hourIndex]
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