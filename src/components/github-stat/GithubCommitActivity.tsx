import { RootState } from "@/redux/store"
import { getLanguageColor } from "@/util/githubUtil"
import { useDispatch, useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Tabs, TabsList, TabsContent, TabsTrigger } from "../ui/tabs"
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "../ui/chart"
import { Bar, BarChart, CartesianGrid, LabelList, Line, LineChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { BookCopy, GitCommitHorizontal, Star } from "lucide-react"
import '@/App.css'

export default function GithubCommitActivity() {
    const dispatch = useDispatch()
    const setting = useSelector((state: RootState) => state.setting)
    const currentUsername = useSelector((state: RootState) => state.githubData.username)
    const currentStat = useSelector((state: RootState) => state.githubData.stat)
    const githubSetting = setting.githubStat

    if (!currentStat) return null

    const data = Object.entries(currentStat.quarterCommitCount).map(([k, v]) => {
        return {
            name: k,
            value: v
        }
    })

    const chartConfig = {
        value: {
            label: "Total Commit",
            color: "#3178C6"
        }
    } satisfies ChartConfig
    return (
        <div className="w-full p-1">
            <ChartContainer config={chartConfig}>
                <BarChart
                    accessibilityLayer
                    data={data}
                    margin={{
                        top: 32,
                        left: -16,
                    }}
                >
                    <CartesianGrid vertical={false} />
                    <XAxis
                        className="x-chart-line"
                        dataKey={"name"}
                        tickLine={false}
                        axisLine={false}
                        tickMargin={15}
                        padding={{ left: 10, right: 10 }}
                        tick={{ fill: '#FFFFFF', opacity: 1 }}
                    />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        className="text-xs"
                        tick={{ fill: '#FFFFFF', opacity: 1 }}
                    />
                    <ChartTooltip
                        cursor={true}
                        content={<ChartTooltipContent indicator="line" />}
                    />
                    <Bar
                        dataKey={"value"}
                        type={"natural"}
                        stroke="#3178C6"
                        strokeWidth={2}
                        fill="#3178C6"
                        radius={4}
                    >
                        {/* <LabelList
                            position="top"
                            offset={16}
                            className="fill-foreground"
                            fontSize={12}
                        /> */}
                    </Bar>
                </BarChart>
            </ChartContainer>
        </div>
    )
}
