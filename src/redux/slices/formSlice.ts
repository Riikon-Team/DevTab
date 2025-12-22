import { defaultValue, FormState } from "@/constants/Form";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UpdateFormPayload } from "../payload/formPayload";

const initialState = defaultValue

const formSlice = createSlice({
    name: 'form',
    initialState,
    reducers: {
        updateForm(state, action: PayloadAction<UpdateFormPayload<keyof FormState>>) {
            const { type, key, value } = action.payload
            state[type][key] = value
        }
    }
})

export const { updateForm } = formSlice.actions
export default formSlice.reducer