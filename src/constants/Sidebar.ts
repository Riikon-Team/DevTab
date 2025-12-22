export type GithubStatSidebar = {
    isOpen: boolean
}

export type TodolistSidebar = {
    isOpen: boolean
}

export type BookmarkSidebar = {
    isOpen: boolean
}

export type WeatherSidebar = {
    isOpen: boolean
}

export type CustomizeSidebar = {
    isOpen: boolean
}

export type SettingSidebar = {
    isOpen: boolean
}

export type AboutSidebar = {
    isOpen: boolean
}

export type SidebarState = {
    githubStat: GithubStatSidebar
    todo: TodolistSidebar
    bookmark: BookmarkSidebar
    weather: WeatherSidebar
    customize: CustomizeSidebar
    setting: SettingSidebar
    about: AboutSidebar
}

//Generic constant variable
const { isOpen } = { isOpen: false }

export const defaultValue: SidebarState = {
    about: { isOpen },
    bookmark: { isOpen },
    customize: { isOpen },
    githubStat: { isOpen },
    setting: { isOpen },
    todo: { isOpen },
    weather: { isOpen },

}