import { SettingType } from "@/constants/Setting"
import { createContext } from "react"

export type SettingContextType = {
    setting: SettingType

    updateMultipleSettings: <T extends keyof SettingType>(
        type: T,
        detail: Partial<SettingType[T]>
    ) => void

    updateSetting: <T extends keyof SettingType, K extends keyof SettingType[T]>(
        type: T,
        key: K,
        value: SettingType[T][K]
    ) => void,

    exportSetting: () => void
    importSetting: (settingJson: string) => void
}

export const SettingContext = createContext<SettingContextType | undefined>(undefined)