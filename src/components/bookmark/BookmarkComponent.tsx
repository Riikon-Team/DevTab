import { Bookmark } from "@/constants/Bookmark"
import { formatUrl } from "@/util/bookmarkUtil"

type BookmarkProps = {
    bookmark: Bookmark
}

export function BookmarkComponent(props: BookmarkProps) {
    return (
        <a href={formatUrl(props.bookmark.url)}>
            <div className="w-20 rounded-full px-2 py-1 flex justify-center items-center gap-1 bg-neutral-800/50 hover:bg-neutral-700/50 cursor-pointer">
                <img
                    className="w-4 h-4 object-cover rounded-full"
                    src={props.bookmark.iconUrl}
                    alt=""
                />
                <p className="truncate text-xs">{props.bookmark.name}</p>
            </div>
        </a>
    )
}