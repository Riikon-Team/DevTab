import { Info, Settings } from "lucide-react";
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";

export default function NavSecondary() {

    const otherItems = [
        {
            title: "Setting",
            icon: Settings
        },
        {
            title: "About",
            icon: Info
        },
    ]

    return (
        <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
                <SidebarMenu>
                    {otherItems.map(item => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild>
                                <div className="flex items-center cursor-pointer select-none">
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