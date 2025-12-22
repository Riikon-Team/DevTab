import { QuoteDetail } from "@/constants/Quote"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type QuoteSlice = {
    quote: QuoteDetail | null
}

const initialState: QuoteSlice = {
    quote: null
}

export const quoteSlice = createSlice({
    name: 'quote',
    initialState,
    reducers: {
        updateQuote: (state, action: PayloadAction<QuoteDetail>) => {
            state.quote = action.payload
        }
    }
})

export default quoteSlice.reducer
export const { updateQuote } = quoteSlice.actions