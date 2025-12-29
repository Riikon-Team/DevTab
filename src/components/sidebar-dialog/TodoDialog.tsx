import { useMediaQuery } from "@/hooks/useMedia"
import { initListBookmark, updateListBookmark } from "@/redux/slices/bookmarkSlice"
import { updateForm } from "@/redux/slices/formSlice"
import { updateSidebar } from "@/redux/slices/sidebarSlice"
import { initTodo } from "@/redux/slices/todolistSlice"
import { RootState } from "@/redux/store"
import { fetchBookmarkData, formatUrl, removeBookmark } from "@/util/bookmarkUtil"
import { fetchTodoList, mapTodoByTag, removeTodoList } from "@/util/todolistUtil"
import { ChevronRight, Pencil, Plus, Trash2, X } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { TodoComponent } from "../todolist/TodoComponent"

export default function TodoDialog(props: { closeSidebar: (open: boolean) => void }) {
    //Redux
    const dispatcher = useDispatch()
    const dialogState = useSelector((state: RootState) => state.sidebar.todo)
    const todo = useSelector((state: RootState) => state.todo)
    const setting = useSelector((state: RootState) => state.setting)

    const isMobile = useMediaQuery('(max-width: 767px)')

    const [loading, setLoading] = useState(true);
    const [deleteIndex, setDeleteIndex] = useState(-1)

    const closeDialog = () => {
        dispatcher(updateSidebar({
            type: 'todo',
            key: 'isOpen',
            value: false
        }))
    }

    const fetchTodo = async () => {
        try {
            const data = fetchTodoList()
            dispatcher(initTodo({ listTodo: data }))
        }
        catch (err) {

        }
        finally {
            setTimeout(() => {
                setLoading(false)
            }, 500)
        }
    }

    const removeTodoHandle = (index: number) => {
        removeTodoList(index)
        try {
            const data = fetchTodoList()
            dispatcher(initTodo({ listTodo: data }))
        }
        catch (err) {
            console.log(err)
        }
        finally {
            setTimeout(() => {
                setLoading(false)
            }, 500)
        }
    }

    useEffect(() => {
        fetchTodo()
    }, [])

    useEffect(() => {
        if (dialogState.isOpen && isMobile) props.closeSidebar(false)
    }, [dialogState.isOpen])

    const groupedTodo = useMemo(() => {
        return Array.from(mapTodoByTag(todo.listTodo).entries())
    }, [todo.listTodo])

    return dialogState.isOpen ?
        <div className="w-full absolute z-100 flex justify-center items-center " style={{ height: '100vh' }}>
            <div className="w-full h-full z-100 bg-black/50" onClick={closeDialog}></div>
            <div className="absolute z-110 bg-accent rounded-2xl w-[90%] lg:w-200" onClick={() => { }}>
                <div className="flex">
                    <div className="w-full h-[60vh] overflow-hidden bg-neutral-900 p-4 rounded-2xl flex flex-col pb-10">
                        <div className="flex justify-between mb-4">
                            <div className="flex items-center gap-1">
                                <p className=" text-sm text-neutral-400">To-do List</p>
                                {/* <ChevronRight size={"1rem"} className="text-neutral-400" /> */}
                            </div>
                            <X className="hover:text-neutral-400 cursor-pointer" onClick={closeDialog} />
                        </div>

                        <div className="h-full w-full flex flex-col">
                            <div className="w-full flex-1 pb-2 flex gap-3 overflow-x-auto scrollbar-thin custom-scrollbar scrollbar-thumb-gray-500 scrollbar-track-transparent">
                                {groupedTodo.map(
                                    ([tag, listTodo]) => (
                                        <div
                                            key={tag.name}
                                            className={`border rounded-2xl w-60 p-3`}

                                        >
                                            <h3 className="font-semibold">{tag.name}</h3>
                                            <div className="my-4">
                                                {listTodo.map((item, index) => (
                                                    <div key={index} className="flex items-stretch mb-2">
                                                        <div
                                                            className={`rounded-r-2xl ${tag.color === "transparent" ? "w-0" : "w-2"} rounded-full`}
                                                            style={{ backgroundColor: tag.color }}
                                                        ></div>
                                                        <div className={`flex-1 rounded-r-2xl border ${tag.color === "transparent" ? "rounded-l-2xl" : ""}`}>
                                                            <TodoComponent todo={item} index={index} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex justify-center">
                                                <button
                                                    className="flex gap-1 items-center cursor-pointer bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 p-2 rounded"
                                                    onClick={() => dispatcher(updateForm({
                                                        type: 'addTodo',
                                                        key: 'isOpen',
                                                        value: true
                                                    }))}
                                                >
                                                    <Plus size={"1rem"} />
                                                    <span className="text-sm">Add new To-do</span>
                                                </button>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        : <></>
}
