import { GitHubData } from "@/constants/Github"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface GithubSlice {
    username: string,
    stat: GitHubData | null
}

const initialState: GithubSlice = {
    username: "",
    stat: null
}

export const githubSlice = createSlice({
    name: 'githubUsername',
    initialState,
    reducers: {
        setGithubUsername: (state, action: PayloadAction<string>) => {
            state.username = action.payload
        },
        setGithubStat: (state, action: PayloadAction<GitHubData>) => {
            state.stat = action.payload
        }
    }
})

export const { setGithubUsername, setGithubStat } = githubSlice.actions
export default githubSlice.reducer