import { TodoList } from "@/constants/TodoList"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { updateListBookmark } from "@/redux/slices/bookmarkSlice"
import { updateForm } from "@/redux/slices/formSlice"
import { initTodo } from "@/redux/slices/todolistSlice"
import { RootState } from "@/redux/store"
import { addBookmark } from "@/util/bookmarkUtil"
import { addTodoList, fetchTodoList, mapTodoByTag } from "@/util/todolistUtil"
import { TooltipArrow } from "@radix-ui/react-tooltip"
import { ChevronDown, Plus, X } from "lucide-react"
import { useMemo, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"


export function ViewTodoForm() {
    //Basic info
    const [inputName, setInputName] = useState("")
    const [inputDescription, setInputUrl] = useState("")
    const [inputState, setInputState] = useState(false)
    const [inputPin, setInputPin] = useState(false)
    //Deadile (optional)
    const [inputDeadline, setInputDeadline] = useState<Date | undefined>(undefined)
    const [datePickerState, setDatePickerState] = useState(false)
    //Tag
    const [isCrateNewTag, setCreateNewTag] = useState(false)
    const [inputTagName, setInputTagName] = useState("")
    const [selectedTagColor, setSelectedTagColor] = useState("#aaaaaa");
    const inputTagColorRef = useRef<HTMLInputElement>(null)

    const [message, setMessage] = useState("")

    const dispatcher = useDispatch()
    const formState = useSelector((state: RootState) => state.form.viewTodo)
    const currentListTodo = useSelector((state: RootState) => state.todo.listTodo)

    const defaultTagColor = [
        "#64748b",
        "#ef4444", "#f97316", "#eab308",
        "#22c55e", "#06b6d4", "#3b82f6",
        "#8b5cf6", "#d946ef", "#ec4899"
    ];

    const closeForm = () => {
        dispatcher(updateForm({
            type: 'viewTodo',
            key: 'isOpen',
            value: false
        }))
    }

    const listTodoTag = useMemo(() => mapTodoByTag(currentListTodo), [currentListTodo])

    const updateColor = (color: string) => {
        setSelectedTagColor(color);
        if (inputTagColorRef.current) {
            inputTagColorRef.current.value = color;
        }
    };

    return (
        formState.isOpen && formState.todo !== null ?
            <div className="w-full absolute z-1000 flex justify-center items-center " style={{ height: '100vh' }}>
                <div className="w-full h-full z-1000 bg-black/50" onClick={closeForm}></div>
                <div className="absolute bg-accent p-4 px-6 rounded-2xl w-120 z-1001" onClick={() => { }}>
                    <div className="flex justify-end mb-1">
                        <X className="hover:text-neutral-400 cursor-pointer" onClick={closeForm} />
                    </div>
                    <div className="mb-4">
                        <p className="font-semibold text-xl">To-do Detail</p>
                        <p className="text-gray-400 mt-2"></p>
                    </div>
                    <div className="h-[65vh] pe-1 flex flex-col gap-5 overflow-y-auto scrollbar-thin custom-scrollbar scrollbar-thumb-gray-500 scrollbar-track-transparent">
                        <div>
                            <p className="font-semibold mb-2 text-sm">Name</p>
                            <Input
                                className="cursor-auto"
                                value={formState.todo.name}
                                readOnly
                            />
                        </div>
                        <div>
                            <p className="font-semibold mb-2 text-sm">Description</p>
                            <Textarea
                                className="resize-none cursor-auto"
                                value={formState.todo.description}
                                readOnly
                            />
                        </div>
                        <div>
                            <p className="font-semibold mb-2 text-sm">Deadline (optional)</p>
                            <Input
                                className="cursor-auto"
                                value={formState.todo.deadline && new Date(Number.parseInt(formState.todo.deadline)).toLocaleDateString()}
                                readOnly
                            />
                        </div>

                        <div className="flex gap-20">
                            <div className="flex gap-2 items-center">
                                <Checkbox
                                    name="popup-addform-pin"
                                    disabled
                                    checked={formState.todo.isPin}
                                />
                                <label htmlFor="popup-addform-pin">
                                    Pin this note
                                </label>
                            </div>

                            <div className="flex gap-2 items-center">
                                <Checkbox
                                    name="popup-addform-state"
                                    disabled
                                    checked={formState.todo.state}
                                />
                                <label htmlFor="popup-addform-state">
                                    Mark as completed
                                </label>
                            </div>
                        </div>
                        <div>
                            <p className="font-semibold mb-2 text-sm">Tags (optional)</p>
                            <InputGroup>
                                <InputGroupAddon>
                                    <div
                                        className="w-4 h-4 rounded-full"
                                        style={{ backgroundColor: formState.todo.tag ? formState.todo.tag.color : "#aaaaaa" }}
                                    >
                                    </div>
                                </InputGroupAddon>
                                <InputGroupInput
                                    className="cursor-auto"
                                    value={formState.todo.tag ? formState.todo.tag.name : "No category"}
                                    readOnly
                                />
                            </InputGroup>
                        </div>
                        <p className="text-center text-red-500">{message}</p>

                    </div>
                    <div className="flex justify-end gap-5">
                        <button
                            className="rounded p-2 px-3 bg-accent text-accent-foreground border cursor-pointer hover:bg-neutral-700"
                            onClick={closeForm}
                        >
                            <span className="font-semibold">
                                Cancel
                            </span>
                        </button>
                        <button
                            className="rounded p-2 px-3 bg-accent-foreground text-accent cursor-pointer hover:bg-neutral-300"
                            onClick={() => addNewTodo()}
                        >
                            <span className="font-semibold">
                                Save changes
                            </span>
                        </button>
                    </div>
                </div>
            </div >
            : <></>
    )
}