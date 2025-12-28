import { useMediaQuery } from "@/hooks/useMedia"
import { updateSidebar } from "@/redux/slices/sidebarSlice"
import { setCurrentDay, setHourlyIndex, setWeatherData, setWeatherStorage } from "@/redux/slices/weatherSlice"
import { RootState } from "@/redux/store"
import { fetchForecastData } from "@/util/weatherUtil"
import { ChevronRight, CloudSun, Droplet, MapPin, Thermometer, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import WeatherForecastComponent from "../weather/WeatherForecastComponent"
import { WeatherEmojiComponent } from "../weather/WeatherEmoji"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { WeatherData, WeatherStorage } from "@/constants/Weather"

export default function WeatherDialog(props: { closeSidebar: (open: boolean) => void }) {
    //Redux
    const dispatcher = useDispatch()
    const dialogState = useSelector((state: RootState) => state.sidebar.weather)
    const setting = useSelector((state: RootState) => state.setting)
    const currentWeatherData = useSelector((state: RootState) => state.weatherDetail.weatherData)
    const currentWeatherStorage = useSelector((state: RootState) => state.weatherDetail.weatherStorage)
    // const currentHourlyIndex = useSelector((state: RootState) => state.weatherDetail.currentHourlyIndex)
    // const currentDay = useSelector((state: RootState) => state.weatherDetail.currentDay)

    const isMobile = useMediaQuery('(max-width: 767px)')

    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [featureIndex, setFeatureIndex] = useState(0)

    const feature = [
        {
            title: 'General',
            icon: CloudSun
        },
        {
            title: "Forecast",
            icon: Thermometer
        }
    ]

    const closeDialog = () => {
        dispatcher(updateSidebar({
            type: 'weather',
            key: 'isOpen',
            value: false
        }))
    }



    const weatherSetting = setting.weather

    const fetchWeatherData = async () => {
        try {
            setIsRefreshing(true)
            const hourIndex = Math.trunc(new Date().getHours() / 3);
            const data = await fetchForecastData(weatherSetting.location, hourIndex, weatherSetting.tempatureScale)
            if (!data || !data.data || data.data.length === 0 || !data.data[0].detail) {
                throw new Error("Invalid weather data received")
            }

            dispatcher(setWeatherData(data.data[0].detail[hourIndex]))
            dispatcher(setWeatherStorage(data))
            dispatcher(setHourlyIndex(hourIndex))
            dispatcher(setCurrentDay(0))
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

    useEffect(() => {
        if (dialogState.isOpen && isMobile) props.closeSidebar(false)
    }, [dialogState.isOpen])

    return dialogState.isOpen ?
        <div className="w-full absolute z-100 flex justify-center items-center " style={{ height: '100vh' }}>
            <div className="w-full h-full z-100 bg-black/50" onClick={closeDialog}></div>
            <div className="absolute z-110 bg-accent rounded-2xl w-[90%] lg:w-3xl" onClick={() => { }}>
                <div className="flex">
                    <div className="p-4 w-[16rem] hidden lg:block">
                        {feature.map((item, index) => (
                            <div
                                className={"cursor-pointer flex items-center gap-2 p-2 hover:bg-neutral-700/50 rounded"}
                                onClick={() => setFeatureIndex(index)}
                            >
                                <item.icon size={"1rem"} />
                                <span className="text-sm">{item.title}</span>
                            </div>
                        ))}
                    </div>
                    <div className="lg:w-lg w-full h-[60vh] overflow-hidden bg-neutral-900 p-4 rounded-tr-2xl rounded-br-2xl flex flex-col pb-10">
                        <div className="flex justify-between mb-4">
                            <div className="flex items-center gap-1">
                                <p className=" text-sm text-neutral-400">Weather</p>
                                <ChevronRight size={"1rem"} className="text-neutral-400" />
                                <p className="text-sm">{feature[featureIndex].title || ""}</p>
                            </div>
                            <X className="hover:text-neutral-400 cursor-pointer" onClick={closeDialog} />
                        </div>
                        <div className="pb-4 h-full w-full">
                            {featureIndex === 0 &&
                                <CurrentWeatherComponent
                                    {...{ currentWeatherData, currentWeatherStorage }}
                                />
                            }
                            {featureIndex == 1 &&
                                <ForecaseWeatherComponent currentWeatherStorage={currentWeatherStorage} />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
        : <></>
}

const getDateString = (dateOffset: number) => {
    const date = new Date(new Date(Date.now() + dateOffset * (24 * 3600000)).setHours(0, 0, 0, 0))
    return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
}

const CurrentWeatherComponent = (props: { currentWeatherData: WeatherData | null, currentWeatherStorage: WeatherStorage | null }) => {
    const { currentWeatherData, currentWeatherStorage } = props

    return (
        <div className="h-full overflow-y-auto scrollbar-thin custom-scrollbar scrollbar-thumb-gray-500 scrollbar-track-transparent px-1 py-4 pb-8">
            <div className="bg-neutral-800 rounded-2xl p-4 pb-6 mb-4">
                {currentWeatherData ?
                    <div className="">
                        <div className="flex items-center gap-1 mb-8">
                            <MapPin size={16} />
                            <p>{currentWeatherData.location}</p>
                        </div>
                        <div className="flex items-center justify-between gap-10 w-full px-12">
                            <div className="">
                                <div className="flex items-center gap-2">
                                    <WeatherEmojiComponent weather={currentWeatherData.weather} />
                                    <p className="text-4xl">
                                        {currentWeatherData.tempature}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <p className="text-center">{currentWeatherData.weather}</p>
                                <div className="flex items-center gap-1">
                                    <Droplet size={16} />
                                    <p>
                                        {currentWeatherData.humidity}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div> : <></>
                }

            </div>
            <div className="bg-neutral-800 rounded-2xl p-4 pb-6 mt-6">
                <div className="mb-4">
                    <p className="font-semibold">Weather today</p>
                    <p className="text-sm text-neutral-400">Weather forecast for today</p>
                </div>
                {
                    currentWeatherStorage ?
                        <div className="flex gap-3 lg:gap-5 mb-1 overflow-x-auto scrollbar-thin custom-scrollbar scrollbar-thumb-gray-500 scrollbar-track-transparent">
                            {
                                currentWeatherStorage.data[0].detail.map((hourData, index) => (
                                    <div className="my-3 px-3 lg:px-4">
                                        <div className="flex flex-col items-center gap-3">
                                            {hourData.updatedAt}
                                            <WeatherEmojiComponent weather={hourData.weather} iconSize={'2rem'} />
                                            <p className="text-xl">
                                                {hourData.tempature}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        : <></>
                }
            </div>
        </div>
    )
}

const ForecaseWeatherComponent = (props: { currentWeatherStorage: WeatherStorage | null }) => {
    const { currentWeatherStorage } = props
    const tabLabel = ["today", "next", "next2"]

    return (
        <div className="bg-neutral-800 rounded-2xl p-4 pb-6 mt-6">
            <Tabs defaultValue="today" className="h-full w-full">
                <TabsList className="w-full bg-transparent flex flex-wrap h-auto gap-2">
                    <TabsTrigger className="px-3 cursor-pointer hover:bg-neutral-700" value="today">{getDateString(0)} (Today)</TabsTrigger>
                    <TabsTrigger className="px-3 cursor-pointer hover:bg-neutral-700" value="next">{getDateString(1)}</TabsTrigger>
                    <TabsTrigger className="px-3 cursor-pointer hover:bg-neutral-700" value="next2">{getDateString(2)}</TabsTrigger>
                </TabsList>
                {currentWeatherStorage ?
                    currentWeatherStorage.data.map((indexData, index) => (
                        <TabsContent value={tabLabel[index] || "none"} className="flex gap-5 mb-1 overflow-x-auto scrollbar-thin custom-scrollbar scrollbar-thumb-gray-500 scrollbar-track-transparent">
                            {
                                indexData.detail.map((hourData, index) => (
                                    <div className="my-3 px-4">
                                        <div className="flex flex-col items-center gap-3">
                                            {hourData.updatedAt}
                                            <WeatherEmojiComponent weather={hourData.weather} iconSize={'2rem'} />
                                            <p className="text-xl">
                                                {hourData.tempature}
                                            </p>
                                            <div className="flex items-center gap-1">
                                                <Droplet size={16} />
                                                <p>
                                                    {hourData.humidity}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </TabsContent>
                    ))
                    : <></>}
            </Tabs>
        </div>
    )
}