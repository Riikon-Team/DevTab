import { WeatherData } from "@/constants/Weather"
import { WeatherEmojiComponent } from "./WeatherEmoji"

type WeatherForecastProp = {
    hourData: WeatherData
}

export default function WeatherForecastComponent(props: WeatherForecastProp) {
    return (
        <div className="backdrop-blur-xs my-3 border-gray-400 border rounded-2xl px-3 py-5">
            {props.hourData.updatedAt}
            <div className="flex items-center gap-2">
                <WeatherEmojiComponent weather={props.hourData.weather} iconSize={24} />
                <p className="text-xl">
                    {props.hourData.tempature}
                </p>
            </div>
        </div>
    )
}