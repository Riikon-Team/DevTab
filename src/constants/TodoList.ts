export interface TodoList {
    name: string
    description: string
    state: boolean,
    isPin: boolean
    deadline?: string,
    tag?: TodoTag
}

export interface TodoTag {
    name: string,
    color: string
}