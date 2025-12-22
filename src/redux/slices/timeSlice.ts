import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface TimeSlice {
    currentDate: number
}

const initialState: TimeSlice = {
    currentDate: Date.now()
}

export const timeSlice = createSlice({
    name: 'currentTime',
    initialState,
    reducers: {
        updateCurrentTime(state, action: PayloadAction<number>) {
            state.currentDate = action.payload
        }
    }
})

export const { updateCurrentTime } = timeSlice.actions
export default timeSlice.reducer