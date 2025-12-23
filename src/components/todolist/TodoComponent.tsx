import { TodoList } from "@/constants/TodoList"

type TodoComponentProps = {
    index: number
    todo: TodoList,
}

export function TodoComponent(props: TodoComponentProps) {
    return (
        <div className="rounded-2xl border">
            <p className="text-semibold">{props.todo.name}</p>
            <p className="text-sm">{props.todo.description}</p>
            <p>{props.todo.deadline}</p>
        </div>
    )
}