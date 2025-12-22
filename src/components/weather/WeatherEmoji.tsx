import { getEmojiByWeather } from "@/util/weatherUtil";
import { Cloud, CloudDrizzle, CloudFog, CloudRain, CloudRainWind, CloudSnow, CloudSun, Cloudy, Snowflake, Sun, Tornado } from "lucide-react";


export const WeatherEmoji = [
    { pattern: 'CLEAR', emoji: CloudSun },
    { pattern: 'SUNNY', emoji: Sun },
    { pattern: 'CLOUD', emoji: Cloudy },
    { pattern: 'OVERCAST', emoji: Cloud },
    { pattern: 'RAIN', emoji: CloudRain },
    { pattern: 'HEAVY RAIN', emoji: CloudRainWind },
    { pattern: 'STORM', emoji: Tornado },
    { pattern: 'SNOW', emoji: CloudSnow },
    { pattern: 'BLIZZARD', emoji: Snowflake },
    { pattern: 'MIST', emoji: CloudFog },
    { pattern: 'FOG', emoji: CloudFog },
    { pattern: 'DRIZZLE', emoji: CloudDrizzle }
]

export const WeatherEmojiComponent = (props: { weather: string | undefined, iconSize?: string | number }) => {
    const Icon = getEmojiByWeather(props.weather || "")
    return (
        <>
            <Icon size={props.iconSize || "3rem"} />
        </>
    )
}