import { defaultSetting, SettingType } from "@/constants/Setting";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UpdateSettingPayload, UpdateMultipleSettingPayload } from "../payload/settingPayload";

const initialState = defaultSetting

type MultipleUpdatePayload = UpdateMultipleSettingPayload<keyof SettingType>

export const settingSlice = createSlice({
    name: 'setting',
    initialState,
    reducers: {
        updateSetting: (state, action: PayloadAction<UpdateSettingPayload<keyof SettingType>>) => {
            const { type, key, value } = action.payload
            state[type][key] = value
        },

        updateMultipleSetting: (state, action: PayloadAction<MultipleUpdatePayload>) => {
            const { type, detail } = action.payload
            if (state[type]) {
                (state[type] as any) = detail
            }
        }
    }
})

export const { updateSetting, updateMultipleSetting } = settingSlice.actions
export default settingSlice.reducer