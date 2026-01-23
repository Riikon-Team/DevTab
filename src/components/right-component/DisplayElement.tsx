import { updateSetting } from "@/redux/slices/settingSlice";
import { RootState } from "@/redux/store";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export function DisplayElement() {
    const displaySetting = useSelector((state: RootState) => state.setting.display)
    const dispatcher = useDispatch()
    //TODO: Get default setting in localStorage 
    //This is temp state
    const [displayAll, setDisplayAll] = useState(true)
    //FIXME: Refactor this
    const changeAllDisplay = (state: boolean) => {
        dispatcher(updateSetting({
            type: "display",
            key: "weather",
            value: state
        }))

        dispatcher(updateSetting({
            type: "display",
            key: "bookmark",
            value: state
        }))

        setDisplayAll(state)
    }

    return (
        <div className="md:flex md:justify-end md:p-2 absolute bottom-0 right-0">
            <div
                className="text-white hover:text-neutral-400 cursor-pointer"
                onClick={() => changeAllDisplay(!displayAll)}
            >
                {displayAll
                    ? <EyeOff size={"1.5rem"} />
                    : <Eye size={"1.5rem"} />
                }
            </div>
        </div>
    )
}