import type { WeatherContent, WeatherData } from "@/constants/weather";
import getForecastData, { getEmojiByWeather, getFullForecastData } from "@/utils/weather";
import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
    name: 'WeatherWidget',
    setup() {
        const weatherData = ref<WeatherData | null>(null)
        const loading = ref(true);
        const forecastData = ref()
        const error = ref(false)

        const weatherLocation = localStorage.getItem('weatherLocation') || "Hồ Chí Minh"
        const tempatureScale = localStorage.getItem('tempatureScale') || "C"

        onMounted(async () => {
            try {
                //Default value just for testing
                const hourIndex = Math.trunc(new Date().getHours() / 3)
                //Will be removed
                const currentWeatherDetail: WeatherData[] = await getForecastData(weatherLocation, 0, hourIndex, tempatureScale).finally(() => setTimeout(() => loading.value = false, 500))
                // forecastData.value = await Promise.all([getForecastData(weatherLocation, 0, hourIndex), getForecastData(weatherLocation, 1, hourIndex), getForecastData('Hồ Chí Minh', 2, hourIndex)])
                forecastData.value = await getFullForecastData(weatherLocation, hourIndex, tempatureScale)
                weatherData.value = currentWeatherDetail[hourIndex]
            }
            catch {
                error.value = true
            }
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
                        <div>
                            <p class="mb-1 text-start">
                                <i class="bi bi-geo-alt me-2"></i>
                                <span class="fw-semibold">{weatherData.value.location}</span>
                            </p>
                            <p class="mb-4 text-start">
                                <span>{new Date().toLocaleDateString('en-GB')}</span>
                            </p>
                            <p class="mb-3 display-1 text-center">{getEmojiByWeather(weatherData.value.weather.toUpperCase().trim())}</p>
                            <p class="mb-1 text-center"><span class="fw-semibold h2">{weatherData.value.tempature}</span></p>
                            <p class="mb-1 text-center">Humidity: <span class="fw-semibold">{weatherData.value.humidity}</span></p>
                        </div>

                        <div class="d-flex overflow-x-auto rounded p-1 mt-5">
                            {
                                forecastData.value?.data.map((date: WeatherContent, index: number) => {
                                    const today = new Date(forecastData.value?.updatedTime)
                                    today.setDate(today.getDate() + index)
                                    console.log(forecastData.value.data)
                                    console.log(date)
                                    return date.detail.map((element: WeatherData, index: number) => {
                                        return (
                                            <div class={index === 0 ? "" : "px-3"}>
                                                <p class="mb-1 fw-semibold h3 text-center">
                                                    {getEmojiByWeather(element.weather.toUpperCase().trim())}
                                                </p>
                                                <p class="mb-1 h5 fw-semibold text-center">
                                                    {element.tempature}
                                                </p>
                                                <p class="mb-2 text-center">
                                                    {element.humidity}
                                                </p>
                                                <p class="mb-2 text-center">
                                                    {index * 3 + ':00'}
                                                </p>
                                                {index === 0 &&
                                                    <p class='text-center'>
                                                        {today.toLocaleDateString('en-GB')}
                                                    </p>
                                                }
                                            </div>
                                        )
                                    })
                                })
                            }
                        </div>

                        <div class="position-fixed" style={{bottom: '0'}}>
                            <p style={{ fontSize: '12px' }} class="mt-2 text-end">Updated at: {weatherData.value.updatedAt}</p>
                        </div>
                    </div>
                ) : error.value && <p class="text-danger">Error when getting weather data.</p>}
            </div>
        )
    }
})
