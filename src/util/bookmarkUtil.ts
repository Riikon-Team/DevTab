import { Bookmark } from "@/constants/Bookmark"

export function fetchBookmarkData(): Bookmark[] {
    try {
        const rawBookmark = localStorage.getItem("bookmark")
        if (!rawBookmark) {
            return []
        }
        return JSON.parse(rawBookmark) as Bookmark[]
    }
    catch (err) {
        return []
    }
}


export function addBookmark(name: string, url: string): Bookmark | null {
    try {
        const rawBookmark = localStorage.getItem("bookmark")
        let listBookmark = new Set<Bookmark>

        if (rawBookmark) {
            const parsedBookmark = [...JSON.parse(rawBookmark)]
            listBookmark = new Set(parsedBookmark)
        }
        else listBookmark = new Set()

        const bookmark: Bookmark = {
            name, url, iconUrl: `https://www.google.com/s2/favicons?domain=${url}&sz=64`
        }
        listBookmark.add(bookmark)

        localStorage.setItem("bookmark", JSON.stringify([...listBookmark]))
        return bookmark
    }
    catch (err) {
        return null
    }
}

export function editBookmark(index: number, name?: string, url?: string) {
    try {
        const rawBookmark = localStorage.getItem("bookmark")
        if (!rawBookmark) {
            return false
        }

        const parsedBookmark = JSON.parse(rawBookmark) as Bookmark[]
        if (!parsedBookmark[index]) return false
        const targetBookmark = parsedBookmark[index]

        let updatedUrl = (url && url.trim() !== "") ? url : targetBookmark.url;
        const newBookmark: Bookmark = {
            ...targetBookmark,
            name: name !== undefined && name !== "" ? name : targetBookmark.name,
            url: updatedUrl,
        }
        newBookmark.iconUrl = `https://www.google.com/s2/favicons?domain=${newBookmark.url}&sz=64`

        parsedBookmark[index] = newBookmark
        localStorage.setItem("bookmark", JSON.stringify([...parsedBookmark]))
        return true
    }
    catch (err) {
        return false
    }
}

export function removeBookmark(index: number) {
    try {
        const rawBookmark = localStorage.getItem("bookmark")
        if (!rawBookmark) {
            return false
        }

        const parsedBookmark = JSON.parse(rawBookmark) as Bookmark[]
        if (!parsedBookmark[index]) return false
        localStorage.setItem("bookmark", JSON.stringify([...parsedBookmark.filter((ele, i) => i !== index)]))
        return true
    }
    catch (err) {
        return false
    }
}

export function formatUrl(url: string) {
    if (!url) return "#";
    if (/^https?:\/\//i.test(url)) {
        return url;
    }
    return `https://${url}`;
}