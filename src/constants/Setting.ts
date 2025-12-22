export type WeatherSetting = {
    isEnable: boolean,
    location: string,
    tempatureScale: "C" | "F",
    refreshMinutesInterval: number,
    fontSize: number,
    backdropFilter: number
}

export type GithubStatSetting = {
    isEnable: boolean,
    username: string,
    showProfile: boolean,
    showRepos: boolean,
    showUserInfo: boolean,
    showStats: boolean,
    showLanguageStats: boolean,
    showCommitActivity: boolean,
    cacheDurationMinutes: number,
    excludedLanguages: string[],
}

export type SettingType = {
    weather: WeatherSetting,
    githubStat: GithubStatSetting
}

export const defaultSetting: SettingType = {
    weather: {
        isEnable: true,
        location: "Ho Chi Minh City",
        tempatureScale: "C",
        refreshMinutesInterval: 60, //Refresh after 1 hour
        fontSize: 1,    //Represent text-xl
        backdropFilter: 0
    },
    githubStat: {
        isEnable: true,
        username: "",
        showProfile: false,
        showRepos: false,
        showUserInfo: true,
        showStats: true,
        showLanguageStats: true,
        showCommitActivity: true,
        cacheDurationMinutes: 60, //Cache each 1 hour
        excludedLanguages: []
    }
}