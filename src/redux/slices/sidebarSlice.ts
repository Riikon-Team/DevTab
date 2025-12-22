import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SidebarState, defaultValue } from "@/constants/Sidebar";
import { UpdateSidebarPayload } from "../payload/sidebarPayload";

const initialState = defaultValue

const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        updateSidebar(state, action: PayloadAction<UpdateSidebarPayload<keyof SidebarState>>) {
            const { type, key, value } = action.payload
            state[type][key] = value
        }
    }
})

export const { updateSidebar } = sidebarSlice.actions
export default sidebarSlice.reducer