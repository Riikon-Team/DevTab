import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuote } from "@/util/quoteUtil"
import { updateQuote } from "@/redux/slices/quoteSlice";
import { Spinner } from "../ui/spinner";

export default function QuoteComponent() {
    const [loading, setLoading] = useState(true)
    const [message, updateMessage] = useState("")

    const dispatcher = useDispatch()
    const quote = useSelector((state: RootState) => state.quote.quote)

    const fetchQuoteData = async () => {
        const quote = await fetchQuote()
        if (!quote) {
            updateMessage("Error when fetching today quote")
            setLoading(false)
        }
        else {
            dispatcher(updateQuote(quote))
            updateMessage("")
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchQuoteData()
    }, [])

    return (
        <>
            {loading ?
                <div className="flex flex-col justify-center items-center">
                    <Spinner className="size-6 mb-2" />
                    <p>Loading quote...</p>
                </div>
                :
                quote ?
                    <blockquote className="bg-black/20 p-2 rounded">
                        <p className="text-xl text-center">{quote.content}</p>
                        <p className="text-center text-gray-300">{quote.author}</p>
                    </blockquote>
                    :
                    <p>{message}</p>
            }
        </>
    )
}