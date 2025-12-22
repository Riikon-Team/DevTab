import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { ThemeProvider } from "@/components/ThemeProvider"
import LeftSideBar from "@/components/sidebar/LeftSideBar"
import CenterComponent from "@/components/CenterComponent"
import RightComponent from "@/components/right-component/RightComponent"
import LeftComponent from "@/components/left-component/LeftComponent"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { setGithubUsername } from "@/redux/slices/githubSlice"
import GitUserForm from "@/components/forms/github-username/GitUserForm"
import GithubStatDialog from "@/components/sidebar-dialog/GithubStatDialog"
import WeatherDialog from "./components/sidebar-dialog/WeatherDialog"
import BookmarkDialog from "./components/sidebar-dialog/BookmarkDialog"
import { AddBookmarkForm } from "./components/forms/bookmark/AddBookmarkForm"
import { EditBookmarkForm } from "./components/forms/bookmark/EditBookmarkForm"

export default function App() {
    const dispatch = useDispatch()
    const githubUsername = useSelector((state: RootState) => state.githubData.username)

    const { setOpenMobile } = useSidebar()

    const storageUsername = localStorage.getItem("githubUsername")
    if (storageUsername) {
        dispatch(setGithubUsername(storageUsername))
    }

    const setSidebarState = (state: boolean) => {
        setOpenMobile(state)
    }

    return (
        <>
            <img
                className="absolute w-full h-full object-cover opacity-70 z-0"
                src="/background/1.jpg" alt=""
            />
            <LeftSideBar />
            <div className="relative w-full">
                <SidebarTrigger className="absolute z-2" />
                <div className="absolute w-full h-full overflow-hidden z-1 flex">
                    <LeftComponent />
                    <CenterComponent />
                    <RightComponent />
                </div>
            </div>
            {/* Form here */}
            <GitUserForm />
            <AddBookmarkForm />
            <EditBookmarkForm />
            {/* Dialog here */}
            <GithubStatDialog closeSidebar={setSidebarState} />
            <WeatherDialog closeSidebar={setSidebarState} />
            <BookmarkDialog closeSidebar={setSidebarState} />
        </>
    )
}