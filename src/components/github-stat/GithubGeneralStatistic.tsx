import { RootState } from "@/redux/store"
import { getLanguageColor } from "@/util/githubUtil"
import { useDispatch, useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Tabs, TabsList, TabsContent, TabsTrigger } from "../ui/tabs"
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "../ui/chart"
import { Pie, PieChart, ResponsiveContainer } from "recharts"
import { BookCopy, GitCommitHorizontal, Star } from "lucide-react"

export default function GithubGeneralStatistic() {
    const dispatch = useDispatch()
    const setting = useSelector((state: RootState) => state.setting)
    const currentUsername = useSelector((state: RootState) => state.githubData.username)
    const currentStat = useSelector((state: RootState) => state.githubData.stat)
    const githubSetting = setting.githubStat

    if (!currentStat) return null

    const totalStar = Object.values(currentStat.repoStarCount).reduce((sum, count) => sum += count)
    const totalCommit = Object.values(currentStat.quarterCommitCount).reduce((sum, count) => sum += count)
    const totalRepo = currentStat.user.publicRepos

    return (
        <div className="w-full p-1 gap-3">
            <div className="flex gap-4 mb-4">
                <div className="flex-1 bg-neutral-800 p-4 rounded-2xl">
                    <p className="text-neutral-400 text-xs">Total stars</p>
                    <p className="text-2xl font-semibold">{totalStar}</p>
                </div>
                <div className="flex-1 bg-neutral-800 p-4 rounded-2xl">
                    <p className="text-neutral-400 text-xs">Total commits (public)</p>
                    <p className="text-2xl font-semibold">{totalCommit}</p>
                </div>
            </div>
            <div className="flex gap-4 mb-4">
                <div className="flex-1 bg-neutral-800 p-4 rounded-2xl">
                    <p className="text-neutral-400 text-xs">Total repositories</p>
                    <p className="text-2xl font-semibold"> {totalRepo}</p>
                </div>
            </div>

        </div>
    )
}
