import { QuoteDetail } from "@/constants/Quote"
import { PROXY } from "@/constants/Search"

const QUOTE_URL = "https://zenquotes.io/api/random"

export async function fetchQuote() {
    try {
        const quote = localStorage.getItem("currentQuote")
        if (quote) {
            const data = JSON.parse(quote) as QuoteDetail
            const today = new Date().setHours(0, 0, 0, 0)
            const updateDate = new Date(data.updatedAt).setHours(0, 0, 0, 0)
            if (today - updateDate === 0) return data
        }

        const response = await fetch(PROXY ? `${PROXY}${encodeURIComponent(QUOTE_URL)}` : QUOTE_URL);
        if (!response.ok) return null

        const newData = await response.json()
        const newQuote = newData[0]
        const result: QuoteDetail = {
            author: newQuote.a,
            content: newQuote.q,
            updatedAt: Date.now()
        }
        localStorage.setItem("currentQuote", JSON.stringify(result))
        return result
    }
    catch (_) {
        return null
    }
}