import { RootState } from "@/redux/store"
import { getLanguageColor } from "@/util/githubUtil"
import { useDispatch, useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Tabs, TabsList, TabsContent, TabsTrigger } from "../ui/tabs"
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "../ui/chart"
import { Pie, PieChart, ResponsiveContainer } from "recharts"

export default function GithubLanguagePieChart() {
    const dispatch = useDispatch()
    const setting = useSelector((state: RootState) => state.setting)
    const currentUsername = useSelector((state: RootState) => state.githubData.username)
    const currentStat = useSelector((state: RootState) => state.githubData.stat)
    const githubSetting = setting.githubStat

    if (!currentStat) return null

    const langRepoStatistic = currentStat.langRepoCount
    const langCommitStatistic = currentStat.langCommitCount
    const langStarStatistic = currentStat.langStarCount
    const cacheLanguageColor: { name: string, color: string }[] = []

    const getListLanguageColor = (statistic: Record<string, number>): { name: string, color: string }[] => {
        const result = []
        for (const name of Object.keys(statistic)) {
            result.push({ name, color: getLanguageColor(name) })
        }
        return result
    }

    cacheLanguageColor.push(
        ...getListLanguageColor(langRepoStatistic),
        ...getListLanguageColor(langCommitStatistic),
        ...getListLanguageColor(langStarStatistic),
    )
    const languageColorMap = new Map(cacheLanguageColor.map(ele => [ele.name, ele.color]))

    const StatisticPieChart = (props: { statistic: Record<string, number> }) => {
        const chartConfig = Object.keys(props.statistic).reduce((accumulator, key) => {
            const colorFromMap = languageColorMap.get(key);

            accumulator[key] = {
                label: key,
                color: colorFromMap ?? "#cccccc",
            };

            return accumulator;
        }, {} as Record<string, { label: string, color: string }>) satisfies ChartConfig

        return (
            <ResponsiveContainer width="100%" height="100%">
                <ChartContainer
                    className="w-full mt-4 h-full"
                    config={chartConfig}
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            nameKey="name"
                            dataKey="count"
                            outerRadius={"80%"}
                            innerRadius={"50%"}
                            data={
                                Object.entries(props.statistic).map(([name, count]) => {
                                    return {
                                        name,
                                        count,
                                        fill: languageColorMap.get(name) ?? "#cccccc"
                                    }
                                })
                            }>
                        </Pie>
                        <ChartLegend
                            content={<ChartLegendContent nameKey="name" />}
                            className="mt-3 flex-wrap gap-2 flex *:justify-center"
                        />
                    </PieChart>
                </ChartContainer>
            </ResponsiveContainer>
        )
    }

    return (
        <div className="w-full h-full">
            <Tabs defaultValue="repo" className="h-full">
                <TabsList className="w-full bg-transparent flex flex-wrap h-auto">
                    <TabsTrigger className="px-3" value="repo">Repository</TabsTrigger>
                    <TabsTrigger className="px-3" value="commit">Commit</TabsTrigger>
                    <TabsTrigger className="px-3" value="star">Star</TabsTrigger>
                </TabsList>
                <TabsContent value="repo">
                    <StatisticPieChart statistic={langRepoStatistic} />
                </TabsContent>
                <TabsContent value="commit">
                    <StatisticPieChart statistic={langCommitStatistic} />
                </TabsContent>
                <TabsContent value="star">
                    <StatisticPieChart statistic={langStarStatistic} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
