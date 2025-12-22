import { FormState } from "@/constants/Form";

export type UpdateFormPayload<T extends keyof FormState> = {
    type: T,
    key: keyof FormState[T],
    value: FormState[T][keyof FormState[T]]
}