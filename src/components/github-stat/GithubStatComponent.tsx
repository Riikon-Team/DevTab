import { setGithubStat } from "@/redux/slices/githubSlice";
import { updateSetting } from "@/redux/slices/settingSlice";
import { RootState } from "@/redux/store"
import { fetchGithubStat } from "@/util/githubUtil";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import GithubLanguagePieChart from "./GithubLanguageChart";
import { ChevronDown, ChevronUp, User } from "lucide-react";
import { Card } from "../ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { Button } from "../ui/button";
import GithubGeneralStatistic from "./GithubGeneralStatistic";
import GithubCommitActivity from "./GithubCommitActivity";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

import "../../App.css"

export default function GithubStatComponent() {
    const dispatch = useDispatch()
    const setting = useSelector((state: RootState) => state.setting)
    const currentUsername = useSelector((state: RootState) => state.githubData.username)
    const currentStat = useSelector((state: RootState) => state.githubData.stat)
    const githubSetting = setting.githubStat

    //Local state
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("")

    const [languageCollapse, setLanguageCollapse] = useState(false)
    const [generalCollapse, setGeneralCollapse] = useState(false)
    const [projectCollapse, setProjectCollapse] = useState(false)
    const [activityCollapse, setActivityCollapse] = useState(false)

    const fetchGitHubData = async () => {
        //Update setting
        dispatch(updateSetting({
            type: "githubStat",
            key: "username",
            value: currentUsername
        }))
        const githubData = await fetchGithubStat(currentUsername, githubSetting)
        if (!githubData) {
            setMessage("Error when fetching Github stat data.")
        }
        else {
            dispatch(setGithubStat(githubData))
        }
    }

    useEffect(() => {
        fetchGitHubData()
    }, [])

    return (
        <div
            className="w-full h-full pe-2 overflow-y-auto scrollbar-thin custom-scrollbar scrollbar-thumb-gray-500 scrollbar-track-transparent"
        >   
            <p>Github Statatistic</p>
            <Collapsible open={languageCollapse} onOpenChange={setLanguageCollapse} className="">
                <CollapsibleTrigger asChild title={languageCollapse ? "Hide language statistic" : "Show language statistic"} >
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="size-8">
                            {languageCollapse ? <ChevronDown /> : <ChevronUp />}
                            <span className="sr-only">Show language statistic</span>
                        </Button>
                        <p className="text-start text-xs">{languageCollapse ? "Hide" : "Show"} Language Statistic</p>
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <div className="bg-transparent backdrop-blur-xs rounded border-gray-400 border p-3">
                        <GithubLanguagePieChart />
                    </div>
                </CollapsibleContent>
            </Collapsible>

            <Collapsible open={generalCollapse} onOpenChange={setGeneralCollapse} className="">
                <CollapsibleTrigger asChild title={generalCollapse ? "Hide general statistic" : "Show general statistic"} >
                    <div className="flex items-center gap-1 ">
                        <Button variant="ghost" size="icon" className="size-8">
                            {generalCollapse ? <ChevronDown /> : <ChevronUp />}
                            <span className="sr-only">Show general statistic</span>
                        </Button>
                        <p className="text-start text-xs">{generalCollapse ? "Hide" : "Show"} General Statistic</p>
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <div className="bg-transparent backdrop-blur-xs rounded border-gray-400 border p-3">
                        <GithubGeneralStatistic />
                    </div>
                </CollapsibleContent>
            </Collapsible>

            <Collapsible open={activityCollapse} onOpenChange={setActivityCollapse} className="">
                <CollapsibleTrigger asChild title={activityCollapse ? "Hide commit activities" : "Show commit activities"} >
                    <div className="flex items-center gap-1 ">
                        <Button variant="ghost" size="icon" className="size-8">
                            {activityCollapse ? <ChevronDown /> : <ChevronUp />}
                            <span className="sr-only">Show commit activities</span>
                        </Button>
                        <p className="text-start text-xs">{activityCollapse ? "Hide" : "Show"} Commit Activities</p>
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <div className="bg-transparent backdrop-blur-xs rounded border-gray-400 border p-3">
                        <GithubCommitActivity />
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </div>
    )
}