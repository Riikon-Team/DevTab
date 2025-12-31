import { TodoList } from "./TodoList"

export type UpdateGitUserForm = {
    isOpen: boolean,
}

export type AddBookmarkForm = {
    isOpen: boolean
}

export type EditBookmarkForm = {
    isOpen: boolean,
    index: number
}

export type AddTodoForm = {
    isOpen: boolean
}

export type ViewTodoForm = {
    isOpen: boolean
    todo: TodoList | null
}

export type EditTodoForm = {
    isOpen: boolean,
    index: number
}


export type FormState = {
    updateGitUser: UpdateGitUserForm,
    addBookmark: AddBookmarkForm,
    editBookmark: EditBookmarkForm,
    addTodo: AddTodoForm,
    editTodo: EditTodoForm,
    viewTodo: ViewTodoForm
}

export const defaultValue: FormState = {
    updateGitUser: {
        isOpen: false,
    },
    addBookmark: {
        isOpen: false
    },
    editBookmark: {
        isOpen: false,
        index: -1,
    },
    addTodo: {
        isOpen: false
    },
    editTodo: {
        isOpen: false,
        index: -1
    },
    viewTodo: {
        isOpen: false,
        todo: null
    }
}