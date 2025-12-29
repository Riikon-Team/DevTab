import { TodoList, TodoTag } from "@/constants/TodoList";

export function mapTodoByTag(listTodo: TodoList[]) {
    const result = new Map<TodoTag, TodoList[]>()
    const defaultTag: TodoTag = { name: "No category", color: "transparent" }

    if (listTodo.length === 0) {
        result.set(defaultTag, [])
        return result
    }

    listTodo.forEach(e => {
        const ele = { ...e }
        const currentTag = ele.tag || defaultTag

        const existingTagKey = Array.from(result.keys()).find(
            (t) => t.name === currentTag.name
        )

        const finalKey = existingTagKey || currentTag

        const list = result.get(finalKey) || []
        list.push(ele)
        result.set(finalKey, list)
    })

    return result
}

export function fetchTodoList() {
    try {
        const todoStorage = localStorage.getItem("todolist")
        if (!todoStorage) return []
        return JSON.parse(todoStorage) as TodoList[]
    }
    catch (_) {
        return []
    }
}

export function addTodoList(input: TodoList) {
    try {
        const todoStorage = localStorage.getItem("todolist")
        const listTodo: TodoList[] = []

        if (todoStorage) {
            listTodo.push(...JSON.parse(todoStorage) as TodoList[])
        }

        listTodo.push(input)
        localStorage.setItem("todolist", JSON.stringify(listTodo))
        return true
    }
    catch (_) {
        return false
    }
}

export function editTodoList(index: number, input: Partial<TodoList>) {
    try {
        const todoStorage = localStorage.getItem("todolist")
        const listTodo: TodoList[] = []

        if (!todoStorage) return false
        listTodo.push(...JSON.parse(todoStorage) as TodoList[])
        if (!listTodo[index]) return false

        const todo = listTodo[index]
        listTodo[index] = Object.assign(todo, input)

        localStorage.setItem("todolist", JSON.stringify(listTodo))
        return true
    }
    catch (_) {
        return false
    }
}

export function removeTodoList(index: number) {
    try {
        const todoStorage = localStorage.getItem("todolist")
        const listTodo: TodoList[] = []

        if (!todoStorage) return true
        listTodo.push(...JSON.parse(todoStorage) as TodoList[])
        if (!listTodo[index]) return true

        localStorage.setItem("todolist", JSON.stringify(listTodo.filter((_, i) => i !== index)))
        return true
    }
    catch (_) {
        return false
    }
}