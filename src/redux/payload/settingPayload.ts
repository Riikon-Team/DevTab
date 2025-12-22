import { SettingType } from "@/constants/Setting";

export type UpdateSettingPayload<T extends keyof SettingType> = {
    type: T,
    key: keyof SettingType[T], 
    value: SettingType[T][keyof SettingType[T]]
}

export type UpdateMultipleSettingPayload<T extends keyof SettingType> = {
    type: T,
    detail: Partial<SettingType[T]>
}