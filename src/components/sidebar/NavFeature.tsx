import { Bookmark, Cloud, Columns3Cog, Github, ListTodo } from "lucide-react";
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { updateSidebar } from "@/redux/slices/sidebarSlice";

export default function NavFeature() {
    const dispatcher = useDispatch()
    const dialogState = useSelector((state: RootState) => state.sidebar)

    const featureItems = [
        {
            title: "Github Stat",
            icon: Github,    //Change later due to deprecated
            action: () => dispatcher(updateSidebar({ type: "githubStat", key: "isOpen", value: true }))
        },
        {
            title: "To-do List",
            icon: ListTodo,
            action: () => dispatcher(updateSidebar({ type: "todo", key: "isOpen", value: true }))

        },
        {
            title: "Bookmark",
            icon: Bookmark,
            action: () => dispatcher(updateSidebar({ type: "bookmark", key: "isOpen", value: true }))
        },
        {
            title: "Weather",
            icon: Cloud,
            action: () => dispatcher(updateSidebar({ type: "weather", key: "isOpen", value: true }))
        },
        {
            title: "Customize",
            icon: Columns3Cog,
            action: () => dispatcher(updateSidebar({ type: "customize", key: "isOpen", value: true }))
        }
    ]

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Feature</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {featureItems.map(item => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild>
                                <div
                                    className="flex items-center cursor-pointer select-none"
                                    onClick={item.action}
                                >
                                    <item.icon />
                                    <span>{item.title}</span>
                                </div>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}