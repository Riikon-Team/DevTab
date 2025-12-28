import { defaultSetting } from "@/constants/Setting"
import { setCurrentDay, setHourlyIndex, setWeatherData, setWeatherStorage } from "@/redux/slices/weatherSlice"
import { RootState } from "@/redux/store"
import { fetchForecastData, getEmojiByWeather } from "@/util/weatherUtil"
import { ChevronDown, ChevronUp, CircleQuestionMark, Droplet, MapPin, RotateCcw } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { WeatherEmojiComponent } from "./WeatherEmoji"
import { Collapsible, CollapsibleTrigger } from "@radix-ui/react-collapsible"
import { Button } from "../ui/button"
import WeatherForecastComponent from "./WeatherForecastComponent"
import { CollapsibleContent } from "../ui/collapsible"
import { ScrollArea, ScrollBar } from "../ui/scroll-area"
import { Spinner } from "../ui/spinner"

export default function WeatherComponent() {
    //Local state
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isCollabsibleOpen, setCollabsibleState] = useState(false)

    //Redux
    const dispatch = useDispatch()
    const currentWeatherData = useSelector((state: RootState) => state.weatherDetail.weatherData)
    const currentWeatherStorage = useSelector((state: RootState) => state.weatherDetail.weatherStorage)
    const currentHourlyIndex = useSelector((state: RootState) => state.weatherDetail.currentHourlyIndex)
    const currentDay = useSelector((state: RootState) => state.weatherDetail.currentDay)

    const setting = useSelector((state: RootState) => state.setting)
    const weatherSetting = setting.weather

    const fetchWeatherData = async () => {
        try {
            setIsRefreshing(true)
            const hourIndex = Math.trunc(new Date().getHours() / 3);
            const data = await fetchForecastData(weatherSetting.location, hourIndex, weatherSetting.tempatureScale)
            if (!data || !data.data || data.data.length === 0 || !data.data[0].detail) {
                throw new Error("Invalid weather data received")
            }

            dispatch(setWeatherData(data.data[0].detail[hourIndex]))
            dispatch(setWeatherStorage(data))
            dispatch(setHourlyIndex(hourIndex))
            dispatch(setCurrentDay(0))
        }
        catch (err) {

        }
        finally {
            setTimeout(() => {
                setLoading(false)
                setIsRefreshing(false)
            }, 500)
        }
    }

    const refreshWeatherData = () => {
        fetchWeatherData()
    }

    useEffect(() => {
        fetchWeatherData()
    }, [])

    if (!weatherSetting.isEnable || !currentWeatherData) return null

    return (
        <div className="p-2">
            <Collapsible open={isCollabsibleOpen} onOpenChange={setCollabsibleState}>
                {/* Header button */}
                <div className="flex justify-between mb-1">
                    <div>
                        {/* <p>Weather</p> */}
                    </div>
                    <div className="flex">
                        <Button onClick={refreshWeatherData} variant="ghost" size="icon" className="size-8" title="Refresh">
                            <RotateCcw />
                            <span className="sr-only">Refresh</span>
                        </Button>
                        <CollapsibleTrigger asChild title={isCollabsibleOpen ? "Hide forecast" : "Show forecast"} >
                            <div>
                                <Button variant="ghost" size="icon" className="size-8">
                                    {isCollabsibleOpen ? <ChevronDown /> : <ChevronUp />}
                                    <span className="sr-only">Show forecast</span>
                                </Button>
                            </div>
                        </CollapsibleTrigger>
                    </div>
                </div>
                {/* Current weather */}
                {
                    loading ?
                        <div className="flex flex-col justify-center items-center">
                            <Spinner className="size-6 mb-2" />
                            <p>Loading weather data...</p>
                        </div> :
                        <div className="flex flex-col justify-center items-center">
                            <div className="flex items-center gap-2">
                                <WeatherEmojiComponent weather={currentWeatherData.weather} />
                                <p className="text-3xl">
                                    {currentWeatherData.tempature}
                                </p>
                            </div>
                            <p className="mt-2 mb-1 text-center">{currentWeatherData.weather}</p>
                            <div className="flex items-center gap-1">
                                <MapPin size={16} />
                                <p>{currentWeatherData.location}</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <Droplet size={16} />
                                <p>
                                    {currentWeatherData.humidity}
                                </p>
                            </div>
                        </div>
                }
                {currentWeatherStorage
                    ? <CollapsibleContent>
                        <ScrollArea className="w-full whitespace-nowrap">
                            <div className="flex gap-5 mb-1">
                                {
                                    currentWeatherStorage.data[0].detail.map((hourData, index) => <WeatherForecastComponent hourData={hourData} key={index} />)
                                }
                            </div>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                        <p className="mt-2 text-xs text-end text-gray-300">Updated at: {displayUpdatedAt(new Date(currentWeatherStorage.updatedTime))}</p>
                    </CollapsibleContent>
                    : <></>
                }
            </Collapsible>
        </div>
    )
}

const displayUpdatedAt = (time: Date) => {
    const date = new Date(time)
    return date.getHours().toString().padStart(2, '0') + ":" +
        date.getMinutes().toString().padStart(2, '0') + ":" +
        date.getSeconds().toString().padStart(2, '0')
}