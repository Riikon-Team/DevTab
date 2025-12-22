import { Input } from "@/components/ui/input"
import { updateListBookmark } from "@/redux/slices/bookmarkSlice"
import { updateForm } from "@/redux/slices/formSlice"
import { RootState } from "@/redux/store"
import { addBookmark } from "@/util/bookmarkUtil"
import { X } from "lucide-react"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"

export function AddBookmarkForm() {
    const [inputName, setInputName] = useState("")
    const [inputUrl, setInputUrl] = useState("")
    const [message, setMessage] = useState("")

    const dispatcher = useDispatch()
    const formState = useSelector((state: RootState) => state.form.addBookmark)

    const closeForm = () => {
        dispatcher(updateForm({
            type: 'addBookmark',
            key: 'isOpen',
            value: false
        }))
    }

    const addNewBookmark = () => {
        if (!inputUrl) {
            setMessage("You must type bookmark's URL")
            return
        }

        const newBookmark = addBookmark(inputName, inputUrl)
        if (newBookmark) {
            dispatcher(updateListBookmark([newBookmark]))
        }
        closeForm()
    }

    return (
        formState.isOpen ?
            <div className="w-full absolute z-1000 flex justify-center items-center " style={{ height: '100vh' }}>
                <div className="w-full h-full z-1000 bg-black/50" onClick={closeForm}></div>
                <div className="absolute bg-accent p-4 px-6 rounded-2xl w-120 z-1001" onClick={() => { }}>
                    <div className="flex justify-end mb-1">
                        <X className="hover:text-neutral-400 cursor-pointer" onClick={closeForm} />
                    </div>
                    <div className="flex flex-col gap-5">
                        <div>
                            <p className="font-semibold text-xl">Add new bookmark</p>
                            <p className="text-gray-400 mt-2">Type your bookmark URL and name, click Save changes to save your bookmark.</p>
                        </div>
                        <div>
                            <p className="font-semibold mb-2">Bookmark name</p>
                            <Input onChange={(e) => {
                                setInputName(e.target.value)
                                setMessage("")
                            }} />
                        </div>
                        <div>
                            <p className="font-semibold mb-2">Bookmark URL</p>
                            <Input onChange={(e) => {
                                setInputUrl(e.target.value)
                                setMessage("")
                            }} />
                        </div>
                        <p className="text-center text-red-500">{message}</p>
                        <div className="flex justify-end gap-5">
                            <button
                                className="rounded p-2 px-3 bg-accent text-accent-foreground border cursor-pointer hover:bg-neutral-700"
                                onClick={closeForm}
                            >
                                <span className="font-semibold">
                                    Cancel
                                </span>
                            </button>
                            <button
                                className="rounded p-2 px-3 bg-accent-foreground text-accent cursor-pointer hover:bg-neutral-300"
                                onClick={() => addNewBookmark()}
                            >
                                <span className="font-semibold">
                                    Save changes
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            : <></>
    )
}