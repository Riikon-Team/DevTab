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
        const loading = ref(true);

        const getWeatherData = (location: string) => {
            //Incoming parameter: lang=vi
            return fetch(`https://wttr.in/${location}?format=j1&`)
                .then(data => data.json())
                .then(data => getWeatherDetail(data)).finally(() => loading.value = false)
        }

        onMounted(async () => {
            //Default value just for testing
            weatherData.value = await getWeatherData('Hồ Chí Minh')
            console.log(weatherData.value)
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

//Get data from json response
const getWeatherDetail = (obj: any): WeatherData | null => {
    try {
        const hourlyIndex = Math.trunc(new Date().getHours() / 3)

        return {
            location: obj['nearest_area'][0]['areaName'][0]['value'],
            weather: obj['weather'][0]['hourly'][hourlyIndex]['weatherDesc'][0]['value'],
            tempature: obj['weather'][0]['hourly'][hourlyIndex]["tempC"] + "°C",   //Currently support Celcius
            humidity: obj['weather'][0]['hourly'][hourlyIndex]["humidity"] + "%",
            updatedAt: (hourlyIndex * 3) + ":00"
        }
    }
    catch {
        return null
    }
}