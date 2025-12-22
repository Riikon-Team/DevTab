import { Search, SearchIcon } from "lucide-react";
import { Input } from "./ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import Clock from "./clock/Clock";
import { useRef, useState } from "react";
import QuoteComponent from "./quote/QuoteComponent";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { BookmarkComponent } from "./bookmark/BookmarkComponent";

export default function CenterComponent() {
    //Redux state
    const bookmark = useSelector((state: RootState) => state.bookmark.listBookmark)

    //Local state
    const inputRef = useRef<HTMLInputElement>(null)
    const [inputData, setInputData] = useState(inputRef.current?.value || "")

    const performSearch = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" && inputData !== "") {
            e.preventDefault()
            const query = inputData
            window.location.href = `https://www.google.com/search?q=${query}`
        }
    }

    return (
        <div className="flex-1 flex flex-col gap-5 items-center justify-center h-full px-6 md:px-auto relative">
            <div className="absolute top-1 flex gap-1">
                {
                    bookmark.map((ele, index) => (
                        <BookmarkComponent bookmark={ele} />
                    ))
                }
            </div>
            <Clock />
            <InputGroup
                className="md:w-full lg:w-120 h-12 backdrop-blur-sm"
                onKeyDown={(e) => performSearch(e)}
            >
                <InputGroupInput
                    id="search-internet" placeholder="Search with Google..."
                    ref={inputRef}
                    onChange={(e) => setInputData(e.target.value)}
                />
                <InputGroupAddon>
                    <SearchIcon />
                </InputGroupAddon>
            </InputGroup>
            <QuoteComponent />
        </div>
    )
}