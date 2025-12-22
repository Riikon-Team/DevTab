export interface TodoList {
    name: string
    description: string
    state: boolean,
    isPin: boolean
    color: string,
    deadline?: string,
    tag?: string
}