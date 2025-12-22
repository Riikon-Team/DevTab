import React from "react"

type DialogComponentProps = {
    sidebarChildren: React.ReactNode,
    contentChildren: React.ReactNode,
    dialogState: boolean,
    onCloseDialog: () => void
}

export default function DialogComponent(props: DialogComponentProps) {
    return (
        props.dialogState ?
            <div className="w-full absolute z-100 flex justify-center items-center " style={{ height: '100vh' }}>
                <div className="w-full h-full z-100 bg-black/50" onClick={props.onCloseDialog}></div>
                <div className="absolute z-110 bg-accent rounded-2xl " onClick={() => { }}>
                    <div className="flex">
                        <div className="p-4 w-[16rem] hidden lg:block">
                            {props.sidebarChildren}
                        </div>
                    </div>
                    <div className="lg:w-lg w-full h-[60vh] overflow-hidden bg-neutral-900 p-4 rounded-tr-2xl rounded-br-2xl flex flex-col pb-10">
                        {props.contentChildren}
                    </div>
                </div>
            </div>
            : <></>
    )
}

type SidebarDialogComponentProps = {
    children: React.ReactNode,
}

export function SidebarDialogComponent(props: SidebarDialogComponentProps) {
    return (
        <div className="flex">
            <div className="p-4 w-[16rem] hidden lg:block">
                {props.children}
            </div>
        </div>
    )
}

export function ContentDialogComponent(props: SidebarDialogComponentProps) {
    return (
        <div className="lg:w-lg w-full h-[60vh] overflow-hidden bg-neutral-900 p-4 rounded-tr-2xl rounded-br-2xl flex flex-col pb-10">
            {props.children}
        </div>
    )
}