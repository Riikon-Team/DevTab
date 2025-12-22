import { Bookmark } from "@/constants/Bookmark";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BookmarkSlice {
    listBookmark: Bookmark[]
}

const initialState: BookmarkSlice = {
    listBookmark: []
}

export const bookmarkSlice = createSlice({
    name: 'bookmark',
    initialState,
    reducers: {
        updateListBookmark(state, action: PayloadAction<Bookmark[]>) {
            state.listBookmark.push(...action.payload)
        },

        initListBookmark(state, action: PayloadAction<Bookmark[]>) {
            state.listBookmark = action.payload
        }
    }
})

export default bookmarkSlice.reducer
export const { updateListBookmark, initListBookmark } = bookmarkSlice.actions