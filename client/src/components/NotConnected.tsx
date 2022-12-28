import Button from "./Button";
import {useRef} from "react";

interface NotConnectedProps {
    myPeerId: string
    handleConnectToPeer: (peerId: string) => void
}

export default function NotConnected(props: NotConnectedProps) {
    const peerIdInput = useRef({} as HTMLInputElement)

    function handleMyPeerIdClicked() {
        navigator.clipboard.writeText(props.myPeerId);
    }

    function handleConnectToPeer(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const peerId = peerIdInput.current.value
        props.handleConnectToPeer(peerId)
    }

    return (
        <div className={"flex flex-col justify-center gap-10 h-full"}>
            <div className={"text-center"}>
                <h1 className={"text-2xl"}>Your Id</h1>
                <h2 className={"text-xl hover:cursor-pointer hover:bg-pink-600 bg-pink-500 text-white p-1 rounded-xl active:bg-pink-200 inline-block"}
                    onClick={handleMyPeerIdClicked}>{props.myPeerId}</h2>
            </div>
            <div className={"text-center"}>

                <form onSubmit={handleConnectToPeer}>
                    <input type={"text"} ref={peerIdInput} size={36}
                           className={"border border-pink-500 p-2 outline-pink-500"}/>
                    <Button type={"submit"}>Connect</Button>
                </form>
            </div>
        </div>
    )
}