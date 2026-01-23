import { useSelector } from "react-redux";
import WeatherComponent from "../weather/WeatherComponent";
import { DisplayElement } from "./DisplayElement";
import { RootState } from "@/redux/store";

export default function RightComponent() {
    const displaySetting = useSelector((state: RootState) => state.setting.display)

    return (
        <div className="hidden lg:w-70 h-full md:flex md:flex-col md:justify-between md:w-auto relative">
            {displaySetting.weather && <WeatherComponent />}
            <DisplayElement />
        </div>
    )
}