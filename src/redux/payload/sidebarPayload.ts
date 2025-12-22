import { SidebarState } from "@/constants/Sidebar";

export type UpdateSidebarPayload<T extends keyof SidebarState> = {
    type: T,
    key: keyof SidebarState[T],
    value: SidebarState[T][keyof SidebarState[T]]
}