import { configureStore } from "@reduxjs/toolkit";
import githubReducer from './slices/githubSlice'
import weatherReducer from './slices/weatherSlice'
import timeReducer from './slices/timeSlice'
import settingReducer from './slices/settingSlice'
import quoteReducer from './slices/quoteSlice'
import formReducer from './slices/formSlice'
import sidebarReducer from './slices/sidebarSlice'
import bookmarkReducer from './slices/bookmarkSlice'

export const store = configureStore({
    reducer: {
        githubData: githubReducer,
        weatherDetail: weatherReducer,
        bookmark: bookmarkReducer,
        currentTime: timeReducer,
        setting: settingReducer,
        quote: quoteReducer,
        form: formReducer,
        sidebar: sidebarReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>