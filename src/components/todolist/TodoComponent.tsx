import { TodoList } from "@/constants/TodoList"
import { updateForm } from "@/redux/slices/formSlice"
import { RootState } from "@/redux/store"
import { useDispatch, useSelector } from "react-redux"

type TodoComponentProps = {
    index: number
    todo: TodoList,
}

export function TodoComponent(props: TodoComponentProps) {
    const viewTodo = useSelector((state: RootState) => state.form.viewTodo)
    const dispatcher = useDispatch()

    const openViewTodo = () => {
        //TODO: Fix this code
        dispatcher(updateForm({
            type: "viewTodo",
            key: "todo",
            value: props.todo
        }))

         dispatcher(updateForm({
            type: "viewTodo",
            key: "isOpen",
            value: true
        }))
    }

    return (
        <div
            className="p-2 cursor-pointer"
            onClick={openViewTodo}
        >
            <div className="flex flex-col gap-2 mb-4">
                <p className="font-semibold">{props.todo.name}</p>
                <p className="text-sm line-clamp-2">{props.todo.description}</p>
            </div>
            <p className="text-end text-xs text-neutral-500">{props.todo.deadline && new Date(Number.parseInt(props.todo.deadline)).toLocaleDateString()}</p>
        </div>
    )
}