import { TodoList } from "@/constants/TodoList";

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