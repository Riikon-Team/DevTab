import { Input } from "@/components/ui/input";
import { updateForm } from "@/redux/slices/formSlice";
import { updateSetting } from "@/redux/slices/settingSlice";
import { RootState } from "@/redux/store";
import { X } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function GitUserForm() {
    const [inputUsername, setInputUsername] = useState("")

    const dispatcher = useDispatch()
    const formState = useSelector((state: RootState) => state.form.updateGitUser)

    const changeGithubUsername = () => {
        localStorage.setItem("githubUsername", inputUsername)
        dispatcher(updateSetting({
            type: 'githubStat',
            key: 'username',
            value: inputUsername
        }))
        closeForm()
    }

    const closeForm = () => {
        dispatcher(updateForm({
            type: 'updateGitUser',
            key: 'isOpen',
            value: false
        }))
    }

    return (
        formState.isOpen ?
            <div className="w-full absolute z-1000 flex justify-center items-center " style={{ height: '100vh' }}>
                <div className="w-full h-full z-1000 bg-black/50" onClick={closeForm}></div>
                <div className="absolute z-1001 bg-accent p-4 px-6 rounded-2xl w-120" onClick={() => { }}>
                    <div className="flex justify-end mb-1">
                        <X className="hover:text-neutral-400 cursor-pointer" onClick={closeForm} />
                    </div>
                    <div className="flex flex-col gap-5">
                        <div>
                            <p className="font-semibold text-xl">Edit Github username</p>
                            <p className="text-gray-400 mt-2">Change your Github username here to statistic your Github account. Click save when you're done.</p>
                        </div>
                        <div>
                            <p className="font-semibold mb-2">Your Github username</p>
                            <Input onChange={(e) => setInputUsername(e.target.value)} />
                        </div>
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
                                onClick={() => changeGithubUsername()}
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