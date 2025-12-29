import { TodoList } from "@/constants/TodoList"

type TodoComponentProps = {
    index: number
    todo: TodoList,
}

export function TodoComponent(props: TodoComponentProps) {
    return (
        <div className="p-2">
            <div className="flex flex-col gap-2 mb-4">
                <p className="font-semibold">{props.todo.name}</p>
                <p className="text-sm">{props.todo.description}</p>
            </div>
            <p className="text-end text-xs text-neutral-500">{props.todo.deadline}</p>
        </div>
    )
}