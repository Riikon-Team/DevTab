import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { TodoList } from "@/constants/TodoList"
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

export function AddTodoForm() {
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
    const formState = useSelector((state: RootState) => state.form.addTodo)
    const currentListTodo = useSelector((state: RootState) => state.todo.listTodo)

    const defaultTagColor = [
        "#64748b",
        "#ef4444", "#f97316", "#eab308",
        "#22c55e", "#06b6d4", "#3b82f6",
        "#8b5cf6", "#d946ef", "#ec4899"
    ];

    const closeForm = () => {
        dispatcher(updateForm({
            type: 'addTodo',
            key: 'isOpen',
            value: false
        }))
    }

    // const addNewTodo = () => {
    //     const todo: TodoList = {
    //         name: inputName,
    //         description: inputDescription,
    //         state: inputState,
    //         isPin: inputPin,
    //         deadline: inputDeadline ?
    //             String(inputDeadline.getTime()) :
    //             undefined,
    //         tag: selectedTagColor && inputTagName ?
    //             { name: inputTagName, color: selectedTagColor } :
    //             undefined
    //     }

    //     const newTodo = addTodoList(todo)
    //     if (newTodo) {
    //         const data = fetchTodoList()
    //         dispatcher(initTodo({ listTodo: data }))
    //         closeForm()
    //     }
    //     else {
    //         setMessage("Error when adding your To-do")
    //     }
    // }


    const addNewTodo = () => {
        if (!inputName.trim()) {
            setMessage("Name is required");
            return;
        }

        const tagData = inputTagName.trim()
            ? { name: inputTagName.trim(), color: selectedTagColor }
            : undefined;

        const todo: TodoList = {
            name: inputName,
            description: inputDescription,
            state: inputState,
            isPin: inputPin,
            deadline: inputDeadline ? String(inputDeadline.getTime()) : undefined,
            tag: tagData
        };

        const newTodo = addTodoList(todo);
        if (newTodo) {
            dispatcher(initTodo({ listTodo: fetchTodoList() }));
            closeForm();
        } else {
            setMessage("Error adding todo");
        }
    };

    const listTodoTag = useMemo(() => mapTodoByTag(currentListTodo), [currentListTodo])

    const updateColor = (color: string) => {
        setSelectedTagColor(color);
        if (inputTagColorRef.current) {
            inputTagColorRef.current.value = color;
        }
    };

    return (
        formState.isOpen ?
            <div className="w-full absolute z-1000 flex justify-center items-center " style={{ height: '100vh' }}>
                <div className="w-full h-full z-1000 bg-black/50" onClick={closeForm}></div>
                <div className="absolute bg-accent p-4 px-6 rounded-2xl w-120 z-1001" onClick={() => { }}>
                    <div className="flex justify-end mb-1">
                        <X className="hover:text-neutral-400 cursor-pointer" onClick={closeForm} />
                    </div>
                    <div className="mb-4">
                        <p className="font-semibold text-xl">Add new To-do</p>
                        <p className="text-gray-400 mt-2"></p>
                    </div>
                    <div className="h-[65vh] pe-1 flex flex-col gap-5 overflow-y-auto scrollbar-thin custom-scrollbar scrollbar-thumb-gray-500 scrollbar-track-transparent">
                        <div>
                            <p className="font-semibold mb-2 text-sm">Name</p>
                            <Input onChange={(e) => {
                                setInputName(e.target.value)
                                setMessage("")
                            }} />
                        </div>
                        <div>
                            <p className="font-semibold mb-2 text-sm">Description</p>
                            <Textarea
                                className="resize-none"
                                onChange={(e) => {
                                    setInputUrl(e.target.value)
                                    setMessage("")
                                }} />
                        </div>
                        <div>
                            <p className="font-semibold mb-2 text-sm">Deadline (optional)</p>
                            <Popover open={datePickerState} onOpenChange={setDatePickerState}>
                                <PopoverTrigger asChild>
                                    <button
                                        className="w-full flex gap-1 items-center cursor-pointer bg-neutral-700 hover:bg-neutral-600 active:bg-neutral-500 p-2 rounded"
                                    >
                                        <ChevronDown size={"1rem"} />
                                        <span className="text-sm">
                                            {inputDeadline ? inputDeadline.toLocaleDateString() : "Select date"}
                                        </span>
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                    <Calendar
                                        className="z-1002"
                                        mode="single"
                                        selected={inputDeadline}
                                        captionLayout="dropdown"
                                        onSelect={(date) => {
                                            setInputDeadline(date)
                                            setDatePickerState(false)
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="flex gap-20">
                            <div className="flex gap-2 items-center">
                                <Checkbox
                                    name="popup-addform-pin"
                                    onCheckedChange={(value) => setInputPin(!!value)}
                                />
                                <label htmlFor="popup-addform-pin">
                                    Pin this note
                                </label>
                            </div>

                            <div className="flex gap-2 items-center">
                                <Checkbox
                                    name="popup-addform-state"
                                    onCheckedChange={(value) => setInputState(!!value)}
                                />
                                <label htmlFor="popup-addform-state">
                                    Mark as completed
                                </label>
                            </div>
                        </div>
                        <div>
                            <p className="font-semibold mb-2 text-sm">Tags (optional)</p>
                            <div className="flex -space-x-px w-full">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            className={`flex items-center justify-center px-3 border rounded-l-md transition-colors focus:z-10 ${isCrateNewTag
                                                ? "bg-neutral-300 border-neutral-300 text-black rounded-md"
                                                : "bg-secondary hover:bg-neutral-700 border-input"}`
                                            }
                                            onClick={() => setCreateNewTag(!isCrateNewTag)}
                                        >
                                            <Plus
                                                size={20}
                                                className={`transition-transform duration-300 ease-in-out ${isCrateNewTag ? "rotate-45" : "rotate-0"
                                                    }`}
                                            />
                                        </button>
                                    </TooltipTrigger>
                                    {
                                        !isCrateNewTag &&
                                        <TooltipContent className="z-1100">
                                            <p>Add new tag</p>
                                        </TooltipContent>
                                    }
                                </Tooltip>
                                <div
                                    className={`
                                        w-full overflow-hidden transition-all duration-500 ease-in-out 
                                        ${isCrateNewTag ? "max-w-0 opacity-0" : "max-w-full opacity-100"}`
                                    }
                                >
                                    <Select disabled={listTodoTag.size <= 1 || isCrateNewTag}>
                                        <SelectTrigger className="w-full rounded-l-none focus:z-10">
                                            <SelectValue placeholder="Select a tag" />
                                        </SelectTrigger>
                                        <SelectContent className="z-1100 mt-10">
                                            <SelectGroup>
                                                {
                                                    [...listTodoTag.keys()].map(ele =>
                                                        <SelectItem key={ele.name} value={ele.name}>{ele.name}</SelectItem>
                                                    )
                                                }
                                            </SelectGroup>

                                        </SelectContent>
                                    </Select>
                                </div>



                            </div>

                            {isCrateNewTag ?
                                <div className="mt-4">
                                    <p className="font-semibold text-sm my-2">Tag name</p>
                                    <Input
                                        placeholder="Type your new Tag name"
                                        onChange={(e) => {
                                            setInputTagName(e.target.value)
                                            setMessage("")
                                        }} />
                                    <p className="font-semibold text-sm my-2">Colors</p>
                                    <div className="flex flex-wrap">
                                        {defaultTagColor.map(ele =>
                                            <button
                                                key={ele}
                                                className={`cursor-pointer m-1 w-8 h-8 rounded-full transition-transform hover:scale-110 
                                                ${selectedTagColor === ele ? "border-white shadow-md" : "border-transparent"}`
                                                }
                                                style={{ backgroundColor: ele }}
                                                onClick={() => updateColor(ele)}
                                            >

                                            </button>
                                        )}
                                    </div>
                                    <div className="flex gap-2 mt-1 items-center">
                                        <p className="text-sm">
                                            Choosed tag color:
                                        </p>
                                        <input
                                            ref={inputTagColorRef}
                                            type="color" name="" id=""
                                            defaultValue={"#aaaaaa"}
                                            onBlur={(e) => setSelectedTagColor(e.target.value)}
                                            className="h-8 w-8 cursor-pointer appearance-none rounded-full border-none bg-transparent [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch]:rounded-full [&::-moz-color-swatch]:border-none [&::-moz-color-swatch]:rounded-full"
                                        />
                                    </div>
                                </div> : <></>
                            }
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