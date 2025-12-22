import { useMediaQuery } from "@/hooks/useMedia"
import { initListBookmark, updateListBookmark } from "@/redux/slices/bookmarkSlice"
import { updateForm } from "@/redux/slices/formSlice"
import { updateSidebar } from "@/redux/slices/sidebarSlice"
import { RootState } from "@/redux/store"
import { fetchBookmarkData, formatUrl, removeBookmark } from "@/util/bookmarkUtil"
import { ChevronRight, Pencil, Plus, Trash2, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

export default function BookmarkDialog(props: { closeSidebar: (open: boolean) => void }) {
    //Redux
    const dispatcher = useDispatch()
    const dialogState = useSelector((state: RootState) => state.sidebar.bookmark)
    const bookmark = useSelector((state: RootState) => state.bookmark)
    const setting = useSelector((state: RootState) => state.setting)

    const isMobile = useMediaQuery('(max-width: 767px)')

    const [loading, setLoading] = useState(true);
    const [deleteIndex, setDeleteIndex] = useState(-1)

    const closeDialog = () => {
        dispatcher(updateSidebar({
            type: 'bookmark',
            key: 'isOpen',
            value: false
        }))
    }

    const fetchBookmark = async () => {
        try {
            const data = fetchBookmarkData()
            dispatcher(initListBookmark(data))
        }
        catch (err) {

        }
        finally {
            setTimeout(() => {
                setLoading(false)
            }, 500)
        }
    }

    const removeBookmarkHandle = (index: number) => {
        removeBookmark(index)
        try {
            const data = fetchBookmarkData()
            dispatcher(initListBookmark(data))
        }
        catch (err) {

        }
        finally {
            setTimeout(() => {
                setLoading(false)
            }, 500)
        }
    }

    useEffect(() => {
        fetchBookmark()
    }, [])

    useEffect(() => {
        if (dialogState.isOpen && isMobile) props.closeSidebar(false)
    }, [dialogState.isOpen])

    return dialogState.isOpen ?
        <div className="w-full absolute z-100 flex justify-center items-center " style={{ height: '100vh' }}>
            <div className="w-full h-full z-100 bg-black/50" onClick={closeDialog}></div>
            <div className="absolute z-110 bg-accent rounded-2xl w-[90%] lg:w-lg" onClick={() => { }}>
                <div className="flex">
                    <div className="lg:w-lg w-full h-[60vh] overflow-hidden bg-neutral-900 p-4 rounded-tr-2xl rounded-br-2xl flex flex-col pb-10">
                        <div className="flex justify-between mb-4">
                            <div className="flex items-center gap-1">
                                <p className=" text-sm text-neutral-400">Bookmark</p>
                                {/* <ChevronRight size={"1rem"} className="text-neutral-400" /> */}
                            </div>
                            <X className="hover:text-neutral-400 cursor-pointer" onClick={closeDialog} />
                        </div>

                        <div className="h-full w-full flex flex-col">
                            <div className="w-full flex-1 pb-2 flex flex-col gap-3 overflow-y-auto scrollbar-thin custom-scrollbar scrollbar-thumb-gray-500 scrollbar-track-transparent">
                                {bookmark.listBookmark.map((ele, index) => (
                                    <div
                                        key={ele.name}
                                        className="me-1 p-3 flex bg-neutral-800 rounded-3xl gap-3"
                                    >
                                        <div className="w-12 flex items-center justify-center">
                                            <img
                                                className="w-10 h-10 object-cover rounded-full"
                                                src={ele.iconUrl}
                                                alt=""
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center">
                                            <h5>{ele.name}</h5>
                                            <a href={formatUrl(ele.url)} className="text-blue-400 hover:text-blue-300">
                                                <p className="text-xs">{ele.url}</p>
                                            </a>
                                        </div>

                                        <div className="flex gap-1 justify-center items-center">
                                            <div
                                                className="w-8 h-8 flex justify-center items-center rounded-full p-2 bg-neutral-700 hover:bg-neutral-600 cursor-pointer"
                                                onClick={() => {
                                                    dispatcher(updateForm({
                                                        type: "editBookmark",
                                                        key: "index",
                                                        value: index
                                                    }))
                                                    //Temp code
                                                    dispatcher(updateForm({
                                                        type: "editBookmark",
                                                        key: "isOpen",
                                                        value: true
                                                    }))
                                                }}
                                            >
                                                <Pencil size={"1rem"} />
                                            </div>
                                            <div
                                                className="w-8 h-8 flex justify-center items-center rounded-full p-2 bg-neutral-700 hover:bg-neutral-600 cursor-pointer"
                                                onClick={() => removeBookmarkHandle(index)}
                                            >
                                                <Trash2 size={"1rem"} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end h-15 py-3">
                                <button
                                    className="flex gap-1 items-center cursor-pointer bg-purple-600 hover:bg-purple-500 active:bg-purple-500/70 p-2 rounded"
                                    onClick={() => dispatcher(updateForm({
                                        type: 'addBookmark',
                                        key: 'isOpen',
                                        value: true
                                    }))}
                                >
                                    <Plus size={"1rem"} />
                                    <span className="text-sm">Add new bookmark</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        : <></>
}
