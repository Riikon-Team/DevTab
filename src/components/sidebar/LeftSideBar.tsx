import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "../ui/sidebar";
import NavUser from "./NavUser";
import NavFeature from "./NavFeature";
import NavSecondary from "./NavSecondary";


export default function LeftSideBar() {
    return (
        <Sidebar>
            <SidebarHeader>
                <NavUser />
            </SidebarHeader>

            <SidebarContent>
                <NavFeature />
                <NavSecondary />
            </SidebarContent>

            <SidebarFooter>
            </SidebarFooter>
        </Sidebar>
    )
}