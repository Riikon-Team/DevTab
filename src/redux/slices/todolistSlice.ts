import { TodoList } from "@/constants/TodoList"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { act } from "react"

type TodolistSlice = {
    listTodo: TodoList[]
}

const initialState: TodolistSlice = {
    listTodo: []
}

export const todoSlice = createSlice({
    name: 'todo',
    initialState,
    reducers: {
        initTodo(state, action: PayloadAction<TodolistSlice>) {
            return action.payload
        },

        insertTodo(state, action: PayloadAction<TodolistSlice>) {
            state.listTodo.push(...action.payload.listTodo)
        }

    }
})

export default todoSlice.reducer
export const { initTodo, insertTodo } = todoSlice.actions