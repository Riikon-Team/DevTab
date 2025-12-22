import { GitHubData, GithubLanguageMap } from "@/constants/Github";
import { PROXY } from "@/constants/Search";
import { SettingType } from "@/constants/Setting";
import listLanguage from "@/asset/languagesColor.json"

const API_URL = "https://profile-summary-for-github.com/api/user/"
const listGithubLanguage: GithubLanguageMap = listLanguage

export const fetchGithubStat = async (username: string, setting: SettingType["githubStat"]): Promise<GitHubData | null> => {
    try {
        if (!username) return null

        const cachedData = localStorage.getItem(`github_data_${username}`);
        if (cachedData) {
            const parsedData = JSON.parse(cachedData) as GitHubData
            const currentTime = Date.now()
            const cacheTime = parsedData.cachedAt || 0
            const cacheAge = (currentTime - cacheTime) / (1000 * 60)

            if (cacheAge < setting.cacheDurationMinutes) return parsedData
        }
        //Fix cors
        const fetchUrl = API_URL + username
        const response = await fetch(PROXY ? `${PROXY}${encodeURIComponent(fetchUrl)}` : fetchUrl);


        if (!response.ok) {
            return null
        }

        const newData = await response.json()
        newData.cachedAt = Date.now()
        localStorage.setItem(`github_data_${username}`, JSON.stringify(newData));
        return newData
    }
    catch (err) {
        return null
    }
}


export const getLanguageColor = (name: string): string => {
    const color = listGithubLanguage[name]?.color
    return color ?? "#cccccc"
}