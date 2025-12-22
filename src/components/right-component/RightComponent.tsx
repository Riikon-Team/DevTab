import WeatherComponent from "../weather/WeatherComponent";

export default function RightComponent() {
    return (
        <div className="hidden lg:w-70 h-full md:block md:w-auto">
            <WeatherComponent />
        </div>
    )
}