import { useDispatch, useSelector } from "react-redux";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { RootState } from "@/redux/store";
import { useEffect } from "react";
import { setGithubUsername } from "@/redux/slices/githubSlice";
import { User } from "lucide-react";
import { updateForm } from "@/redux/slices/formSlice";

export default function NavUser() {
    const dispatch = useDispatch()
    const githubUsername = useSelector((state: RootState) => state.githubData.username)
    const setting = useSelector((state: RootState) => state.setting.githubStat)

    const openGitUsernameForm = () => {
        dispatch(updateForm({
            type: 'updateGitUser',
            key: 'isOpen',
            value: true
        }))
    }

    useEffect(() => {
        const storageUsername = setting.username
        if (storageUsername) {
            dispatch(setGithubUsername(storageUsername))
        }
    })

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton className="h-fit">
                    {githubUsername !== "" ?
                        <div className="flex items-center gap-3">
                            <div className="rounded-full border border-black bg-gray-150">
                                <img
                                    className="rounded-full w-12"
                                    src={`https://avatars.githubusercontent.com/${githubUsername}`} alt=""
                                />
                            </div>
                            <div>
                                <p className="font-bold">{githubUsername}</p>
                                <a href={`https://github.com/${githubUsername}`} target="_blank" className=""><p className="text-xs">@{githubUsername}</p></a>
                            </div>
                        </div> :
                        <div className="flex items-center gap-3">
                            <div className="rounded-full border p-2 border-black bg-gray-150">
                                <User />
                            </div>
                            <div>
                                <p className="font-bold">Unknown Github</p>
                                <p className="text-xs hover:text-gray-300 cursor-pointer" onClick={openGitUsernameForm}>Click here to set username</p>
                            </div>
                        </div>
                    }
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}