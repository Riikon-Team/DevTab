import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { TodoList } from "@/constants/TodoList"
import { updateListBookmark } from "@/redux/slices/bookmarkSlice"
import { updateForm } from "@/redux/slices/formSlice"
import { initTodo } from "@/redux/slices/todolistSlice"
import { RootState } from "@/redux/store"
import { addBookmark } from "@/util/bookmarkUtil"
import { addTodoList, fetchTodoList } from "@/util/todolistUtil"
import { ChevronDown, X } from "lucide-react"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"

export function AddTodoForm() {
    const [inputName, setInputName] = useState("")
    const [inputDescription, setInputUrl] = useState("")
    const [inputState, setInputState] = useState(false)
    const [inputPin, setInputPin] = useState(false)
    const [inputDeadline, setInputDeadline] = useState<Date | undefined>(undefined)

    const [inputTagName, setInputTagName] = useState("")
    const [inputTagColor, setInputTagColor] = useState("#000000")

    const [message, setMessage] = useState("")
    const [datePickerState, setDatePickerState] = useState(false)

    const dispatcher = useDispatch()
    const formState = useSelector((state: RootState) => state.form.addTodo)

    const closeForm = () => {
        dispatcher(updateForm({
            type: 'addTodo',
            key: 'isOpen',
            value: false
        }))
    }

    const addNewTodo = () => {
        // if (!inputUrl) {
        //     setMessage("You must type bookmark's URL")
        //     return
        // }

        const todo: TodoList = {
            name: inputName,
            description: inputDescription,
            state: inputState,
            isPin: inputPin,
            deadline: inputDeadline ?
                String(inputDeadline.getTime()) :
                undefined,
            tag: inputTagColor && inputTagName ?
                { name: inputTagName, color: inputTagColor } :
                undefined
        }

        const newTodo = addTodoList(todo)
        if (newTodo) {
            const data = fetchTodoList()
            dispatcher(initTodo({ listTodo: data }))
            closeForm()
        }
        else {
            setMessage("Error when adding your To-do")
        }
    }

    return (
        formState.isOpen ?
            <div className="w-full absolute z-1000 flex justify-center items-center " style={{ height: '100vh' }}>
                <div className="w-full h-full z-1000 bg-black/50" onClick={closeForm}></div>
                <div className="absolute bg-accent p-4 px-6 rounded-2xl w-120 z-1001" onClick={() => { }}>
                    <div className="flex justify-end mb-1">
                        <X className="hover:text-neutral-400 cursor-pointer" onClick={closeForm} />
                    </div>
                    <div className="flex flex-col gap-5">
                        <div>
                            <p className="font-semibold text-xl">Add new To-do</p>
                            <p className="text-gray-400 mt-2"></p>
                        </div>
                        <div>
                            <p className="font-semibold mb-2 text-sm">To-do name</p>
                            <Input onChange={(e) => {
                                setInputName(e.target.value)
                                setMessage("")
                            }} />
                        </div>
                        <div>
                            <p className="font-semibold mb-2 text-sm">To-do Description</p>
                            <Textarea
                                className="resize-none"
                                onChange={(e) => {
                                    setInputUrl(e.target.value)
                                    setMessage("")
                                }} />
                        </div>
                        <div>
                            <p className="font-semibold mb-2 text-sm">To-do Description</p>
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
                        <p className="text-center text-red-500">{message}</p>
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
                </div>
            </div>
            : <></>
    )
}