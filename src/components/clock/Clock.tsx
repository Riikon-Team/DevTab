import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect } from "react";
import { updateCurrentTime } from "@/redux/slices/timeSlice";

export default function Clock() {
    const dispatch = useDispatch()
    const dateState = useSelector((state: RootState) => state.currentTime.currentDate)
    const currentDate = new Date(dateState)

    const dayList = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"]

    useEffect(() => {
        const timer = setInterval(() => {
            dispatch(updateCurrentTime(Date.now()))
        }, 1000)

        return () => { clearInterval(timer) }
    }, [])
    return (
        <div>
            <p className="text-7xl text-center">
                {currentDate.getHours().toString().padStart(2, '0')}:
                {currentDate.getMinutes().toString().padStart(2, '0')}:
                {currentDate.getSeconds().toString().padStart(2, '0')}
            </p>
            <p className="text-2xl text-center mt-2">
                {currentDate.getDate().toString().padStart(2, '0')}/
                {currentDate.getMonth().toString().padStart(2, '0')}/
                {currentDate.getFullYear().toString().padStart(2, '0')}
            </p>
            <div className="flex gap-2 justify-center mt-5 select-none">
                {dayList.map((day, i) => (<div className={"p-2 rounded " + (i === currentDate.getDay() ? "bg-purple-500" : "")}>{day}</div>))}
            </div>
        </div>
    )
}