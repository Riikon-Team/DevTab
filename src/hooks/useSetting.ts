// import { SettingType } from "@/constants/Setting";
// import { SettingContext } from "@/contexts/SettingContext";
// import { useContext } from "react";

// export const useSetting = <T extends keyof SettingType>(type: T): [SettingType[T], (updateData: Partial<SettingType[T]>) => void] => {
//     const context = useContext(SettingContext)
//     if (!context) {
//         throw new Error
//     }

//     const updateSetting = (updateData: Partial<SettingType[T]>) => {
//         context.importSetting(JSON.stringify(updateData))
//     }

//     return [context.setting[type], updateSetting]
// }
