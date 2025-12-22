import { useDispatch, useSelector } from "react-redux";
import { Dialog } from "../ui/dialog";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuAction, SidebarMenuItem, SidebarProvider } from "../ui/sidebar";
import { RootState } from "@/redux/store";
import { ChartArea, ChartNoAxesColumn, ChevronRight, Construction, GitGraph, LayoutDashboard, X } from "lucide-react";
import { updateSidebar } from "@/redux/slices/sidebarSlice";
import GithubLanguagePieChart from "../github-stat/GithubLanguageChart";
import { useEffect, useState } from "react";
import { fetchGithubStat } from "@/util/githubUtil";
import { updateSetting } from "@/redux/slices/settingSlice";
import { setGithubStat } from "@/redux/slices/githubSlice";
import GithubCommitActivity from "../github-stat/GithubCommitActivity";
import GithubGeneralStatistic from "../github-stat/GithubGeneralStatistic";
import { useMediaQuery } from "@/hooks/useMedia";
import DialogComponent from "../common/Dialog";

export default function GithubStatDialog(props: { closeSidebar: (open: boolean) => void }) {
    const dispatcher = useDispatch()
    const dialogState = useSelector((state: RootState) => state.sidebar.githubStat)
    const setting = useSelector((state: RootState) => state.setting)
    const githubDetail = useSelector((state: RootState) => state.githubData)

    const isMobile = useMediaQuery('(max-width: 767px)')

    const [featureIndex, setFeatureIndex] = useState(0)

    const feature = [
        {
            title: 'General',
            icon: LayoutDashboard
        },
        {
            title: "Coming soon",
            icon: Construction
        }
    ]

    const closeDialog = () => {
        dispatcher(updateSidebar({
            type: 'githubStat',
            key: 'isOpen',
            value: false
        }))
    }

    const fetchGitHubData = async () => {
        //Update setting
        dispatcher(updateSetting({
            type: "githubStat",
            key: "username",
            value: githubDetail.username
        }))
        const githubData = await fetchGithubStat(githubDetail.username, setting.githubStat)
        if (!githubData) {
            // setMessage("Error when fetching Github stat data.")
        }
        else {
            dispatcher(setGithubStat(githubData))
        }
    }

    useEffect(() => {
        fetchGitHubData()
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
                                <p className=" text-sm text-neutral-400">Github Stat</p>
                                <ChevronRight size={"1rem"} className="text-neutral-400" />
                                <p className="text-sm">{feature[featureIndex].title || ""}</p>
                            </div>
                            <X className="hover:text-neutral-400 cursor-pointer" onClick={closeDialog} />
                        </div>
                        <div className="pb-4 h-full">
                            {featureIndex === 0 &&
                                <div className="h-full overflow-y-auto scrollbar-thin custom-scrollbar scrollbar-thumb-gray-500 scrollbar-track-transparent px-1 py-4 pb-8">
                                    <GithubGeneralStatistic />
                                    <div className="bg-neutral-800 rounded-2xl p-4 pb-6 mb-4">
                                        <div className="mb-2">
                                            <p className="font-semibold">Commit Activity</p>
                                            <p className="text-sm text-neutral-400">Your commit activity in the last 3 years</p>
                                        </div>
                                        <GithubCommitActivity />
                                    </div>
                                    <div className="bg-neutral-800 rounded-2xl p-4 pb-6 mt-6">
                                        <div className="mb-4">
                                            <p className="font-semibold">Language Statistic</p>
                                            <p className="text-sm text-neutral-400">Language used in your public repositories</p>
                                        </div>
                                        <GithubLanguagePieChart />
                                    </div>
                                </div>
                            }
                            {featureIndex == 1 &&
                                <div className="gap-1 flex-col flex items-center justify-center h-full">
                                    <p className="text-2xl font-semibold">More features coming soon</p>
                                    <p className="text-neutral-400">Something interesting in development</p>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
        : <></>

}